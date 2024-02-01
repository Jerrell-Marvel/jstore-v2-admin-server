import { Request, Response } from "express";
import { addProduct, addProductWithVariants } from "../../services/product.service";
import { StatusCodes } from "http-status-codes";
import { addProductImages } from "../../services/productImage.service";
import { validateAndProcessCreateProductReq, validateAndProcessCreateProductWithVariantsReq } from "../../requestHandlers/product/createProductReqHandlers";
import { pool } from "../../db";
import { addProductVariants } from "../../services/productVariant.service";
import { addVariantImages } from "../../services/variantImage.service";

export const createProduct = async (req: Request, res: Response) => {
  const { body, files, displayImage, productImages } = await validateAndProcessCreateProductReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const productId = await addProduct({ ...body, displayImageUrl: displayImage.path }, client);

    if (productImages) {
      await addProductImages(productImages, productId, client);
    }

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
  const { body, files, variantImages, displayImage, displayPrice, productImages } = await validateAndProcessCreateProductWithVariantsReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productId = await addProductWithVariants({ name: body.name, description: body.description, displayImageUrl: displayImage.path, displayPrice }, client);

    const productVariantIds = await addProductVariants(body.variants, productId, client);

    const variantIdWithImages = productVariantIds.map((id, idx) => {
      return {
        variantId: id,
        variantImages: variantImages[idx],
      };
    });

    if (productImages) {
      await addProductImages(productImages, productId, client);
    }

    await addVariantImages(variantIdWithImages, client);

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