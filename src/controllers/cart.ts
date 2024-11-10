import { Request, Response } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { CartType, ProductType } from "../types/index.js";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });

    const cart: any = await Cart.findOne({ userId }).populate("items.product", {
      productId: 1,
      title: 1,
      brand: 1,
      thumbnail: 1,
      quantity: 1,
      stock: 1,
      price: 1,
      discount: 1,
      color: 1,
      size: 1,
    });

    if (!cart)
      return res.status(200).json({
        success: true,
        message: "Cart is Empty.",
      });

    let totalQuantity: number = 0;
    let totalPrice: number = 0;
    let finalPrice: number = 0;
    let discount: number = 0;
    let deliveryCharges: number = 0;
    let platformFee: number = 0;

    cart.items.forEach((item: { quantity: number; product: ProductType }) => {
      let productDiscount: number = 0;
      if (item.product.discount?.discountType === "Percentage") {
        productDiscount =
          ((item.product.price * item.product.discount.value) / 100) *
          item.quantity;
      }
      discount += productDiscount;
      totalQuantity += item.quantity;
      totalPrice += item.product.price * item.quantity;
      finalPrice += item.product.price * item.quantity - productDiscount;
    });

    return res.status(200).json({
      success: true,
      cart: {
        userId: cart.userId,
        items: cart.items,
        totalPrice,
        totalQuantity,
        finalPrice,
        discount,
        deliveryCharges,
        platformFee,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const getCartCount = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });

    const cart: CartType | null = await Cart.findOne({ userId }).select({
      totalQuantity: 1,
      _id: 0,
    });

    if (!cart)
      return res.status(200).json({
        success: true,
        message: "Cart is Empty.",
        cartCount: 0,
      });

    return res.status(200).json({
      success: true,
      cartCount: cart.totalQuantity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const productId: string = req.body.productId;
    const quantity: number = req.body.quantity || 1;

    const product: ProductType | null = await Product.findById(productId);

    if (!product || !productId)
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });

    const checkCart = await Cart.findOne({ userId });

    if (!checkCart) {
      const newCart = new Cart({
        userId,
        items: [
          { product: productId, quantity: quantity, updatedAt: Date.now() },
        ],
        totalQuantity: quantity,
      });

      await newCart.save();

      return res.status(200).json({
        success: true,
        message: "Added to Cart.",
      });
    }

    let alreadyAdded = false;
    let duplicateProduct;
    let addedQuantity = 0;

    checkCart?.items.forEach((item: any) => {
      if (item.product.toString() === product._id!.toString()) {
        alreadyAdded = true;
        duplicateProduct = item.product;
        addedQuantity = item.quantity;
      }
    });

    if (product?.stock! < addedQuantity + quantity) {
      return res.status(200).json({
        success: false,
        message: "Stock not available.",
      });
    }

    if (alreadyAdded && duplicateProduct) {
      const filteredItems = checkCart.items.filter(
        (item: any) => item.product.toString() !== product._id!.toString()
      );

      const cartItems = [
        ...filteredItems,
        {
          product: duplicateProduct,
          quantity: (addedQuantity += quantity),
          updatedAt: Date.now(),
        },
      ];

      await Cart.findOneAndUpdate(
        { userId },
        {
          $set: {
            items: cartItems,
            totalQuantity: checkCart.totalQuantity + quantity,
          },
        }
      );
    } else {
      await Cart.findOneAndUpdate(
        { userId },
        {
          $push: {
            items: { product: product._id, quantity, updatedAt: Date.now() },
          },
          $set: {
            totalQuantity: checkCart.totalQuantity + quantity,
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Added to Cart.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const incrementProductQuantity = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const productId: string = req.params.productId;

    const product: ProductType | null = await Product.findById(productId);
    if (!productId || !product)
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });

    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(400).json({
        success: false,
        message: "Cart not found.",
      });

    let duplicateProduct;
    let addedQuantity = 0;

    cart?.items.forEach((item: any) => {
      if (item.product.toString() === product?._id!.toString()) {
        duplicateProduct = item.product;
        addedQuantity = item.quantity;
      }
    });

    if (!duplicateProduct) {
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product?.stock! < addedQuantity + 1) {
      return res.status(400).json({
        success: false,
        message: "Stock not available.",
      });
    }
    const filteredItems =
      cart?.items.filter(
        (item: any) => item.product.toString() !== product._id!.toString()
      ) || [];

    const cartItems = [
      ...filteredItems,
      {
        product: duplicateProduct,
        quantity: addedQuantity + 1,
        updatedAt: Date.now(),
      },
    ];
    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: cartItems,
          totalQuantity: cart.totalQuantity + 1,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Added to Cart.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const decrementProductQuantity = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const productId: string = req.params.productId;

    const product: ProductType | null = await Product.findById(productId);
    if (!productId || !product)
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });

    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(400).json({
        success: false,
        message: "Cart not found.",
      });

    let duplicateProduct;
    let addedQuantity = 0;

    cart?.items.forEach((item: any) => {
      if (item.product.toString() === product?._id!.toString()) {
        duplicateProduct = item.product;
        addedQuantity = item.quantity;
      }
    });

    if (addedQuantity === 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity is 1 cannot decrement.",
      });
    }

    if (!duplicateProduct) {
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });
    }

    const filteredItems =
      cart?.items.filter(
        (item: any) => item.product.toString() !== product._id!.toString()
      ) || [];

    const cartItems = [
      ...filteredItems,
      {
        product: duplicateProduct,
        quantity: addedQuantity - 1,
        updatedAt: Date.now(),
      },
    ];
    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: cartItems,
          totalQuantity: cart.totalQuantity - 1,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Quantity decremented.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const productId: string = req.params.productId;

    const product: ProductType | null = await Product.findById(productId);
    if (!productId || !product)
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });

    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(400).json({
        success: false,
        message: "Cart not found.",
      });

    let productToBeRemoved;
    let addedQuantity = 0;

    cart?.items.forEach((item: any) => {
      if (item.product.toString() === product?._id!.toString()) {
        productToBeRemoved = item.product;
        addedQuantity = item.quantity;
      }
    });

    if (!productToBeRemoved) {
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });
    }

    const filteredItems =
      cart?.items.filter(
        (item: any) => item.product.toString() !== product._id!.toString()
      ) || [];

    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: filteredItems,
          totalQuantity: cart.totalQuantity - addedQuantity,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Item removed.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
