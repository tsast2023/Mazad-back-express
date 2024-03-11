const mongoose = require  ("mongoose");
const TransactionSchema = new mongoose.Schema({
    solde : {type:mongoose.Types.ObjectId , ref:""},
    Acheteur_vendeur:{type:mongoose.Types.ObjectId , ref:"Acheteur-vendeur"},
    administrateur :{type:mongoose.Types.ObjectId , ref:"Administrateur"},
    soldeTransferer :{type:BigInt64Array}
},
    { timestamps: true }
);

module.exports = mongoose.model("Transaction ", TransactionSchema , "Transaction");


