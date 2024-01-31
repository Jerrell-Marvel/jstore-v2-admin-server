import { Request, Response } from "express";
import { addProduct, addProductWithVariants } from "../../services/products.service";
import { StatusCodes } from "http-status-codes";
import { addProductImages } from "../../services/productImages.service";
import { validateAndProcessCreateProductReq, validateAndProcessCreateProductWithVariantsReq } from "../../requestHandlers/product/createProductReqHandlers";
import { pool } from "../../db";

export const createProduct = async (req: Request, res: Response) => {
  const { body, files, displayImage, productImages } = await validateAndProcessCreateProductReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const productId = await addProduct({ ...body, displayImageUrl: displayImage.path }, client);

    await addProductImages(productImages, productId, client);

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
  const { body, files, variantImages, displayImage, displayPrice } = await validateAndProcessCreateProductWithVariantsReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productId = await addProductWithVariants({ ...body, displayImageUrl: displayImage.path, displayPrice }, client);

    await client.query("COMMIT");

    return res.json(productId);
  } catch (e) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};
