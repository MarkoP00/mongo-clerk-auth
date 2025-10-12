import express from "express";
import { syncClerkUser } from "../controllers/clerkController.js";
import { authenticateClerk } from "../middleware/authMiddleware.js";
import { clerkClient } from "@clerk/express";

const router = express.Router();
// const secretKey = process.env.CLERK_SECRET_KEY; - key is automatically read when clerk is awaken

// clerk endpoint
router.post("/register", authenticateClerk, syncClerkUser);

// logout user
router.post("/logout", async (req, res) => {
  const { sessionId } = req.body;

  try {
    if (sessionId) {
      await clerkClient.sessions.revokeSession(sessionId);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ message: "No session id provided" });
  } catch (err) {
    console.error("Failed to revoke session", err);
    res.status(500).json({ error: "Failed to revoke session" });
  }
});
export default router;
