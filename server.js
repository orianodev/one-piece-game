const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => res.sendFile(join(__dirname, 'index.html')));
app.get('/style.css', (req, res) => res.sendFile(join(__dirname, 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(join(__dirname, 'script.js')));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('connection', (socket) => {
    socket.on('move', (msg) => {
        console.log("inc emitted for :", msg);
        io.to("room1").emit('move', msg);
    });
});

io.on('connection', (socket) => {
    // Listen for a 'joinRoom' event from the client
    socket.on('joinRoom', (room) => {
        socket.join(room); // Join the specified room
        console.log(`Socket ${socket.id} joined room ${room}`);
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});