const { verifyToken } = require('../utils/jwt');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const payload = verifyToken(token);
    req.user = payload; // Add user info to request
    next();
  } catch (error) {
    return res.sendStatus(403); // Forbidden
  }
}

module.exports = { authenticateToken };
