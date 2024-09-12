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
exports.DiscountSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.DiscountSchema = new mongoose_1.Schema({
    description: { type: String },
    discountType: {
        type: String,
        enum: ["Percentage", "Fixed"],
    },
    value: {
        type: Number,
        min: 0,
    },
});
const ProductSchema = new mongoose_1.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    brand: {
        type: String,
    },
    category: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    discount: {
        type: exports.DiscountSchema,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    images: [
        {
            type: String,
        },
    ],
    highlights: [
        {
            type: String,
        },
    ],
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    warranty: {
        type: String,
    },
    offers: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    specifications: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const Product = mongoose_1.default.models.Product ||
    (0, mongoose_1.model)("Product", ProductSchema);
exports.default = Product;
