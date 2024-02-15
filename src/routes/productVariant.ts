import express from "express";
import { memoryFileUpload } from "../middleware/memoryFileUpload";
import * as productVariantController from "../controllers/productVariant.controller";
const router = express.Router();

router.post(
  "/:productId",
  memoryFileUpload().fields([
    {
      name: "variantImages",
      maxCount: 3,
    },
  ]),
  productVariantController.createProductVariant
);

router.patch("/:variantId", productVariantController.updateProductVariant);

router.delete("/:variantId", productVariantController.deleteProductVariant);

router.patch("/all/:productId", productVariantController.deleteAllProductVariant);

export default router;
