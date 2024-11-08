import mongoose, { model, Model, Schema } from "mongoose";
import { CartType } from "../types/index.js";

const CartSchema = new Schema<CartType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalQuantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Cart =
  (mongoose.models.Cart as Model<CartType>) ||
  model<CartType>("Cart", CartSchema);

export default Cart;
