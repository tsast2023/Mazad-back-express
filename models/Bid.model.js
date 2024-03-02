const mongoose = require  ("mongoose");
const BidSchema = new mongoose.Schema({
    reference : {type:Number , required:true},
    ville : {type:String , required:true},
    prixMagasin:{type:String , required :true},
    prixMazad : {type:Number , required:true},
    coutDeClick : {type:Number , required:true},
    coutDeParticipation:{type:Number , required:true},
    valeurDeMajoration:{type:Number , required:true},
    formuleDeFacilite:{type:Number , required:true},
    remboursable:{type:Boolean},
    nombreParticipantsAtt:{type:Number},
    nombreParticipantsReel:{type:Number , required:true},
    datePublication:{type:Date},
    dateLancement:{type:Date},
    dateFermeture:{type:Date},
    
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("enchère", BidSchema , "enchère");


