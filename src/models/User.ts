import mongoose, { model, Model, Schema, Types } from "mongoose";
import { DeliveryAddress, UserType } from "../types/index.js";

const AddressSchema = new Schema<DeliveryAddress>({
  firstName: { type: String, required: true },
  lastName: { type: String },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  appartment: { type: String },
  landmark: { type: String },
  phoneNumber: [{ type: String }],
});

const UserSchema = new Schema<UserType>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    password: {
      type: String,
      select: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpiry: {
      type: Date,
    },
    addresses: [AddressSchema],
    avatar: {
      type: String,
      default: `${process.env.CLIENT_DOMAIN}/images/avatar.jpeg`,
    },
    orderHistory: [
      {
        type: Types.ObjectId,
        ref: "Product",
      },
    ],
    phoneNumber: { type: String },
    userRole: {
      type: String,
      default: "customer",
      enum: ["customer", "seller", "admin"],
    },
    wishlist: [
      {
        type: Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as Model<UserType>) ||
  model<UserType>("User", UserSchema);

export default User;
