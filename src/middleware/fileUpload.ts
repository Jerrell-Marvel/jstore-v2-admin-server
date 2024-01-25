import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

export const fileUpload = (destination: string) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },

    filename: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
    },
  });

  const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png/i;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));

    if (mimetype && extname) {
      return cb(null, true);
    }
    //   cb(new BadRequestError("invalid file type"));

    cb(new Error("Invalid file type"));
  };
  const limits = {
    fileSize: 1024 * 1024 * 3,
  };
  const upload = multer({ storage, fileFilter: imageFileFilter, limits });

  return upload;
};
