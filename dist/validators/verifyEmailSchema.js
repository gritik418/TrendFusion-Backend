import { z } from "zod";
const verifyEmailSchema = z.object({
    email: z.string().email("Email must be valid."),
    verificationCode: z
        .string()
        .min(6, "OTP must be of 6 digits.")
        .max(6, "OTP must be of 6 digits."),
});
export default verifyEmailSchema;
