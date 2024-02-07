import { ProductVariantSchema } from "../schema/Product";
import { z } from "zod";
import { attachPathToFiles } from "../utils/fileUtils";
import { Request } from "express";
import { hasVariants } from "../services/productVariant.service";
import { BadRequestError } from "../errors/BadRequestError";

export const validateAndProcessCreateProductVariantReq = async (req: Request) => {
  const schema = z.object({
    body: ProductVariantSchema,
    files: z.array(z.unknown()).nonempty().max(3).optional(),
    params: z.object({
      productId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  const variantImages = parsedReq.files as Express.Multer.File[] | undefined;

  let variantImagesWithPath: Express.Multer.File[];
  if (variantImages) {
    variantImagesWithPath = attachPathToFiles(variantImages);

    return { body: parsedReq.body, params: parsedReq.params, variantImages: variantImagesWithPath };
  }

  return { body: parsedReq.body, params: parsedReq.params, variantImages };
};
