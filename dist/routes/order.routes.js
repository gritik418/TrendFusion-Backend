import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { createOrder, getOrders } from "../controllers/order.js";
const router = Router();
router.get("/", authenticate, getOrders);
router.post("/create", authenticate, createOrder);
export default router;
