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

export const ProductVariantSchema = z.object({
  name: z.string().trim().min(1).max(255),
  quantity: z.coerce.number().gt(0),
  price: z.coerce.number().gt(0),
});

export const productFieldsValidation = {
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  quantity: z.number().gt(0),
  price: z.number().gt(0),
  display_image_url: z.string().min(1).max(255),
  display_image_alt: z.string().min(1).max(255),
};

export const ProductSchema2 = z.object({
  name: productFieldsValidation.name,
  description: productFieldsValidation.description,
  quantity: productFieldsValidation.quantity,
  price: productFieldsValidation.price,
  display_image_url: productFieldsValidation.display_image_url,
});

type c = z.infer<typeof ProductSchema2>;
