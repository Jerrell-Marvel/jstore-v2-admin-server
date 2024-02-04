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
    text: `SELECT EXISTS(SELECT 1 FROM product_variants WHERE product_id=$1);`,
    values: [productId],
  };

  let queryResult: QueryResult<{ exists: boolean }>;

  if (client) {
    queryResult = await client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  const test = await pool.query<{ exists: boolean }>(query);

  const rows = queryResult.rows;

  return rows[0].exists;
};
