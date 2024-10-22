import { NextFunction, Request, Response } from "express";
import { ADMIN_TF_TOKEN } from "../constants/variables";
import jwt from "jsonwebtoken";

export type AdminJWTPayload = {
  email: string;
  id: string;
  role: "custome" | "admin" | "seller";
};

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.cookies[ADMIN_TF_TOKEN];
    if (!token) throw new Error("Please Login.");

    const verify = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AdminJWTPayload;
    if (!verify) throw new Error("Please Login.");

    console.log(verify.id, verify.email);
    if (verify.role !== "admin") throw new Error("Only admins are allowed.");
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Please Login.",
    });
  }
};

export default adminAuth;
