"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = void 0;
const loginSchema_1 = __importDefault(require("../validators/loginSchema"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const variables_1 = require("../constants/variables");
const options_1 = require("../constants/options");
const userLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const result = loginSchema_1.default.safeParse({ identifier, password });
        if (!result.success) {
            if (result.error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error.",
                    errors: result.error.errors,
                });
            }
            return res.status(400).json({
                success: false,
                message: "Something went wrong.",
            });
        }
        const user = await User_1.default.findOne({
            $or: [
                {
                    email: result.data.identifier,
                },
                { username: result.data.identifier },
            ],
            isVerified: true,
            provider: "credentials",
        }).select({ password: 1, _id: 1, email: 1 });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }
        const verify = await bcryptjs_1.default.compare(result.data.password, user.password);
        if (!verify) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }
        const payload = {
            id: user._id.toString(),
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
        return res.status(200).cookie(variables_1.TF_TOKEN, token, options_1.cookieOptions).json({
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
exports.userLogin = userLogin;
