import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { addProduct } from "../services/products.service";
import { StatusCodes } from "http-status-codes";
import { addProductImages } from "../services/productImages.service";
import { ProductVariantWithImage } from "../types/product";
import { parseProductVariantArray } from "../utils/typeChecks";
import { moveFiles } from "../utils/fileUtils";
import { validateAndProcessCreateProductReq, validateAndProcessCreateProductWithVariantsReq } from "../validators/product.validator";
import { pool } from "../db";

export const createProduct = async (req: Request, res: Response) => {
  const { body, files } = await validateAndProcessCreateProductReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const productId = await addProduct(body, "test", client);

    await addProductImages(files.displayImage as Express.Multer.File[], productId, client);

    await client.query("COMMIT");

    return res.status(StatusCodes.CREATED).json(productId);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const createProductWithVariants = async (req: Request, res: Response) => {
  // return res.json(req.files);
  await validateAndProcessCreateProductWithVariantsReq(req);

  // const { body, files } = await validateCreateProductWithVariantsReq(req);
  // const { name, description, variants, defaultVariantIdx } = req.body;
  // if (!name || !description || !defaultVariantIdx) {
  //   console.log(name, description, defaultVariantIdx);
  //   throw new BadRequestError("missing fields");
  // }
  // if (!Array.isArray(variants) || variants.length === 0) {
  //   throw new BadRequestError("variants must be an array and not empty");
  // }
  // const parsedVariants = parseProductVariantArray(variants);
  // const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // let displayImage: Express.Multer.File[] | undefined;
  // if (!files.displayImage || files.displayImage.length === 0) {
  //   throw new BadRequestError("display image can't be empty");
  // } else {
  //   displayImage = files.displayImage;
  // }
  // let imagesToSave: Express.Multer.File[] = [];
  // const variantWithImages: ProductVariantWithImage[] = parsedVariants.map((variant, idx) => {
  //   const images = files[`variants[${idx}][images]`] || [];
  //   if (images && images.length !== 0) {
  //     imagesToSave = [...imagesToSave, ...images];
  //   }
  //   return {
  //     ...variant,
  //     images,
  //   };
  // });
  // // await addProduct
  // // await addProductImage
  // // await productVariant
  // // await productVariantImage
  // return res.json(variantWithImages);
};
