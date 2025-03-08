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
  mise: async (req, res) => {
    try {
        const { bidId, amount } = req.body;
        const pseudo = req.user.sub;

        const balance = await Solde.findOne({ 'user.pseudo': pseudo }).populate('user');
        if (!balance) {
            return res.status(404).send({ error: "Balance not found" });
        }

        const bid = await bids.findById(bidId).populate('participantIds');
        if (!bid) {
            return res.status(404).send({ error: "Bid not found" });
        }

        if (!bid.participantIds.some(p => p._id.equals(balance.user._id))) {
            return res.status(403).send({ error: "You are not a participant in this bid" });
        }

        if (balance.soldeMazed < bid.coutClic) {
            return res.status(403).send({ error: "Insufficient balance for this bid" });
        }

        if (new Date() >= bid.datefermeture) {
            return res.status(400).send({ error: "Bid time has ended" });
        }

        if ((bid.highestBid || 0) + amount >= bid.prixMazedAchat) {
            bid.status = "Terminée";
            bid.datefermeture = new Date();
            await bid.save({ validateBeforeSave: false }).catch((err) => {
              console.error("Error saving bid:", err);
            });
            return res.status(200).send({ message: "Bid ended as highest bid reached the purchase price" });
        }

        // Create new Encherissement record
        const encherissement = new Encherissement({
            participant: balance.user._id,
            heureMajoration: Date.now(),
            valeurMajorationUser: amount,
            montantTot: (bid.highestBid || 0) + amount
        });

        await encherissement.save();
        console.log(encherissement)
        console.log(balance.user._id)
        console.log(bid.extensionTime)
        // ✅ **Updating bid manually instead of `updateBidDetails`**
        console.log(encherissement.montantTot , balance.user._id , new Date(Date.now() + bid.extensionTime * 1000))
        bid.highestBid = encherissement.montantTot;
        bid.highestBidder = balance.user._id;
        bid.datefermeture = new Date(Date.now() + bid.extensionTime * 1000); // Extend time if needed

        await bid.save({ validateBeforeSave: false }).catch((err) => {
          console.error("Error saving bid:", err);
        });
        // Subtract the bid amount from the user's balance (Solde)
            balance.soldeMazed -= amount;
            await balance.save();
        // Save transaction
        const transaction = new Transaction({
            acheteur: balance.user._id,
            montantTransaction: amount,
            actionTransaction: "clic dans une enchère"
        });

        await transaction.save();

        // Emit bid update
        const io = getIo();
        if (io) {
            io.emit('bidUpdate', bid);
        }

        res.json({ message: "Bid successful", bid });
    } catch (error) {
        console.error({ msg: error.errors });
        res.status(500).send({ error: "Server error" });
    }
}

};

module.exports = bidCtrl;
