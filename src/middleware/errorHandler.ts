import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(JSON.stringify(err));
  console.log("here");
  let customError = {
    success: false,
    name: err.name || "Internal server error",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong try again later",
  };

  return res.status(customError.statusCode).json(customError);
};
