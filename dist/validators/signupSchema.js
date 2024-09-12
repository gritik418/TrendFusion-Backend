"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const signupSchema = zod_1.z
    .object({
    firstName: zod_1.z.string().min(3, "First name must be atleast 3 characters."),
    lastName: zod_1.z.any(),
    username: zod_1.z.string().min(3, "Username must be atleast 3 characters."),
    email: zod_1.z.string().email("Email must be valid."),
    password: zod_1.z
        .string()
        .min(8, "Password must be atleast 8 characters.")
        .max(20, "Password must be atmost 20 characters."),
    confirmPassword: zod_1.z
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
exports.default = signupSchema;
