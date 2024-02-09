import express from "express";
import { memoryFileUpload } from "../middleware/memoryFileUpload";
import productImageController from "../controllers/productImage.controller";
productImageController;
const router = express.Router();

router.post(
  "/:productId",
  memoryFileUpload().fields([
    {
      name: "productImages",
      maxCount: 8,
    },
  ]),
  productImageController.addProductImages
);

router.delete("/:productImageId", productImageController.deleteProductImage);

export default router;
