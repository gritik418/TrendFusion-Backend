import mongoose, { model, Model, Schema } from "mongoose";
import { ReviewsType } from "../types/index.js";

const ReviewsSchema = new Schema<ReviewsType>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Reviews =
  (mongoose.models.Reviews as Model<ReviewsType>) ||
  model<ReviewsType>("Reviews", ReviewsSchema);

export default Reviews;
