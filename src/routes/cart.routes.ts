import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { addToCart, getCart } from "../controllers/cart.js";

const router = Router();

router.get("/", authenticate, getCart);

router.post("/add", authenticate, addToCart);

export default router;
