import format from "pg-format";
import { pool } from "../db";
export const addProductImages = async (images: Express.Multer.File[], productId: number) => {
  console.log(typeof productId);
  const imageValues = Object.values(images).map((image) => [image.filename, productId]);

  const query = format(`INSERT INTO product_images (image_url, product_id) VALUES %L RETURNING product_image_id`, imageValues);

  const result = await pool.query(query);

  return result.rows;
};
