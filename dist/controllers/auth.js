"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.veriyEmail = exports.userSignup = exports.userLogin = void 0;
const loginSchema_1 = __importDefault(require("../validators/loginSchema"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const variables_1 = require("../constants/variables");
const options_1 = require("../constants/options");
const signupSchema_1 = __importDefault(require("../validators/signupSchema"));
const generateOTP_1 = __importDefault(require("../helpers/generateOTP"));
const sendEmail_1 = __importDefault(require("../helpers/sendEmail"));
const verificationTemplate_1 = __importDefault(require("../utils/verificationTemplate"));
const verifyEmailSchema_1 = __importDefault(require("../validators/verifyEmailSchema"));
const userLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const result = loginSchema_1.default.safeParse({ identifier, password });
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
        const user = await User_1.default.findOne({
            $or: [
                {
                    email: result.data.identifier,
                },
                { username: result.data.identifier },
            ],
            isVerified: true,
            provider: "credentials",
        }).select({ password: 1, _id: 1, email: 1, userRole: 1 });
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
            role: user.userRole,
        };
        console.log(payload);
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
const userSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, confirmPassword, } = req.body;
        const result = signupSchema_1.default.safeParse({
            firstName,
            lastName,
            email,
            username,
            password,
            confirmPassword,
        });
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
        const checkExistingEmail = await User_1.default.findOne({ email: result.data.email });
        if (checkExistingEmail) {
            if (checkExistingEmail.isVerified) {
                return res.status(401).json({
                    success: false,
                    message: "Account already exists.",
                });
            }
            await User_1.default.findOneAndDelete({
                email: result.data.email,
            });
        }
        const checkUsername = await User_1.default.findOne({
            username: result.data.username,
        });
        if (checkUsername) {
            if (checkUsername.isVerified) {
                return res.status(401).json({
                    success: false,
                    message: "Username already taken.",
                });
            }
            await User_1.default.findOneAndDelete({
                username: result.data.username,
            });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(result.data.password, salt);
        const verificationCodeSalt = await bcryptjs_1.default.genSalt(8);
        const verificationCode = (0, generateOTP_1.default)().toString();
        const hashedCode = await bcryptjs_1.default.hash(verificationCode, verificationCodeSalt);
        const user = new User_1.default({
            firstName: result.data.firstName,
            lastName: result.data.lastName || "",
            username: result.data.username,
            email: result.data.email,
            password: hashedPassword,
            verificationCode: hashedCode,
            verificationCodeExpiry: Date.now() + 10 * 60 * 1000,
        });
        await user.save();
        await (0, sendEmail_1.default)({
            from: "TrendFusion",
            to: result.data.email,
            subject: "Email Verification",
            html: (0, verificationTemplate_1.default)(verificationCode),
            text: `Please verify your Email addess. The otp for email verification is ${verificationCode}. The otp is valid onlf for 10 minutes.`,
        });
        return res.status(201).json({
            success: true,
            message: "Account created, Please verify your email address.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
exports.userSignup = userSignup;
const veriyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        const result = verifyEmailSchema_1.default.safeParse({
            email,
            verificationCode,
        });
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
        const user = await User_1.default.findOne({
            email: result.data.email,
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Please signup again.",
            });
        }
        const isOTPValid = new Date(user.verificationCodeExpiry).getTime() > new Date().getTime();
        if (!isOTPValid) {
            await User_1.default.findByIdAndDelete(user._id);
            return res.status(401).json({
                success: false,
                message: "OTP Expired.",
            });
        }
        const verify = await bcryptjs_1.default.compare(result.data.verificationCode, user.verificationCode);
        if (!verify) {
            await User_1.default.findByIdAndDelete(user._id);
            return res.status(401).json({
                success: false,
                message: "Wrong OTP.",
            });
        }
        await User_1.default.findByIdAndUpdate(user._id, {
            $set: {
                isVerified: true,
                verificationCode: null,
                verificationCodeExpiry: null,
            },
        });
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.userRole,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
        return res.status(200).cookie(variables_1.TF_TOKEN, token, options_1.cookieOptions).json({
            success: true,
            message: "Account verified successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
exports.veriyEmail = veriyEmail;
