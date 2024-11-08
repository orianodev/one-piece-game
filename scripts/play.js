"use strict";
// @ts-ignore
const socket = io();
// DOM
const $canvas = document.querySelector("#canvas");
const $ctx = $canvas.getContext("2d");
const $character1 = document.querySelector("#character-1");
const $hp1 = document.querySelector("#hp-1");
const $mana1 = document.querySelector("#mana-1");
const $score1 = document.querySelector("#score-1");
const $character2 = document.querySelector("#character-2");
const $hp2 = document.querySelector("#hp-2");
const $mana2 = document.querySelector("#mana-2");
const $score2 = document.querySelector("#score-2");
const setting = {
    playH: 80,
    playW: 80,
    projH: 30,
    projW: 30,
    freezeDelay: 150,
    collisionDistance: 30,
    specialManaMultiplier: 10,
    specialDamageMultiplier: 4,
    transformThreshold: 0.1,
    transformSpeedFactor: 3,
    transformStrengthFactor: 3,
    transformAttackSpeedFactor: 3,
    transformRegenFactor: 3,
    cursorSize: 10,
    aiLevelInterval: {
        "easy": 100,
        "medium": 50,
        "hard": 30,
    }
};
const defaultPosition = { A: { x: 0, y: $canvas.height / 2 - setting.playH }, B: { x: $canvas.width - setting.playW, y: $canvas.height / 2 - setting.playH } };
const characterStats = {
    luffy: {
        name: "Monkey D Luffy",
        sprite: "/images/players/luffy.png",
        color: "red",
        speed: 20,
        hp: 200,
        maxHp: 200,
        healingPower: 5,
        mana: 100,
        maxMana: 100,
        regenPower: 10,
        attackSprite: "/images/attacks/punch.png",
        attackCost: 10,
        attackSpeed: 20,
        attackStrength: 10,
    },
    zoro: {
        name: "Roronoa Zoro",
        sprite: "/images/players/zoro.png",
        color: "green",
        speed: 13,
        hp: 180,
        maxHp: 190,
        healingPower: 4,
        mana: 100,
        maxMana: 100,
        regenPower: 10,
        attackSprite: "/images/attacks/tornado.png",
        attackCost: 10,
        attackSpeed: 25,
        attackStrength: 9,
    },
    sanji: {
        name: "Vinsmoke Sanji",
        sprite: "/images/players/sanji.png",
        color: "yellow",
        speed: 15,
        hp: 170,
        maxHp: 170,
        healingPower: 3,
        mana: 100,
        maxMana: 100,
        regenPower: 10,
        attackSprite: "/images/attacks/kick.png",
        attackCost: 10,
        attackSpeed: 19,
        attackStrength: 10,
    },
    ace: {
        name: "Portgas D Ace",
        sprite: "/images/players/ace.png",
        color: "orange",
        speed: 18,
        hp: 200,
        maxHp: 250,
        healingPower: 3,
        mana: 100,
        maxMana: 100,
        regenPower: 10,
        attackSprite: "/images/attacks/flame.png",
        attackCost: 10,
        attackSpeed: 17,
        attackStrength: 15,
    }
};
// PLAYER
class Player {
    constructor(id, characterId, characterName, color, sprite, score, x, y, direction, speed, hp, maxHp, healingPower, mana, maxMana, regenPower, attackSprite, attackCost, attackSpeed, attackStrength, thrownProjectile, opponentPosition) {
        this.isTransformed = false;
        this.id = id;
        this.characterId = characterId;
        this.characterName = characterName;
        this.color = color;
        this.sprite = sprite;
        this.score = score;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.hp = hp;
        this.maxHp = maxHp;
        this.healingPower = healingPower;
        this.mana = mana;
        this.maxMana = maxMana;
        this.regenPower = regenPower;
        this.attackSprite = attackSprite;
        this.attackCost = attackCost;
        this.attackSpeed = attackSpeed;
        this.attackStrength = attackStrength;
        this.thrownProjectiles = thrownProjectile;
        this.opponentPosition = opponentPosition;
    }
    draw() {
        $ctx.globalAlpha = 1;
        _F.setShadow(this.color);
        const newSprite = new Image(setting.playW, setting.playH);
        newSprite.src = this.sprite;
        $ctx.drawImage(newSprite, this.x, this.y, setting.playW, setting.playH);
        $ctx.globalAlpha = 0.5;
        if (this.direction === "up")
            $ctx.fillRect(this.x + (setting.playW / 2 - 5), this.y - setting.cursorSize - 5, setting.cursorSize, setting.cursorSize);
        if (this.direction === "down")
            $ctx.fillRect(this.x + (setting.playW / 2 - 5), this.y + setting.playH + 5, setting.cursorSize, setting.cursorSize);
        if (this.direction === "left")
            $ctx.fillRect(this.x - setting.cursorSize - 5, this.y + setting.playH / 2 - 5, setting.cursorSize, setting.cursorSize);
        if (this.direction === "right")
            $ctx.fillRect(this.x + setting.playW + 5, this.y + setting.playH / 2 - 5, setting.cursorSize, setting.cursorSize);
        _F.resetPen();
    }
    freeze() {
        console.log("no freeze");
        if (isFrozen)
            return false;
        console.log("frozen");
        isFrozen = true;
        unfreezeThisPlayer();
        return true;
    }
    attack() {
        if (this.id === "A" || _F.mode === "dual") {
            if (!this.freeze())
                return;
        }
        if (this.mana < this.attackCost)
            return;
        this.mana -= this.attackCost;
        const projectile = new Projectile(this.id, "simple", this.color, this.attackSprite, this.x + setting.playW / 2, this.y + setting.playH / 2, this.direction);
        this.thrownProjectiles.push(projectile);
        projectile.draw();
        this.updateServer();
    }
    specialAttack() {
        if (this.id === "A" || _F.mode === "dual") {
            if (!this.freeze())
                return;
        }
        if (this.mana < this.attackCost * setting.specialManaMultiplier)
            return;
        this.mana -= this.attackCost * setting.specialManaMultiplier;
        const projectile = new Projectile(this.id, "special", this.color, this.attackSprite, this.x + setting.playW / 2, this.y + setting.playH / 2, this.direction);
        this.thrownProjectiles.push(projectile);
        projectile.draw();
        this.updateServer();
    }
    heal() {
        if (this.id === "A" || _F.mode === "dual") {
            if (!this.freeze())
                return;
        }
        if (this.hp + this.healingPower > this.maxHp)
            return;
        this.hp += this.healingPower;
        this.updateServer();
    }
    regen() {
        if (this.id === "A" || _F.mode === "dual") {
            if (!this.freeze())
                return;
        }
        if (this.mana + this.regenPower > this.maxMana)
            return;
        this.mana += this.regenPower;
        this.updateServer();
    }
    transform() {
        console.log("trying to transform");
        if (this.id === "A" || _F.mode === "dual") {
            if (!this.freeze())
                return;
        }
        if (this.isTransformed || this.hp > this.maxHp * setting.transformThreshold)
            return;
        this.isTransformed = true;
        this.sprite = this.sprite.replace("players", "transform");
        console.log("New sprite:", this.sprite);
        this.speed *= setting.transformSpeedFactor;
        this.attackStrength *= setting.transformStrengthFactor;
        this.attackSpeed *= setting.transformAttackSpeedFactor;
        this.regenPower *= setting.transformRegenFactor;
        if (this.id === "A")
            $character1.style.color = "red";
        else if (this.id === "B")
            $character2.style.color = "red";
        setTimeout(() => this.untransform(), 5000);
        this.updateServer();
        console.log("successfully transformed");
    }
    untransform() {
        console.log("UNtransform");
        console.log(characterStats[this.characterId].sprite);
        this.sprite = characterStats[this.characterId].sprite;
        console.log(this.speed);
        this.speed = characterStats[this.characterId].speed;
        console.log(this.speed);
        this.attackStrength = characterStats[this.characterId].attackStrength;
        this.regenPower = characterStats[this.characterId].regenPower;
        if (this.id === "A")
            $character1.style.color = "whitesmoke";
        else if (this.id === "B")
            $character2.style.color = "whitesmoke";
        this.updateServer();
    }
    moveUp() {
        if (this.y < 0)
            return;
        if (this.y == this.opponentPosition.y + setting.playH && this.x + setting.playW > this.opponentPosition.x && this.x < this.opponentPosition.x + setting.playW)
            return;
        this.direction = "up";
        this.y -= this.speed;
        this.updateServer();
    }
    moveDown() {
        if (this.y > $canvas.height - setting.playH)
            return;
        if (this.y + setting.playH == this.opponentPosition.y && this.x + setting.playW > this.opponentPosition.x && this.x < this.opponentPosition.x + setting.playW)
            return;
        this.direction = "down";
        this.y += this.speed;
        this.updateServer();
    }
    moveLeft() {
        if (this.x < 0)
            return;
        if (this.y + setting.playH > this.opponentPosition.y && this.y < this.opponentPosition.y + setting.playH && this.x == this.opponentPosition.x + setting.playW)
            return;
        this.direction = "left";
        this.x -= this.speed;
        this.updateServer();
    }
    moveRight() {
        if (this.x > $canvas.width - setting.playW)
            return;
        if (this.y + setting.playH > this.opponentPosition.y && this.y < this.opponentPosition.y + setting.playH && this.x + setting.playW == this.opponentPosition.x)
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
    constructor(thrower, type, color, sprite, x, y, direction) {
        this.throwerId = thrower;
        this.type = type;
        this.color = color;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
    draw() {
        _F.setShadow(this.color);
        const newSprite = new Image(setting.playW, setting.playH);
        const spriteImg = this.sprite.replace(".png", "-" + this.direction[0] + ".png");
        newSprite.src = spriteImg;
        if (this.type === "simple")
            $ctx.drawImage(newSprite, this.x, this.y, setting.projW, setting.projH);
        if (this.type === "special")
            $ctx.drawImage(newSprite, this.x, this.y, setting.playW, setting.playH);
        _F.resetPen();
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
        if (this.direction == "right" && this.x >= $canvas.width - setting.projW)
            this.destroy(thrower);
        if (this.direction == "up" && this.y <= 0)
            this.destroy(thrower);
        if (this.direction == "down" && this.y >= $canvas.height - setting.projH)
            this.destroy(thrower);
    }
    checkCollisionWithOppenent(thrower) {
        const opponent = _F.thisPlayer.id === this.throwerId ? _F.opponentPlayer : _F.thisPlayer;
        const opponentCenter = { x: opponent.x + setting.playW / 2, y: opponent.y + setting.playH / 2 };
        const thisProjectileCenter = { x: this.x + setting.projW / 2, y: this.y + setting.projH / 2 };
        const distance = Math.sqrt(Math.pow(opponentCenter.x - thisProjectileCenter.x, 2) + Math.pow(opponentCenter.y - thisProjectileCenter.y, 2));
        if (distance < setting.collisionDistance) {
            opponent.hp -= this.type === "simple" ? thrower.attackStrength : thrower.attackStrength * setting.specialDamageMultiplier;
            this.destroy(thrower);
        }
    }
    destroy(thrower) {
        thrower.thrownProjectiles.splice(thrower.thrownProjectiles.indexOf(this), 1);
        _F.thisPlayer.updateServer();
    }
}
class Fight {
    constructor(roomId, mode) {
        this.thisPlayer = new Player("A", "luffy", "name", "black", "images/players/luffy.png", 0, defaultPosition.A.x, defaultPosition.A.y, "right", 10, 100, 100, 10, 100, 100, 10, "", 10, 10, 10, [], defaultPosition.B);
        this.opponentPlayer = new Player("B", "luffy", "name", "black", "images/players/zoro.png", 0, defaultPosition.B.x, defaultPosition.B.y, "right", 10, 100, 100, 10, 100, 100, 10, "", 10, 10, 10, [], defaultPosition.A);
        this.roomId = roomId;
        this.mode = mode;
    }
    aiAction() {
        const aiAction = ["move", "attack", "super", "heal", "regen", "transfo"];
        const aiChoice = aiAction[Math.floor(Math.random() * aiAction.length)];
        console.log(aiChoice);
        if (aiChoice === "move") {
            if (this.opponentPlayer.x < this.thisPlayer.x - setting.playW)
                this.opponentPlayer.moveRight();
            else if (this.opponentPlayer.x > this.thisPlayer.x + setting.playW)
                this.opponentPlayer.moveLeft();
            else if (this.opponentPlayer.y < this.thisPlayer.y - setting.playW)
                this.opponentPlayer.moveDown();
            else if (this.opponentPlayer.y > this.thisPlayer.y + setting.playH)
                this.opponentPlayer.moveUp();
        }
        else if (aiChoice === "attack") {
            return this.opponentPlayer.attack();
        }
        else if (aiChoice === "super") {
            return this.opponentPlayer.specialAttack();
        }
        else if (aiChoice === "heal") {
            return this.opponentPlayer.heal();
        }
        else if (aiChoice === "regen") {
            return this.opponentPlayer.regen();
        }
        else if (aiChoice === "transfo") {
            return this.opponentPlayer.transform();
        }
    }
    rebuildPlayers(msg) {
        if (thisPlayerId === "A") {
            _F.thisPlayer = new Player("A", msg.A.characterId, msg.A.characterName, msg.A.color, msg.A.sprite, msg.A.score, msg.A.x, msg.A.y, msg.A.direction, msg.A.speed, msg.A.hp, msg.A.maxHp, msg.A.healingPower, msg.A.mana, msg.A.maxMana, msg.A.regenPower, msg.A.attackSprite, msg.A.attackCost, msg.A.attackSpeed, msg.A.attackStrength, _F.rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
            _F.opponentPlayer = new Player("B", msg.B.characterId, msg.B.characterName, msg.B.color, msg.B.sprite, msg.B.score, msg.B.x, msg.B.y, msg.B.direction, msg.B.speed, msg.B.hp, msg.A.maxHp, msg.B.healingPower, msg.B.mana, msg.B.maxMana, msg.B.regenPower, msg.B.attackSprite, msg.B.attackCost, msg.B.attackSpeed, msg.B.attackStrength, _F.rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
        }
        else if (thisPlayerId === "B") {
            _F.thisPlayer = new Player("B", msg.B.characterId, msg.B.characterName, msg.B.color, msg.B.sprite, msg.B.score, msg.B.x, msg.B.y, msg.B.direction, msg.B.speed, msg.B.hp, msg.A.maxHp, msg.B.healingPower, msg.B.mana, msg.B.maxMana, msg.B.regenPower, msg.B.attackSprite, msg.B.attackCost, msg.B.attackSpeed, msg.B.attackStrength, _F.rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
            _F.opponentPlayer = new Player("A", msg.A.characterId, msg.A.characterName, msg.A.color, msg.A.sprite, msg.A.score, msg.A.x, msg.A.y, msg.A.direction, msg.A.speed, msg.A.hp, msg.A.maxHp, msg.A.healingPower, msg.A.mana, msg.A.maxMana, msg.A.regenPower, msg.A.attackSprite, msg.A.attackCost, msg.A.attackSpeed, msg.A.attackStrength, _F.rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
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
        $hp1.innerText = playerA.hp.toString();
        if (playerA.hp <= playerA.maxHp * setting.transformThreshold)
            $hp1.style.color = "red";
        $mana1.innerText = playerA.mana.toString();
        $hp2.innerText = playerB.hp.toString();
        if (playerB.hp <= playerB.maxHp * setting.transformThreshold)
            $hp2.style.color = "red";
        $mana2.innerText = playerB.mana.toString();
    }
    rebuildProjectileArray(flattedProjectileArray) {
        return flattedProjectileArray.map((projectile) => new Projectile(projectile.throwerId, projectile.type, projectile.color, projectile.sprite, projectile.x, projectile.y, projectile.direction));
    }
    resetPen() {
        $ctx.globalAlpha = 1;
        $ctx.shadowBlur = 0;
        $ctx.shadowOffsetX = 0;
        $ctx.shadowOffsetY = 0;
        $ctx.shadowColor = "black";
    }
    setShadow(color) {
        $ctx.shadowBlur = 10;
        $ctx.shadowOffsetX = 1;
        $ctx.shadowOffsetY = 1;
        $ctx.shadowColor = color;
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
let thisPlayerId;
const mode = localStorage.getItem("mode");
const roomId = parseInt(localStorage.getItem("roomId"));
const _F = new Fight(roomId, mode);
if (_F.mode === "dual") {
    console.log(mode, _F.mode, roomId, _F.roomId);
    socket.emit("whereIsthisPlayerId", { roomId: _F.roomId });
}
else if (_F.mode === "solo")
    soloGameSetup();
const stadium = localStorage.getItem("stadiumChoice");
const $wallpaper = document.querySelector("#wallpaper");
$wallpaper.style.backgroundImage = `url(/images/wallpapers/${stadium}.webp)`;
let isFrozen = false;
function unfreezeThisPlayer() {
    setTimeout(() => isFrozen = false, setting.freezeDelay);
}
function soloGameSetup() {
    const thisScore = parseInt(localStorage.getItem("score"));
    thisPlayerId = "A";
    const thisCharacterId = localStorage.getItem("characterId");
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer = new Player("A", thisCharacterId, thisCharacter.name, thisCharacter.color, thisCharacter.sprite, thisScore, defaultPosition.A.x, defaultPosition.A.y, "right", thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healingPower, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPower, thisCharacter.attackSprite, thisCharacter.attackCost, thisCharacter.attackSpeed, thisCharacter.attackStrength, [], defaultPosition.B);
    const charactersIdList = Object.keys(characterStats).filter((id) => id !== thisCharacterId);
    const aiCharacterId = charactersIdList[Math.floor(Math.random() * charactersIdList.length)];
    const aiCharacter = characterStats[aiCharacterId];
    const aiPlayer = new Player("B", aiCharacterId, aiCharacter.name, aiCharacter.color, aiCharacter.sprite, 0, defaultPosition.B.x, defaultPosition.B.y, "left", aiCharacter.speed, aiCharacter.hp, aiCharacter.maxHp, aiCharacter.healingPower, aiCharacter.mana, aiCharacter.maxMana, aiCharacter.regenPower, aiCharacter.attackSprite, aiCharacter.attackCost, aiCharacter.attackSpeed, aiCharacter.attackStrength, [], defaultPosition.B);
    const aiLevel = localStorage.getItem("aiLevel");
    _F.rebuildPlayers({ A: thisPlayer, B: aiPlayer });
    $character1.innerText = thisPlayer.characterName;
    $score1.innerText = thisScore.toString();
    $character2.innerText = aiPlayer.characterName;
    $score2.innerText = "0";
    soloGameInterval();
    aiActionInterval(aiLevel);
}
function soloGameInterval() {
    setInterval(() => {
        if (_F.thisPlayer.hp <= 0 || _F.opponentPlayer.hp <= 0) {
            const winnerId = _F.thisPlayer.hp <= 0 ? "B" : "A";
            const winnerName = _F.thisPlayer.hp <= 0 ? _F.opponentPlayer.characterName : _F.thisPlayer.characterName;
            if (winnerId === thisPlayerId)
                localStorage.setItem("score", (_F.thisPlayer.score + 1).toString());
            alert(`Player ${winnerId === "A" ? "1" : "2"} has won with ${winnerName}!`);
            window.location.reload();
        }
        _F.thisPlayer.thrownProjectiles.forEach((projectile) => projectile.move());
        _F.opponentPlayer.thrownProjectiles.forEach((projectile) => projectile.move());
        _F.reDrawAll();
    }, 50);
}
function aiActionInterval(aiLevel) {
    setInterval(() => {
        _F.aiAction();
    }, setting.aiLevelInterval[aiLevel]);
}
socket.on("whereIsThisPlayerId", (playerId) => {
    console.log(thisPlayerId);
    if (!thisPlayerId)
        thisPlayerId = playerId;
    console.log("this player id: ", thisPlayerId);
    const thisScore = parseInt(localStorage.getItem("score"));
    const thisCharacterId = localStorage.getItem("characterId");
    let thisCharacter = characterStats[thisCharacterId];
    const thisPlayer = new Player(playerId, thisCharacterId, thisCharacter.name, thisCharacter.color, thisCharacter.sprite, thisScore, defaultPosition[playerId].x, defaultPosition[playerId].y, thisPlayerId === "A" ? "right" : "left", thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healingPower, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPower, thisCharacter.attackSprite, thisCharacter.attackCost, thisCharacter.attackSpeed, thisCharacter.attackStrength, [], defaultPosition[playerId === "A" ? "B" : "A"]);
    socket.emit("thisPlayerStats", { thisPlayer, roomId: _F.roomId, playerId });
});
socket.on("start", (msg) => {
    _F.rebuildPlayers(msg);
    const playerA = _F.thisPlayer.id === "A" ? _F.thisPlayer : _F.opponentPlayer;
    const playerB = _F.thisPlayer.id === "B" ? _F.thisPlayer : _F.opponentPlayer;
    $character1.innerText = playerA.characterName;
    $score1.innerText = playerA.score.toString();
    $character2.innerText = playerB.characterName;
    $score2.innerText = playerB.score.toString();
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
    window.location.href = "/";
});
socket.on("gameOver", (msg) => {
    if (msg.id === thisPlayerId)
        localStorage.setItem("score", (_F.thisPlayer.score + 1).toString());
    alert(`Player ${msg.id === "A" ? "1" : "2"} has won with ${msg.name}! You will be redirected to the selection page.`);
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
        case "q":
            _F.thisPlayer.regen();
            break;
        case "s":
            _F.thisPlayer.specialAttack();
            break;
        case " ":
            _F.thisPlayer.transform();
            break;
    }
});
