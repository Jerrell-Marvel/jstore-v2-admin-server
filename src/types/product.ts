import { z } from "zod";
import { ProductSchema, ProductVariantSchema } from "../schema/Product";
export type Product = z.infer<typeof ProductSchema>;

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export type ProductVariantWithImage = ProductVariant & { images: Express.Multer.File[] };
