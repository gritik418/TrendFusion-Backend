"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queries_1 = __importDefault(require("./queries"));
const resolvers = {
    Query: queries_1.default,
};
exports.default = resolvers;
