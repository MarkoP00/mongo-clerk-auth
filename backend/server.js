import express from "express";
import connectDB from "./server/config/database.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import clerkRoutes from "./routes/clerkRoutes.js";
import cors from "cors";
import { authenticateJWT } from "./middleware/authMiddleware.js";

dotenv.config();
connectDB();

const port = process.env.PORT || 8000;
const app = express();
app.use(cors());

app.use(express.json()); //raw json format
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth/clerk", clerkRoutes);

app.get("/api/auth/verify", authenticateJWT, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    success: true,
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
