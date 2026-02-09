import mongoose from "mongoose";
const SponsorSchema = new mongoose.Schema(
  {
    companyName: String,
    industry: String,
    budget: Number,
    interests: [String],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);
export default mongoose.model("Sponsor", new mongoose.Schema({}));
