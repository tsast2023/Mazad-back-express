const mongoose = require('mongoose');

// Define the Solde schema
const SoldeSchema = new mongoose.Schema({
    soldeMazed: {
        type: Number,
        required: true
    },
    soldeAquisition: {
        type: Number,
        required: true
    },
    user: { 
        type: {
            _id: { type: mongoose.Schema.Types.Mixed, ref: 'user', required: true },
        },
        required: true
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});


module.exports = mongoose.model("solde", SoldeSchema, 'solde');


