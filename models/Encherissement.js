const mongoose = require('mongoose');
const { Schema } = mongoose;

const EncherissementSchema = new Schema({
  participant: { type: Schema.Types.Mixed, ref: 'User' }, // Assuming User is another model
  heureMajoration: { type: Date }, // LocalDateTime equivalent in Java is Date in JavaScript
  valeurMajorationUser: { type: Number },
  montantTot: { type: Number }
}, { timestamps: true }); // timestamps option to automatically manage createdAt and updatedAt fields

// Adding the id field as the primary key is automatically managed by MongoDB and doesn't need to be explicitly declared.

module.exports = mongoose.model('Encherissement', EncherissementSchema , "Encherissement");