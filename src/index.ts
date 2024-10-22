import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import connectDB from "./database/db.config.js";
import gqlServer from "./graphql/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin/admin.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());

async function initGraphQLServer() {
  await gqlServer.start();

  app.use("/graphql", expressMiddleware(gqlServer));
}

connectDB();
initGraphQLServer();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`App served at: http://localhost:${PORT}`);
});
