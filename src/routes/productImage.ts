import express from "express";
import { memoryFileUpload } from "../middleware/memoryFileUpload";
import { addProductImage } from "../controllers/productImage.controller";
const router = express.Router();

router.post("/:productId", memoryFileUpload().single("productImage"), addProductImage);

export default router;
