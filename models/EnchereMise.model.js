const mongoose = require('mongoose');
const { Schema } = mongoose;

const enchereMiseSchema = new Schema({
    prixMazedOnlineFinal: Number,
    enchérissement: [{ type: Schema.Types.ObjectId, ref: 'Encherissement' }],
    highestBidder: { type: Schema.Types.ObjectId, ref: 'User' },
    highestBid: Number,
    typePaiement: String, // Assuming it's a string, you can also use enums if needed
});

const EnchereMise = Enchere.discriminator('EnchereMise', enchereMiseSchema);
module.exports = EnchereMise;