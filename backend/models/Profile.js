import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // 🔗 Link to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🧍 Basic Identity
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["organizer", "sponsor", "both"],
      required: true,
    },

    organizationName: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    profilePhoto: {
      type: String, // URL (Cloudinary or similar)
    },

    // 📊 Organizer Stats
    eventsHosted: {
      type: Number,
      default: 0,
    },

    totalAttendeesReached: {
      type: Number,
      default: 0,
    },

    sponsorsOnboarded: {
      type: Number,
      default: 0,
    },

    averageEventRating: {
      type: Number,
      default: 0,
    },

    // 💼 Sponsor Info
    brandsSponsored: [
      {
        type: String,
      },
    ],

    sponsorshipCategories: [
      {
        type: String,
      },
    ],

    budgetRange: {
      type: String, // e.g. "₹50,000 - ₹2,00,000"
    },

    // 🖼 Gallery (Optional)
    gallery: [
      {
        type: String, // image URLs
      },
    ],

    testimonials: [
      {
        name: String,
        feedback: String,
      },
    ],

    mediaCoverage: [
      {
        title: String,
        link: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
