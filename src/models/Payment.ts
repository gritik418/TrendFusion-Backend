import mongoose, { model, Model, Schema } from "mongoose";
import { PaymentType } from "../types/index.js";

const PaymentSchema = new Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed", "refunded"],
      required: true,
    },
    transactionId: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    cardType: {
      type: String,
      required: false,
    },
    last4: {
      type: String,
      required: false,
    },
    expiryDate: {
      type: String,
      required: false,
    },
    billingAddress: {
      type: Map,
      of: String,
      required: false,
    },
    refundStatus: {
      type: String,
      enum: ["not_refunded", "partially_refunded", "fully_refunded"],
      required: false,
    },
    refundAmount: {
      type: Number,
      required: false,
    },
    paymentGateway: {
      type: String,
      required: false,
    },
    gatewayResponse: {
      type: Map,
      of: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const Payment =
  (mongoose.models.Payment as Model<PaymentType>) ||
  model<PaymentType>("Payment", PaymentSchema);

export default Payment;
