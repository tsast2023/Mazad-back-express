const mongoose = require  ("mongoose");
const SoldeSchema = new mongoose.Schema({
    soldeMazed : {type:BigInt64Array},
    soldeAquisition : {type:BigInt64Array}
    }, 
    { timestamps: true }
);
module.exports = mongoose.model("solde", SoldeSchema, 'solde');


