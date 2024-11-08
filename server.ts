import { DisconnectReason, Socket } from "socket.io";

import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname)));

type PlayerAttributes = {
    [K in keyof Player]: Player[K] extends Function ? never : Player[K];
}
type GameState = { A: PlayerAttributes | {}, B: PlayerAttributes | {}, countdown: NodeJS.Timeout | null }
type RoomID = number;


let gameStateArray: { [key: RoomID]: GameState } = {};

function resetGame(roomId: RoomID) {
    if (gameStateArray[roomId] && gameStateArray[roomId].countdown) {
        clearInterval(gameStateArray[roomId].countdown);
    }
    delete gameStateArray[roomId]
}

io.on('connection', (socket: Socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('disconnect', (reason: DisconnectReason) => {
        console.log(`User ${socket.id} disconnected for ${reason}`);
        // @ts-ignore
        // for (const [room, clients] of socket.adapter.rooms) {
        //     if (typeof room === "number") console.log(room)
        //     socket.broadcast.to(room).emit('playerDisconnected', { id: socket.id });
        //     io.to(room).emit('stop');
        //     console.log(`Fight interrupted in room ${room}.`);
        // }
        // resetGame();
    });

    socket.on('askId', (msg: { roomId: number }) => {
        if (!gameStateArray[msg.roomId]) gameStateArray[msg.roomId] = { A: {}, B: {}, countdown: null };
        const thisGameState = gameStateArray[msg.roomId] as GameState;
        if (Object.keys(thisGameState.A).includes("id")) {

        }
        socket.join(msg.roomId);
        io.to(msg.roomId).emit('getId', playerId);
        console.log(`Socket ${socket.id} joined room ${msg.roomId} as player ${playerId}`);
    });

    socket.on("postPlayer", (msg: { thisPlayer: Player, roomId: number, playerId: PlayerId }) => {
        console.log("giving this player stats");
        players[msg.playerId] = msg.myPlayer;
        if (players["A"].id && players["B"].id && isFirst) {
            io.to(msg.roomId).emit('start', players);
            console.log(`Game started between players ${players["A"].id} and ${players["B"].id}`);
            startCountdown();
        }
    });

    socket.on('update', (msg: { roomId: number, A: Player, B: Player }) => {
        if (msg.A.hp <= 0 || msg.B.hp <= 0) {
            console.log(`Game over between players ${players["A"].id} and ${players["B"].id}`);
            io.to(msg.roomId).emit('over', { id: msg.A.hp <= 0 ? "B" : "A", name: msg.A.hp <= 0 ? msg.B.characterName : msg.A.characterName });
            resetGame();
        }
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
