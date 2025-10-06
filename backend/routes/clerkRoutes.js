import express from "express";
import { syncClerkUser } from "../controllers/clerkController.js";
import { authenticateClerk } from "../middleware/authMiddleware.js";

const router = express.Router();

// clerk endpoint
router.post("/register", authenticateClerk, syncClerkUser);

export default router;
