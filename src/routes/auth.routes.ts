import { Router } from "express";
import { userLogin } from "../controllers/auth";

const router = Router();

router.post("/login", userLogin);

export default router;
