const { Server } = require('socket.io');

let io; // Define io outside of the function to make it accessible in the exports

function initializeSocket(server) {
    io = new Server(server); // Assign io to the created Server instance

    io.on('connection', (socket) => {
        console.log('Connected');
        socket.id = "user" + Math.random();
        console.log(`User connected: ${socket.id}`);

        socket.on('msg_from_client', (from, msg) => {
            console.log(`Message from user ${socket.id}: ${from}`, msg);
            io.emit('message', 'Hello, specific user!');
        });

        socket.on('establish_connection', (token) => {
            const userToken = token.accesstoken;
            console.log("userToken:", userToken);
        });

        socket.on('disconnect', () => {
            console.log("User disconnected");
        });
    });
}

module.exports = {
    initializeSocket,
    getIo: () => io, // Exporting io here to make it accessible outside of this module
};
