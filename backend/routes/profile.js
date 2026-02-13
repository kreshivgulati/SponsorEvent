import express from "express";
import Profile from "../models/Profile.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/profile
 * Get logged-in user's profile
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * POST /api/profile
 * Create profile (only if not exists)
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const existing = await Profile.findOne({ user: userId });

    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = await Profile.create({
      user: userId,
      ...req.body,
    });

    res.status(201).json(profile);
  } catch (err) {
    console.error("CREATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * PUT /api/profile
 * Update profile
 */
router.put("/", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
