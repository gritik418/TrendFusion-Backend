interface User {
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
