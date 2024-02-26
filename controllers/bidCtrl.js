const bids = require("../models/Bid.model");


async function findBalanceByUserId(userId) {
    const user = await User.findById(userId);
    return user ? user.balance : null; 
}


const bidCtrl = {
  getAll: async (req, res) => {
    try {
      const bidss = await bids.find();
      res.json({ allbids: bidss });
    } catch (error) {
      console.log({ msg: error });
      res.status(500).send({ error: "Server error" });
    }
  },
  participate: async (req, res) => {
    try {
      const { bidId } = req.params;
      const userId = req.kauth.grant.access_token.content.sub;

      // Check user balance
      const balance = await findBalanceByUserId(userId);
      if (balance < requiredBalanceForParticipation) {
        // Define this threshold as per your app's logic
        return res
          .status(403)
          .send({ error: "Insufficient balance to participate" });
      }

      const bid = await bids.findById(bidId);
      if (!bid) {
        return res.status(404).send({ error: "Bid not found" });
      }

      if (bid.participants.includes(userId)) {
        return res.status(400).send({ error: "User already participating" });
      }
      bid.participants.push(userId);
      await bid.save();

      res.json({ message: "Participation successful" });
    } catch (error) {
      console.log({ msg: error });
      res.status(500).send({ error: "Server error" });
    }
  },
  join: async (req, res) => {
    try {
      const { bidId } = req.params; 

      if (!req.kauth.grant.access_token.hasRole("bidder")) {
        return res.status(403).send({ error: "Insufficient permissions" });
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
      const userId = req.kauth.grant.access_token.content.sub;

      // Check user balance
      const balance = await findBalanceByUserId(userId);
      if (balance < amount) {
        // Assuming the bid amount cannot exceed the user's current balance
        return res
          .status(403)
          .send({ error: "Insufficient balance for this bid" });
      }

      const bid = await bids.findById(bidId);
      if (!bid) {
        return res.status(404).send({ error: "Bid not found" });
      }

      if (amount <= bid.highestBid) {
        return res
          .status(400)
          .send({ error: "Bid must be higher than current highest bid" });
      }
      bid.highestBid = amount;
      bid.highestBidder = userId;
      await bid.save();

      res.json({ message: "Bid successful", newHighestBid: amount });
    } catch (error) {
      console.log({ msg: error });
      res.status(500).send({ error: "Server error" });
    }
  },
};

module.exports = bidCtrl;
