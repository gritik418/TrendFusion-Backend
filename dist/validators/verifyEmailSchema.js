"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const verifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email must be valid."),
    verificationCode: zod_1.z
        .string()
        .min(6, "OTP must be of 6 digits.")
        .max(6, "OTP must be of 6 digits."),
});
exports.default = verifyEmailSchema;
