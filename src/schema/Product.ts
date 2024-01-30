// import Joi from "joi";

// export const productSchema = Joi.object({
//   name: Joi.string().min(1).max(255).required(),
//   description: Joi.string().min(1).max(255).required(),
//   quantity: Joi.number().greater(0).required(),
//   price: Joi.number().greater(0).required(),
// });

import { z } from "zod";

export const ProductSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1).max(255),
    quantity: z.coerce.number().gt(0),
    price: z.coerce.number().gt(0),
  })
  .strict();

export const ProductVariantSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    quantity: z.coerce.number().gt(0),
    price: z.coerce.number().gt(0),
  })
  .strict();
