import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader?.split(" ")[1];

  if (!authToken){
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = {
      userId: decoded.id,
      role: decoded.role,
    };

    next();
  });
};
