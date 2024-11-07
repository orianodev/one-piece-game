"use strict";
// @ts-ignore
const socket = io();
// DOM
const $canvas = document.querySelector("#canvas");
const $ctx = $canvas.getContext("2d");
const $joinBtn = document.querySelector("#join");
const $pickA = document.querySelector("#pickA");
const $pickB = document.querySelector("#pickB");
const $showPlayer = document.querySelector("#showPlayer");
const $hp1 = document.querySelector("#hp-1");
const $score1 = document.querySelector("#score-1");
const $character1 = document.querySelector("#character-1");
const $hp2 = document.querySelector("#hp-2");
const $score2 = document.querySelector("#score-2");
const $character2 = document.querySelector("#character-2");
const settings = {
    playH: 50,
    playW: 50,
    projH: 10,
    projW: 10,
    cursorSize: 10,
};
const defaultPosition = { A: { x: 0, y: $canvas.height / 2 - settings.playH }, B: { x: $canvas.width - settings.playW, y: $canvas.height / 2 - settings.playH } };
const characterStats = {
    luffy: {
        name: "Monkey D Luffy",
        spriteUrl: "/images/characters/luffy.png",
        color: "red",
        speed: 20,
        hp: 200,
        maxHp: 200,
        healingPower: 5,
        attackSpeed: 20,
        attackStrength: 10,
    },
    zoro: {
        name: "Roronoa Zoro",
        spriteUrl: "/images/characters/zoro.png",
        color: "green",
        speed: 13,
        hp: 180,
        maxHp: 190,
        healingPower: 4,
        attackSpeed: 25,
        attackStrength: 9,
    },
    sanji: {
        name: "Vinsmoke Sanji",
        spriteUrl: "/images/characters/sanji.png",
        color: "yellow",
        speed: 15,
        hp: 170,
        maxHp: 170,
        healingPower: 3,
        attackSpeed: 19,
        attackStrength: 10,
    },
    ace: {
        name: "Portgas D Ace",
        spriteUrl: "/images/characters/ace.png",
        color: "orange",
        speed: 18,
        hp: 200,
        maxHp: 250,
        healingPower: 3,
        attackSpeed: 17,
        attackStrength: 15,
    }
};
// PLAYER
class Player {
    constructor(id, characterId, characterName, color, spriteUrl, score, x, y, direction, speed, hp, maxHp, healingPower, attackSpeed, attackStrength, thrownProjectile, opponentPosition) {
        this.id = id;
        this.characterId = characterId;
        this.characterName = characterName;
        this.color = color;
        this.spriteUrl = spriteUrl;
        this.score = score;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.hp = hp;
        this.maxHp = maxHp;
        this.healingPower = healingPower;
        this.attackSpeed = attackSpeed;
        this.attackStrength = attackStrength;
        this.thrownProjectiles = thrownProjectile;
        this.opponentPosition = opponentPosition;
    }
    draw() {
        $ctx.globalAlpha = 1;
        const newSprite = new Image(settings.playW, settings.playH);
        newSprite.src = this.spriteUrl;
        $ctx.drawImage(newSprite, this.x, this.y, settings.playW, settings.playH);
        $ctx.globalAlpha = 0.5;
        $ctx.fillStyle = this.color;
        if (this.direction === "up")
            $ctx.fillRect(this.x + (settings.playW / 2 - 5), this.y - settings.cursorSize - 5, settings.cursorSize, settings.cursorSize);
        if (this.direction === "down")
            $ctx.fillRect(this.x + (settings.playW / 2 - 5), this.y + settings.playH + 5, settings.cursorSize, settings.cursorSize);
        if (this.direction === "left")
            $ctx.fillRect(this.x - settings.cursorSize - 5, this.y + settings.playH / 2 - 5, settings.cursorSize, settings.cursorSize);
        if (this.direction === "right")
            $ctx.fillRect(this.x + settings.playW + 5, this.y + settings.playH / 2 - 5, settings.cursorSize, settings.cursorSize);
        $ctx.globalAlpha = 1;
    }
    attack() {
        const projectile = new Projectile(this.id, this.x + settings.playW / 2, this.y + settings.playH / 2, this.direction, "images/fireball.png");
        this.thrownProjectiles.push(projectile);
        projectile.draw();
        this.updateServer();
    }
    heal() {
        if (this.hp + this.healingPower <= this.maxHp)
            this.hp += this.healingPower;
        this.updateServer();
    }
    moveUp() {
        if (this.y < 0)
            return;
        if (this.y == this.opponentPosition.y + settings.playH && this.x + settings.playW > this.opponentPosition.x && this.x < this.opponentPosition.x + settings.playW)
            return;
        this.direction = "up";
        this.y -= this.speed;
        this.updateServer();
    }
    moveDown() {
        if (this.y > $canvas.height - settings.playH)
            return;
        if (this.y + settings.playH == this.opponentPosition.y && this.x + settings.playW > this.opponentPosition.x && this.x < this.opponentPosition.x + settings.playW)
            return;
        this.direction = "down";
        this.y += this.speed;
        this.updateServer();
    }
    moveLeft() {
        if (this.x < 0)
            return;
        if (this.y + settings.playH > this.opponentPosition.y && this.y < this.opponentPosition.y + settings.playH && this.x == this.opponentPosition.x + settings.playW)
            return;
        this.direction = "left";
        this.x -= this.speed;
        this.updateServer();
    }
    moveRight() {
        if (this.x > $canvas.width - settings.playW)
            return;
        if (this.y + settings.playH > this.opponentPosition.y && this.y < this.opponentPosition.y + settings.playH && this.x + settings.playW == this.opponentPosition.x)
            return;
        this.direction = "right";
        this.x += this.speed;
        this.updateServer();
    }
    updateServer() {
        if (this.id == "A")
            socket.emit("update", { roomId: _F.roomId, A: _F.thisPlayer, B: _F.opponentPlayer });
        else if (this.id == "B")
            socket.emit("update", { roomId: _F.roomId, A: _F.opponentPlayer, B: _F.thisPlayer });
    }
    ;
}
class Projectile {
    constructor(thrower, x, y, direction, color) {
        this.throwerId = thrower;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
    }
    draw() {
        $ctx.fillStyle = "black";
        $ctx.fillRect(this.x, this.y, settings.projW, settings.projH);
        // const newSprite = new Image();
        // newSprite.src = this.spriteUrl;
        // $ctx.drawImage(newSprite, this.x, this.y, settings.projW, settings.projH);
    }
    move() {
        const thrower = _F.thisPlayer.id === this.throwerId ? _F.thisPlayer : _F.opponentPlayer;
        if (this.direction == "left")
            this.x -= thrower.attackSpeed;
        if (this.direction == "right")
            this.x += thrower.attackSpeed;
        if (this.direction == "up")
            this.y -= thrower.attackSpeed;
        if (this.direction == "down")
            this.y += thrower.attackSpeed;
        this.checkCollisionWithBorder(thrower);
        this.checkCollisionWithOppenent(thrower);
    }
    checkCollisionWithBorder(thrower) {
        if (this.direction == "left" && this.x <= 0)
            this.destroy(thrower);
        if (this.direction == "right" && this.x >= $canvas.width - settings.projW)
            this.destroy(thrower);
        if (this.direction == "up" && this.y <= 0)
            this.destroy(thrower);
        if (this.direction == "down" && this.y >= $canvas.height - settings.projH)
            this.destroy(thrower);
    }
    checkCollisionWithOppenent(thrower) {
        const opponent = _F.thisPlayer.id === this.throwerId ? _F.opponentPlayer : _F.thisPlayer;
        const opponentCenter = { x: opponent.x + settings.playW / 2, y: opponent.y + settings.playH / 2 };
        const thisProjectileCenter = { x: this.x + settings.projW / 2, y: this.y + settings.projH / 2 };
        const distance = Math.sqrt(Math.pow(opponentCenter.x - thisProjectileCenter.x, 2) + Math.pow(opponentCenter.y - thisProjectileCenter.y, 2));
        console.log("Dist. between proj. and opp. :", distance);
        if (distance < 30) {
            opponent.hp -= 10;
            this.destroy(thrower);
        }
    }
    destroy(thrower) {
        thrower.thrownProjectiles.splice(thrower.thrownProjectiles.indexOf(this), 1);
        _F.thisPlayer.updateServer();
    }
}
class Fight {
    constructor(roomId) {
        this.thisPlayer = new Player("A", "default", "name", "black", "images/characters/luffy.png", 0, defaultPosition.A.x, defaultPosition.A.y, "right", 10, 100, 100, 10, 10, 10, [], defaultPosition.B);
        this.opponentPlayer = new Player("B", "default", "name", "black", "images/characters/zoro.png", 0, defaultPosition.B.x, defaultPosition.B.y, "right", 10, 100, 100, 10, 10, 10, [], defaultPosition.A);
        this.roomId = roomId;
    }
    rebuildPlayers(msg) {
        if (myPlayerId === "A") {
            _F.thisPlayer = new Player("A", msg.A.characterId, msg.A.characterName, msg.A.color, msg.A.spriteUrl, msg.A.score, msg.A.x, msg.A.y, msg.A.direction, msg.A.speed, msg.A.hp, msg.A.maxHp, msg.A.healingPower, msg.A.attackSpeed, msg.A.attackStrength, _F.rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
            _F.opponentPlayer = new Player("B", msg.B.characterId, msg.B.characterName, msg.B.color, msg.B.spriteUrl, msg.B.score, msg.B.x, msg.B.y, msg.B.direction, msg.B.speed, msg.B.hp, msg.A.maxHp, msg.B.healingPower, msg.B.attackSpeed, msg.B.attackStrength, _F.rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
        }
        else if (myPlayerId === "B") {
            _F.thisPlayer = new Player("B", msg.B.characterId, msg.B.characterName, msg.B.color, msg.B.spriteUrl, msg.B.score, msg.B.x, msg.B.y, msg.B.direction, msg.B.speed, msg.B.hp, msg.A.maxHp, msg.B.healingPower, msg.B.attackSpeed, msg.B.attackStrength, _F.rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
            _F.opponentPlayer = new Player("A", msg.A.characterId, msg.A.characterName, msg.A.color, msg.A.spriteUrl, msg.A.score, msg.A.x, msg.A.y, msg.A.direction, msg.A.speed, msg.A.hp, msg.A.maxHp, msg.A.healingPower, msg.A.attackSpeed, msg.A.attackStrength, _F.rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
        }
    }
    reDrawAll() {
        $ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        this.drawGrid();
        this.thisPlayer.draw();
        this.opponentPlayer.draw();
        this.thisPlayer.thrownProjectiles.forEach((projectile) => projectile.draw());
        this.opponentPlayer.thrownProjectiles.forEach((projectile) => projectile.draw());
        const playerA = this.thisPlayer.id === "A" ? this.thisPlayer : this.opponentPlayer;
        const playerB = this.thisPlayer.id === "B" ? this.thisPlayer : this.opponentPlayer;
        $character1.innerText = playerA.characterId;
        $hp1.innerText = playerA.hp.toString();
        $score1.innerText = playerA.score.toString();
        $character2.innerText = playerB.characterId;
        $hp2.innerText = playerB.hp.toString();
        $score2.innerText = playerB.score.toString();
    }
    rebuildProjectileArray(flattedProjectileArray) {
        return flattedProjectileArray.map((projectile) => new Projectile(projectile.throwerId, projectile.x, projectile.y, projectile.direction, projectile.color));
    }
    drawGrid(gridSize = 10) {
        $ctx.strokeStyle = "#444";
        $ctx.lineWidth = 0.5;
        for (let x = 0; x <= $canvas.width; x += gridSize) {
            $ctx.beginPath();
            $ctx.moveTo(x, 0);
            $ctx.lineTo(x, $canvas.height);
            $ctx.stroke();
        }
        for (let y = 0; y <= $canvas.height; y += gridSize) {
            $ctx.beginPath();
            $ctx.moveTo(0, y);
            $ctx.lineTo($canvas.width, y);
            $ctx.stroke();
        }
    }
}
const _F = new Fight(parseInt(localStorage.getItem("roomID")));
let myPlayerId;
socket.emit("whereIsMyPlayerId", { roomId: _F.roomId });
socket.on("whereIsMyPlayerId", (playerId) => {
    if (!myPlayerId)
        myPlayerId = playerId;
    const myScore = parseInt(localStorage.getItem("score"));
    const myCharacterId = localStorage.getItem("characterID");
    let pickedCharacter;
    switch (myCharacterId) {
        case "luffy":
            pickedCharacter = characterStats.luffy;
            break;
        case "zoro":
            pickedCharacter = characterStats.zoro;
            break;
        case "sanji":
            pickedCharacter = characterStats.sanji;
            break;
        case "ace":
            pickedCharacter = characterStats.ace;
            break;
        default:
            pickedCharacter = characterStats.luffy;
            break;
    }
    const myPlayer = new Player(playerId, myCharacterId, pickedCharacter.name, pickedCharacter.color, pickedCharacter.spriteUrl, myScore, defaultPosition[playerId].x, defaultPosition[playerId].y, "right", pickedCharacter.speed, pickedCharacter.hp, pickedCharacter.maxHp, pickedCharacter.healingPower, pickedCharacter.attackSpeed, pickedCharacter.attackStrength, [], defaultPosition[playerId === "A" ? "B" : "A"]);
    socket.emit("myPlayerStats", { myPlayer, roomId: _F.roomId, playerId });
});
socket.on("start", (msg) => {
    _F.rebuildPlayers(msg);
});
socket.on("move", () => {
    _F.thisPlayer.thrownProjectiles.forEach((projectile) => projectile.move());
    _F.opponentPlayer.thrownProjectiles.forEach((projectile) => projectile.move());
    _F.reDrawAll();
});
socket.on("update", (msg) => {
    _F.rebuildPlayers(msg);
    _F.reDrawAll();
});
socket.on("stop", () => {
    alert("A user disconnected. You will be redirected to the selection page.");
    localStorage.removeItem("roomID");
    window.location.href = "/";
});
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            _F.thisPlayer.moveUp();
            break;
        case "ArrowDown":
            _F.thisPlayer.moveDown();
            break;
        case "ArrowRight":
            _F.thisPlayer.moveRight();
            break;
        case "ArrowLeft":
            _F.thisPlayer.moveLeft();
            break;
        case "z":
            _F.thisPlayer.attack();
            break;
        case "d":
            _F.thisPlayer.heal();
            break;
    }
});
