const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Assuming these roles, adjust as needed
const roleUserEnum = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_BUYER_SELLER'];

const utilisateurSchema = new Schema({
  nomFamille: { type: String, required: true },
  Prenom: { type: String, required: true },
  numTel: String,
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  motdePasse: { type: String, required: true },
  role: {
    type: String,
    enum: roleUserEnum,
    required: true
  },
  photoDeProfil:{type:String},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

}, { discriminatorKey: 'type', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
module.exports = mongoose.model("user" , utilisateurSchema , "user" );