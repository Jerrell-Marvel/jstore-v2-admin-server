import { ProductVariantSchema } from "../schema/Product";
import { z } from "zod";
import { attachPathToFiles } from "../utils/fileUtils";
import { Request } from "express";

export const validateAndProcessCreateProductVariantReq = async (req: Request) => {
  const schema = z.object({
    body: ProductVariantSchema.strict(),
    files: z.object({
      variantImages: z.array(z.unknown()).nonempty().max(3).optional(),
    }),

    params: z.object({
      productId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  const variantImages = parsedReq.files.variantImages as Express.Multer.File[] | undefined;

  let variantImagesWithPath: Express.Multer.File[];
  if (variantImages) {
    variantImagesWithPath = attachPathToFiles(variantImages);

    return { body: parsedReq.body, params: parsedReq.params, variantImages: variantImagesWithPath };
  }

  return { body: parsedReq.body, params: parsedReq.params, variantImages };
};

export const validateAndProcessUpdateProductVariantReq = async (req: Request) => {
  console.log(req.body);
  const schema = z.object({
    body: ProductVariantSchema.partial().strict(),
    params: z.object({
      variantId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  return { body: parsedReq.body, params: parsedReq.params };
};

export const validateAndProcessDeleteProductVariantReq = async (req: Request) => {
  console.log(req.body);
  const schema = z.object({
    body: z.object({
      quantity: z.coerce.number().optional(),
      price: z.coerce.number().optional(),
    }),
    params: z.object({
      variantId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  return { body: parsedReq.body, params: parsedReq.params };
};

export const validateAndProcessDeleteAllProductVariantReq = async (req: Request) => {
  console.log(req.body);

  const schema = z.object({
    body: z
      .object({
        quantity: z.coerce.number().gt(0),
        price: z.coerce.number().gt(0),
      })
      .strict(),
    params: z.object({
      productId: z.coerce.number(),
    }),
  });

  const parsedReq = await schema.parseAsync(req);

  return { body: parsedReq.body, params: parsedReq.params };
};
