"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AddressSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    appartment: { type: String },
    landmark: { type: String },
    phoneNumber: [{ type: String }],
});
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials",
    },
    password: {
        type: String,
        select: false,
    },
    verificationCode: {
        type: String,
    },
    verificationCodeExpiry: {
        type: Date,
    },
    addresses: [AddressSchema],
    avatar: {
        type: String,
        default: `${process.env.CLIENT_DOMAIN}/images/avatar.jpeg`,
    },
    orderHistory: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Product",
        },
    ],
    phoneNumber: { type: String },
    userRole: {
        type: String,
        default: "customer",
        enum: ["customer", "seller", "admin"],
    },
    wishlist: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Product",
        },
    ],
}, { timestamps: true });
const User = mongoose_1.default.models.User || (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
