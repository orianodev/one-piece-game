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
const settings = {
    ph: 50,
    pw: 50
};
// PLAYER
class Player {
    constructor(name, hp, x, y, spriteUrl, opponent) {
        this.name = name;
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.spriteUrl = spriteUrl;
        this.opponent = opponent;
    }
    moveUp() {
        if (this.y > 0) {
            if (this.y == this.opponent.y + settings.ph && this.x + settings.pw > this.opponent.x && this.x < this.opponent.x + settings.pw) {
                return;
            }
            this.y -= 10;
            emitAfterMove();
        }
    }
    moveDown() {
        if (this.y < canvas.height - 50) {
            if (this.y + settings.ph == this.opponent.y && this.x + settings.pw > this.opponent.x && this.x < this.opponent.x + settings.pw) {
                return;
            }
            this.y += 10;
            emitAfterMove();
        }
    }
    moveLeft() {
        if (this.x > 0) {
            if (this.y + settings.ph > this.opponent.y && this.y < this.opponent.y + settings.ph && this.x == this.opponent.x + settings.pw) {
                return;
            }
            this.x -= 10;
            emitAfterMove();
        }
    }
    moveRight() {
        if (this.x < canvas.width - 50) {
            if (this.y + settings.ph > this.opponent.y && this.y < this.opponent.y + settings.ph && this.x + settings.pw == this.opponent.x) {
                return;
            }
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
    player = new Player("A", 100, 0, canvas.height / 2 - settings.ph, "images/luffy.png", null);
    player.opponent = new Player("B", 100, canvas.width - settings.pw, canvas.height / 2 - settings.ph, "images/zoro.png", null);
    showPlayer.innerText = player.name;
});
pickB.addEventListener("click", (e) => {
    player = new Player("B", 100, canvas.width - settings.pw, canvas.height / 2 - settings.ph, "images/zoro.png", null);
    player.opponent = new Player("A", 100, 0, canvas.height / 2 - settings.ph, "images/luffy.png", null);
    showPlayer.innerText = player.name;
});
// MOVE EMIT
function emitAfterMove() {
    if (player.name == "A")
        socket.emit("move", { A: player, B: playerB });
    else if (player.name == "B")
        socket.emit("move", { A: playerA, B: player });
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
    playerA = msg.A;
    playerB = msg.B;
    player.opponent = player.name === "A" ? playerB : playerA;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    aX.innerText = playerA.x.toString();
    aY.innerText = playerA.y.toString();
    bX.innerText = playerB.x.toString();
    bY.innerText = playerB.y.toString();
    spriteA = createSprite(playerA.spriteUrl);
    spriteB = createSprite(playerB.spriteUrl);
    ctx.drawImage(spriteA, playerA.x, playerA.y, settings.pw, settings.ph);
    ctx.drawImage(spriteB, playerB.x, playerB.y, settings.pw, settings.ph);
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
