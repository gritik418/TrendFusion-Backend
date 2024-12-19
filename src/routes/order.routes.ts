import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { createOrder } from "../controllers/order.js";

const router = Router();

router.post("/create", authenticate, createOrder);

export default router;
