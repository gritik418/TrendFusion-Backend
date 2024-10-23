import { z } from "zod";

const signupSchema = z
  .object({
    firstName: z.string().min(3, "First name must be atleast 3 characters."),
    lastName: z
      .string()
      .min(2, "Last name must be atleast 2 characters.")
      .optional(),
    username: z.string().min(3, "Username must be atleast 3 characters."),
    email: z.string().email("Email must be valid."),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters.")
      .max(20, "Password must be atmost 20 characters."),
    confirmPassword: z
      .string()
      .min(8, "Password must be atleast 8 characters.")
      .max(20, "Password must be atmost 20 characters."),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type SignupDataType = z.infer<typeof signupSchema>;

export default signupSchema;
