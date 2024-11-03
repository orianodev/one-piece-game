"use strict";
// @ts-ignore
const socket = io();
// DOM
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const joinBtn = document.querySelector("#join");
const pickA = document.querySelector("#pickA");
const pickB = document.querySelector("#pickB");
const showPlayer = document.querySelector("#showPlayer");
const aX = document.querySelector("#aX");
const aY = document.querySelector("#aY");
const bX = document.querySelector("#bX");
const bY = document.querySelector("#bY");
// PLAYER
class Player {
    constructor(name, hp, x, y, spriteUrl) {
        this.name = name;
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.spriteUrl = spriteUrl;
    }
    moveUp() {
        if (this.y >= 0) {
            this.y -= 10;
            emitAfterMove();
        }
    }
    moveDown() {
        if (this.y <= canvas.height - 50) {
            this.y += 10;
            emitAfterMove();
        }
    }
    moveLeft() {
        if (this.x >= 0) {
            this.x -= 10;
            emitAfterMove();
        }
    }
    moveRight() {
        if (this.x <= canvas.width - 50) {
            this.x += 10;
            emitAfterMove();
        }
    }
}
// ROOM JOIN
joinBtn.addEventListener("click", (e) => {
    socket.emit("joinRoom", "room1");
});
// PLAYER PICK
let player;
let playerA;
let playerB;
pickA.addEventListener("click", (e) => {
    player = new Player("A", 100, 0, 0, "images/luffy.png");
    showPlayer.innerText = player.name;
});
pickB.addEventListener("click", (e) => {
    player = new Player("B", 100, 0, 0, "images/zoro.png");
    ;
    showPlayer.innerText = player.name;
});
// MOVE EMIT
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
// DRAW PLAYER
let spriteA;
let spriteB;
function createSprite(imageUrl) {
    const newSprite = new Image();
    newSprite.src = imageUrl;
    return newSprite;
}
// MOVE RECEIVE
socket.on("move", (msg) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerA = msg.A;
    aX.innerText = playerA.x.toString();
    aY.innerText = playerA.y.toString();
    spriteA = createSprite(playerA.spriteUrl);
    ctx.drawImage(spriteA, playerA.x, playerA.y, 50, 50);
    playerB = msg.B;
    bX.innerText = playerB.x.toString();
    bY.innerText = playerB.y.toString();
    spriteB = createSprite(playerB.spriteUrl);
    ctx.drawImage(spriteB, playerB.x, playerB.y, 50, 50);
});
// MOVE KEY
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
