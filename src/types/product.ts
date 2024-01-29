import { z } from "zod";
import { ProductSchema } from "../schema/Product";
export type Product = z.infer<typeof ProductSchema>;

export type ProductVariant = {
  name: string;
  quantity: number;
  price: number;
};

export type ProductVariantWithImage = ProductVariant & { images: Express.Multer.File[] };
