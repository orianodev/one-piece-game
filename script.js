"use strict";
// @ts-ignore
const socket = io();
class Player {
    constructor(name, hp, x, y) {
        this.name = name;
        this.hp = hp;
        this.x = x;
        this.y = y;
    }
    moveUp() {
        this.y++;
        emitAfterMove();
    }
    moveDown() {
        this.y--;
        emitAfterMove();
    }
    moveRight() {
        this.x++;
        emitAfterMove();
    }
    moveLeft() {
        this.x--;
        emitAfterMove();
    }
}
let player;
let playerA;
let playerB;
const joinBtn = document.querySelector("#join");
const pickA = document.querySelector("#pickA");
const pickB = document.querySelector("#pickB");
const showPlayer = document.querySelector("#showPlayer");
const aX = document.querySelector("#aX");
const aY = document.querySelector("#aY");
const bX = document.querySelector("#bX");
const bY = document.querySelector("#bY");
joinBtn.addEventListener("click", (e) => {
    socket.emit("joinRoom", "room1");
});
pickA.addEventListener("click", (e) => {
    player = new Player("A", 100, 0, 0);
    showPlayer.innerText = player.name;
});
pickB.addEventListener("click", (e) => {
    player = new Player("B", 100, 0, 0);
    ;
    showPlayer.innerText = player.name;
});
function emitAfterMove() {
    console.log(player, playerA, playerB);
    if (player.name == "A") {
        console.log("Emit inc for :", player);
        socket.emit("move", { A: player, B: playerB });
    }
    else if (player.name == "B") {
        console.log("Emit inc for :", player);
        socket.emit("move", { A: playerA, B: player });
    }
}
;
socket.on("move", (msg) => {
    playerA = msg.A;
    aX.innerText = playerA.x.toString();
    aY.innerText = playerA.y.toString();
    playerB = msg.B;
    bX.innerText = playerB.x.toString();
    bY.innerText = playerB.y.toString();
});
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            player.moveUp();
            break;
        case "ArrowDown":
            player.moveDown();
            break;
        case "ArrowRight":
            player.moveRight();
            break;
        case "ArrowLeft":
            player.moveLeft();
            break;
    }
});
