import { Request, Response } from "express";
import User from "../models/User.js";

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });

    const user = await User.findById(userId)
      .select({ wishlist: 1 })
      .populate("wishlist", {
        _id: 1,
        productId: 1,
        brand: 1,
        title: 1,
        price: 1,
        discount: 1,
        color: 1,
        size: 1,
        thumbnail: 1,
        stock: 1,
        isAvailable: 1,
        rating: 1,
      });

    return res.status(200).json({
      success: true,
      wishlist: user?.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const productId: string = req.body.productId;

    if (!userId)
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });

    if (!productId)
      return res.status(401).json({
        success: false,
        message: "Product id not found.",
      });

    const user = await User.findById(userId).select({
      wishlist: 1,
      _id: 0,
    });

    if (!user?.wishlist.includes(productId)) {
      await User.findByIdAndUpdate(userId, {
        $push: { wishlist: productId },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Added to Wishlist!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const productId: string = req.params.productId;

    if (!userId)
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });

    if (!productId)
      return res.status(401).json({
        success: false,
        message: "Product id not found.",
      });

    const user = await User.findById(userId).select({
      wishlist: 1,
      _id: 0,
    });

    if (user?.wishlist.includes(productId)) {
      await User.findByIdAndUpdate(userId, {
        $pull: { wishlist: productId },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from Wishlist!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
