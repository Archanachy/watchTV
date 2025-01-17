const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a JWT
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}

// Verify a JWT
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
