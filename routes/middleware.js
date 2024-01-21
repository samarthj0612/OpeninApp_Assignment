// middleware/authMiddleware.js

require('dotenv').config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

function verifyToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { verifyToken };
