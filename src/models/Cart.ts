import mongoose, { model, Model, Schema } from "mongoose";
import { DiscountSchema } from "./Product.js";

const ColorSchema = new Schema<Color>({
  colorName: { type: String },
  colorImage: {
    type: String,
  },
});

const CartItemSchema = new Schema<CartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  brand: {
    type: String,
  },
  title: {
    type: String,
    trim: true,
  },
  thumbnail: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  color: ColorSchema,
  size: {
    type: String,
  },
  stock: {
    type: Number,
    default: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  unitDiscount: DiscountSchema,
});

const CartSchema = new Schema<Cart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
    discount: {
      type: Number,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    totalQuantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Cart =
  (mongoose.models.Cart as Model<Cart>) || model<Cart>("Cart", CartSchema);

export default Cart;
