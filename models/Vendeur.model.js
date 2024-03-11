const mongoose = require('mongoose');

const VendeurSchema = new mongoose.Schema({
  imgCin: {
    type: String,
  },
  cin: {
    type: Number,
  },
  patente: {
    type: String,
  },
  status: {
    type: String,
    enum: ['BLOQUER', 'OTHER_STATUS_VALUES'],
    default: 'BLOQUER',
  },
  type: {
    type: String,
    enum: ['TYPE_VALUES'],
  },
  nomSociete: {
    type: String,
  },
  dateNaissance: {
    type: Date,
  },
  photoDeProfil: {
    type: String,
  },
  socketId: {
    type: String,
  },
  solde: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'solde',
  },
}, {
  discriminatorKey: 'userType',
});
module.exports = mongoose.model('Utilisateur').discriminator('Vendeur', VendeurSchema);