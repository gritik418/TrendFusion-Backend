"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const product_1 = __importDefault(require("./product"));
const gqlServer = new server_1.ApolloServer({
    typeDefs: product_1.default.typeDefs,
    resolvers: product_1.default.resolvers,
});
exports.default = gqlServer;
