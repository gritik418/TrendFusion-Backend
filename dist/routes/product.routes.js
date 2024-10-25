import { Router } from "express";
import { getProductById, getProductSuggestions, searchProduct, } from "../controllers/product.js";
const router = Router();
router.get("/suggestion", getProductSuggestions);
router.get("/search", searchProduct);
router.get("/:id", getProductById);
export default router;
