const jwt = require("jsonwebtoken");
const User = require("../models/Admin");

// Tokenni tasdiqlash
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Rolni tasdiqlash
const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Server error" });
    }
  };
};

module.exports = { authMiddleware, roleMiddleware };
