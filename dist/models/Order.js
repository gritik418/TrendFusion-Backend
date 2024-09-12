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
const ProductItemSchema = new mongoose_1.Schema({
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
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
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
    unitPrice: {
        type: Number,
        required: true,
    },
    unitDiscount: Product_1.DiscountSchema,
});
const DeliveryAddressSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    phoneNumber: [
        {
            type: String,
        },
    ],
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: "India",
    },
    street: {
        type: String,
        trim: true,
    },
    appartment: {
        type: String,
        trim: true,
    },
    landmark: {
        type: String,
        trim: true,
    },
    postalCode: {
        type: String,
    },
});
const OrderSchema = new mongoose_1.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [ProductItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        min: 1,
    },
    discount: Product_1.DiscountSchema,
    finalPrice: {
        type: Number,
        required: true,
        min: 1,
    },
    totalQuantity: {
        type: Number,
        default: 1,
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash on Delivery"],
        default: "Cash on Delivery",
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    deliveryDate: {
        type: Date,
    },
    deliveryAddress: DeliveryAddressSchema,
    trackingId: {
        type: String,
        unique: true,
    },
}, { timestamps: true });
const Order = mongoose_1.default.models.Order || (0, mongoose_1.model)("Order", OrderSchema);
exports.default = Order;
