import { Request, Response } from "express";
import { addProduct, addProductWithVariants, updateProduct } from "../services/product.service";
import { StatusCodes } from "http-status-codes";
import { addProductImages } from "../services/productImage.service";
import { validateAndProcessCreateProductReq, validateAndProcessCreateProductWithVariantsReq, validateAndProcessUpdateProductReq } from "../requestHandlers/productReqHandlers";
import { pool } from "../db";
import { addProductVariants, hasVariants } from "../services/productVariant.service";
import { addVariantImages } from "../services/variantImage.service";
import { saveFiles } from "../utils/fileUtils";
import { BadRequestError } from "../errors/BadRequestError";

export const createProduct = async (req: Request, res: Response) => {
  const { body, files, displayImage, productImages } = await validateAndProcessCreateProductReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const productId = await addProduct({ ...body, displayImageUrl: displayImage.path }, client);

    const imagesToSave = [displayImage];
    if (productImages) {
      imagesToSave.push(...productImages);
      await addProductImages(productImages, productId, { client, performCheck: true });
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

    const productId = await addProductWithVariants({ name: body.name, description: body.description, displayImageUrl: displayImage.path, displayPrice }, client);

    const productVariantIds = await addProductVariants(body.variants, productId, client);

    const imagesToSave = [displayImage];

    // to save it to product_images table
    if (productImages) {
      imagesToSave.push(...productImages);
      await addProductImages(productImages, productId, { client });
    }

    const variantIdWithImages = productVariantIds.map((id, idx) => {
      const images = variantsImages[idx];
      imagesToSave.push(...images);

      return {
        variantId: id,
        variantImages: images,
      };
    });
    await addVariantImages(variantIdWithImages, client);

    await saveFiles(imagesToSave);

    await updateProduct({ default_variant: productVariantIds[body.defaultVariantIdx] }, productId, client);

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

export const updateProductController = async (req: Request, res: Response) => {
  const { body, displayImage, params } = await validateAndProcessUpdateProductReq(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateData: typeof body & { display_image_url?: string } = body;

    if (displayImage) {
      updateData.display_image_url = displayImage.path;
    }

    const result = await updateProduct(updateData, params.productId, client);

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
