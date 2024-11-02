import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  addToCart,
  decrementProductQuantity,
  getCart,
  incrementProductQuantity,
} from "../controllers/cart.js";

const router = Router();

router.get("/", authenticate, getCart);

router.post("/add", authenticate, addToCart);

router.patch("/inc/:productId", authenticate, incrementProductQuantity);

router.patch("/dec/:productId", authenticate, decrementProductQuantity);

export default router;
