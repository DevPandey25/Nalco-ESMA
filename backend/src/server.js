const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

// Connect to Database
connectDB();

const server = http.createServer(app);

// Initialize real-time WebSocket communication layer
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`
🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
📡 Listening on port ${PORT}
🔗 URL: http://localhost:${PORT}
    `);
});
