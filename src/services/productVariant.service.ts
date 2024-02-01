import { PoolClient } from "pg";
import { ProductVariant } from "../types/product";
import format from "pg-format";
import { pool } from "../db";

export const addProductVariants = async (variants: ProductVariant[], productId: number, client?: PoolClient) => {
  const variantValues = variants.map((variant) => [productId, variant.name, variant.price, variant.quantity]);

  console.log(variantValues);

  const query = format(
    `INSERT INTO product_variants (product_id, name, quantity, price)
  VALUES %L RETURNING product_variant_id`,
    variantValues
  );

  let result;

  if (client) {
    result = await client.query(query);
  } else {
    result = await pool.query(query);
  }

  return result.rows.map((data) => data.product_variant_id);
};
