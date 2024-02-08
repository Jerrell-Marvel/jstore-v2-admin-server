import express from "express";
import { memoryFileUpload } from "../middleware/memoryFileUpload";
import productVariantController from "../controllers/productVariant.controller";
const router = express.Router();

router.post("/:productId", memoryFileUpload().array("variantImages", 3), productVariantController.createProductVariant);

router.patch("/:variantId", productVariantController.updateProductVariant);

export default router;
