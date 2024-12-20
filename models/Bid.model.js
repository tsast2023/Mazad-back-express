const mongoose = require('mongoose');
const { Schema } = mongoose;

const enchereSchema = new Schema({
  ref: { type: String, unique: true },
  coutClic: Number,
  coutParticipation: Number,
  valeurMajoration: [Number],
  facilite: Boolean,
  valeurFacilite: Number,
  datedeclenchement: Date,
  datefermeture: Date,
  ville: String,
  delegationAr: String,
  prixMazedOnline: Number,
  prixMazedAchat: Number,
  nombreParticipantAttendu: Number,
  extensionTime: Number,
  nombreMois: Number,
  galerie: [String],
  description: String,
  nomProduit: {
    type: String,
    required: true,
    maxlength: 25
  },
  categorie: {
    type: Schema.Types.ObjectId,
    ref: 'Categorie'
  },
  critere: {
    type: Map,
    of: String
  },
  participantIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  unite: {
    type: String,
    enum: ['Mois', 'Jours']
  },
  avocat: String,
  notaire: String,
  datePublication: Date,
  status: {
    type: String,
    enum: ['Brouillon', 'Ouverte', 'En_Cours', 'Terminée', 'Annulée']
  },
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
  nombreParticipantréel: {
    type: Number,
    default: 0
  },
  autoFinancement: Number,
  villeArabe: String,
  descriptionAr: String,
  descriptionEn: String,
  nomProduitAr: String,
  nomProduitEn: String,
  critereAr: {
    type: Map,
    of: String
  },
  critereEn: {
    type: Map,
    of: String
  },
  traficUtilisateurs: {
    type: Map,
    of: Number
  },
  delegation: String,
  highestBidder: {
    type: Schema.Types.ObjectId,
    ref: 'User' // Reference to the highest bidder (User model)
  },
  highestBid: Number,
}, {
  timestamps: true
});

// Custom method to get the number of visits for a specific date
enchereSchema.methods.obtenirNombreDeVisitesPourDate = function (date) {
  return this.traficUtilisateurs.get(date.toISOString()) || 0;
};

// Custom method to log a visit for a specific date
enchereSchema.methods.enregistrerVisite = function (date) {
  const dateKey = date.toISOString();
  this.traficUtilisateurs.set(dateKey, (this.traficUtilisateurs.get(dateKey) || 0) + 1);
};

module.exports = mongoose.model('Enchere', enchereSchema, 'enchere');