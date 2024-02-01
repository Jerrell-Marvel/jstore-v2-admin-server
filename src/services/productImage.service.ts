import format from "pg-format";
import { pool } from "../db";
import { PoolClient } from "pg";

export const addProductImages = async (images: Express.Multer.File[], productId: number, client?: PoolClient) => {
  if (images.length === 0) {
    return [];
  }

  const imageValues = Object.values(images).map((image) => [image.path, productId]);

  const query = format(`INSERT INTO product_images (image_url, product_id) VALUES %L RETURNING product_image_id`, imageValues);

  let queryResult;
  if (client) {
    queryResult = await client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  const rows = queryResult.rows as { product_image_id: number }[];

  const result = rows.map((row) => row.product_image_id);
  return result;
};
