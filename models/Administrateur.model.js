const mongoose = require  ("mongoose");
const AdminSchema = new mongoose.Schema({
    
    },
    { timestamps: true }
);

module.exports = mongoose.model('Utilisateur').discriminator('Administrateur', AdminSchema);

