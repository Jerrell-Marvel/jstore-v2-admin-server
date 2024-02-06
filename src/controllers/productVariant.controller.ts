import { Request, Response } from "express";
import { validateAndProcessCreateProductVariantReq } from "../requestHandlers/productVariantReqHandler";
import { pool } from "../db";
import { addProductVariants, hasVariants } from "../services/productVariant.service";
import { addVariantImages } from "../services/variantImage.service";
import { saveFiles } from "../utils/fileUtils";

export const createProductVariant = async (req: Request, res: Response) => {
  const { body, variantImages, params } = await validateAndProcessCreateProductVariantReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const isProductHasVariants = await hasVariants(params.productId);

    // spread operator is save to use due to .strict() on the body
    const variantIds = await addProductVariants([{ ...body }], params.productId, client);

    const variantId = variantIds[0];

    if (variantImages) {
      await addVariantImages(
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
