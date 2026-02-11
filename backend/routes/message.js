import express from "express";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { authenticateToken } from "../middleware/auth.js";
import { getIO } from "../socketInstance.js";

const router = express.Router();

/**
 * GET /api/message/:chatId
 * Fetch chat history
 */
router.get("/:chatId", authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Ensure user belongs to the chat
    if (
      chat.sponsor.toString() !== userId &&
      chat.organizer.toString() !== userId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/**
 * POST /api/message
 * Send a message
 * body: { chatId, text }
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const { userId } = req.user;

    if (!chatId || !text?.trim()) {
      return res.status(400).json({ message: "chatId and text required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    let senderRole;
    if (chat.organizer.toString() === userId) {
      senderRole = "organizer";
    } else if (chat.sponsor.toString() === userId) {
      senderRole = "sponsor";
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

   const message = await Message.create({
  chatId,
  senderId: userId,
  senderRole,
  text: text.trim(),
});

const io = getIO();
io.to(chatId).emit("receive-message", message);

res.json(message);

  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
