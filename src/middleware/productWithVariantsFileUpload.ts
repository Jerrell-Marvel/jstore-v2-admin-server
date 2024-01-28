import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import multer, { Field } from "multer";
import { fileUpload } from "./fileUpload";

export const productWithVariantsFileUpload = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  if (!req.query.variantCount) {
    throw new BadRequestError("variantCount query parameter is required");
  }

  const variantCount: number = parseInt(req.query.variantCount as string);
  const fileFields: Field[] = [
    {
      name: "displayImage",
      maxCount: 1,
    },
  ];
  for (let i = 0; i < variantCount; i++) {
    fileFields.push({
      name: `variants[${i}][images]`,
      maxCount: 3,
    });
  }
  console.log(fileFields);
  fileUpload("./public/product-images").fields(fileFields)(req, res, next);
};
