import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TF_TOKEN } from "../constants/variables.js";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string | undefined = req.cookies[TF_TOKEN];
    if (!token) throw new Error("Please Login.");

    const verify = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    if (!verify) throw new Error("Please Login.");

    req.params.userId = verify.id;
    req.params.userEmail = verify.email;
    req.params.userRole = verify.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Please Login.",
    });
  }
};

export default authenticate;
