const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


const cors = require('cors');
const utilisateurRoutes = require('./routes/auth');

const protectedRoutes = require('./routes/protected');



const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/protected', protectedRoutes);


// Monter les routes utilisateur
app.use('/api/auth', utilisateurRoutes);

module.exports = app;
