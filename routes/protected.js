const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.get('/profil', authMiddleware, (req, res) => {
  res.json({ message: 'Accès à la route protégée', user: req.user });
});

module.exports = router;
