import format from "pg-format";
import { pool } from "../db";
import { PoolClient } from "pg";
import { BadRequestError } from "../errors/BadRequestError";

type AddVariantImagesParams = {
  data: { variantId: number; variantImages: Express.Multer.File[] }[];
  client?: PoolClient;
};

export const addVariantImages = async (data: { variantId: number; variantImages: Express.Multer.File[] }[], client?: PoolClient) => {
  console.log(data);
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

  let result;
  if (client) {
    result = await client.query(query);
  } else {
    result = await pool.query(query);
  }

  return result.rows;
};
