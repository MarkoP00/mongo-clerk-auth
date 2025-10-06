import express from "express";
import rateLimit from "express-rate-limit";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, //1 min
  max: 10,
  message: "Too many login attmepts, please try again later",
});

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);

export default router;
