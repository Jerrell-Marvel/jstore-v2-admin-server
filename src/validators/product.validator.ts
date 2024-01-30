import { Request } from "express";
import { z, ZodError } from "zod";
import { ProductSchema, ProductVariantSchema } from "../schema/Product";

export const validateAndProcessCreateProductReq = async (req: Request) => {
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

  return await CreateProductReqSchema.parseAsync(req);
};

export const validateAndProcessCreateProductWithVariantsReq = async (req: Request) => {
  const bodySchema = z
    .object({
      name: z.string().trim().min(1).max(255),
      description: z.string().trim().min(1).max(255),
      variants: z.array(ProductVariantSchema).nonempty().max(10),
      defaultVariantIdx: z.coerce.number().gte(0).max(9),
    })
    .strict()
    .refine((data) => data.defaultVariantIdx < data.variants.length, {
      message: "invalid defaultVariantIdx field",
      path: ["defaultVariantIdx"],
    });
  // files

  //variant image files don't hv to be validated again because of multer, only check display image

  const fileSchema = z
    .object({
      displayImage: z.array(z.unknown()).nonempty().max(1),
    })
    .passthrough();

  const CreateProductWithVariantReqSchema = z.object({
    body: bodySchema,
    files: fileSchema,
  });

  const parsedReq = await CreateProductWithVariantReqSchema.parseAsync(req);

  const files = parsedReq.files as { displayImage: Express.Multer.File[]; [key: string]: Express.Multer.File[] };

  const variantImages: Express.Multer.File[][] = [];

  // console.log(files);

  for (let i = 0; i < parsedReq.body.variants.length; i++) {
    const images = files[`variants[${i}][images]`] || [];

    variantImages.push(images);
  }

  console.log(variantImages);

  return { body: parsedReq.body, files: files, variantImages };
};
