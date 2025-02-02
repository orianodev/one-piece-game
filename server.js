"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const node_path_1 = require("node:path");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
app.get("/", (req, res) => res.sendFile((0, node_path_1.join)(__dirname, "views/index.html")));
app.get("/commands", (req, res) => res.sendFile((0, node_path_1.join)(__dirname, "views/commands.html")));
app.get("/settings", (req, res) => res.sendFile((0, node_path_1.join)(__dirname, "views/settings.html")));
app.get("/play", (req, res) => res.sendFile((0, node_path_1.join)(__dirname, "views/play.html")));
app.use(express_1.default.static((0, node_path_1.join)(__dirname)));
let gameStateCollection = {};
io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    socket.on('disconnect', (reason) => {
        let roomToStop;
        for (const [room, clients] of socket.adapter.rooms) {
            if (!Number.isNaN(parseInt(room))) {
                roomToStop = room;
                io.to(room.toString()).emit('stop');
                console.log(`Fight interrupted in room ${room} by ${socket.id} disconnected for ${reason}.`);
                delete gameStateCollection[roomToStop];
            }
        }
    });
    socket.on('askId', (roomId) => {
        if (!gameStateCollection[roomId])
            gameStateCollection[roomId] = { A: {}, B: {} };
        const thisGameState = gameStateCollection[roomId];
        if (Object.keys(thisGameState.A).includes("id") && Object.keys(thisGameState.B).includes("id")) {
            socket.emit("busy");
        }
        else {
            const playerId = Object.keys(thisGameState.A).includes("id") ? "B" : "A";
            socket.join(roomId.toString());
            socket.emit('getId', playerId);
            console.log(`Socket ${socket.id} joined room ${roomId} as player ${playerId}`);
        }
    });
    socket.on("postPlayer", (msg) => {
        console.log(`Player ${msg.playerId} added his players stats in room ${msg.roomId}`);
        if (gameStateCollection[msg.roomId]) {
            gameStateCollection[msg.roomId][msg.playerId] = msg.thisPlayer;
            const thisGameState = gameStateCollection[msg.roomId];
            if (Object.keys(thisGameState.A).includes("id") && Object.keys(thisGameState.B).includes("id")) {
                io.to(msg.roomId.toString()).emit('start', gameStateCollection[msg.roomId]);
                console.log(`Game started between players ${thisGameState.A.id} and ${thisGameState.B.id}`);
            }
        }
        else
            console.error(`The room ${msg.roomId} does not exist.`);
        console.log(gameStateCollection);
    });
    socket.on('update', (msg) => {
        if (msg.A[4] <= 0 || msg.B[4] <= 0) {
            io.to(msg.roomId.toString()).emit('over', msg.A[4] <= 0 ? "B" : "A");
            delete gameStateCollection[msg.roomId];
            console.log(`Game over in room ${msg.roomId}.`);
        }
        console.log(`Update from ${socket.id} :`, msg.A, msg.B);
        const packetSize = Buffer.byteLength(JSON.stringify(msg), 'utf8');
        console.log(`Packet size: ${packetSize} bytes`);
        io.to(msg.roomId.toString()).emit('update', { A: msg.A, B: msg.B });
    });
});
server.listen(3000, () => console.log('server running at http://localhost:3000'));
