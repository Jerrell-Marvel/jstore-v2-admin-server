import { Request } from "express";
import { z, ZodError } from "zod";
import { ProductSchema, ProductSchema2, ProductVariantSchema } from "../../schema/Product";
import { generateUniqueSuffix } from "../../utils/common";
import { attachPathToFiles } from "../../utils/fileUtils";
import { parse } from "dotenv";
import { hasVariants } from "../../services/productVariant.service";
import { BadRequestError } from "../../errors/BadRequestError";

export const validateAndProcessCreateProductReq = async (req: Request) => {
  const CreateProductReqSchema = z.object({
    body: ProductSchema,
    files: z
      .object({
        displayImage: z.array(z.unknown()).nonempty().max(1),
        productImages: z.array(z.unknown()).nonempty().max(8).optional(),
      })
      .strict(),
  });

  const parsedReq = await CreateProductReqSchema.parseAsync(req);

  const files = parsedReq.files as {
    displayImage: Express.Multer.File[];
    productImages?: Express.Multer.File[];
  };

  const displayImageWithPath = attachPathToFiles(files.displayImage)[0];

  const productImagesWithPath = files.productImages && attachPathToFiles(files.productImages);

  return { body: parsedReq.body, files, displayImage: displayImageWithPath, productImages: productImagesWithPath };
};

export const validateAndProcessCreateProductWithVariantsReq = async (req: Request) => {
  const bodySchema = z
    .object({
      name: z.string().trim().min(1).max(255),
      description: z.string().trim().min(1).max(255),
      quantity: z.coerce.number().gt(0).optional(),
      price: z.coerce.number().gt(0).optional(),
      variants: z.array(ProductVariantSchema).nonempty().max(10).optional(),
      defaultVariantIdx: z.coerce.number().gte(0).max(9).optional(),
    })
    .strict()
    .refine((data) => (data.variants ? !data.quantity && !data.price : true), {
      message: "product with variants can't have quantity and price",
      path: ["quantity", "price"],
    })

    .refine(
      (data) => {
        if (data.variants) {
          return data.defaultVariantIdx ? data.defaultVariantIdx < data.variants?.length : false;
        }

        return true;
      },
      {
        message: "defaultVariantIdx field is required and must be less than the number of variants",
        path: ["defaultVariantIdx"],
      }
    );
  // files

  //variant image files don't hv to be validated again because of multer, only check display image
  const fileSchema = z
    .object({
      displayImage: z.array(z.unknown()).nonempty().max(1),
      productImages: z.array(z.unknown()).nonempty().max(8).optional(),
    })
    .passthrough();

  const CreateProductWithVariantReqSchema = z.object({
    body: bodySchema,
    files: fileSchema,
  });

  const parsedReq = await CreateProductWithVariantReqSchema.parseAsync(req);

  const files = parsedReq.files as { displayImage: Express.Multer.File[]; productImages?: Express.Multer.File[] } & { [key: string]: Express.Multer.File[] | undefined };

  // process display images
  const displayImageWithPath = attachPathToFiles(files.displayImage)[0];

  // process product images
  const productImagesWithPath = files.productImages && attachPathToFiles(files.productImages);

  if (parsedReq.body.variants) {
    // process variant images
    // will contain array of multer file array, same index with variants array
    const variantsImages: Express.Multer.File[][] = [];

    for (let i = 0; i < parsedReq.body.variants.length; i++) {
      const images = files[`variants[${i}][images]`] || [];

      // attaching path to each variantImage
      const imagesWithPath = attachPathToFiles(images);

      variantsImages.push(imagesWithPath);
    }

    // process display price
    const variants = parsedReq.body.variants;
    const displayPrice = variants[parsedReq.body.defaultVariantIdx!].price;

    return { body: parsedReq.body, files, productImages: productImagesWithPath, hasVariants: true, variantsImages, displayImage: displayImageWithPath, displayPrice };
  }

  return { body: parsedReq.body, files, displayImage: displayImageWithPath, productImages: productImagesWithPath };
};

export const validateAndProcessUpdateProductReq = async (req: Request) => {
  const updateProductSchema = z
    .object({
      body: ProductSchema.partial().strict(),

      // multer .single(), which is the display image
      file: z.unknown().optional(),

      params: z.object({
        productId: z.coerce.number(),
      }),
    })
    .refine((data) => data.body.description || data.body.name || data.body.price || data.body.quantity || data.body.quantity === 0 || data.file, {
      message: "cannot send empty data",
    });

  const parsedReq = await updateProductSchema.parseAsync(req);

  // make sure that if a product has variants then quantity and price field can't be updated
  const isProductHasVariants = await hasVariants(parsedReq.params.productId);
  if (isProductHasVariants && (parsedReq.body.quantity || parsedReq.body.price)) {
    throw new BadRequestError("product with variants cannot have quantity and price field");
  }
  const displayImage = parsedReq.file as Express.Multer.File | undefined;

  let displayImageWithPath: Express.Multer.File | undefined;
  if (displayImage) {
    displayImageWithPath = attachPathToFiles([displayImage])[0];
  }

  return { body: parsedReq.body, params: parsedReq.params, file: parsedReq.file, displayImage: displayImageWithPath };
};
