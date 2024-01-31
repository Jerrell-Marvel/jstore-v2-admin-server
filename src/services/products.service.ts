import { Pool, PoolClient } from "pg";
import { pool } from "../db";
import { InternalServerError } from "../errors/InternalServerError";
import { Product, ProductVariant } from "../types/product";
import { addProductImages } from "./productImages.service";

export const addProduct = async (productData: Product & { displayImageUrl: string }, client?: PoolClient) => {
  const { name, description, quantity, price, displayImageUrl } = productData;
  const query = {
    text: `
        INSERT INTO products (name, description, quantity, price, display_price, display_image_url)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING product_id;
        `,
    values: [name, description, quantity, price, price, displayImageUrl],
  };

  let result;
  if (client) {
    result = await client.query(query);
  } else {
    result = await pool.query(query);
  }

  return result.rows[0].product_id as number;
};

// export const addProduct = async (productData: { name: string; description: string; quantity: number; price: number }, displayImage: Express.Multer.File, productImages?: Express.Multer.File[]) => {
//   const client = await pool.connect();

//   let productId, productImageIds;
//   try {
//     // start the transaction
//     await client.query("BEGIN");

//     const query = {
//       text: `
//           INSERT INTO products (name, description, quantity, price, display_price, display_image_url)
//           VALUES
//           ($1, $2, $3, $4, $5, $6)
//           RETURNING product_id;
//           `,
//       values: [productData.name, productData.description, productData.quantity, productData.price, productData.price, displayImage.filename],
//     };

//     const insertProductResult = await client.query(query);

//     productId = insertProductResult.rows[0].product_id;

//     if (productImages) {
//       productImageIds = await addProductImages(productImages, productId, client);
//     }

//     // commit transaction
//     await client.query("COMMIT");
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw new InternalServerError("Error on creating product");
//   } finally {
//     client.release();
//   }

//   return {
//     productId,
//     productImageIds,
//   };
// };

export const addProductWithVariants = async (productData: { name: string; description: string; displayPrice: number; displayImageUrl: string }, client?: PoolClient) => {
  const { name, description, displayImageUrl, displayPrice } = productData;

  // const displayPrice = variants[defaultVariantIdx].price;

  const query = {
    text: `
      INSERT INTO products (name, description, display_price, display_image_url)
      VALUES
      ($1, $2, $3, $4)
      RETURNING product_id;
      `,
    values: [name, description, displayPrice, displayImageUrl],
  };

  let result;
  if (client) {
    result = await client.query(query);
  } else {
    result = await pool.query(query);
  }

  return result.rows[0].product_id as number;
};
