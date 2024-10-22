"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmin = void 0;
const User_1 = __importDefault(require("../../models/User"));
const getAdmin = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const admin = await User_1.default.findById(adminId).select({
            verificationCodeExpiry: 0,
            verificationCode: 0,
            provider: 0,
        });
        if (!admin || !adminId)
            return res.status(401).json({
                success: false,
                message: "Admin not found.",
            });
        return res.status(200).json({
            success: true,
            data: admin,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
exports.getAdmin = getAdmin;
