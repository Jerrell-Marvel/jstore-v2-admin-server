import { Request, Response } from "express";

import { validateAndProcessCreateProductImageReq, validateAndProcessDeleteProductImageReq } from "../requestHandlers/productImageReqHandler";
import { pool } from "../db";
import { saveFiles } from "../utils/fileUtils";
import { BadRequestError } from "../errors/BadRequestError";
import * as productImageService from "../services/productImage.service";

export const addProductImages = async (req: Request, res: Response) => {
  const { productImages, params } = await validateAndProcessCreateProductImageReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await productImageService.addProductImages(productImages, params.productId, { client, performCheck: true });

    await saveFiles(productImages);

    await client.query("COMMIT");

    return res.json(productImages);
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
