const mongoose = require("mongoose");
const CarteRechargeSchema = new mongoose.Schema({
    NumSérie:{type:String},
    valeur:{BigInt64Array}

    },
    { timestamps: true }
);

module.exports = mongoose.model("CarteRecharge", CarteRechargeSchema , "CarteRecharge");


