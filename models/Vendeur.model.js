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

}, {
  discriminatorKey: 'userType',
});
module.exports = mongoose.model('user').discriminator('Vendeur', VendeurSchema , 'Vendeur');