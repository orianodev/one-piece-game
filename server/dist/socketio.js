"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIOListener = socketIOListener;
let gameStateCollection = {};
const socketRoomMap = new Map();
function socketIOListener(socket, io) {
    console.log(`User ${socket.id} connected`);
    socket.on('disconnect', (reason) => {
        const roomToClear = socketRoomMap.get(socket.id);
        console.log(`Fight interrupted in room ${roomToClear} by ${socket.id} disconnected for ${reason}.`);
        if (roomToClear) {
            io.to(roomToClear.toString()).emit('stop');
            console.log(`\n\nFight interrupted in room ${roomToClear} by ${socket.id} disconnected for ${reason}.`);
            socketRoomMap.delete(socket.id);
            for (const [socketID, roomID] of socketRoomMap) {
                if (roomID === roomToClear) {
                    io.to(socketID).emit('stop');
                    socketRoomMap.delete(socketID);
                }
            }
            delete gameStateCollection[roomToClear];
            console.log("Game state after deletion:", gameStateCollection, "Socket map after deletion:", socketRoomMap);
        }
    });
    socket.on('askId', (roomId) => {
        socketRoomMap.set(socket.id, roomId);
        console.log(socketRoomMap);
        if (!gameStateCollection[roomId]) {
            gameStateCollection[roomId] = { A: {}, B: {} };
        }
        ;
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
        const startTime = performance.now();
        if (msg.A[4] <= 0 || msg.B[4] <= 0) {
            io.to(msg.roomId.toString()).emit('over', msg.A[4] <= 0 ? "B" : "A");
            console.log(`Game over in room ${msg.roomId}.`);
            setTimeout(() => delete gameStateCollection[msg.roomId], 500);
        }
        console.log(`Update from ${socket.id} :`, msg.A, msg.B);
        const size = Buffer.byteLength(JSON.stringify(msg));
        console.log(`Packet Size: ${size} bytes.`);
        io.to(msg.roomId.toString()).emit('update', { A: msg.A, B: msg.B });
        const endTime = performance.now();
        console.log(`Update handling time: ${endTime - startTime} ms`);
    });
}
