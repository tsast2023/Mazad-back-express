const jwt = require('jsonwebtoken');
const {Server} = require('socket.io')

let io; // Define io outside of the function to make it accessible in the exports

function initializeSocket(server) {
// Use the Redis adapter with Socket.IO
const io = new Server(server);

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
}

module.exports = {
    initializeSocket,
    getIo: () => io, // Exporting io here to make it accessible outside of this module
};
