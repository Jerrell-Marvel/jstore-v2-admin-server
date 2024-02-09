import express from "express";
import { productWithVariantsFileUpload } from "../middleware/productWithVariantsFileUpload";

import { memoryFileUpload } from "../middleware/memoryFileUpload";
import productController from "../controllers/product.controller";

const router = express.Router();

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
