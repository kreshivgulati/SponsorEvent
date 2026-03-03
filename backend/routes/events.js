import express from "express";
import Event from "../models/Event.js";
import { authenticateToken } from "../middleware/auth.js"
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import Interest from "../models/Interest.js";
// Add this at the very top of events.js, right after the imports
const router = express.Router();
router.use((req, res, next) => {
  console.log(`[EVENTS ROUTE] ${req.method} ${req.originalUrl}`);
  next();
});
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
    // ✅ Moved console.log here where req exists
    console.log("Creating event for user:", req.user.userId);
    
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
      organizer: req.user.userId,
    });

    res.status(201).json({ success: true, event });
  } catch (err) {
    console.error("EVENT CREATE ERROR:", err);
    res.status(400).json({ message: err.message });
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
// Get organizer's events (PROTECTED)
// =======================
router.get("/organizer", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching events for user:", req.user.userId); // ✅ Optional: add logging here too
    const events = await Event.find({
      organizer: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, events });
  } catch (err) {
    console.error("ORGANIZER EVENTS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
// =======================
// Update Event (ORGANIZER ONLY)
// =======================
router.put("/:id", authenticateToken, requireOrganizer, async (req, res) => {
  try {
    // First check if the event belongs to this organizer
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Verify this organizer owns the event
    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own events"
      });
    }

    // Handle notableSponsors - could be string or array
    let notableSponsors = req.body.pastExperience?.notableSponsors;
    
    // If it's a string, convert to array by splitting on commas
    if (typeof notableSponsors === 'string') {
      notableSponsors = notableSponsors.split(',').map(s => s.trim()).filter(s => s);
    }
    // If it's already an array, use it as is
    // If it's undefined or null, set to empty array

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
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
          notableSponsors: notableSponsors || [] // Store as array in database
        }
      },
      { new: true } // Return the updated document
    );

    res.json({ 
      success: true, 
      event: updatedEvent,
      message: "Event updated successfully" 
    });
  } catch (err) {
    console.error("EVENT UPDATE ERROR:", err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
});
// =======================
// Get single event (PUBLIC)
// =======================
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// =======================
// Delete Event (ORGANIZER ONLY)
// =======================
router.delete("/:id", authenticateToken, requireOrganizer, async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("DELETE REQUEST RECEIVED");
    console.log("Event ID:", req.params.id);
    console.log("User ID:", req.user.userId);
    console.log("User Role:", req.user.role);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format"
      });
    }
    
    // First check if the event belongs to this organizer
    const event = await Event.findById(req.params.id);
    console.log("Event found:", event ? "Yes" : "No");
    
    if (!event) {
      console.log("Event not found in database");
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    console.log("Event organizer:", event.organizer.toString());
    console.log("Request user:", req.user.userId);
    
    // Verify this organizer owns the event
    if (event.organizer.toString() !== req.user.userId) {
      console.log("Authorization failed - organizer mismatch");
      return res.status(403).json({
        success: false,
        message: "You can only delete your own events"
      });
    }

    console.log("Authorization successful, proceeding with deletion");

    // Delete related data first
    try {
      if (mongoose.modelNames().includes("Chat")) {
        const chatResult = await Chat.deleteMany({ event: req.params.id });
        console.log(`Deleted ${chatResult.deletedCount} chats`);
      }
    } catch (e) {
      console.log("Error deleting chats:", e.message);
    }
    
    try {
      if (mongoose.modelNames().includes("Interest")) {
        const interestResult = await Interest.deleteMany({ event: req.params.id });
        console.log(`Deleted ${interestResult.deletedCount} interests`);
      }
    } catch (e) {
      console.log("Error deleting interests:", e.message);
    }
    
    // Delete the event
    const deleteResult = await Event.findByIdAndDelete(req.params.id);
    console.log("Event deleted:", deleteResult ? "Yes" : "No");

    res.json({ 
      success: true, 
      message: "Event deleted successfully" 
    });
  } catch (err) {
    console.error("EVENT DELETE ERROR:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  } finally {
    console.log("=".repeat(50));
  }
});
export default router;