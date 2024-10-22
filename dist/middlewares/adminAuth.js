"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("../constants/variables");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuth = (req, res, next) => {
    try {
        const token = req.cookies[variables_1.ADMIN_TF_TOKEN];
        if (!token)
            throw new Error("Please Login.");
        const verify = jsonwebtoken_1.default.verify(token, process.env.ADMIN_JWT_SECRET);
        if (!verify)
            throw new Error("Please Login.");
        if (verify.role !== "admin")
            throw new Error("Only admins are allowed.");
        req.params.adminId = verify.id;
        req.params.adminEmail = verify.email;
        req.params.role = verify.role;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Please Login.",
        });
    }
};
exports.default = adminAuth;