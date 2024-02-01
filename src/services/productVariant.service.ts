import { PoolClient } from "pg";
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
