import { Request } from "express";
import { z, ZodError } from "zod";
import { ProductSchema } from "../schema/Product";

export const validateCreateProductReq = async (req: Request) => {
  console.log(req.body);
  console.log(typeof req.body.productImages);
  const CreateProductReqSchema = z.object({
    body: ProductSchema,
    files: z
      .object({
        displayImage: z.array(z.unknown()).nonempty().max(1),
        productImages: z.array(z.unknown()).nonempty().max(8).optional(),
      })
      .strict(),
  });
  type A = z.infer<typeof CreateProductReqSchema>;
  return await CreateProductReqSchema.parseAsync(req);
};
