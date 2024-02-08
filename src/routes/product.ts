import express, { NextFunction, Request, Response } from "express";
import { fileUpload } from "../middleware/fileUpload";
productController;
import { productWithVariantsFileUpload } from "../middleware/productWithVariantsFileUpload";

import { memoryFileUpload } from "../middleware/memoryFileUpload";
import productController from "../controllers/product.controller";

const router = express.Router();

// router.post("/variants", fileUpload("./public/product-images").any(), createProductWithVariants);

router.post("/variants", productWithVariantsFileUpload, productController.createProductWithVariants);

router.post(
  "/",
  memoryFileUpload().fields([
    {
      name: "displayImage",
      maxCount: 1,
    },

    {
      name: "productImages",
      maxCount: 8,
    },
  ]),
  productController.createProduct
);

router.patch("/:productId", memoryFileUpload().single("displayImage"), productController.updateProduct);

export default router;
