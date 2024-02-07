import express from "express";
import { memoryFileUpload } from "../middleware/memoryFileUpload";
import { addProductImage, deleteProductImage } from "../controllers/productImage.controller";
const router = express.Router();

router.post("/:productId", memoryFileUpload().single("productImage"), addProductImage);

router.delete("/:productImageId", deleteProductImage);

export default router;
