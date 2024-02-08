import { PoolClient, QueryResult } from "pg";
import { ProductVariant } from "../types/product";
import format from "pg-format";
import { pool } from "../db";

export const addProductVariants = async (variants: ProductVariant[], productId: number, client?: PoolClient) => {
  const variantValues = variants.map((variant) => [productId, variant.name, variant.price, variant.quantity]);

  const query = format(
    `INSERT INTO product_variants (product_id, name, quantity, price)
  VALUES %L RETURNING product_variant_id`,
    variantValues
  );

  let queryResult;

  if (client) {
    queryResult = await client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  const rows = queryResult.rows as { product_variant_id: number }[];

  const result = rows.map((row) => row.product_variant_id);
  return result;
};

export const hasVariants = async (productId: number, client?: PoolClient) => {
  const query = {
    text: `SELECT has_variants FROM products WHERE product_id=$1 FOR UPDATE;`,
    values: [productId],
  };

  let queryResult: QueryResult<{ has_variants: boolean }>;

  if (client) {
    queryResult = await client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  return queryResult;
};

export const updateProduct = async (
  product: {
    name?: string;
    quantity?: number;
    price?: number;
  },
  variantId: number,
  client?: PoolClient
) => {
  let placeHolderCount = 0;

  const keys = Object.keys(product);
  const values = Object.values(product);

  const setClauses = keys.map((key, index) => `${key} = $${++placeHolderCount}`).join(", ");

  const queryText = `UPDATE product_variants SET ${setClauses} WHERE product_variant_id = $${++placeHolderCount} RETURNING *;`;

  const queryValues = [...values, variantId];

  const query = {
    text: queryText,
    values: queryValues,
  };

  let queryResult: QueryResult;
  if (client) {
    queryResult = await client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  return queryResult;
};
