import mongoose, { model, Model, Schema } from "mongoose";

export const DiscountSchema = new Schema<Discount>({
  description: { type: String },
  discountType: {
    type: String,
    enum: ["Percentage", "Fixed"],
  },
  value: {
    type: Number,
    min: 0,
  },
});

const OfferSchema = new Schema<Offers>({
  offerType: { type: String },
  offer: {
    type: String,
  },
});

const ColorSchema = new Schema<Color>({
  colorName: { type: String },
  colorImage: {
    type: String,
  },
});

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
    discount: {
      type: DiscountSchema,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    color: ColorSchema,
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
    offers: [OfferSchema],
    specifications: {
      type: Schema.Types.Mixed,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product =
  (mongoose.models.Product as Model<Product>) ||
  model<Product>("Product", ProductSchema);

export default Product;
