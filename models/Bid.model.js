const mongoose = require  ("mongoose");
const BidSchema = new mongoose.Schema({
    reference : {type:Number , required:true},
    product:{type:mongoose.Types.ObjectId , ref:"produit"},
    ville : {type:String , required:true},
    prixMagasin:{type:String , required :true},
    PrixMazedOnline  : {type:Number , required:true},
    CoutClic  : {type:Number , required:true},
    CoutParticipation :{type:Number , required:true},
    ValeurMajoration :{type:Number , required:true},
    Facilité :{type:Number , required:true},
    Remboursement :{type:Boolean},
    NombreParticipant :{type:Number},
    NombreParticipantréel :{type:Number , required:true},
    participants : [{type:mongoose.Types.ObjectId , ref:"User"}],
    datePublication:{type:Date},
    datedeclenchement :{type:Date},
    datefermeture :{type:Date},
    extensionTime : {type:Number},
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("enchère", BidSchema , "enchère");


