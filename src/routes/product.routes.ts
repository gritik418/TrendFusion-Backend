import { Router } from "express";
import { getProductSuggestions } from "../controllers/product.js";

const router = Router();

router.get("/suggestion", getProductSuggestions);

export default router;
