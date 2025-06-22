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

    const bid = await bids.findById(bidId)
      .populate('participantIds')
      .populate('enchérissement.participant'); // utile si tu veux accéder aux objets complets dans enchérissement

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

    const isFinalBid = (bid.highestBid || 0) + amount >= bid.prixMazedAchat;

    // Création d’un nouvel encherissement
    const encherissement = {
      participant: balance.user,
      heureMajoration: Date.now(),
      valeurMajorationUser: amount,
      montantTot: (bid.highestBid || 0) + amount
    };

    bid.highestBid = encherissement.montantTot;
    bid.highestBidder = balance.user._id;
    bid.datefermeture = new Date(Date.now() + bid.extensionTime * 1000);
    bid.enchérissement.unshift(encherissement);

    if (isFinalBid) {
      bid.status = "Terminée";
      bid.datefermeture = new Date();
    }

    await bid.save({ validateBeforeSave: false });

    // Débit du solde Mazed
    balance.soldeMazed -= amount;
    await balance.save();

    // Enregistrement de la transaction pour le clic
    const transaction = new Transaction({
      acheteur: balance.user,
      montantTransaction: amount,
      actionTransaction: "clic dans une enchère"
    });
    await transaction.save();

    // 🚨 Traitement de remboursement si enchère terminée
    if (isFinalBid) {
      const remboursements = {};

      for (const ench of bid.enchérissement) {
        const user = ench.participant;
        if (!user || user._id.toString() === bid.highestBidder.toString()) continue;

        const userId = user._id.toString();
        if (!remboursements[userId]) {
          remboursements[userId] = {
            user,
            montant: 0
          };
        }

        remboursements[userId].montant += ench.valeurMajorationUser;
      }

      for (const userId in remboursements) {
        const { user, montant } = remboursements[userId];

        const solde = await Solde.findOne({ 'user._id': user._id });
        if (solde) {
          solde.soldeAquisition += montant;
          await solde.save();
        } else {
          console.warn(`⚠️ Solde introuvable pour l'utilisateur ${user.pseudo || user._id}`);
        }
      }
    }

    // Émission de mise à jour via WebSocket
    const io = getIo();
    if (io) {
      io.emit('bidUpdate', bid);
    }

    res.json({
      message: isFinalBid
        ? "Bid ended as highest bid reached the purchase price. Remboursements effectués."
        : "Bid successful",
      bid
    });

  } catch (error) {
    console.error({ msg: error.errors || error });
    res.status(500).send({ error: "Server error" });
  }
}


};

module.exports = bidCtrl;
