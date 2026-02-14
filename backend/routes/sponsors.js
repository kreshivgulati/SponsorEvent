import express from "express";
import Sponsor from "../models/Sponsor.js";
import { authenticateToken } from "../../frontend/middleware/auth.js";
import User from "../models/User.js"
const router = express.Router();

// =======================
// Create Sponsor Profile
// =======================
router.post("/", authenticateToken, async (req, res) => {
  try {
    const sponsor = await Sponsor.create({
      ...req.body,
      userId: req.user.userId,
    });

    res.status(201).json({ success: true, sponsor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =======================
// Get all sponsors
// =======================



// Get all sponsors
router.get("/", async (req, res) => {
  try {
    const sponsors = await User.find({ role: "sponsor" })
      .select("-password") // remove password
      .sort({ createdAt: -1 });

    res.json({ success: true, sponsors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
