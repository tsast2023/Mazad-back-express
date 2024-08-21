const bids = require("../models/Bid.model");
const Solde = require('../models/Solde.model')
const User = require('../models/User.model')
const Encherissement = require('../models/Encherissement')
const Transaction = require('../models/Transaction.model');
const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose;
const { getIo } = require('../socket');

const bidCtrl = {

    getAll: async(req, res) => {
        try {
          const bidss = await bids.find();
          res.json(bidss);
        } catch (error) {
          console.log({ msg: error });
          res.status(500).send({ error: "Server error" });
        }
      },


join: async (req, res) => {

          try {
      const { bidId } = req.params; 
      const bid = await bids.findById(bidId);
      if (!bid.participants.includes(userId)) {
        return res.status(403).send({ error: "you are not participating yet in this bid" });
      }

      
      res.json({ message: "Join successful" });
    } catch (error) {
      console.log({ msg: error });
      res.status(500).send({ error: "Server error" });
    }
  },
mise : async (req, res) => {
    try {
        const { bidId , amount} = req.body;
        const pseudo = req.user;
        console.log("uuuuu",pseudo)
        console.log(req.body)
        const balance = await Solde.findOne({ 'user.pseudo': pseudo }).populate('user');
        console.log('uussserr',balance.user)
        // Check user balance
        const bid = await bids.findById(bidId);
        if (!bid) {
            return res.status(404).send({error: "Bid not found"});
        }

        
        console.log('solde' , balance)
        if (balance.soldeMazed < bid.coutClic) {
            return res.status(403).send({ error: "Insufficient balance for this bid" });
        }

        // Check if the bid time has ended
        if (new Date() >= bid.dateFermeture) {
            return res.status(400).send({error: "Bid time has ended"});
        }

        if(!bid.participantsSigné.map(user => user.pseudo).includes(pseudo)){
          return res.status(400).send({error: "you re not participating at this bid"});
        }
        const encherissement = new Encherissement({
            participant:balance.user,
            heureMajoration:Date.now(),
            valeurMajorationUser:amount,
            montantTot:bid.highestBid+amount
        })
        console.log('Encherissement object:', encherissement);
        // Validate the object manually
        await encherissement.save();

        
         
          const updatedBid = await bids.findOneAndUpdate(
            { _id: bidId },
            {
              $push: { enchérissement: encherissement },
              highestBid: encherissement.montantTot,
              highestBidder: balance.user ,
              datefermeture: new Date(bid.datefermeture.getTime() + bid.extensionTime * 60000)
            },
            { new: true } // Return the updated document
          );
          console.log(updatedBid)
       
       


        const transaction  = new Transaction({
          acheteur:balance.user._id,
          montantTransaction:amount,
          actionTransaction:"clic dans une enchère"
        })
        await transaction.save();
        const io = getIo();
            if (io) {
                io.emit('bidUpdate', updatedBid)}
        res.json({ message: "Bid successful", bid: updatedBid });
    } catch (error) {
        console.log({msg: error});
        res.status(500).send({error: error});
    }
},

};

module.exports = bidCtrl;
