const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve static files directly from the public folder
app.use(express.static(join(__dirname)));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('update', (msg) => {
        console.log(`Update from ${socket.id} :`, msg);
        const msgSize = Buffer.byteLength(JSON.stringify(msg), 'utf8');
        console.log(`Packet size: ${msgSize} bytes`);
        io.to("room1").emit('update', msg);
    });

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
    });
});


setInterval(() => io.emit("move", ""), 100);

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});