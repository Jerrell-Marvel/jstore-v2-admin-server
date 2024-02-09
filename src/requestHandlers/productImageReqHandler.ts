import { Request } from "express";
import { z } from "zod";
import { attachPathToFiles } from "../utils/fileUtils";

export const validateAndProcessCreateProductImageReq = async (req: Request) => {
  const schema = z.object({
    files: z.array(z.unknown()).nonempty().max(8),
    params: z.object({
      productId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  const productImages = parsedReq.files as Express.Multer.File[];

  const productImagesWithPath = attachPathToFiles(productImages);

  return { params: parsedReq.params, productImages: productImagesWithPath };
};

export const validateAndProcessDeleteProductImageReq = async (req: Request) => {
  const schema = z.object({
    params: z.object({
      productImageId: z.coerce.number(),
    }),
  });

  return await schema.parseAsync(req);
};
