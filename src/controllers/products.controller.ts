import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { addProduct } from "../services/products.service";

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, quantity, price } = req.body;

  if (!name || !description || !quantity || !price) {
    throw new BadRequestError("missing fields");
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files.displayImage) {
    throw new BadRequestError("display image can't be empty");
  }

  const result = await addProduct({ name, description, quantity, price }, files.displayImage[0], files.productImages);

  return res.json(result);
};

export const createProductWithVariants = (req: Request, res: Response) => {
  return res.json("yeya");
};
