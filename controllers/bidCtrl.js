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
      const userId = req.user.id;
      const bid = await bids.findById(bidId);
      if (!bid) {
        return res.status(404).send({ error: "Bid not found" });
      }
      // Check user balance
      const balance = await findBalanceByUserId(userId);
      if (balance < bid.coutDeParticipation) {
        
        return res
          .status(403)
          .send({ error: "Insufficient balance to participate" });
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
        const { bidId, amount } = req.body;
        const userId = req.user.id;

        // Check user balance
        const balance = await findBalanceByUserId(userId);
        if (balance < amount) {
            return res.status(403).send({ error: "Insufficient balance for this bid" });
        }

        const bid = await bids.findById(bidId);
        if (!bid) {
            return res.status(404).send({ error: "Bid not found" });
        }

        // Check if the bid time has ended
        if (new Date() >= bid.dateFermeture) {
            return res.status(400).send({ error: "Bid time has ended" });
        }

        if (amount <= bid.highestBid) {
            return res.status(400).send({ error: "Bid must be higher than current highest bid" });
        }

        bid.highestBid = amount;
        bid.highestBidder = userId;

        // Extend the bid end time by the extensionTime
        // Assuming extensionTime is in minutes, convert it to milliseconds
        bid.endTime = new Date(bid.endTime.getTime() + bid.extensionTime * 60000);

        await bid.save();

        // Emit an event with the updated bid information, including the new end time
        io.emit('bidUpdate', { 
            bidId: bid._id, 
            highestBid: amount, 
            highestBidder: userId,
            endTime: bid.endTime 
        });

        res.json({ message: "Bid successful", newHighestBid: amount, newEndTime: bid.endTime });
    } catch (error) {
        console.log({ msg: error });
        res.status(500).send({ error: "Server error" });
    }
},

};

module.exports = bidCtrl;
