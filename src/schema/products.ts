import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(255).required(),
  quantity: Joi.number().greater(0).required(),
  price: Joi.number().greater(0).required(),
});
