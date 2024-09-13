import { Router } from "express";
import { userLogin, userSignup, veriyEmail } from "../controllers/auth";

const router = Router();

router.post("/login", userLogin);

router.post("/signup", userSignup);

router.post("/verify", veriyEmail);

export default router;
