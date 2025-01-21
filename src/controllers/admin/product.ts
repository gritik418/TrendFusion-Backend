import { Request, Response } from "express";
import productSchema from "../../validators/productSchema.js";
import Product from "../../models/Product.js";

export const verifyProductId = async (req: Request, res: Response) => {
  try {
    const productId: string | null = req.body.productId;

    if (!productId)
      return res.status(400).json({
        success: false,
        message: "Product Id is required.",
      });

    if (productId.includes(" "))
      return res.status(400).json({
        success: false,
        message: "Product Id must not contain white spaces.",
      });

    if (productId.length < 8)
      return res.status(400).json({
        success: false,
        message: "Product Id must be atleast 8 characters.",
      });

    const checkProductId = await Product.findOne({
      productId: productId,
    });

    if (checkProductId)
      return res.status(400).json({
        success: false,
        message: "Product Id already exists.",
      });

    return res.status(201).json({
      success: true,
      message: "Product Id is valid.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const result = productSchema.safeParse(req.body);

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

    const checkProductId = await Product.findOne({
      productId: result.data.productId,
    });

    if (checkProductId)
      return res.status(400).json({
        success: false,
        message: "Product Id already exists.",
      });

    const product = new Product(result.data);
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product Added.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
