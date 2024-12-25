import { Request, Response } from "express";
import Product from "../models/Product.js";
import { Filters, ProductType, Variant } from "../types/index.js";

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
    const category = req.query["category"];
    const brands = req.query["brand"];
    const colors = req.query["color"];
    const size = req.query["size"];
    const min = req.query["min"];
    const max = req.query["max"];
    const sortCriteria = req.query["sortCriteria"];
    const sortOrder = req.query["sortOrder"];
    const page = req.query["page"];
    const limit = req.query["limit"];
    let skip = (Number(page) - 1) * Number(limit);

    let filterQueries: Filters = {
      brands: [],
      categories: [],
      colors: [],
      size: [],
    };

    if (category) {
      if (typeof category === "object") {
        filterQueries.categories = category as string[];
      } else {
        filterQueries.categories = [category as string];
      }
    }

    if (brands) {
      if (typeof brands === "object") {
        filterQueries.brands = brands as string[];
      } else {
        filterQueries.brands = [brands as string];
      }
    }

    if (colors) {
      if (typeof colors === "object") {
        filterQueries.colors = colors as string[];
      } else {
        filterQueries.colors = [colors as string];
      }
    }

    if (size) {
      if (typeof size === "object") {
        filterQueries.size = size as any;
      } else {
        filterQueries.size = [size as string];
      }
    }

    let filterObject: any = {};
    if (filterQueries.brands.length > 0) {
      filterObject.brand = { $in: filterQueries.brands };
    }
    if (filterQueries.categories.length > 0) {
      filterObject.category = { $in: filterQueries.categories };
    }
    if (filterQueries.size.length > 0) {
      filterObject.size = { $in: filterQueries.size };
    }
    if (filterQueries.colors.length > 0) {
      filterObject["color.colorName"] = { $in: filterQueries.colors };
    }

    let priceFilter: { $gte?: number; $lte?: number } = {};
    priceFilter["$gte"] = 0;
    if (min) {
      priceFilter["$gte"] = Number(min) || 0;
    }
    if (max) {
      priceFilter["$lte"] = Number(max);
    }

    const priceObject = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    }).select({ price: 1, _id: 0 });

    if (priceObject.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }
    let maxPages = Math.ceil(priceObject.length / Number(limit));

    let minPrice: number = 0;
    let maxPrice: number = 0;
    let sortObject: { [criteria: string]: number } | undefined = { price: 1 };

    if (sortCriteria) {
      if (sortCriteria === "price") {
        sortObject = { price: 1 };
        if (sortOrder && sortOrder === "desc") {
          sortObject = { price: -1 };
        }
      } else {
        sortObject = { rating: 1 };
        if (sortOrder && sortOrder === "desc") {
          sortObject = { rating: -1 };
        }
      }
    }

    priceObject.forEach(({ price }, index: number) => {
      if (index === 0) {
        minPrice = price;
      }
      if (price < minPrice) {
        minPrice = price;
      }
      if (price > maxPrice) {
        maxPrice = price;
      }
    });

    const products = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
      price: { ...priceFilter },
      ...filterObject,
    })
      .sort({ ...sortObject } as any)
      .skip(skip)
      .limit(Number(limit));

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    let filters: Filters = {
      brands: [],
      categories: [],
      colors: [],
      size: [],
    };

    products?.forEach((product) => {
      if (product.brand) {
        if (!filters.brands.includes(product?.brand)) {
          filters.brands.push(product.brand);
        }
      }
      if (product.category) {
        if (!filters.categories.includes(product?.category)) {
          filters.categories.push(product.category);
        }
      }
      if (product.color) {
        if (!filters.colors.includes(product?.color.colorName)) {
          filters.colors.push(product.color.colorName);
        }
      }
      if (product.size) {
        if (!filters.size.includes(product?.size)) {
          filters.size.push(product.size);
        }
      }
    });

    return res.status(200).json({
      success: true,
      products,
      filters,
      minPrice,
      maxPrice,
      maxPages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const getProductByProductId = async (req: Request, res: Response) => {
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
      variantProducts.forEach((product: ProductType) => {
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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId: string = req.params.id;
    if (!productId)
      return res.status(200).json({
        success: false,
        message: "Product Id not found.",
      });

    const product = await Product.findById(productId);

    if (!product)
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
