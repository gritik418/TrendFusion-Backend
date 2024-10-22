import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { AdminJWTPayload } from "../../middlewares/adminAuth";
import { ADMIN_TF_TOKEN } from "../../constants/variables";
import { cookieOptions } from "../../constants/options";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      if (result.error) {
        const errors: any = {};
        result.error.errors.forEach((error) => {
          errors[error.path[0]] = error.message;
        });

        return res.status(400).json({
          success: false,
          message: "Validation Error.",
          errors,
        });
      }
      return res.status(400).json({
        success: false,
        message: "Something went wrong.",
      });
    }

    const admin = await User.findOne({
      email: result.data.email,
      isVerified: true,
      userRole: "admin",
    }).select({ password: 1 });
    if (!admin)
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials.",
      });

    const verify = await bcrypt.compare(result.data.password, admin.password!);
    if (!verify)
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials.",
      });

    const payload: AdminJWTPayload = {
      email: admin.email,
      id: admin._id.toString(),
      role: admin.userRole,
    };
    const token = jwt.sign(payload, process.env.ADMIN_JWT_SECRET!);

    return res.status(200).cookie(ADMIN_TF_TOKEN, token, cookieOptions).json({
      success: true,
      message: "Logged in successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
