const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const bidRoute = require('./routes/BidRoute');
const mongoose = require('mongoose');
const { initializeSocket } = require('./socket');
const session = require('express-session')
const Redis = require('ioredis')
const cron = require('node-cron');
const Enchere = require("./models/Bid.model")
const RedisStore = require('connect-redis').default;
const app = express();
const sendEmail = require('./sendEmail')
const server = http.createServer(app);
const redisClient = new Redis();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect("mongodb+srv://brahimsarah43:MazedImmobilier@cluster0.osk4g2r.mongodb.net/MazedImmobilier?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));



initializeSocket(server)
app.use(
    session({
      secret: "Session",
      credentials: true,
      name: "sid",
      store: new RedisStore({client:redisClient}),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
        httpOnly: true,
        expires: 1000 * 60 * 60 * 24 * 7,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
      },
    })
  );
// Routes
app.use('/bid', bidRoute);
cron.schedule('* * * * *', async () => {
  try {
    console.log("Cron job started");
    
    const expiredBids = await Enchere.find({
      datefermeture: { $lte: new Date() },
      SmsSent: { $ne: true }, // Ensure email hasn't already been sent
    }).populate('highestBidder'); // Ensure you get highestBidder details

    console.log(`Found ${expiredBids.length} expired bids`);

    for (const bid of expiredBids) {
      console.log(`Processing bid with id: ${bid._id}`);
      
      if (bid.highestBidder && bid.highestBidder.email) {
        console.log(`Sending email to ${bid.highestBidder.email}`);

        // Send an email to the highest bidder
        sendEmail(
          bid.highestBidder.email,
          'Congratulations! You won the bid!',
          `Dear ${bid.highestBidder.name},\n\nYou have won the bid with an amount of ${bid.highestBid}.`
        );
        
        // Mark the bid as email sent
        bid.SmsSent = true;
        await bid.save();
        console.log(`Email sent and bid updated: ${bid._id}`);
      } else {
        console.log(`No highest bidder or no email for bid: ${bid._id}`);
      }
    }

    console.log("Cron job finished");
  } catch (error) {
    console.log('Error in cron job:', error);
  }
});

// Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
