import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order.js";
import orderSchema from "../validators/orderSchema.js";
export const createOrder = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orderDetails = req.body;
        const result = orderSchema.safeParse(orderDetails);
        if (!result.success) {
            if (result.error) {
                const errors = {};
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
        const orderId = uuidv4();
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
            trackingId: "",
        });
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Order Placed!",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
