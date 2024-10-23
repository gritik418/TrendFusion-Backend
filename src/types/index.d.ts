interface User {
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

interface Product {
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

interface Order {
  orderId: string;
  userId: Types.ObjectId;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  deliveredOn?: Date;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderProductInfo[];
  itemCount: number;
  totalQuantity: number;
  totalPrice: number;
  discount?: Discount;
  finalPrice: number;
  paymentMethod:
    | "Credit Card"
    | "PayPal"
    | "Bank Transfer"
    | "Cash on Delivery";
  deliveryAddress: DeliveryAddress;
  trackingId?: string;
}

interface Cart {
  userId: Types.ObjectId;
  items: string[] | CartItem[];
  totalPrice: number;
  discount?: Discount;
  finalPrice: number;
  totalQuantity: number;
}

interface Reviews {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  title?: string;
  description?: string;
  images?: string[];
}

interface WishlistItem {
  productId: string;
  title: string;
  brand?: string;
  thumbnail: string;
  isAvailable: boolean;
  price: number;
  discount?: Discount;
  rating?: number;
  stock: number;
}

interface OrderProductInfo {
  productId: Types.ObjectId;
  title: string;
  brand: string;
  thumbnail: string;
  quantity: number;
  unitPrice: number;
  unitDiscount?: Discount;
  color?: string;
  size?: string;
}

interface CartItem {
  productId: Types.ObjectId;
  title: string;
  brand: string;
  thumbnail: string;
  quantity: number;
  stock: number;
  unitPrice: number;
  unitDiscount?: Discount;
  color?: string;
  size?: string;
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
