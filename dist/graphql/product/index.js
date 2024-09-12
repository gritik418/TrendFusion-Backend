"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers_1 = __importDefault(require("./resolvers"));
const typedefs_1 = __importDefault(require("./typedefs"));
const product = {
    typeDefs: typedefs_1.default,
    resolvers: resolvers_1.default,
};
exports.default = product;
