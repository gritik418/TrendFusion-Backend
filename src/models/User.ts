import mongoose, { model, Model, Schema } from "mongoose";

const UserSchema = new Schema<User>(
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
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as Model<User>) || model<User>("User", UserSchema);

export default User;
