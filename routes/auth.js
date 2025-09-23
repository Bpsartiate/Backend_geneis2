const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Simuler envoi SMS (à remplacer par API SMS réelle)
function envoyerSMS(numero, message) {
  console.log(`Envoi SMS à ${numero}: ${message}`);
}

// Générer un OTP aléatoire de 6 chiffres
function genererOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
// Route GET pour debug (info sur l'API register)
router.get('/register', (req, res) => {
  res.status(200).json({ message: 'Utilisez POST pour enregistrer un utilisateur.' });
});
//inscription utilisateur avec nom, email, et numéro de téléphone, role
router.post('/register', async (req, res) => {
  const { nom, email, telephone, role } = req.body;
  if (!nom || !email || !telephone || !role) {
    return res.status(400).json({ message: 'Nom, email, téléphone et rôle sont requis' });
  }
  try {
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    const nouvelUtilisateur = new Utilisateur({ nom, email, telephone, role });
    await nouvelUtilisateur.save();
    res.status(201).json({ message: 'Utilisateur enregistré avec succès', utilisateur: nouvelUtilisateur });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Demander OTP: générer et envoyer OTP temporaire par SMS
router.post('/demander-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email est requis' });
  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const otp = genererOTP();
    const expiration = new Date(Date.now() + 5 * 60 * 1000); // OTP valide 5 minutes
    utilisateur.otp = otp;
    utilisateur.otp_expiration = expiration;
    await utilisateur.save();
    envoyerSMS(utilisateur.telephone, `Votre code OTP est: ${otp}`);
    // Inclure l'OTP dans la réponse uniquement en développement
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({ message: 'OTP envoyé par SMS', otp });
    }
    res.status(200).json({ message: 'OTP envoyé par SMS' });
  } catch (error) {
    console.error('Erreur lors de la demande OTP:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Route authentification (login) avec OTP + génération JWT
router.post('/authentifier', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email et OTP sont requis' });
  }
  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (utilisateur.otp !== otp) {
      return res.status(400).json({ message: 'OTP invalide' });
    }
    if (new Date() > utilisateur.otp_expiration) {
      return res.status(400).json({ message: 'OTP expiré' });
    }
    // Réinitialisation OTP après succès
    utilisateur.otp = null;
    utilisateur.otp_expiration = null;
    await utilisateur.save();

    // Génération JWT token
    const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Authentification réussie', token });
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
module.exports = router;