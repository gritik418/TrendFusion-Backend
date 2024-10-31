import { Request, Response } from "express";
import Product from "../models/Product.js";

type VariantSize = {
  size: string;
  slug: string;
};

type Variant = {
  colorImage: string;
  colorName: string;
  size?: VariantSize[];
};

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
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId: string = req.params.id;
    if (!productId)
      return res.status(200).json({
        success: false,
        message: "Product Id not found.",
      });

    const product = await Product.findOne({
      productId,
    });

    const variants: { [name: string]: Variant } = {};

    if (product && product.title && product.color && product.size) {
      const variantProducts = await Product.find({ title: product.title });
      variantProducts.forEach((product: Product) => {
        if (product.color) {
          if (!Object.keys(variants).includes(product.color.colorName)) {
            variants[product.color.colorName] = {
              colorName: product.color.colorName,
              colorImage: product.color.colorImage,
              size: [],
            };
            if (
              !variants[product.color.colorName].size?.includes({
                slug: product.productId,
                size: product.size || "",
              })
            ) {
              variants[product.color.colorName].size?.push({
                size: product.size || "",
                slug: product.productId,
              });
            }
          } else {
            if (
              !variants[product.color.colorName].size?.includes({
                slug: product.productId,
                size: product.size || "",
              })
            ) {
              variants[product.color.colorName].size?.push({
                size: product.size || "",
                slug: product.productId,
              });
            }
          }
        }
      });
    }

    if (!product)
      return res.status(200).json({
        success: false,
        message: "Product not found.",
      });

    return res.status(200).json({
      success: true,
      product,
      variants: Object.values(variants),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
