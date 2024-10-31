import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { addToCart } from "../controllers/cart.js";

const router = Router();

router.post("/add", authenticate, addToCart);

export default router;
