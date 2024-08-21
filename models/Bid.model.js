const mongoose = require('mongoose');
const { Schema } = mongoose;


const EnchereSchema = new Schema({
  ref: { type: String, unique: true },
  coutClic: Number,
  coutParticipation: Number,
  valeurMajoration: [Number],
  facilite: Boolean,
  valeurFacilite: Number,
  datedeclenchement: Date,
  datefermeture: Date,
  ville: String,
  prixMazedOnline: Number,
  nombreParticipantAttendu: Number,
  nombreParticipantréel: Number,
  extensionTime: Number,
  nombreMois: Number,
  prixMazedOnlineFinal: Number,
  galerie: [String],
  description: String,
  nomProduit: {
    type: String,
    required: true,
    maxlength: 25
  },
  categorie: {
    type: Schema.Types.ObjectId,
    ref: 'Categorie' // Assuming you have a Categorie model
  },
  critere: {
    type: Map,
    of: String
  },
  participantsNonSigne: [{
    type: Schema.Types.ObjectId,
    ref: 'Acheteur' // Assuming you have an Acheteur model
  }],
  participantsSigne: [{
    type: Schema.Types.ObjectId,
    ref: 'Acheteur'
  }],
  enchérissement: [{
    type: Schema.Types.Mixed,
    ref: 'Encherissement' // Assuming you have an Encherissement model
  }],
  unite: {
    type: String,
    enum:["Mois" , "Jours" ]
  },
  avocat: String,
  noataire: String,
  datePublication: Date,
  status: {
    type: String,
    enum: ["Brouillon" , "Ouverte" , "En_Cours" , "Terminée" , "Annulée" ]
  },
  contractEnchere: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  epingler: {
    type: Boolean,
    default: false
  },
  highestBidder: {
    type: Schema.Types.Mixed,
    ref: 'user' // Assuming you have a User model
  },
  highestBid: Number,
  typePaiement: {
    type: Number,
    enum: ["Carte Bancaire" , "PayPal" , "Virement Bancaire"]
  },
  SmsSent: {
    type: Boolean,
    default: false
  },
});

  
  module.exports = mongoose.model("Enchere", EnchereSchema , "enchere");


