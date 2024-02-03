import { Pool, PoolClient } from "pg";
import { pool } from "../db";
import { InternalServerError } from "../errors/InternalServerError";
import { Product, ProductVariant } from "../types/product";
import { addProductImages } from "./productImage.service";

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

export const updateProduct = async (
  product: {
    name?: string;
    description?: string;
    quantity?: number;
    price?: number;
    default_variant?: number;
  },
  productId: number,
  client?: PoolClient
) => {
  const keys = Object.keys(product);
  const values = Object.values(product);

  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  const queryText = `UPDATE PRODUCTS SET ${setClauses} WHERE product_id = $${keys.length + 1}`;
  const queryValues = [...values, productId];

  console.log(queryText);
  console.log(queryValues);

  const query = {
    text: queryText,
    values: queryValues,
  };

  let queryResult;
  if (client) {
    queryResult = await client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  console.log(queryResult);
};
