import mongoose, { model, Model, Schema } from "mongoose";
import { DiscountSchema } from "./Product.js";
import {
  DeliveryAddress,
  OrderProductInfo,
  OrderType,
} from "../types/index.js";

const ProductItemSchema = new Schema<OrderProductInfo>({
  _id: {
    type: String,
  },
  brand: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  unitDiscount: DiscountSchema,
});

const DeliveryAddressSchema = new Schema<DeliveryAddress>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  phoneNumber: [
    {
      type: String,
    },
  ],
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    trim: true,
  },
  appartment: {
    type: String,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  postalCode: {
    type: String,
  },
});

const OrderSchema = new Schema<OrderType>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [ProductItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    totalQuantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash on Delivery"],
      default: "Cash on Delivery",
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    deliveredOn: {
      type: Date,
    },
    itemCount: {
      type: Number,
      required: true,
    },
    deliveryAddress: DeliveryAddressSchema,
    trackingId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Order =
  (mongoose.models.Order as Model<OrderType>) ||
  model<OrderType>("Order", OrderSchema);

export default Order;
