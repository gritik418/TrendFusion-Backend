import { Router } from "express";
import adminAuth from "../../middlewares/adminAuth.js";
import { addProduct } from "../../controllers/admin/product.js";
const router = Router();
router.post("/add", adminAuth, addProduct);
export default router;
