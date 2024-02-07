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

  // check if product exist0 and check if the product already have variants
  const hasVariantsResult = await hasVariants(parsedReq.params.productId);
  if (hasVariantsResult.rowCount === 0) {
    throw new BadRequestError("product doesn't exist");
  }

  const isProductHasVariants = hasVariantsResult.rows[0].has_variants;

  const variantImages = parsedReq.files as Express.Multer.File[] | undefined;

  let variantImagesWithPath: Express.Multer.File[];
  if (variantImages) {
    variantImagesWithPath = attachPathToFiles(variantImages);

    return { body: parsedReq.body, params: parsedReq.params, variantImages: variantImagesWithPath, isProductHasVariants };
  }

  return { body: parsedReq.body, params: parsedReq.params, variantImages, isProductHasVariants };
};
