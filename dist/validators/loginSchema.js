"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1, "Email or Username is required."),
    password: zod_1.z
        .string()
        .min(8, "Password must be atleast 8 characters.")
        .max(20, "Password must be atmost 20 characters."),
});
exports.default = loginSchema;
