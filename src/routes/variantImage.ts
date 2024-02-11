import express from "express";
import { memoryFileUpload } from "../middleware/memoryFileUpload";
import * as variantImageController from "../controllers/variantImage.controller";

const router = express.Router();

router.post(
  "/:variantId",
  memoryFileUpload().fields([
    {
      name: "variantImages",
      maxCount: 3,
    },
  ]),
  variantImageController.addVariantImages
);

router.delete("/:variantImageId", variantImageController.deleteVariantImage);

export default router;
