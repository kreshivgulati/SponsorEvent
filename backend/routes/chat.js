import express from "express";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   GET ALL CHATS FOR USER
========================= */
router.get("/my", authenticateToken, async (req, res) => {
  const { userId, role } = req.user;

  try {
    let chats;

    if (role === "organizer") {
      chats = await Chat.find({ organizer: userId })
        .populate("event")
        .populate("sponsor");
    } else if (role === "sponsor") {
      chats = await Chat.find({ sponsor: userId })
        .populate("event")
        .populate("organizer");
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    res.json(chats);
  } catch (err) {
    console.error("GET /my error:", err);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
});

/* =========================
   CREATE CHAT
========================= */
router.post("/", authenticateToken, async (req, res) => {
  const { userId, role } = req.user;
  const { sponsorId, eventId } = req.body;

  if (role !== "organizer") {
    return res.status(403).json({ message: "Only organizers can start chat" });
  }

  if (!sponsorId || !eventId) {
    return res.status(400).json({ message: "Missing sponsorId or eventId" });
  }

  try {
    let chat = await Chat.findOne({
      organizer: userId,
      sponsor: sponsorId,
      event: eventId,
    });

    if (!chat) {
      chat = await Chat.create({
        organizer: userId,
        sponsor: sponsorId,
        event: eventId,
      });
    }

    res.json(chat);
  } catch (err) {
    console.error("POST chat error:", err);
    res.status(500).json({ message: "Failed to create chat" });
  }
});

/* =========================
   GET CHAT MESSAGES
========================= */
router.get("/:chatId/messages", authenticateToken, async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.user;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (
      chat.sponsor.toString() !== userId &&
      chat.organizer.toString() !== userId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages);
  } catch (err) {
    console.error("GET messages error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;
