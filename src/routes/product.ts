import express from "express";
import { fileUpload } from "../middleware/fileUpload";
import { createProduct } from "../controllers/product";

const router = express.Router();

router.post("/", fileUpload("./public/product-images").any(), createProduct);

export default router;
