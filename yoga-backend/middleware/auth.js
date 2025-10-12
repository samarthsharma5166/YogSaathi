import jwt from "jsonwebtoken";

// Verify JWT from headers
export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is missing
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token. Please login again" });
  }
};

// Allow only admin users
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access only." });
  }
  next();
};
