const mongoose = require  ("mongoose");
const BidSchema = new mongoose.Schema({
    libeléCategorie:{type:String},
    NombreDesProduits:{type:String},
    products:{type:String},
    CategoryFille:{type:String},
    }, 
    { timestamps: true }
  );
  
  module.exports = mongoose.model("category", BidSchema, 'category');


