"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const User_1 = __importDefault(require("../../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const variables_1 = require("../../constants/variables");
const options_1 = require("../../constants/options");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            if (result.error) {
                const errors = {};
                result.error.errors.forEach((error) => {
                    errors[error.path[0]] = error.message;
                });
                return res.status(400).json({
                    success: false,
                    message: "Validation Error.",
                    errors,
                });
            }
            return res.status(400).json({
                success: false,
                message: "Something went wrong.",
            });
        }
        const admin = await User_1.default.findOne({
            email: result.data.email,
            isVerified: true,
            userRole: "admin",
        }).select({ password: 1, email: 1, userRole: 1 });
        if (!admin)
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials.",
            });
        const verify = await bcryptjs_1.default.compare(result.data.password, admin.password);
        if (!verify)
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials.",
            });
        const payload = {
            email: admin.email,
            id: admin._id.toString(),
            role: admin.userRole,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.ADMIN_JWT_SECRET);
        return res.status(200).cookie(variables_1.ADMIN_TF_TOKEN, token, options_1.cookieOptions).json({
            success: true,
            message: "Logged in successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
exports.adminLogin = adminLogin;
