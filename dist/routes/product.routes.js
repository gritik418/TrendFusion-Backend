import { Router } from "express";
import { getProductById, getProductByProductId, getProductSuggestions, searchProduct, } from "../controllers/product.js";
const router = Router();
router.get("/suggestion", getProductSuggestions);
router.get("/search", searchProduct);
router.get("/variants/:id", getProductByProductId);
router.get("/:id", getProductById);
export default router;
