import express from "express";
import Interest from "../models/Interest.js";
import Event from "../models/Event.js";
import { authenticateToken } from "../../frontend/middleware/auth.js";

const router = express.Router();

// =======================
// Sponsor shows interest
// =======================
router.post("/:eventId", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "sponsor") {
      return res.status(403).json({
        message: "Only sponsors can show interest",
      });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Prevent duplicate interest
    const existing = await Interest.findOne({
      event: event._id,
      sponsor: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already shown interest",
      });
    }

    const interest = await Interest.create({
      event: event._id,
      sponsor: req.user.id,
      organizer: event.organizer,
    });

    res.status(201).json({
      success: true,
      message: "Interest sent to organizer",
      interest,
    });
  } catch (err) {
    console.error("INTEREST ERROR:", err);
    res.status(500).json({ message: "Failed to show interest" });
  }
});
// =======================
// Organizer sees interests (notifications)
// =======================
router.get("/organizer", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({
        message: "Only organizers can view notifications",
      });
    }

    const interests = await Interest.find({
      organizer: req.user.id,
    })
      .populate("sponsor", "name email")
      .populate("event", "title date location budget")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      interests,
    });
  } catch (err) {
    console.error("FETCH INTERESTS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});

export default router;
