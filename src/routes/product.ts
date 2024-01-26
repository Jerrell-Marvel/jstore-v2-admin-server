import express from "express";
import { fileUpload } from "../middleware/fileUpload";
import { createProduct } from "../controllers/products.controller";

const router = express.Router();

router.post("/variants", fileUpload("./public/product-images").any(), createProduct);

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
