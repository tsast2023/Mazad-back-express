const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
  {
    nomCategorie: {
      type: String,
      required: true,
      unique: true,
      maxlength: 25, 
    },
    nomCategorieArabe: { type: String },
    nomCategorieEnglish: { type: String },
    alUne: { type: Boolean, default: false },
    statusCategorie: {
      type: String,
      enum: ["ACTIVER", "DESACTIVER"], 
      default: "ACTIVER",
    },
    icon: { type: String },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }, 
    traficUtilisateurs: {
      type: Map,
      of: Number, 
      default: {},
    },
  },
  { timestamps: true } 
);

categorieSchema.methods.enregistrerVisite = function (date) {
  const dateKey = date.toISOString().split("T")[0];
  this.traficUtilisateurs.set(
    dateKey,
    (this.traficUtilisateurs.get(dateKey) || 0) + 1
  );
  return this.save();
};

categorieSchema.methods.obtenirNombreDeVisitesPourDate = function (date) {
  const dateKey = date.toISOString().split("T")[0];
  return this.traficUtilisateurs.get(dateKey) || 0;
};

module.exports = mongoose.model("Categorie", categorieSchema , "categorie");
