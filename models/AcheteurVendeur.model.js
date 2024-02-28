const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acheteurVendeurSchema = new Schema({
    pseudo: { type: String, unique: true, required: true },
    dateNaissance: Date,
    photoDeProfil: String,
    soldeMazed: { type: Schema.Types.Decimal128, required: true },
    soldeAqquisition: { type: Schema.Types.Decimal128, required: true },
    patente: String,
});
module.exports = mongoose.model('Utilisateur').discriminator('AcheteurVendeur', acheteurVendeurSchema);
