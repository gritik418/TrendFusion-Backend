"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_routes_js_1 = __importDefault(require("./products.routes.js"));
const auth_routes_js_1 = __importDefault(require("./auth.routes.js"));
const adminAuth_js_1 = __importDefault(require("../../middlewares/adminAuth.js"));
const admin_js_1 = require("../../controllers/admin/admin.js");
const router = (0, express_1.Router)();
router.use("/products", products_routes_js_1.default);
router.use("/auth", auth_routes_js_1.default);
router.get("/", adminAuth_js_1.default, admin_js_1.getAdmin);
exports.default = router;
