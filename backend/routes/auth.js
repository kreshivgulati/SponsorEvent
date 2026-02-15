  import express from "express";
  import passport from "passport";
  import jwt from "jsonwebtoken";
  import bcrypt from "bcrypt";
  import User from "../models/User.js";

  const router = express.Router();

  /* ---------------- GOOGLE LOGIN ---------------- */

  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
failureRedirect: `${process.env.FRONTEND_URL}/login`,
      session: false,
    }),
    (req, res) => {
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`);    }
  );

  /* ---------------- EMAIL + PASSWORD LOGIN ---------------- */
  router.post("/register", async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        confirmPassword,
        role,
        acceptTerms,
      } = req.body;

      // 1️⃣ Basic validation
      if (!name || !email || !password || !confirmPassword || !role) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      if (!acceptTerms) {
        return res.status(400).json({
          message: "You must accept Terms & Privacy Policy",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      }

      // 2️⃣ Check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message: "User already exists. Please login instead.",
        });
      }

      // 3️⃣ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4️⃣ Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        isVerified: true,
      });

      // 5️⃣ Issue token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({ token });
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res
          .status(404)
          .json({ message: "User does not exist. Please sign up first." });
      }
  
      if (!user.password) {
        return res
          .status(400)
          .json({ message: "This account uses Google login" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.status(200).json({ token });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      res.status(500).json({ message: "Login failed" });
    }
  });
  


  export default router;
