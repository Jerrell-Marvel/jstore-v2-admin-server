import format from "pg-format";
import { pool } from "../db";
import { PoolClient } from "pg";
export const addProductImages = async (images: Express.Multer.File[], productId: number, client?: PoolClient) => {
  const imageValues = Object.values(images).map((image) => [image.filename, productId]);

  const query = format(`INSERT INTO product_images (image_url, product_id) VALUES %L RETURNING product_image_id`, imageValues);

  let result;

  if (client) {
    result = await client.query(query);
  } else {
    result = await pool.query(query);
  }

  return result.rows;
};
