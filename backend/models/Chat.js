import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure only ONE chat per sponsor–organizer pair
chatSchema.index({ sponsorId: 1, organizerId: 1 }, { unique: true });

export default mongoose.model("Chat", chatSchema);
