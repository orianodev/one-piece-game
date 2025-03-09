"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIOListener = socketIOListener;
let gameStateCollection = {};
const socketRoomMap = new Map();
function socketIOListener(socket, io) {
    console.log(`User ${socket.id} connected`);
    socket.on('askId', (roomId) => {
        if (!gameStateCollection[roomId]) {
            gameStateCollection[roomId] = { p1: {}, p2: {} };
        }
        const thisGameState = gameStateCollection[roomId];
        if (Object.keys(thisGameState.p1).length > 0 && Object.keys(thisGameState.p2).length > 0) {
            socket.emit("busy");
        }
        else {
            socketRoomMap.set(socket.id, roomId);
            const playerId = Object.keys(thisGameState.p1).length > 0 ? "p2" : "p1";
            socket.join(roomId.toString());
            socket.emit('getId', playerId);
            console.log(`\nSocket ${socket.id} joined room ${roomId} as player ${playerId}`);
        }
    });
    socket.on("postPlayer", (msg) => {
        console.log(`Player ${msg.playerId} added his player infos in room ${msg.roomId}`);
        if (gameStateCollection[msg.roomId]) {
            gameStateCollection[msg.roomId][msg.playerId] = msg.player;
            const thisGameState = gameStateCollection[msg.roomId];
            if (Object.keys(thisGameState.p1).length > 0 && Object.keys(thisGameState.p2).length > 0) {
                io.to(msg.roomId.toString()).emit('start', gameStateCollection[msg.roomId]);
                console.log(`Game started in room ${msg.roomId}.`);
            }
        }
        else
            console.error(`The room ${msg.roomId} does not exist.`);
        console.log(gameStateCollection);
    });
    socket.on('update', (msg) => {
        if (msg.p1[4] <= 0 || msg.p2[4] <= 0) {
            io.to(msg.roomId.toString()).emit('over', msg.p1[4] <= 0 ? "p2" : "p1");
            console.log(`Game over in room ${msg.roomId}.`);
            setTimeout(() => delete gameStateCollection[msg.roomId], 1000);
        }
        else {
            console.log(`Update from ${socket.id} :\n${JSON.stringify(msg.p1)}\n${JSON.stringify(msg.p2)}`);
            console.log(`Packet Size: ${Buffer.byteLength(JSON.stringify(msg))} bytes.`);
            io.to(msg.roomId.toString()).emit('update', { "p1": msg.p1, "p2": msg.p2 });
        }
    });
    socket.on('disconnect', (reason) => {
        const roomToClear = socketRoomMap.get(socket.id);
        console.log(`Fight interrupted in room ${roomToClear} by ${socket.id} disconnected for ${reason}.`);
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
            console.log("Game state after deletion:");
            console.log(gameStateCollection);
            console.log("Socket map after deletion:");
            console.log(socketRoomMap);
        }
    });
    socket.on("test", (msg) => {
        console.log(`Test from ${socket.id} :`, msg);
    });
}
