import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required."),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters.")
    .max(20, "Password must be atmost 20 characters."),
});

export type LoginDataType = z.infer<typeof loginSchema>;

export default loginSchema;
