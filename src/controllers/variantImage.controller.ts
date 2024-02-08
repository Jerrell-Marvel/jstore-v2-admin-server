import { Request, Response } from "express";
import { validateAndProcessAddProductImageReq } from "../requestHandlers/variantImageReqHandler";
import { pool } from "../db";

import * as variantImageService from "../services/variantImage.service";
import { BadRequestError } from "../errors/BadRequestError";
import { saveFiles } from "../utils/fileUtils";
const addVariantImages = async (req: Request, res: Response) => {
  const { params, variantImages } = await validateAndProcessAddProductImageReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const addVariantImagesResult = await variantImageService.createVariantImages(variantImages, params.variantId, { client, performCheck: true });

    if (addVariantImagesResult.rowCount === 0) {
      throw new BadRequestError("variant doesn't exist");
    }

    await saveFiles(variantImages);

    await client.query("COMMIT");

    return res.json("success");
  } catch (error) {
    await client.query("ROLLBACK");

    return res.json(error);
  } finally {
    client.release();
  }
};

export default { addVariantImages };
