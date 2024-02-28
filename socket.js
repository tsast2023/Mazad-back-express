const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const globalMap = require('./globalMap')
let io; // Initialize a variable to hold the io instance
var skid = ""
function addToOnlineUsers(key, value) {
    if (globalMap.has(key)) {
      
      const existingValues = globalMap.get(key);
      existingValues.push(value);
    }else {
      globalMap.set(key, [value]);
      }
    }
    function deleteValueFromGlobalMap(value) {
        globalMap.forEach((values, key) => {
          const index = values.indexOf(value);
          if (index !== -1) {
            values.splice(index, 1);
            if (values.length === 0) {
              // If there are no more values for the key, remove the key from the map
              globalMap.delete(key);
            }
          }
        });
    }
function initializeSocket(server) {
    io = require("socket.io")(server ,{cors:{origin:"*"}} );



io.on('connection', function(socket){	
    console.log('Connected');
    
    console.log(`User connected: ${socket.id}`);

    socket.on('msg_from_client', function(from,msg){

      console.log(`Message from user ${socket.id} `+from, msg);
      io.to(socket.id).emit('message', 'Hello, specific user!');
    })

    socket.on('establish_connection', function(token){
      const userToken=token.accesstoken;
      console.log(userToken)
      try {
        // const decodedToken = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
        // const userId = decodedToken.user.id; 
        const userIdd = "useriddddd"
        if (userIdd) {
            console.log("User ID:", userIdd);

            addToOnlineUsers(userIdd,socket.id);
            globalMap.forEach((value, key) => {
            console.log(`Key: ${key}, Value: ${value}`);
            });

        } else {
            console.log("User ID not found in the token.");
        }
        } catch (error) {
        console.error("Error decoding token:", error.message);
        }
    })
   

    socket.on('disconnect', function(msg){


        console.log("deleting user");
        deleteValueFromGlobalMap(socket.id);
        console.log(`User: ${socket.id} disconnected `);
        globalMap.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${value}`);
        });

    })
    
});

}


module.exports = {
    initializeSocket,
    getIo: () => io,
    socketid: ()=>skid,
    addToOnlineUsers : addToOnlineUsers,
}
