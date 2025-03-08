const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Assuming these roles, adjust as needed
const roleUserEnum = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_BUYER_SELLER' , 'Acheteur'];

const utilisateurSchema = new Schema({
  nomFamille: { type: String,  },
  Prenom: { type: String,  },
  numTel: String,
  pseudo:{type:String},
  email: {
    type: String,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  role: {
    type: String,
    enum: roleUserEnum
    
  },
  photoDeProfil:{type:String},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

}, { discriminatorKey: 'type', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
module.exports = mongoose.model("User" , utilisateurSchema , "user" );