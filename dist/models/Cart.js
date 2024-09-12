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
const Product_1 = require("./Product");
const CartItemSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    brand: {
        type: String,
    },
    title: {
        type: String,
        trim: true,
    },
    thumbnail: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    stock: {
        type: Number,
        default: 1,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    unitDiscount: Product_1.DiscountSchema,
});
const CartSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [CartItemSchema],
    discount: Product_1.DiscountSchema,
    finalPrice: {
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 1,
    },
    totalQuantity: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });
const Cart = mongoose_1.default.models.Cart || (0, mongoose_1.model)("Cart", CartSchema);
exports.default = Cart;
