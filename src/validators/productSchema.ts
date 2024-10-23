import { z } from "zod";

const discountSchema = z.object({
  discountType: z.enum(["Percentage", "Fixed"]),
  value: z.number(),
  description: z.string(),
});

const offerSchema = z.object({
  offerType: z.string(),
  offer: z.string(),
});

const colorSchema = z.object({
  colorName: z.string(),
  colorImage: z.string(),
});

const specificationSchema = z.object({
  category: z.string(),
  specs: z.any(),
});

const productSchema = z.object({
  productId: z.string().min(3),
  brand: z.string().optional(),
  title: z.string().min(10),
  description: z.string().min(20),
  isAvailable: z.boolean(),
  stock: z.number().min(0),
  price: z.number().min(1),
  category: z.string().optional(),
  warranty: z.string().optional(),
  highlights: z.string().array().optional(),
  size: z.string().optional(),
  discount: discountSchema.optional(),
  offers: offerSchema.array().optional(),
  images: z.string().array(),
  thumbnail: z.string(),
  color: colorSchema.optional(),
  specifications: specificationSchema.array().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export type ProductDataType = z.infer<typeof productSchema>;

export default productSchema;
