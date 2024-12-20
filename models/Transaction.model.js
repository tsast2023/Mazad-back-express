const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the action transaction enum values
const actionTransactionEnum = [
    'participation à une enchère', 
    'clic dans une enchère', 
    'paiement enchère'
];

// Transaction schema
const TransactionSchema = new Schema({
    acheteur: {type:mongoose.Schema.Types.Mixed , ref:"acheteur"}, // Embedding Acheteur as an object
    montantTransaction: {
        type: Number,
        required: true
    },
    actionTransaction: {
        type: String,
        required: true,
        enum: actionTransactionEnum // Using the predefined enum values
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema , "transaction");
