import express from "express";
import { memoryFileUpload } from "../middleware/memoryFileUpload";
import { createProductVariant, updateProductVariant } from "../controllers/productVariant.controller";

const router = express.Router();

router.post("/:productId", memoryFileUpload().array("variantImages", 3), createProductVariant);

router.patch("/:variantId", memoryFileUpload().array("variantImages", 3), updateProductVariant);
