import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { addToWishlist, getWishlist, removeFromWishlist, } from "../controllers/wishlist.js";
const router = Router();
router.get("/", authenticate, getWishlist);
router.post("/add", authenticate, addToWishlist);
router.patch("/remove", authenticate, removeFromWishlist);
export default router;
