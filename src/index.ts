import express from "express";
import connectDB from "./database/db.config";

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`App served at: http://localhost:${PORT}`);
});
