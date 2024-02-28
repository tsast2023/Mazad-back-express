const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    libelleProduct :{type:String},
    Galerie :{type:[String]},
    stockInitiale :{type:Int32Array},
    stockactuel :{type:Int32Array},
    prixPrincipale :{type:Int32Array},
    couleurs :{type:[String]},
    CodeABarre :{type:String},
    QrCode : {type:String},
    Fournisseur :{type:String},
    visiteMagasin :{type:String},
    prixMazedOnline :{type:String},
    status:{type:String},
    category :{type:mongoose.Types.ObjectId , ref:"category"},
    categoryFille:{type : mongoose.Types.ObjectId , ref:"category"},
    Description :{type:String},
    enchere :{type:mongoose.Types.ObjectId , ref:"enchère"}

})
module.exports = mongoose.model('produit' , ProductSchema);