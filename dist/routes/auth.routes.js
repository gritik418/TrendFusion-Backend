import { Router } from "express";
import { userLogin, userSignup, veriyEmail } from "../controllers/auth.js";
const router = Router();
router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/verify", veriyEmail);
export default router;
