"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIOListener = socketIOListener;
function socketIOListener(socket, io, gameStateCollection) {
    console.log(`User ${socket.id} connected`);
    socket.on('disconnect', (reason) => {
        let roomId;
        for (const [room, clients] of socket.adapter.rooms) {
            if (!isNaN(parseInt(room))) {
                roomId = room;
                io.to(room).emit('stop');
                console.log(`Fight interrupted in room ${room} by ${socket.id} disconnected for ${reason}.`);
                delete gameStateCollection[roomId];
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
            console.log(`Game over in room ${msg.roomId}.`);
            setTimeout(() => delete gameStateCollection[msg.roomId], 500);
        }
        console.log(`Update from ${socket.id} :`, msg.A, msg.B);
        const sizeA = Buffer.byteLength(JSON.stringify(msg.A), 'utf8');
        const sizeB = Buffer.byteLength(JSON.stringify(msg.B), 'utf8');
        console.log(`Update from ${socket.id} | Packet Size: A = ${sizeA} bytes, B = ${sizeB} bytes`);
        io.to(msg.roomId.toString()).emit('update', { A: msg.A, B: msg.B });
    });
}
