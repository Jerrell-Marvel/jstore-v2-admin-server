import express, { NextFunction, Request, Response } from "express";
import { fileUpload } from "../middleware/fileUpload";
import { createProduct, createProductWithVariants, updateProductController } from "../controllers/product/product.controller";
import { productWithVariantsFileUpload } from "../middleware/productWithVariantsFileUpload";
import { updateProduct } from "../services/product.service";
import { memoryFileUpload } from "../middleware/memoryFileUpload";

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

router.patch("/:productId", memoryFileUpload().single("displayImage"), updateProductController);

export default router;
