"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const variables_1 = require("../constants/variables");
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies[variables_1.TF_TOKEN];
        if (!token)
            throw new Error("Please Login.");
        const verify = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!verify)
            throw new Error("Please Login.");
        req.params.userId = verify.id;
        req.params.userEmail = verify.email;
        req.params.userRole = verify.role;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Please Login.",
        });
    }
};
exports.default = authenticate;
