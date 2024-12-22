import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { createOrder, getOrderById, getOrders } from "../controllers/order.js";
const router = Router();
router.get("/", authenticate, getOrders);
router.get("/:orderId", authenticate, getOrderById);
router.post("/create", authenticate, createOrder);
export default router;
