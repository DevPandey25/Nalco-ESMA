const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    });

    // Assign globally to simplify multi-file background message passing
    global.io = io;

    io.on('connection', (socket) => {
        console.log(`🔌 Socket Client Connected: ${socket.id}`);

        // Client joins room specific to their roles or identifiers
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        socket.on('leaveRoom', (room) => {
            socket.leave(room);
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Socket Client Disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized.');
    }
    return io;
};

module.exports = { initSocket, getIO };
