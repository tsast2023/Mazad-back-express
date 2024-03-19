const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const bidRoute = require('./routes/BidRoute');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect("mongodb+srv://tsast2023:ydNrpqZADUIYJP3y@cluster0.b7tqviv.mongodb.net/MAZAD?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// Create a Redis client
const redisClient = createClient({
    host: 'localhost',
    port: 6379,
});

// Handle Redis client errors
redisClient.on('error', function (err) {
    console.error('Redis client error:', err);
});

// Create a Redis adapter using the Redis client
const redisAdapter = createAdapter(redisClient);

// Use the Redis adapter with Socket.IO
const io = new Server(server , {adapter:redisAdapter});

// Socket.IO event handling
io.on('connection', function(socket) {
    console.log('Connected');
    console.log(`User connected: ${socket.id}`);

    socket.on('msg_from_client', function(from, msg) {
        console.log(`Message from user ${socket.id} ` + from, msg);
        io.to(socket.id).emit('message', 'Hello, specific user!');
    });

    socket.on('establish_connection', function(token) {
        const userToken = token.accesstoken;
        console.log("userToken");
    });

    socket.on('disconnect', function(msg) {
        console.log("deleting user");
    });
});

// Routes
app.use('/bid', bidRoute);

// Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
