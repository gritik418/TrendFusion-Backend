import { Request, Response } from "express";
import Product from "../models/Product.js";

export const getProductSuggestions = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query["searchQuery"];
    const suggestions: string[] = [];

    const products = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    }).select({ brand: 1, title: 1, _id: 0 });

    products.forEach(({ brand, title }) => {
      if (!suggestions.includes(brand as string)) {
        suggestions.push(brand as string);
      }
      if (!suggestions.includes(title as string)) {
        suggestions.push(title as string);
      }
    });

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query["searchQuery"];
    const products = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
