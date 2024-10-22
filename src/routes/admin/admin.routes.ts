import { Router } from "express";
import productRoutes from "./products.routes.js";
import authRoutes from "./auth.routes.js";
import adminAuth from "../../middlewares/adminAuth.js";
import { getAdmin } from "../../controllers/admin/admin.js";

const router = Router();

router.use("/products", productRoutes);
router.use("/auth", authRoutes);

router.get("/", adminAuth, getAdmin);

export default router;