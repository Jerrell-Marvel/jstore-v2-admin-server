import { Request } from "express";
import { z, ZodError } from "zod";
import { ProductSchema, ProductVariantSchema } from "../../schema/Product";
import { generateUniqueSuffix } from "../../utils/common";

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

  const parsedReq = await CreateProductReqSchema.parseAsync(req);

  const files = parsedReq.files as {
    displayImage: Express.Multer.File[];
    productImages?: Express.Multer.File[];
  };

  const displayImageWithPath = files.displayImage[0];
  displayImageWithPath.path = "/public/product-images/" + generateUniqueSuffix() + "-" + displayImageWithPath.originalname;

  const productImagesWithPath = files.productImages?.map((image) => {
    return {
      ...image,
      path: "/public/product-images/" + generateUniqueSuffix() + "-" + image.originalname,
    };
  });

  return { body: parsedReq.body, files, displayImage: displayImageWithPath, productImages: productImagesWithPath || [] };
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
      message: "invalid defaultVariantIdx field (variant doesn't exist)",
      path: ["defaultVariantIdx"],
    });
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
  const displayImage = files.displayImage[0];
  displayImage.path = "/public/product-images/" + generateUniqueSuffix() + "-" + displayImage.originalname;

  // process product images
  const productImagesWithPath = files.productImages?.map((image) => {
    return {
      ...image,
      path: "/public/product-images/" + generateUniqueSuffix() + "-" + image.originalname,
    };
  });

  // process variant images
  // will contain array of multer file array, same index with variants array
  const variantImages: Express.Multer.File[][] = [];

  for (let i = 0; i < parsedReq.body.variants.length; i++) {
    const images = files[`variants[${i}][images]`] || [];

    // attaching path to each variantImage
    const imagesWithPath = images.map((image) => {
      return {
        ...image,
        path: "/public/product-images/" + generateUniqueSuffix() + "-" + image.originalname,
      };
    });

    variantImages.push(imagesWithPath);
  }

  // process display price
  const variants = parsedReq.body.variants;
  const displayPrice = variants[parsedReq.body.defaultVariantIdx].price;

  return { body: parsedReq.body, files, productImages: productImagesWithPath, variantImages, displayImage, displayPrice };
};
