import mongoose, { model, Model, Schema } from "mongoose";

const ProductSchema = new Schema<Product>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
    },
    category: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 99,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    highlights: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    warranty: {
      type: String,
    },
    offers: {
      type: Schema.Types.Mixed,
    },
    specifications: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Product =
  (mongoose.models.Product as Model<Product>) ||
  model<Product>("Product", ProductSchema);

export default Product;
