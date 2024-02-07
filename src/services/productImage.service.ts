import format from "pg-format";
import { pool } from "../db";
import { PoolClient } from "pg";

export const addProductImages = async (images: Express.Multer.File[], productId: number, options: { client?: PoolClient; performCheck?: boolean } = { performCheck: false }) => {
  if (images.length === 0) {
    return [];
  }

  const imageValues = Object.values(images).map((image) => [image.path, productId]);

  let query: string;
  if (options.performCheck) {
    query = format(
      `DO
   $$
   DECLARE
       variant_count INT;
   BEGIN 
       SELECT COUNT(*) INTO variant_count FROM product_images WHERE product_id = %L FOR UPDATE;
   
       IF (8-variant_count >= %L) THEN
           INSERT INTO product_images (image_url, product_id) VALUES %L;
       ELSE
           RAISE EXCEPTION 'too many product-images';
       END IF;
   END
   $$`,
      productId,
      imageValues.length,
      imageValues
    );
  } else {
    query = format(`INSERT INTO product_images (image_url, product_id) VALUES %L;`, imageValues);
  }

  let queryResult;
  if (options.client) {
    queryResult = await options.client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  // const rows = queryResult.rows as { product_image_id: number }[];

  // const result = rows.map((row) => row.product_image_id);
  // return result;
};

export const deleteProductImage = async (productImageId: number, client?: PoolClient) => {
  const queryText = `DELETE FROM product_images WHERE product_image_id=$1;`;

  const query = {
    text: queryText,
    values: [productImageId],
  };

  if (client) {
    await client.query(query);
  } else {
    await pool.query(query);
  }
};
