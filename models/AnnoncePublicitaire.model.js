const mongoose = require  ("mongoose");
const ProductSchema = new mongoose.Schema({
    Contenu:{type:[String]},
    DatePublication:{type:Date},
    status:{type:String},
    product:{type:mongoose.Types.ObjectId , ref:"produit"}
    },
    { timestamps: true }
);

module.exports = mongoose.model("produit", ProductSchema , "product");


