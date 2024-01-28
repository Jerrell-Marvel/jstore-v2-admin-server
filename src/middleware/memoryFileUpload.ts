import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { InternalServerError } from "../errors/InternalServerError";

export const memoryFileUpload = () => {
  const storage = multer.memoryStorage();

  const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png/i;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new InternalServerError("Invalid file type"));
  };

  const limits = {
    fileSize: 1024 * 1024 * 4,
  };
  const upload = multer({ storage, fileFilter: imageFileFilter, limits });

  return upload;
};
