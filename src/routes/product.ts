import express, { NextFunction, Request, Response } from "express";
import { fileUpload } from "../middleware/fileUpload";
import { createProduct, createProductWithVariants } from "../controllers/product/product.controller";
import { productWithVariantsFileUpload } from "../middleware/productWithVariantsFileUpload";

const router = express.Router();

// router.post("/variants", fileUpload("./public/product-images").any(), createProductWithVariants);

router.post("/variants", productWithVariantsFileUpload, createProductWithVariants);

router.post(
  "/",
  fileUpload("./public/product-images").fields([
    {
      name: "displayImage",
      maxCount: 1,
    },

    {
      name: "productImages",
      maxCount: 8,
    },
  ]),
  createProduct
);

export default router;
