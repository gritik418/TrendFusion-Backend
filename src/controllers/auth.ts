import { Request, Response } from "express";

export const userLogin = (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
