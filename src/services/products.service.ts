import { pool } from "../db";
import { addProductImages } from "./productImages.service";

export const addProduct = async (productData: { name: string; description: string; quantity: number; price: number }, displayImage: Express.Multer.File, productImages: Express.Multer.File[]) => {
  const query = {
    text: `
        INSERT INTO products (name, description, quantity, price, display_price, display_image_url)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING product_id;
        `,
    values: [productData.name, productData.description, productData.quantity, productData.price, productData.price, displayImage.filename],
  };
  const insertProductResult = await pool.query(query);

  const productId = insertProductResult.rows[0].product_id;

  const insertProductImageResult = await addProductImages(productImages, productId);

  return {
    productId: insertProductResult.rows[0],
    productImageIds: insertProductImageResult,
  };
};
