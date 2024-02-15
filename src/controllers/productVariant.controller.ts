import { Request, Response } from "express";
import { validateAndProcessCreateProductVariantReq, validateAndProcessDeleteAllProductVariantReq, validateAndProcessDeleteProductVariantReq, validateAndProcessUpdateProductVariantReq } from "../requestHandlers/productVariantReqHandler";
import { pool } from "../db";

import { saveFiles } from "../utils/fileUtils";

import { BadRequestError } from "../errors/BadRequestError";

import * as productService from "../services/product.service";
import * as productVariantService from "../services/productVariant.service";
import * as variantImageService from "../services/variantImage.service";
import { updateProduct } from "./product.controller";

export const createProductVariant = async (req: Request, res: Response) => {
  const { body, variantImages, params } = await validateAndProcessCreateProductVariantReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // check if product exist0 and check if the product already have variants
    const hasVariantsResult = await productVariantService.hasVariants(params.productId, client);
    if (hasVariantsResult.rowCount === 0) {
      throw new BadRequestError("product doesn't exist");
    }
    const isProductHasVariants = hasVariantsResult.rows[0].has_variants;

    // spread operator is save to use due to .strict() on the body
    const variantIds = await productVariantService.addProductVariants([{ ...body }], params.productId, client);
    const variantId = variantIds[0];

    if (!isProductHasVariants) {
      await productService.updateProduct({ price: undefined, quantity: undefined, default_variant: variantId, has_variants: true }, params.productId, client);
    }

    if (variantImages) {
      await variantImageService.createMultipleVariantImages(
        [
          {
            variantId,
            variantImages,
          },
        ],
        client
      );

      await saveFiles(variantImages);
    }

    await client.query("COMMIT");

    return res.json("success");
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

export const updateProductVariant = async (req: Request, res: Response) => {
  const { body, params } = await validateAndProcessUpdateProductVariantReq(req);
  console.log("here");

  const updateProductVariantResult = await productVariantService.updateProductVariant({ ...body }, params.variantId);

  if (updateProductVariantResult.rowCount === 0) {
    throw new BadRequestError("variant doesn't exist");
  }

  return res.json(updateProductVariantResult);
};

export const deleteProductVariant = async (req: Request, res: Response) => {
  const { params } = await validateAndProcessDeleteProductVariantReq(req);

  const deleteProductVariantResult = await productVariantService.deleteVariant(params.variantId);

  if (deleteProductVariantResult.rowCount === 0) {
    throw new BadRequestError("variant doesn't exist");
  }

  return res.json("variant deleted");
};

export const deleteAllProductVariant = async (req: Request, res: Response) => {
  const { body, params } = await validateAndProcessDeleteAllProductVariantReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productServiceResult = await productService.updateProduct({ default_variant: undefined, quantity: body.quantity, price: body.quantity, has_variants: false }, params.productId, client);

    if (productServiceResult.rowCount === 0) {
      throw new BadRequestError("product doesn't exist");
    }

    await productVariantService.deleteVariantsByProductId(params.productId, client);

    await client.query("COMMIT");

    return res.json("success");
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");

    return res.json(error);
  } finally {
    client.release();
  }
};
