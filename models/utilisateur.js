const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  telephone: { type: String, unique: true, sparse: true },
  role: { type: String, required: true },
  password: { type: String, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
