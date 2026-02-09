// routes/chat.js
import express from "express";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { authenticateToken  } from "../../frontend/middleware/auth.js";

const router = express.Router();

/**
 * POST /routes/chat
 * body: { otherUserId }
 */
router.post("/", authenticateToken, async (req, res) => {
  const { userId, role } = req.user;
  const { otherUserId } = req.body;

  if (!otherUserId)
    return res.status(400).json({ message: "Missing other user" });

  const query =
    role === "sponsor"
      ? { sponsorId: userId, organizerId: otherUserId }
      : { sponsorId: otherUserId, organizerId: userId };

  let chat = await Chat.findOne(query);
  if (!chat) chat = await Chat.create(query);

  res.json(chat);
});

// GET chat messages (HISTORY)
router.get("/:chatId/messages", authenticateToken, async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.user;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  // Security check
  if (
    chat.sponsorId.toString() !== userId &&
    chat.organizerId.toString() !== userId
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const messages = await Message.find({ chatId }).sort("createdAt");
  res.json(messages);
});
export default router;
