import { PoolClient } from "pg";
import { ProductVariant } from "../types/productVariants";

export const addProductVariants = async (variants: ProductVariant[], productId: number, client?: PoolClient) => {
  const variantValues = variants.map((variant) => [productId, variant.name, variant.price, variant.quantity]);
};
