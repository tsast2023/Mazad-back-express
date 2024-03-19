const mongoose = require  ("mongoose");
const SoldeSchema = new mongoose.Schema({
    soldeMazed : {type:Number},
    soldeAquisition : {type:Number}
    }, 
    { timestamps: true }
);
module.exports = mongoose.model("solde", SoldeSchema, 'solde');


