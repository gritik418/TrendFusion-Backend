import { Router } from "express";
import {
  addShippingAddress,
  getUser,
  updatePhoneNumber,
} from "../controllers/user.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, getUser);

router.post("/address", authenticate, addShippingAddress);

router.patch("/update/phonenumber", authenticate, updatePhoneNumber);

export default router;
