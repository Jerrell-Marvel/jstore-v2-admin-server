import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { addProduct } from "../services/products.service";
import { StatusCodes } from "http-status-codes";

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, quantity, price } = req.body;

  const parsedQuantity = parseInt(quantity);
  const parsedPrice = parseInt(price);

  if (!name || !description || !quantity || !price) {
    throw new BadRequestError("missing fields");
  }

  if (isNaN(parsedQuantity) || isNaN(parsedPrice) || parsedQuantity < 0 || parsedQuantity < 0) {
    throw new BadRequestError("invalid quantity or price field");
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files.displayImage) {
    throw new BadRequestError("display image can't be empty");
  }

  const result = await addProduct({ name, description, quantity, price }, files.displayImage[0], files.productImages);

  return res.status(StatusCodes.CREATED).json(result);
};

export const createProductWithVariants = (req: Request, res: Response) => {
  return res.json("yeya");
};
