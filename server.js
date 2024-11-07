const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname)));

let isFirst = true;
let players = { "A": {}, "B": {} };
let countdown;

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected.`);
        for (const [room, clients] of socket.adapter.rooms) {
            if (typeof room === "number") console.log(room)
            socket.broadcast.to(room).emit('playerDisconnected', { id: socket.id });
            io.to(room).emit('stop');
            console.log(`Fight interrupted in room ${room}.`);
        }
        players = { "A": {}, "B": {} };
        isFirst = true;
        if (countdown) {
            clearInterval(countdown);
            countdown = null;
        }
    });

    socket.on('whereIsMyPlayerId', (msg) => {
        const playerId = isFirst ? "A" : "B"
        socket.join(msg.roomId);
        io.to(msg.roomId).emit('whereIsMyPlayerId', playerId);
        console.log(`Socket ${socket.id} joined room ${msg.roomId} as player ${playerId}`);
        isFirst = !isFirst;
    });

    socket.on("myPlayerStats", (msg) => {
        players[msg.playerId] = msg.myPlayer;
        if (players["A"].id && players["B"].id && isFirst) {
            io.to(msg.roomId).emit('start', players);
            console.log(`Game started between players ${players["A"].id} and ${players["B"].id}`);
            startCountdown();
        }
    });

    socket.on('update', (msg) => {
        console.log(`Update from ${socket.id} :`, msg.A, msg.B);
        const msgSize = Buffer.byteLength(JSON.stringify(msg), 'utf8');
        console.log(`Packet size: ${msgSize} bytes`);
        io.to(msg.roomId).emit('update', { A: msg.A, B: msg.B });
    });
});

function startCountdown() {
    if (!countdown) countdown = setInterval(() => io.emit("move"), 50);
}

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
