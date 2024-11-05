"use strict";
// @ts-ignore
const socket = io();
// DOM
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
function drawGrid(gridSize = 10) {
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}
const joinBtn = document.querySelector("#join");
const pickA = document.querySelector("#pickA");
const pickB = document.querySelector("#pickB");
const showPlayer = document.querySelector("#showPlayer");
const aX = document.querySelector("#aX");
const aY = document.querySelector("#aY");
const bX = document.querySelector("#bX");
const bY = document.querySelector("#bY");
const settings = {
    playH: 50,
    playW: 50,
    projH: 10,
    projW: 10,
};
const defaultPosition = { A: { x: 0, y: canvas.height / 2 - settings.playH }, B: { x: canvas.width - settings.playW, y: canvas.height / 2 - settings.playH } };
// PLAYER
class Player {
    constructor(id, hp, x, y, direction, score, spriteUrl, thrownProjectile, opponentPosition) {
        this.id = id;
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.score = score;
        this.spriteUrl = spriteUrl;
        this.thrownProjectiles = thrownProjectile;
        this.opponentPosition = opponentPosition;
    }
    draw() {
        const newSprite = new Image(settings.playW, settings.playH);
        newSprite.src = this.spriteUrl;
        ctx.drawImage(newSprite, this.x, this.y, settings.playW, settings.playH);
    }
    throwProjectile() {
        const projectile = new Projectile(this.id, this.x + settings.playW / 2, this.y + settings.playH / 2, this.direction, "images/fireball.png");
        this.thrownProjectiles.push(projectile);
        projectile.draw();
        this.updateServer();
    }
    moveUp() {
        if (this.y > 0) {
            if (this.y == this.opponentPosition.y + settings.playH && this.x + settings.playW > this.opponentPosition.x && this.x < this.opponentPosition.x + settings.playW) {
                return;
            }
            this.direction = "up";
            this.y -= 10;
            this.updateServer();
        }
    }
    moveDown() {
        if (this.y < canvas.height - 50) {
            if (this.y + settings.playH == this.opponentPosition.y && this.x + settings.playW > this.opponentPosition.x && this.x < this.opponentPosition.x + settings.playW) {
                return;
            }
            this.direction = "down";
            this.y += 10;
            this.updateServer();
        }
    }
    moveLeft() {
        if (this.x > 0) {
            if (this.y + settings.playH > this.opponentPosition.y && this.y < this.opponentPosition.y + settings.playH && this.x == this.opponentPosition.x + settings.playW) {
                return;
            }
            this.direction = "left";
            this.x -= 10;
            this.updateServer();
        }
    }
    moveRight() {
        if (this.x < canvas.width - 50) {
            if (this.y + settings.playH > this.opponentPosition.y && this.y < this.opponentPosition.y + settings.playH && this.x + settings.playW == this.opponentPosition.x) {
                return;
            }
            this.direction = "right";
            this.x += 10;
            this.updateServer();
        }
    }
    updateServer() {
        if (this.id == "A")
            socket.emit("update", { A: thisPlayer, B: opponentPlayer });
        else if (this.id == "B")
            socket.emit("update", { A: opponentPlayer, B: thisPlayer });
    }
    ;
}
class Projectile {
    constructor(thrower, x, y, direction, spriteUrl) {
        this.throwerId = thrower;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.spriteUrl = spriteUrl;
    }
    draw() {
        const newSprite = new Image();
        newSprite.src = this.spriteUrl;
        ctx.drawImage(newSprite, this.x, this.y, settings.projW, settings.projH);
    }
    checkCollisionWithBorder() {
        const thrower = thisPlayer.id === this.throwerId ? thisPlayer : opponentPlayer;
        if (this.direction == "left" && this.x <= 0)
            this.destroy(thrower);
        if (this.direction == "right" && this.x >= canvas.width - settings.projW)
            this.destroy(thrower);
        if (this.direction == "up" && this.y <= 0)
            this.destroy(thrower);
        if (this.direction == "down" && this.y >= canvas.height - settings.projH)
            this.destroy(thrower);
    }
    checkCollisionWithOppenent() {
        const thrower = thisPlayer.id === this.throwerId ? thisPlayer : opponentPlayer;
        const opponent = thisPlayer.id === this.throwerId ? opponentPlayer : thisPlayer;
        const opponentCenter = { x: opponent.x + settings.playW / 2, y: opponent.y + settings.playH / 2 };
        const thisProjectileCenter = { x: this.x + settings.projW / 2, y: this.y + settings.projH / 2 };
        const distance = Math.sqrt(Math.pow(opponentCenter.x - thisProjectileCenter.x, 2) + Math.pow(opponentCenter.y - thisProjectileCenter.y, 2));
        console.log("Dist. between proj. and opp. :", distance);
        if (distance < 30) {
            opponent.hp -= 10;
            thrower.score++;
            this.destroy(thrower);
        }
    }
    destroy(thrower) {
        thrower.thrownProjectiles.splice(thrower.thrownProjectiles.indexOf(this), 1);
        thisPlayer.updateServer();
    }
}
// ROOM JOIN
joinBtn.addEventListener("click", (e) => {
    socket.emit("joinRoom", "room1");
});
// PLAYER PICK
let thisPlayer;
let opponentPlayer;
pickA.addEventListener("click", (e) => {
    thisPlayer = new Player("A", 100, defaultPosition.A.x, defaultPosition.A.y, "right", 0, "images/luffy.png", [], defaultPosition.B);
    opponentPlayer = new Player("B", 100, defaultPosition.B.x, defaultPosition.B.y, "left", 0, "images/zoro.png", [], defaultPosition.A);
    showPlayer.innerText = thisPlayer.id;
});
pickB.addEventListener("click", (e) => {
    thisPlayer = new Player("B", 100, defaultPosition.B.x, defaultPosition.B.y, "left", 0, "images/zoro.png", [], defaultPosition.A);
    opponentPlayer = new Player("A", 100, defaultPosition.A.x, defaultPosition.A.y, "right", 0, "images/luffy.png", [], defaultPosition.B);
    showPlayer.innerText = thisPlayer.id;
});
function rebuildProjectileArray(flattedProjectileArray) {
    return flattedProjectileArray.map((projectile) => new Projectile(projectile.throwerId, projectile.x, projectile.y, projectile.direction, projectile.spriteUrl));
}
// MOVE RECEIVE
socket.on("update", (msg) => {
    if (thisPlayer.id == "A") {
        thisPlayer = new Player("A", msg.A.hp, msg.A.x, msg.A.y, msg.A.direction, msg.A.score, msg.A.spriteUrl, rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
        opponentPlayer = new Player("B", msg.B.hp, msg.B.x, msg.B.y, msg.B.direction, msg.B.score, msg.B.spriteUrl, rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
    }
    else if (thisPlayer.id = "B") {
        thisPlayer = new Player("B", msg.B.hp, msg.B.x, msg.B.y, msg.B.direction, msg.B.score, msg.B.spriteUrl, rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
        opponentPlayer = new Player("A", msg.A.hp, msg.A.x, msg.A.y, msg.A.direction, msg.A.score, msg.A.spriteUrl, rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    aX.innerText = thisPlayer.id === "A" ? thisPlayer.x.toString() : opponentPlayer.x.toString();
    aY.innerText = thisPlayer.id === "A" ? thisPlayer.y.toString() : opponentPlayer.y.toString();
    bX.innerText = thisPlayer.id === "B" ? thisPlayer.x.toString() : opponentPlayer.x.toString();
    bY.innerText = thisPlayer.id === "B" ? thisPlayer.y.toString() : opponentPlayer.y.toString();
    thisPlayer.draw();
    opponentPlayer.draw();
    thisPlayer.thrownProjectiles.forEach((projectile) => {
        projectile.draw();
        projectile.checkCollisionWithBorder();
        projectile.checkCollisionWithOppenent();
    });
    opponentPlayer.thrownProjectiles.forEach((projectile) => {
        projectile.draw();
        projectile.checkCollisionWithBorder();
        projectile.checkCollisionWithOppenent();
    });
});
// MOVE KEY
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            thisPlayer.moveUp();
            break;
        case "ArrowDown":
            thisPlayer.moveDown();
            break;
        case "ArrowRight":
            thisPlayer.moveRight();
            break;
        case "ArrowLeft":
            thisPlayer.moveLeft();
            break;
        case " ":
            console.log("Throw!");
            thisPlayer.throwProjectile();
            break;
    }
});
