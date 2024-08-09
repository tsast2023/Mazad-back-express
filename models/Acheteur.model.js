const mongoose = require('mongoose');

const AcheteurSchema = new mongoose.Schema({
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
module.exports = mongoose.model('user').discriminator('Acheteur', AcheteurSchema , 'Acheteur');
