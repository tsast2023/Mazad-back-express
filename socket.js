const { Server } = require('socket.io');
const RedisAdapter = require('socket.io-redis'); // Import the Redis adapter
const Redis = require('ioredis'); // Import ioredis to create a Redis client

let io;

function initializeSocket(server) {
    io = new Server(server);

    // // Create Redis clients
    // const pubClient = new Redis({
    //     host: 'clustercfg.redis-cache.k7pfd9.use1.cache.amazonaws.com', // Replace with your ElastiCache endpoint
    //     port: 6379,
    //     password: 'yourSecureAuthToken123', // Include this if you've set a password
    // });

    // const subClient = pubClient.duplicate(); // Duplicate the publisher client for subscription

    // // Use socket.io Redis adapter
    // io.adapter(RedisAdapter({ pubClient, subClient }));

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        
        socket.on('msg_from_client', (from, msg) => {
            console.log(`Message from user ${socket.id}: ${from}`, msg);

            // Emit the message to all connected clients
            io.emit('message', { from, text: msg });
        });

        socket.on('establish_connection', (token) => {
            const userToken = token.accesstoken;
            console.log("userToken:", userToken);
        });

        socket.on('disconnect', () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = {
    initializeSocket,
    getIo: () => io,
};
