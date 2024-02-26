const express = require('express');
const app = express();
const mongoose = require('mongoose')
const http = require('http');
const socketIo = require('socket.io');
mongoose.connect("mongodb+srv://tsast2023:ydNrpqZADUIYJP3y@cluster0.b7tqviv.mongodb.net/MAZAD?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log('data base is connected')).catch((err)=>console.log(err.message))












const PORT = 7000
app.listen(PORT, ()=>console.log("server is running on port" ,  PORT))