const app = require('./app');
const mongoose = require('./config/db');

const PORT = process.env.PORT || 3000;

mongoose.connection.once('open', () => {
  console.log('Connexion à MongoDB réussie');
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion à MongoDB:', err);
});
