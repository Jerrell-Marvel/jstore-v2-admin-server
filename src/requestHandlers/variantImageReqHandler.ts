import { Request } from "express";
import { z } from "zod";
import { attachPathToFiles } from "../utils/fileUtils";

export const validateAndProcessAddProductImageReq = async (req: Request) => {
  const schema = z.object({
    files: z.array(z.unknown()).nonempty().max(3),
    params: z.object({
      variantId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  const variantImages = parsedReq.files as Express.Multer.File[];

  const variantImagesWithPath = attachPathToFiles(variantImages);

  return { params: parsedReq.params, variantImages: variantImagesWithPath };
};
