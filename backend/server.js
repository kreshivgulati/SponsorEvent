/**
 * Event-Sponsor Matching Platform - Backend Server
 */

import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import passport from "./config/passport.js";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import interestRoutes from "./routes/interest.js";
import { setIO } from "./socketInstance.js";
import profileRoutes from "./routes/profile.js";


import { setupSocket } from "./socket.js";

// Routes
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import sponsorRoutes from "./routes/sponsors.js";
import matchRoutes from "./routes/match.js";
import chatRoutes from "./routes/chat.js";
import messageRoutes from "./routes/message.js";
import analyticsRoutes from './routes/analytics.js';
// Models
import User from "./models/User.js";


// =======================
// App & Server Init
// =======================
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Socket setup
setupSocket(io);




// =======================
// MongoDB
// =======================
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// =======================
// Middleware
// =======================
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// =======================
// JWT TEST ROUTE (DEBUG ONLY)
// =======================
app.get("/test-token", (req, res) => {
  const token = jwt.sign(
    { testUser: "jwt-working" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  res.json({
    message: "JWT generated successfully",
    token,
  });
});



passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    done(null, await User.findById(id));
  } catch (err) {
    done(err, null);
  }
});

// =======================
// Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);

// =======================
// Start Server
// =======================
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
