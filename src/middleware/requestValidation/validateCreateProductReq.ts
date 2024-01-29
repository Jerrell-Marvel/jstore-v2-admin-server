import { Request, Response } from "express";
import { productSchema } from "../../schema/products";
import { ValidationError } from "joi";
import { BadRequestError } from "../../errors/BadRequestError";

export const validateCreateProductReq = async (req: Request, res: Response) => {
  const value = await productSchema.validateAsync(req.body);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files.displayImage || files.displayImage.length == 0) {
    throw new BadRequestError("display image is required");
  }

  req.body = value;
};
