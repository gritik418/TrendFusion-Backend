import { z } from "zod";
import addressSchema from "./addressSchema.js";
const discountSchema = z.object({
    discountType: z.enum(["Percentage", "Fixed"]),
    value: z.number(),
    description: z.string(),
});
const itemsSchema = z.object({
    brand: z.string().optional(),
    title: z.string(),
    unitPrice: z.number().min(1),
    quantity: z.number().min(1),
    thumbnail: z.string(),
    productId: z.string(),
    color: z.any().optional(),
    size: z.string().optional(),
    unitDiscount: discountSchema.optional(),
});
const orderSchema = z.object({
    expectedDeliveryDate: z.any(),
    items: itemsSchema.array(),
    itemCount: z.number().min(1),
    totalQuantity: z.number().min(1),
    totalPrice: z.number().min(1),
    discount: z.number().optional(),
    finalPrice: z.number().min(1),
    paymentMethod: z.enum([
        "Credit Card",
        "PayPal",
        "Bank Transfer",
        "Cash on Delivery",
    ]),
    deliveryAddress: addressSchema,
    trackingId: z.string().optional(),
});
export default orderSchema;
