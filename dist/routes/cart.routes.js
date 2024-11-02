import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { addToCart, getCart, incrementProductQuantity, } from "../controllers/cart.js";
const router = Router();
router.get("/", authenticate, getCart);
router.post("/add", authenticate, addToCart);
router.patch("/inc/:productId", authenticate, incrementProductQuantity);
export default router;
