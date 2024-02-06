import express from "express";
import { memoryFileUpload } from "../middleware/memoryFileUpload";
import { createProductVariant } from "../controllers/productVariant.controller";

const router = express.Router();

router.post("/:productId", memoryFileUpload().array("variantImages"), createProductVariant);
