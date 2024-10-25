import { Router } from "express";
import {
  getProductSuggestions,
  searchProduct,
} from "../controllers/product.js";

const router = Router();

router.get("/suggestion", getProductSuggestions);

router.get("/search", searchProduct);

export default router;
