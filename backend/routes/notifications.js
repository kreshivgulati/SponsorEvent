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
    .populate("event", "title startDate endDate")
    .populate("sponsor", "name email");

  // 🔥 Remove interests where event is deleted
  const validInterests = interests.filter(i => i.event !== null);

  res.json({ success: true, interests: validInterests });
});
export default router;
