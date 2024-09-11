interface User extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  isVerified: boolean;
  provider: "credentials" | "google";
  password?: string;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  phoneNumber: number;
}

interface Product extends Document {
  productId: string;
  title: string;
  brand?: string;
  description: string;
  thumbnail: string;
  isAvailable: boolean;
  images?: string[];
  category?: string;
  price: number;
  warranty?: string;
  discount?: Discount;
  rating?: number;
  stock: number;
  color?: string;
  size?: string;
  highlights: string[];
  specifications?: Specifications;
  offers?: Offers;
}

interface Order {
  orderId: string;
  userId: Types.ObjectId;
  orderDate: Date;
  deliveryDate?: Date;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderProductInfo[] | undefined;
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
  userId: string;
  items: string[] | CartItem[];
  totalPrice: number;
  discount?: Discount;
  finalPrice: number;
  totalQuantity: number;
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
  productId: string;
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
  [category: string]: {
    [key: string]: string;
  };
}

interface Offers {
  [offerType: string]: string;
}

interface Reviews {
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  description?: string;
  images?: string[];
}

interface DeliveryAddress {
  firstName: string;
  lastName?: string;
  city: string;
  state: string;
  street: string;
  country: string;
  postalCode: string;
  landmark?: string;
  appartment?: string;
  phoneNumber: string[];
}

interface Discount {
  discountType: "Percentage" | "Fixed";
  value: number;
  description?: string;
}
