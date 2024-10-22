import { Request, Response } from "express";
import User from "../../models/User";

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.adminId;
    const admin = await User.findById(adminId).select({
      verificationCodeExpiry: 0,
      verificationCode: 0,
      provider: 0,
    });

    if (!admin || !adminId)
      return res.status(401).json({
        success: false,
        message: "Admin not found.",
      });

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
