const express = require('express');
const app = express();
const mongoose = require('mongoose')
const http = require('http');
const { Server } = require("socket.io");
const bidRoute = require('./routes/BidRoute')
const socket = require("./socket")
// sockeet
const server = require('http').createServer(app);
socket.initializeSocket(server);

mongoose.connect("mongodb+srv://tsast2023:ydNrpqZADUIYJP3y@cluster0.b7tqviv.mongodb.net/MAZAD?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log('data base is connected')).catch((err)=>console.log(err.message))



app.use('/bid' , bidRoute);








const PORT = 7000
server.listen(PORT, ()=>console.log("server is running on port" ,  PORT))