/**
 * Event-Sponsor Matching Platform - Backend Server
 */

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import interestRoutes from "./routes/interest.js";

import { setupSocket } from "./socket.js";

// Routes
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import sponsorRoutes from "./routes/sponsors.js";
import matchRoutes from "./routes/match.js";
import chatRoutes from "./routes/chat.js";

// Models
import User from "./models/User.js";

dotenv.config();

// =======================
// App & Server Init
// =======================
const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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
    origin: "http://localhost:3000",
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

// =======================
// Google OAuth Strategy
// =======================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            isVerified: true,
            role: null,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

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

// =======================
// Start Server
// =======================
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
