import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server, DisconnectReason, Socket } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname)));

let gameStateCollection: GameStateCollection = {};

io.on('connection', (socket: Socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('disconnect', (reason: DisconnectReason) => {
        let roomToStop: RoomID;
        // @ts-ignore
        for (const [room, clients] of socket.adapter.rooms) {
            if (!Number.isNaN(parseInt(room))) {
                roomToStop = room;
                io.to(room.toString()).emit('stop');
                console.log(`Fight interrupted in room ${room} by ${socket.id} disconnected for ${reason}.`);
                delete gameStateCollection[roomToStop]
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
            delete gameStateCollection[msg.roomId]
            console.log(`Game over in room ${msg.roomId}.`);
        }
        console.log(`Update from ${socket.id} :`, msg.A, msg.B);
        const packetSize = Buffer.byteLength(JSON.stringify(msg), 'utf8');
        console.log(`Packet size: ${packetSize} bytes`);
        io.to(msg.roomId.toString()).emit('update', { A: msg.A, B: msg.B });
    });
});

server.listen(3000, () => console.log('server running at http://localhost:3000'));