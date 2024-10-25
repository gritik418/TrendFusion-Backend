import adminAuth from "../../middlewares/adminAuth.js";
import { Router } from "express";
import {
  addProduct,
  verifyProductId,
} from "../../controllers/admin/product.js";

const router = Router();

router.post("/check", adminAuth, verifyProductId);

router.post("/add", adminAuth, addProduct);

export default router;
