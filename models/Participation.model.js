const mongoose = require('mongoose');
const User = require('./User'); // Import the base User model

const AcheteurSchema = new mongoose.Schema({
  dateNaissance: { type: Date },
  SocketId: { type: String },
  mesEnchere: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enchere' }]
});

// Create the Acheteur model as a discriminator of User
const Acheteur = User.discriminator('Acheteur', AcheteurSchema , 'Acheteur');

module.exports = Acheteur;
