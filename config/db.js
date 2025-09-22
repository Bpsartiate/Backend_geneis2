require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => console.log('MongoDB connectée'))
  .catch(err => console.error('Erreur connexion MongoDB:', err));

module.exports = mongoose;