import { DefaultEventsMap, DisconnectReason, Server, Socket } from "socket.io";

export function socketIOListener(socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, gameStateCollection: GameStateCollection) {
    console.log(`User ${socket.id} connected`);

    socket.on('disconnect', (reason: DisconnectReason) => {
        let roomId: RoomID;
        // @ts-expect-error
        for (const [room, clients] of socket.adapter.rooms) {
            if (!isNaN(parseInt(room))) {
                roomId = room;
                io.to(room).emit('stop');
                console.log(`Fight interrupted in room ${room} by ${socket.id} disconnected for ${reason}.`);
                delete gameStateCollection[roomId]
            }
        }
    });

    socket.on('askId', (roomId: RoomID) => {
        if (!gameStateCollection[roomId]) gameStateCollection[roomId] = { A: {}, B: {} };
        const thisGameState = gameStateCollection[roomId] as GameState;
        if (Object.keys(thisGameState.A).includes("id") && Object.keys(thisGameState.B).includes("id")) {
            socket.emit("busy")
        } else {
            const playerId: PlayerId = Object.keys(thisGameState.A).includes("id") ? "B" : "A";
            socket.join(roomId.toString());
            socket.emit('getId', playerId);
            console.log(`Socket ${socket.id} joined room ${roomId} as player ${playerId}`);
        }
    });

    socket.on("postPlayer", (msg: { thisPlayer: Player, roomId: RoomID, playerId: PlayerId }) => {
        console.log(`Player ${msg.playerId} added his players stats in room ${msg.roomId}`);
        if (gameStateCollection[msg.roomId]) {
            gameStateCollection[msg.roomId]![msg.playerId] = msg.thisPlayer
            const thisGameState = gameStateCollection[msg.roomId] as { A: PlayerAttributes, B: PlayerAttributes };
            if (Object.keys(thisGameState.A).includes("id") && Object.keys(thisGameState.B).includes("id")) {
                io.to(msg.roomId.toString()).emit('start', gameStateCollection[msg.roomId]);
                console.log(`Game started between players ${thisGameState.A.id} and ${thisGameState.B.id}`);
            }
        } else console.error(`The room ${msg.roomId} does not exist.`);
        console.log(gameStateCollection);

    });

    socket.on('update', (msg: { roomId: RoomID, A: PlayerAttributesDeltasTuple, B: PlayerAttributesDeltasTuple }) => {
        if (msg.A[4] <= 0 || msg.B[4] <= 0) {
            io.to(msg.roomId.toString()).emit('over', msg.A[4] <= 0 ? "B" : "A");
            console.log(`Game over in room ${msg.roomId}.`);
            setTimeout(() => delete gameStateCollection[msg.roomId], 500); // Delay to ensure event reaches all clients
        }
        console.log(`Update from ${socket.id} :`, msg.A, msg.B);
        const sizeA = Buffer.byteLength(JSON.stringify(msg.A), 'utf8');
        const sizeB = Buffer.byteLength(JSON.stringify(msg.B), 'utf8');
        console.log(`Update from ${socket.id} | Packet Size: A = ${sizeA} bytes, B = ${sizeB} bytes`);
        io.to(msg.roomId.toString()).emit('update', { A: msg.A, B: msg.B });
    });
}