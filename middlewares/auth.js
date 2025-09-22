const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // données utilisateur disponibles dans req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

module.exports = authMiddleware;
