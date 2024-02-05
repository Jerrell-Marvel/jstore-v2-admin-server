import { Request, Response } from "express";

import * as productImageService from "../services/productImage.service";
import { validateAndProcessCreateProductImageReq } from "../requestHandlers/productImageReqHandler";
import { pool } from "../db";
import { saveFiles } from "../utils/fileUtils";

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

    return res.json(error);
  } finally {
    client.release();
  }
};
