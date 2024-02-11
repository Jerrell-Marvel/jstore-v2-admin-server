import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import { validateAndProcessCreateProductReq, validateAndProcessCreateProductWithVariantsReq, validateAndProcessDeleteProductReq, validateAndProcessUpdateProductReq } from "../requestHandlers/productReqHandlers";
import { pool } from "../db";

import { saveFiles } from "../utils/fileUtils";
import { BadRequestError } from "../errors/BadRequestError";
import * as productService from "../services/product.service";
import * as productImageService from "../services/productImage.service";
import * as productVariantService from "../services/productVariant.service";
import * as variantImageService from "../services/variantImage.service";

export const createProduct = async (req: Request, res: Response) => {
  const { body, files, displayImage, productImages } = await validateAndProcessCreateProductReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const productId = await productService.addProduct({ ...body, displayImageUrl: displayImage.path }, client);

    const imagesToSave = [displayImage];
    if (productImages) {
      imagesToSave.push(...productImages);

      await productImageService.addProductImages(productImages, productId, { client });
    }

    await saveFiles(imagesToSave);

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
  const { body, files, variantsImages, displayImage, displayPrice, productImages } = await validateAndProcessCreateProductWithVariantsReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productId = await productService.addProductWithVariants({ name: body.name, description: body.description, displayImageUrl: displayImage.path, displayPrice }, client);

    const productVariantIds = await productVariantService.addProductVariants(body.variants, productId, client);

    const imagesToSave = [displayImage];

    // to save it to product_images table
    if (productImages) {
      imagesToSave.push(...productImages);
      await productImageService.addProductImages(productImages, productId, { client });
    }

    const variantIdWithImages = productVariantIds.map((id, idx) => {
      const images = variantsImages[idx];
      imagesToSave.push(...images);

      return {
        variantId: id,
        variantImages: images,
      };
    });
    await variantImageService.createMultipleVariantImages(variantIdWithImages, client);

    await saveFiles(imagesToSave);

    await productService.updateProduct({ default_variant: productVariantIds[body.defaultVariantIdx] }, productId, client);

    await client.query("COMMIT");

    return res.json({ productId, productVariantIds });
  } catch (e) {
    console.log("error occured");
    console.log(e);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { body, displayImage, params } = await validateAndProcessUpdateProductReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // make sure that if a product has variants then quantity and price field can't be updated
    const hasVariantsResult = await productVariantService.hasVariants(params.productId, client);

    if (hasVariantsResult.rowCount === 0) {
      throw new BadRequestError("product doesn't exist");
    }

    if (hasVariantsResult.rows[0].has_variants && (body.quantity || body.price)) {
      throw new BadRequestError("product with variants cannot have quantity and price field");
    }

    const updateData: typeof body & { display_image_url?: string } = body;

    if (displayImage) {
      updateData.display_image_url = displayImage.path;
      await saveFiles([displayImage]);
    }

    const result = await productService.updateProduct(updateData, params.productId, client);

    if (result.rowCount === 0) {
      throw new BadRequestError("product doesn't exist");
    }

    await client.query("COMMIT");

    return res.json(result);
  } catch (e) {
    await client.query("ROLLBACK");

    return res.json(e);
  } finally {
    client.release();
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  const { params } = await validateAndProcessDeleteProductReq(req);

  const deleteProductResult = await productService.deleteProduct(params.productId);

  if (deleteProductResult.rowCount === 0) {
    throw new BadRequestError("product doesn't exist");
  }

  return res.json("deleted");
};

// export default {
//   createProduct,
//   createProductWithVariants,
//   updateProduct,
//   deleteProduct,
// };
