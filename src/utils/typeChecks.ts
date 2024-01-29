import { BadRequestError } from "../errors/BadRequestError";
import { ProductVariant } from "../types/product";

// export const isProductVariantArray = (arr: any[]): arr is ProductVariant[] => {
//   // Check if each element in the array is of type ProductVariants
//   return arr.every((item) => typeof item === "object" && item !== null && typeof item.name === "string" && typeof item.quantity === "number" && typeof item.price === "number");
// };

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
    };
  });

  return result;
};
