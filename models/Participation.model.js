const mongoose = require  ("mongoose");
const ParicipationSchema = new mongoose.Schema({
    enchere:{type:mongoose.Types.ObjectId , ref:"enchère"},
    participants:[{type:mongoose.Types.ObjectId , ref:"Acheteur-vendeur"}],
    

},
    { timestamps: true }
);

module.exports = mongoose.model("Paricipation", ParicipationSchema , "Transaction");


