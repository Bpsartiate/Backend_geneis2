const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nom: { type: String },
  role: { type: String, required: true },
  telephone: { type: String, required: true },
  otp: { type: String },
  otp_expiration: { type: Date }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
