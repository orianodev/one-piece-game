"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIOListener = socketIOListener;
let gameStateCollection = {};
const socketRoomMap = new Map();
function socketIOListener(socket, io) {
    console.log(`User ${socket.id} connected`);
    socket.on('askId', (roomId) => {
        if (!gameStateCollection[roomId]) {
            gameStateCollection[roomId] = { 1: {}, 2: {} };
        }
        const thisGameState = gameStateCollection[roomId];
        if (Object.keys(thisGameState[1]).length > 0 && Object.keys(thisGameState[2]).length > 0) {
            socket.emit("busy");
        }
        else {
            socketRoomMap.set(socket.id, roomId);
            const playerId = Object.keys(thisGameState[1]).length > 0 ? 2 : 1;
            socket.join(roomId.toString());
            socket.emit('getId', playerId);
            console.log(`Socket ${socket.id} joined room ${roomId} as player ${playerId}`);
        }
    });
    socket.on("postPlayer", (msg) => {
        console.log(`Player ${msg.playerId} added his player infos in room ${msg.roomId}`);
        if (gameStateCollection[msg.roomId]) {
            gameStateCollection[msg.roomId][msg.playerId] = msg.player;
            const thisGameState = gameStateCollection[msg.roomId];
            if (Object.keys(thisGameState[1]).length > 0 && Object.keys(thisGameState[2]).length > 0) {
                io.to(msg.roomId.toString()).emit('start', gameStateCollection[msg.roomId]);
                console.log(`Game started in room ${msg.roomId}.`);
            }
        }
        else
            console.error(`The room ${msg.roomId} does not exist.`);
        console.log(gameStateCollection);
    });
    socket.on('update', (msg) => {
        if (msg[1][4] <= 0 || msg[2][4] <= 0) {
            io.to(msg.roomId.toString()).emit('over', msg[1][4] <= 0 ? 2 : 1);
            console.log(`Game over in room ${msg.roomId}.`);
            setTimeout(() => delete gameStateCollection[msg.roomId], 1000);
        }
        else {
            console.log(`Update from ${socket.id} :`, msg[1], msg[2]);
            console.log(`Packet Size: ${Buffer.byteLength(JSON.stringify(msg))} bytes.`);
            io.to(msg.roomId.toString()).emit('update', { 1: msg[1], 2: msg[2] });
        }
    });
    socket.on('disconnect', (reason) => {
        const roomToClear = socketRoomMap.get(socket.id);
        console.log(`Fight interrupted in room ${roomToClear || "(local)"} by ${socket.id} disconnected for ${reason}.`);
        if (roomToClear) {
            io.to(roomToClear.toString()).emit('stop');
            socketRoomMap.delete(socket.id);
            for (const [socketID, roomID] of socketRoomMap) {
                if (roomID === roomToClear) {
                    io.to(socketID).emit('stop');
                    socketRoomMap.delete(socketID);
                }
            }
            delete gameStateCollection[roomToClear];
            console.log(`Game state after deletion: ${gameStateCollection}\nSocket map after deletion:${socketRoomMap}`);
        }
    });
}
