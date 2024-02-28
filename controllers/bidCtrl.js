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
    io.on("connection" , (socket)=>{
      console.log('new user is connected with' , socket.id)
      io.emit("bidupadte" , socket.id)
  })
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
mise : async (req, res) => {
    try {
        const { bidId, amount } = req.body;
        const userId = req.kauth.grant.access_token.content.sub;

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
        if (new Date() >= bid.endTime) {
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

misse : (req,res)=>{
  try {
    
  } catch (error) {
    
  }
}

};

module.exports = bidCtrl;
