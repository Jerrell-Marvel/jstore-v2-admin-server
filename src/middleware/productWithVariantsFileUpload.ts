import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import multer, { Field } from "multer";
import { memoryFileUpload } from "./memoryFileUpload";

export const productWithVariantsFileUpload = async (req: Request, res: Response, next: NextFunction) => {
  const MAX_VARIANT_LIMIT = 10;
  const MAX_VARIANT_IMAGE_LIMIT = 3;

  const fileFields: Field[] = [
    {
      name: "displayImage",
      maxCount: 1,
    },
  ];
  for (let i = 0; i < MAX_VARIANT_LIMIT; i++) {
    fileFields.push({
      name: `variants[${i}][images]`,
      maxCount: MAX_VARIANT_IMAGE_LIMIT,
    });
  }

  memoryFileUpload().fields(fileFields)(req, res, next);
};
