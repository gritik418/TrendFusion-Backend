import { Request, Response } from "express";
import loginSchema, { LoginDataType } from "../validators/loginSchema";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TF_TOKEN } from "../constants/variables";
import { cookieOptions } from "../constants/options";
import signupSchema, { SignupDataType } from "../validators/signupSchema";
import generateOTP from "../helpers/generateOTP";
import sendEmail from "../helpers/sendEmail";
import verificationTemplate from "../utils/verificationTemplate";
import verifyEmailSchema, {
  VerifyEmailDataType,
} from "../validators/verifyEmailSchema";

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

export const userSignup = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
    }: SignupDataType = req.body;

    const result = signupSchema.safeParse({
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
    });

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

    const checkExistingEmail = await User.findOne({ email: result.data.email });
    if (checkExistingEmail) {
      if (checkExistingEmail.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Account already exists.",
        });
      }
      await User.findOneAndDelete({
        email: result.data.email,
      });
    }

    const checkUsername = await User.findOne({
      username: result.data.username,
    });
    if (checkUsername) {
      if (checkUsername.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Username already taken.",
        });
      }
      await User.findOneAndDelete({
        username: result.data.username,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(result.data.password, salt);
    const verificationCodeSalt = await bcrypt.genSalt(8);
    const verificationCode: string = await bcrypt.hash(
      generateOTP().toString(),
      verificationCodeSalt
    );

    const user = new User({
      firstName: result.data.firstName,
      lastName: result.data.lastName || "",
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
      verificationCode: verificationCode,
      verificationCodeExpiry: Date.now() + 10 * 60 * 1000,
    });
    await user.save();

    await sendEmail({
      from: "TrendFusion",
      to: result.data.email,
      subject: "Email Verification",
      html: verificationTemplate(verificationCode),
      text: `Please verify your Email addess. The otp for email verification is ${verificationCode}. The otp is valid onlf for 10 minutes.`,
    });

    return res.status(201).json({
      success: true,
      message: "Account created, Please verify your email address.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const veriyEmail = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode }: VerifyEmailDataType = req.body;

    const result = verifyEmailSchema.safeParse({
      email,
      verificationCode,
    });

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
      email: result.data.email,
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const isOTPValid: boolean =
      new Date(user.verificationCodeExpiry!).getTime() > new Date().getTime();
    if (!isOTPValid) {
      await User.findByIdAndDelete(user._id);
      return res.status(401).json({
        success: false,
        message: "OTP Expired.",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $set: {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpiry: null,
      },
    });

    const payload: JWTPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    return res.status(200).cookie(TF_TOKEN, token, cookieOptions).json({
      success: true,
      message: "Account verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
