import express from "express";
import Event from "../models/Event.js";
import { authenticateToken } from "../../frontend/middleware/auth.js";

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
  date: req.body.date,
  location: req.body.location,
  budget: req.body.budget,
  attendees: req.body.attendees,
  type: req.body.type,
  audience: req.body.audience,
  image: req.body.image,

  socialReach: {
    instagram: req.body.socialReach?.instagram,
    linkedin: req.body.socialReach?.linkedin,
  },

  pastExperience: {
    isRecurring: req.body.pastExperience?.isRecurring,
    editions: req.body.pastExperience?.editions,
    highestAttendance: req.body.pastExperience?.highestAttendance,
    notableSponsors: req.body.pastExperience?.notableSponsors,
  },

  organizer: req.user.id,
});;

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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id) { // ✅ FIX
      return res.status(403).json({
        message: "You can delete only your own events",
      });
    }

    await event.deleteOne();
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
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
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
