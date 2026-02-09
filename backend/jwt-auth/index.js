import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// FAKE USER (for learning)
const USER = {
  id: 1,
  email: "test@gmail.com",
  password: "123456",
};

// LOGIN ROUTE (GET JWT HERE)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== "test@gmail.com" || password !== "123456") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// PROTECTED ROUTE
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Access granted", user: decoded });
  } catch {
    res.sendStatus(403);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Backend running on port", process.env.PORT);
});