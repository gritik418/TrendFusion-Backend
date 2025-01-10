import { Request, Response } from "express";
import User from "../models/User.js";
import { DeliveryAddress, UserType } from "../types/index.js";
import addressSchema from "../validators/addressSchema.js";

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user: UserType | null = await User.findById(userId).select({
      verificationCodeExpiry: 0,
      verificationCode: 0,
      provider: 0,
    });

    if (!user || !userId) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const updatePhoneNumber = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const phoneNumber: string | null = req.body.phoneNumber;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone Number is required.",
      });
    }

    if (phoneNumber.length !== 10 || !phoneNumber.match(/^\d+$/)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Phone Number.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndUpdate(userId, { $set: { phoneNumber } });

    return res.status(200).json({
      success: true,
      message: "Phone Number Updated!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const addShippingAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const address: DeliveryAddress | null = req.body;

    const result = addressSchema.safeParse(address);

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

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndUpdate(userId, { $push: { addresses: address } });

    return res.status(200).json({
      success: true,
      message: "Address Added!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// TODO: Api not completed
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      // data: user,
      message: "Updated Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
