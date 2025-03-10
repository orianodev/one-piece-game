import { DefaultEventsMap, DisconnectReason, Server, Socket } from "socket.io";
import { GameState, GameStateCollection, PlayerId, PostMessage, RoomID, UpdateMessage } from "../../shared/Types";

let gameStateCollection: GameStateCollection = {};
const socketRoomMap: Map<string, RoomID> = new Map();

export function socketIOListener(socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    console.log(`User ${socket.id} connected`);

    socket.on('askId', (roomId: RoomID) => {
        // Create room if it does not exist
        if (!gameStateCollection[roomId]) {
            gameStateCollection[roomId] = { p1: {}, p2: {} };
        }
        // Check if room is full
        const thisGameState = gameStateCollection[roomId] as GameState;
        if (Object.keys(thisGameState.p1).length > 0 && Object.keys(thisGameState.p2).length > 0) {
            socket.emit("busy")
        }
        else {
            // Register player
            socketRoomMap.set(socket.id, roomId);
            const playerId: PlayerId = Object.keys(thisGameState.p1).length > 0 ? "p2" : "p1";
            socket.join(roomId.toString());
            socket.emit('getId', playerId);
            console.log(`\nSocket ${socket.id} joined room ${roomId} as player ${playerId}`);
        }
    });

    socket.on("postPlayer", (msg: PostMessage) => {
        console.log(`Player ${msg.playerId} added his player infos in room ${msg.roomId}`);
        // Register player infos
        if (gameStateCollection[msg.roomId]) {
            gameStateCollection[msg.roomId]![msg.playerId] = msg.player
            const thisGameState = gameStateCollection[msg.roomId] as GameState;
            // Start game if both players are registered
            if (Object.keys(thisGameState.p1).length > 0 && Object.keys(thisGameState.p2).length > 0) {
                io.to(msg.roomId.toString()).emit('start', gameStateCollection[msg.roomId]);
                console.log(`Game started in room ${msg.roomId}.`);
                console.log(gameStateCollection);
            }
        } else console.error(`The room ${msg.roomId} does not exist.`);

    });

    socket.on('update', (msg: UpdateMessage) => {
        // Check if one player is KO
        if (msg.p1[4] <= 0 || msg.p2[4] <= 0) {
            io.to(msg.roomId.toString()).emit('over', msg.p1[4] <= 0 ? "p2" : "p1");
            setTimeout(() => {
                delete gameStateCollection[msg.roomId]
                console.log(`Game over in room ${msg.roomId}.`);
            }, 1000); // Delay to ensure event reaches all clients
        }
        else {
            // Send game state to clients
            console.log(`Update by ${socket.id} (${Buffer.byteLength(JSON.stringify(msg))}b):\t${JSON.stringify(msg.p1)}\t${JSON.stringify(msg.p2)}`);
            io.to(msg.roomId.toString()).emit('update', { "p1": msg.p1, "p2": msg.p2 });
        }
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
            delete gameStateCollection[roomToClear];
            // console.log("Game state after deletion:");
            // console.log(gameStateCollection);
            // console.log("Socket map after deletion:");
            // console.log(socketRoomMap);
        }
    });

    socket.on("test", (msg: any) => {
        console.log(`Test from ${socket.id} :`, msg);
    });
}