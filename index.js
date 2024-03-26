const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const bidRoute = require('./routes/BidRoute');
const mongoose = require('mongoose');
const { initializeSocket } = require('./socket');
const session = require('express-session')
const Redis = require('ioredis')
const RedisStore = require('connect-redis').default;






const app = express();
const server = http.createServer(app);
const redisClient = new Redis();
require('dotenv').config();



// Connect to MongoDB
mongoose.connect("mongodb+srv://tsast2023:ydNrpqZADUIYJP3y@cluster0.b7tqviv.mongodb.net/MAZAD?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
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

// Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
