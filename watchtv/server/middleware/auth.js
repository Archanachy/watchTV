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

function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
}


module.exports = { authenticateToken,verifyAdmin };
