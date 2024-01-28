import { BadRequestError } from "../errors/BadRequestError";
import { ProductVariant } from "../types/productVariants";

export const parseProductVariantArray = (items: any[]): ProductVariant[] => {
  const result = items.map((item: any) => {
    const name = item.name;
    const quantity = parseInt(item.quantity);
    const price = parseInt(item.price);

    if (!name || typeof name !== "string") {
      throw new BadRequestError("invalid variant name field");
    }

    if (isNaN(quantity) || isNaN(price)) {
      throw new BadRequestError("quantity and price must be valid numbers.");
    }

    return {
      name,
      quantity,
      price,
      someWeirdField: "any string",
    };
  });

  return result;
};
