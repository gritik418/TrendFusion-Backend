import { Router } from "express";
import { getUser, updatePhoneNumber } from "../controllers/user.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, getUser);

router.patch("/edit/phonenumber", authenticate, updatePhoneNumber);

export default router;
