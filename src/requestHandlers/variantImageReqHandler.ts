import { Request } from "express";
import { z } from "zod";
import { attachPathToFiles } from "../utils/fileUtils";

export const validateAndProcessAddVariantImageReq = async (req: Request) => {
  const schema = z.object({
    files: z.object({
      variantImages: z.array(z.unknown()).nonempty().max(3),
    }),
    params: z.object({
      variantId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  const variantImages = parsedReq.files.variantImages as Express.Multer.File[];

  const variantImagesWithPath = attachPathToFiles(variantImages);

  return { params: parsedReq.params, variantImages: variantImagesWithPath };
};

export const validateAndProcessDeleteVariantImageReq = async (req: Request) => {
  const schema = z.object({
    params: z.object({
      variantImageId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  return { params: parsedReq.params };
};
