import { z } from "zod";
const addressSchema = z.object({
    firstName: z.string().min(3, "First name must be atleast 3 characters."),
    lastName: z
        .string()
        .min(2, "Last name must be atleast 2 characters.")
        .optional(),
    phoneNumber: z
        .string()
        .min(10, "Phone Number must be of 10 digits.")
        .max(10, "Phone Number must be of 10 digits."),
    alternatePhoneNumber: z
        .string()
        .min(10, "Phone Number must be of 10 digits.")
        .max(10, "Phone Number must be of 10 digits.")
        .optional(),
    state: z.string(),
    city: z.string(),
    postalCode: z.string(),
    street: z.string(),
    appartment: z.string().optional(),
    landmark: z.string().optional(),
    addressType: z.enum(["home", "work"]),
    isDefault: z.boolean().optional(),
});
export default addressSchema;
