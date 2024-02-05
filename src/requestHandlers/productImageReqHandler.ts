import { Request } from "express";
import { z } from "zod";
import { attachPathToFiles } from "../utils/fileUtils";

export const validateAndProcessCreateProductImageReq = async (req: Request) => {
  const schema = z
    .object({
      file: z.unknown(),
      params: z.object({
        productId: z.coerce.number(),
      }),
    })
    .refine((data) => data.file, {
      message: "productImage file is required",
      path: ["productImage"],
    });

  const parsedReq = await schema.parseAsync(req);

  const productImage = parsedReq.file as Express.Multer.File;

  const productImageWithPath = attachPathToFiles([productImage])[0];

  return { params: parsedReq.params, productImage: productImageWithPath };
};

export const validateAndProcessDeleteProductImageReq = async (req: Request) => {
  const schema = z.object({
    params: z.object({
      productImageId: z.coerce.number(),
    }),
  });

  return await schema.parseAsync(req);
};
