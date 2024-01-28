import express from "express";
import { fileUpload } from "../middleware/fileUpload";
import { createProduct, createProductWithVariants } from "../controllers/products.controller";
import { productWithVariantsFileUpload } from "../middleware/productWithVariantsFileUpload";

import multer from "multer";
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
