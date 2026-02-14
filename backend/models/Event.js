import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true },
endDate: { type: Date, required: true },
    location: String,
    budget: Number,
    expectedAttendees: Number,
    category: String,
    audience: String,
    image:String,
    socialReach: {
  instagram: Number,
  linkedin: Number,
},
    pastExperience: {
  isRecurring: Boolean,
  editions: Number,
  highestAttendance: Number,
  notableSponsors: String,
},
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Event', EventSchema);
