import { Request, Response } from "express";
import { validateAndProcessAddVariantImageReq, validateAndProcessDeleteVariantImageReq } from "../requestHandlers/variantImageReqHandler";
import { pool } from "../db";
import { BadRequestError } from "../errors/BadRequestError";
import { saveFiles } from "../utils/fileUtils";
import * as variantImageService from "../services/variantImage.service";

export const addVariantImages = async (req: Request, res: Response) => {
  const { params, variantImages } = await validateAndProcessAddVariantImageReq(req);

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

export const deleteVariantImage = async (req: Request, res: Response) => {
  const { params } = await validateAndProcessDeleteVariantImageReq(req);

  const deleteVariantImageResult = await variantImageService.deleteVariantImage(params.variantImageId);

  if (deleteVariantImageResult.rowCount === 0) {
    throw new BadRequestError("variant image doesn't exist");
  }

  return res.json("variant images deleted");
};
