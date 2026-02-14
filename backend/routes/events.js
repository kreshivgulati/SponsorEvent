import express from "express";
import Event from "../models/Event.js";
import { authenticateToken } from "../../frontend/middleware/auth.js";
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import Interest from "../models/Interest.js";
const router = express.Router();

// =======================
// Organizer-only middleware
// =======================
function requireOrganizer(req, res, next) {
  if (req.user.role !== "organizer") {
    return res.status(403).json({
      message: "Only organizers can create events",
    });
  }
  next();
}

// =======================
// Create Event (ORGANIZER ONLY)
// =======================
router.post("/", authenticateToken, requireOrganizer, async (req, res) => {
  try {
 const event = await Event.create({
  title: req.body.title,
  description: req.body.description,

  startDate: new Date(req.body.startDate),
  endDate: new Date(req.body.endDate),

  location: req.body.location,
  budget: req.body.budget,
  attendees: req.body.attendees,
  type: req.body.type,
  audience: req.body.audience,
  image: req.body.image,

  socialReach: {
    instagram: req.body.socialReach?.instagram,
    linkedin: req.body.socialReach?.linkedin,
    averagePostReach: req.body.socialReach?.averagePostReach,
  },

  pastExperience: {
    isRecurring: req.body.pastExperience?.isRecurring,
    editions: req.body.pastExperience?.editions,
    highestAttendance: req.body.pastExperience?.highestAttendance,
    notableSponsors: req.body.pastExperience?.notableSponsors,
  },

  organizer: req.user.id,
});

    res.status(201).json({ success: true, event });
  } catch (err) {
    console.error("EVENT CREATE ERROR:", err);
    res.status(400).json({ message: err.message });
  }
});

// =======================
// Delete Event (ORGANIZER ONLY)
// =======================
router.delete("/:id", authenticateToken, requireOrganizer, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can delete only your own events",
      });
    }

    await Chat.deleteMany({ event: event._id });
    await Interest.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({
      success: true,
      message: "Event and related data deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// =======================
// Get all events (PUBLIC)
// =======================
router.get("/", async (req, res) => {
  const events = await Event.find().populate("organizer", "name email");
  res.json({ success: true, events });
});
// =======================
// Get single event (PUBLIC)
// =======================

router.get("/organizer", authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({
      organizer: new mongoose.Types.ObjectId(req.user.id),
    }).sort({ createdAt: -1 });

    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
