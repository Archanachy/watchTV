const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a JWT
function generateToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}

// Verify a JWT
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
