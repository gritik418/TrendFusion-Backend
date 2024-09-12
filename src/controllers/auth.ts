import { Request, Response } from "express";
import loginSchema, { LoginDataType } from "../validators/loginSchema";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TF_TOKEN } from "../constants/variables";
import { cookieOptions } from "../constants/options";

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { identifier, password }: LoginDataType = req.body;

    const result = loginSchema.safeParse({ identifier, password });

    if (!result.success) {
      if (result.error) {
        return res.status(400).json({
          success: false,
          message: "Validation Error.",
          errors: result.error.errors,
        });
      }
      return res.status(400).json({
        success: false,
        message: "Something went wrong.",
      });
    }

    const user = await User.findOne({
      $or: [
        {
          email: result.data.identifier,
        },
        { username: result.data.identifier },
      ],
      isVerified: true,
      provider: "credentials",
    }).select({ password: 1, _id: 1, email: 1 });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const verify = await bcrypt.compare(result.data.password, user.password!);
    if (!verify) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const payload: JWTPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    return res.status(200).cookie(TF_TOKEN, token, cookieOptions).json({
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
