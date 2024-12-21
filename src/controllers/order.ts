import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order.js";
import { OrderType } from "../types/index.js";
import orderSchema from "../validators/orderSchema.js";
import Product from "../models/Product.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const orderDetails: OrderType | null = req.body;

    const result = orderSchema.safeParse(orderDetails);

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

    for (const item of result.data.items) {
      const product = await Product.findById(item._id);
      if (!product)
        return res.status(400).json({
          success: false,
          message: "Product not found.",
        });

      if (item.quantity > product.stock)
        return res.status(400).json({
          success: false,
          message: "Stock not available.",
        });

      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const orderId: string = uuidv4();
    const order = new Order({
      orderId,
      userId,
      orderDate: Date.now(),
      expectedDeliveryDate: new Date(result.data.expectedDeliveryDate),
      status: "Pending",
      items: result.data.items,
      itemCount: result.data.itemCount,
      totalQuantity: result.data.totalQuantity,
      totalPrice: result.data.totalPrice,
      discount: result.data.discount,
      finalPrice: result.data.finalPrice,
      paymentMethod: result.data.paymentMethod,
      deliveryAddress: result.data.deliveryAddress,
      trackingId: orderId,
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order Placed!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).exec();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
