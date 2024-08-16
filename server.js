const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store usernames
const users = {};

// Handle incoming connections from clients
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle setting username
    socket.on('setUsername', (username) => {
        users[socket.id] = username;
        io.emit('updateUserList', Object.values(users));
    });

    // Handle incoming chat messages
    socket.on('chatMessage', (message) => {
        const username = users[socket.id] || 'Anonymous';
        io.emit('message', { username, text: message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete users[socket.id];
        io.emit('updateUserList', Object.values(users));
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
