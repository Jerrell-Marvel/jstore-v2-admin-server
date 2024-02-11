import format from "pg-format";
import { pool } from "../db";
import { PoolClient, QueryResult } from "pg";
import { BadRequestError } from "../errors/BadRequestError";

export const createMultipleVariantImages = async (data: { variantId: number; variantImages: Express.Multer.File[] }[], client?: PoolClient) => {
  // console.log(data);
  const imageValues: (string | number)[][] = [];

  let isEmpty = true;
  for (const variant of data) {
    for (const variantImage of variant.variantImages) {
      isEmpty = false;
      imageValues.push([variant.variantId, variantImage.path]);
    }
  }

  if (isEmpty) {
    return [];
  }

  const query = format(`INSERT INTO variant_images (product_variant_id, image_url) VALUES %L RETURNING variant_image_id`, imageValues);

  let queryResult;
  if (client) {
    queryResult = await client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  const rows = queryResult.rows as { variant_image_id: number }[];

  const result = rows.map((row) => row.variant_image_id);

  return result;
};

// if perform check is true make sure to have client
export const createVariantImages = async (images: Express.Multer.File[], variantId: number, options: { client?: PoolClient; performCheck?: boolean } = { performCheck: false }) => {
  if (images.length === 0) {
    throw new Error("variant images can't be empty");
  }

  const imageValues = Object.values(images).map((image) => [image.path, variantId]);

  let query: string;
  if (options.performCheck) {
    query = format(
      `DO
   $$
   DECLARE
       variant_image_count INT;
   BEGIN 
       PERFORM pg_try_advisory_xact_lock(2, %L);

       SELECT COUNT(*) INTO variant_image_count FROM variant_images WHERE product_variant_id = %L;
   
       IF (3-variant_image_count >= %L) THEN
           INSERT INTO variant_images (image_url, product_variant_id) VALUES %L;
       ELSE
           RAISE EXCEPTION 'too many variant-images';
       END IF;
   END
   $$`,
      variantId,
      variantId,
      imageValues.length,
      imageValues
    );
  } else {
    query = format(`INSERT INTO variant_images (image_url, product_variant_id) VALUES %L;`, imageValues);
  }

  console.log(query);

  let queryResult;
  if (options.client) {
    queryResult = await options.client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  return queryResult;

  // const rows = queryResult.rows as { product_image_id: number }[];

  // const result = rows.map((row) => row.product_image_id);
  // return result;
};

export const deleteVariantImage = async (variantImageId: number) => {
  const queryText = `UPDATE variant_images SET is_active=FALSE WHERE variant_image_id:$1;`;

  const query = {
    text: queryText,
    values: [variantImageId],
  };

  const queryResult = await pool.query(query);

  return queryResult;
};
