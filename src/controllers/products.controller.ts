import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { addProduct } from "../services/products.service";
import { StatusCodes } from "http-status-codes";
import { addProductImages } from "../services/productImages.service";
import { ProductVariantWithImage } from "../types/productVariants";
import { parseProductVariantArray } from "../utils/typeChecks";
import { moveFiles } from "../utils/fileUtils";

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, quantity, price } = req.body;

  const parsedQuantity = parseInt(quantity);
  const parsedPrice = parseInt(price);

  if (!name || !description || !quantity || !price) {
    throw new BadRequestError("missing fields");
  }

  if (isNaN(parsedQuantity) || isNaN(parsedPrice) || parsedQuantity < 0 || parsedQuantity < 0) {
    throw new BadRequestError("invalid quantity or price field");
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files.displayImage) {
    throw new BadRequestError("display image can't be empty");
  }

  const result = await addProduct({ name, description, quantity, price }, files.displayImage[0], files.productImages);

  return res.status(StatusCodes.CREATED).json(result);
};

export const createProductWithVariants = async (req: Request, res: Response) => {
  const { name, description, variants, defaultVariantIdx } = req.body;

  if (!name || !description || !defaultVariantIdx) {
    console.log(name, description, defaultVariantIdx);
    throw new BadRequestError("missing fields");
  }

  if (!Array.isArray(variants) || variants.length == 0) {
    throw new BadRequestError("variants must be an array and not empty");
  }

  const parsedVariants = parseProductVariantArray(variants);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let displayImage: Express.Multer.File[] | undefined;

  if (!files.displayImage || files.displayImage.length === 0) {
    throw new BadRequestError("display image can't be empty");
  } else {
    displayImage = files.displayImage;
  }

  let imagesToMove: Express.Multer.File[] = [displayImage[0]];
  let imagesToDelete: Express.Multer.File[] = [];

  const variantWithImages: ProductVariantWithImage[] = parsedVariants.map((variant) => {
    return {
      ...variant,
      images: [],
    };
  });

  for (const [key, file] of Object.entries(files)) {
    const match = key.match(/\[(\d+)\]\[images\]/);

    if (match) {
      const variantIdx = parseInt(match[1]);

      if (variantIdx >= variantWithImages.length) {
        imagesToDelete.push(file);
      }

      variantWithImages[variantIdx].images = file;
    }
  }

  // const variantWithImages: ProductVariantWithImage[] = parsedVariants.map((variant, idx) => {
  //   const images = files[`variants[${idx}][images]`];
  //   imagesToMove = [...imagesToMove, ...images];
  //   return {
  //     ...variant,
  //     images: files[`variants[${idx}][images]`],
  //   };
  // });
  console.log(imagesToMove);

  await moveFiles(imagesToMove);
  return res.json(variantWithImages);

  return res.json(variantWithImages);
};
