"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const db_config_js_1 = __importDefault(require("./database/db.config.js"));
const index_js_1 = __importDefault(require("./graphql/index.js"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const admin_routes_js_1 = __importDefault(require("./routes/admin/admin.routes.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:3000",
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
async function initGraphQLServer() {
    await index_js_1.default.start();
    app.use("/graphql", (0, express4_1.expressMiddleware)(index_js_1.default));
}
(0, db_config_js_1.default)();
initGraphQLServer();
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/user", user_routes_js_1.default);
app.use("/api/admin", admin_routes_js_1.default);
app.listen(PORT, () => {
    console.log(`App served at: http://localhost:${PORT}`);
});
