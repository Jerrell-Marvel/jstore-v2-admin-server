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

  for (const variant of data) {
    for (const variantImage of variant.variantImages) {
      imageValues.push([variant.variantId, variantImage.path]);
    }
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
