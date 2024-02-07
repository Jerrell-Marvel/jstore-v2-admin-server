import { Request, Response } from "express";

import * as productImageService from "../services/productImage.service";
import { validateAndProcessCreateProductImageReq, validateAndProcessDeleteProductImageReq } from "../requestHandlers/productImageReqHandler";
import { pool } from "../db";
import { saveFiles } from "../utils/fileUtils";
import { BadRequestError } from "../errors/BadRequestError";

export const addProductImage = async (req: Request, res: Response) => {
  const { productImage, params } = await validateAndProcessCreateProductImageReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await productImageService.addProductImages([productImage], params.productId, { client, performCheck: true });

    await saveFiles([productImage]);

    await client.query("COMMIT");

    return res.json(productImage.path);
  } catch (error) {
    await client.query("ROLLBACK");

    console.log(error);

    return res.json(error);
  } finally {
    client.release();
  }
};

export const deleteProductImage = async (req: Request, res: Response) => {
  const {
    params: { productImageId },
  } = await validateAndProcessDeleteProductImageReq(req);

  console.log("here");

  const deleteProductImageResult = await productImageService.deleteProductImage(productImageId);

  if (deleteProductImageResult.rowCount === 0) {
    throw new BadRequestError("image doesn't exist");
  }

  return res.json("succeed");
};
