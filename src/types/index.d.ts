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
}

interface Product extends Document {
  productId: string;
  title: string;
  brand?: string;
  description: string;
  thumbnail: string;
  images?: string[];
  category?: string;
  price: number;
  warranty?: string;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  color?: string;
  size?: string;
  highlights: string[];
  specifications?: Specifications;
  offers?: Offers;
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
