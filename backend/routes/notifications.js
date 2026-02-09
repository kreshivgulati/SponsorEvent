import express from "express";
import Interest from "../models/Interest.js";
import { authenticateToken } from "../../frontend/middleware/auth.js";

const router = express.Router();

// =======================
// Organizer notifications
// =======================
router.get("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "organizer") {
    return res.status(403).json({ message: "Access denied" });
  }

  const interests = await Interest.find({
    organizer: req.user.id,
  })
    .populate("event", "title date")
    .populate("sponsor", "name email");

  res.json({ success: true, interests });
});

export default router;
