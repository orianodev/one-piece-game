import { DefaultEventsMap, DisconnectReason, Server, Socket } from "socket.io";
import { GameState, GameStateCollection, PlayerAttributes, PlayerAttributesTuple, PlayerId, RoomID } from "../../shared/Types";

let gameStateCollection: GameStateCollection = {};
const socketRoomMap: Map<string, RoomID> = new Map();

export function socketIOListener(socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    console.log(`User ${socket.id} connected`);

    socket.on('askId', (roomId: RoomID) => {
        socketRoomMap.set(socket.id, roomId);
        // console.log(socketRoomMap);
        if (!gameStateCollection[roomId]) {
            gameStateCollection[roomId] = { A: {}, B: {} }
        };
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

    socket.on("postPlayer", (msg: { thisPlayer: PlayerAttributes, roomId: RoomID, playerId: PlayerId }) => {
        console.log(`Player ${msg.playerId} added his player infos in room ${msg.roomId}`);
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

    socket.on('update', (msg: { roomId: RoomID, A: PlayerAttributesTuple, B: PlayerAttributesTuple }) => {
        const startTime = performance.now();

        if (msg.A[4] <= 0 || msg.B[4] <= 0) {
            io.to(msg.roomId.toString()).emit('over', msg.A[4] <= 0 ? "B" : "A");
            console.log(`Game over in room ${msg.roomId}.`);
            setTimeout(() => delete gameStateCollection[msg.roomId], 500); // Delay to ensure event reaches all clients
        }
        console.log(`Update from ${socket.id} :`, msg.A, msg.B);
        const size = Buffer.byteLength(JSON.stringify(msg));
        console.log(`Packet Size: ${size} bytes.`);
        io.to(msg.roomId.toString()).emit('update', { A: msg.A, B: msg.B });

        const endTime = performance.now();
        console.log(`Update handling time: ${endTime - startTime} ms`);
    });

    socket.on('disconnect', (reason: DisconnectReason) => {
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
            delete gameStateCollection[roomToClear]
            console.log("Game state after deletion:", gameStateCollection, "Socket map after deletion:", socketRoomMap);
        }
    });
}