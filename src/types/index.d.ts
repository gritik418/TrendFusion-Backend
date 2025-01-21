import { Document } from "mongoose";

interface UserType extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  avatar?: string;
  gender?: "male" | "female";
  isVerified: boolean;
  provider: "credentials" | "google";
  password?: string;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  phoneNumber: string;
  addresses: DeliveryAddress[];
  wishlist: Types.ObjectId[];
  userRole: "customer" | "admin" | "seller";
  orderHistory: Types.ObjectId[];
}

interface ProductType extends Document {
  productId: string;
  title: string;
  brand?: string;
  description: string;
  thumbnail: string;
  isAvailable: boolean;
  images: string[];
  category?: string;
  price: number;
  warranty?: string;
  discount?: Discount;
  rating?: number;
  stock: number;
  color?: Color;
  size?: string;
  highlights: string[];
  specifications?: Specifications[];
  offers?: Offers[];
}

interface ProductWithVariants extends Product {
  variants?: Variants[];
}

type Variants = {
  colorName: string;
  colorImage: string;
  sizes: VariantSize[];
};

type Color = {
  colorName: string;
  colorImage: string;
};

interface OrderType {
  orderId: string;
  userId: Types.ObjectId;
  paymentId?: Types.ObjectId;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  deliveredOn?: Date;
  status:
    | "Pending"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Out for Delivery";
  items: OrderProductInfo[];
  itemCount: number;
  totalQuantity: number;
  totalPrice: number;
  discount?: number;
  finalPrice: number;
  paymentMethod: "Prepaid" | "Cash on Delivery";
  deliveryAddress: DeliveryAddress;
  trackingId?: string;
  deliveryCharges?: number;
  platformFee?: number;
}

interface PaymentType extends Document {
  paymentId: string;
  orderId: Types.ObjectId;
  userId?: Types.ObjectId;
  paymentMethod: string;
  paymentStatus: "pending" | "successful" | "failed" | "refunded";
  transactionId?: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  cardType?: string;
  last4?: string;
  expiryDate?: string;
  billingAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  refundStatus?: "not_refunded" | "partially_refunded" | "fully_refunded";
  refundAmount?: number;
  paymentGateway?: string;
  gatewayResponse?: {
    responseCode: string;
    message: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CartType extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
  discount?: number;
  finalPrice: number;
  totalQuantity: number;
  deliveryCharges?: number;
  platformFee?: number;
}

interface ReviewsType extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  title?: string;
  description?: string;
  images?: string[];
}

interface WishlistItem {
  _id: string;
  productId: string;
  title: string;
  brand?: string;
  thumbnail: string;
  isAvailable: boolean;
  price: number;
  discount?: Discount;
  stock: number;
  color?: Color;
  size?: string;
  rating?: number;
}

interface OrderProductInfo {
  _id: string;
  title: string;
  brand?: string;
  thumbnail: string;
  quantity: number;
  unitPrice: number;
  unitDiscount?: Discount;
  color?: string;
  size?: Color;
}

interface CartItem {
  product: Types.ObjectId[];
  quantity: number;
  updatedAt: Date;
}

interface Specifications {
  category: string;
  specs: {
    [key: string]: string;
  }[];
}

interface Offers {
  offerType: string;
  offer: string;
}

type Color = {
  colorName: string;
  colorImage: string;
};

interface DeliveryAddress {
  firstName: string;
  lastName?: string;
  city: string;
  state: string;
  street: string;
  postalCode: string;
  landmark?: string;
  appartment?: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  isDefault: boolean;
  addressType: "home" | "work";
}

interface Discount {
  discountType: "Percentage" | "Fixed";
  value: number;
  description?: string;
}

interface JWTPayload extends JwtPayload {
  id: string;
  email: string;
  role: "customer" | "admin" | "seller";
}

type VariantSize = {
  size: string;
  slug: string;
};

type Variant = {
  colorImage: string;
  colorName: string;
  size?: VariantSize[];
};

type Filters = {
  brands: string[];
  categories: string[];
  colors: string[];
  size: string[];
};
