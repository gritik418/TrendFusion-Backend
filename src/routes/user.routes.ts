import { Router } from "express";
import { getUser } from "../controllers/user.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, getUser);

export default router;
