"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        const { connection } = await (0, mongoose_1.connect)(MONGO_URI);
        console.log(`Mongo connected: ${connection.name}`);
    }
    catch (error) {
        console.log(`Mongo Error: ${error}`);
    }
};
exports.default = connectDB;
