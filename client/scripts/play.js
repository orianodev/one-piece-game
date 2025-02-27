import { characterStats } from "./charactersStats.js";
import { def, defPos } from "./defaultSettings.js";
const $playScreen = document.querySelector("#play");
const $canvas = document.querySelector("#canvas");
const $ctx = $canvas.getContext("2d");
$canvas.width = def.canvasWidth * def.canvasScaleMult;
$canvas.height = def.canvasHeight * def.canvasScaleMult;
$canvas.style.width = `${def.canvasWidth}px`;
$canvas.style.height = `${def.canvasHeight}px`;
$ctx.scale(def.canvasScaleMult, def.canvasScaleMult);
const $character1 = document.querySelector("#character-1");
const $hpBar1 = document.querySelector("#hp-bar-1");
const $hp1 = document.querySelector("#hp-1");
const $manaBar1 = document.querySelector("#mana-bar-1");
const $mana1 = document.querySelector("#mana-1");
const $score1 = document.querySelector("#score-1");
const $character2 = document.querySelector("#character-2");
const $hpBar2 = document.querySelector("#hp-bar-2");
const $hp2 = document.querySelector("#hp-2");
const $manaBar2 = document.querySelector("#mana-bar-2");
const $mana2 = document.querySelector("#mana-2");
const $score2 = document.querySelector("#score-2");
class Player {
    id;
    charId;
    charName;
    color;
    img;
    sprite = new Image(def.playW, def.playH);
    atkSprite = new Image(def.atkW, def.atkH);
    score;
    rage = false;
    x;
    y;
    dir;
    speed;
    hp;
    maxHp;
    healPow;
    mana;
    maxMana;
    regenPow;
    strength;
    atkImg;
    atkCost;
    atkSpeed;
    atks;
    constructor(id, charId, charName, color, img, score, x, y, dir, speed, hp, maxHp, healPow, mana, maxMana, regenPow, strength, atkImg, atkCost, atkSpeed, atks) {
        this.id = id;
        this.charId = charId;
        this.charName = charName;
        this.color = color;
        this.img = img;
        this.score = score;
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = speed;
        this.hp = hp;
        this.maxHp = maxHp;
        this.healPow = healPow;
        this.mana = mana;
        this.maxMana = maxMana;
        this.regenPow = regenPow;
        this.strength = strength;
        this.atkImg = atkImg;
        this.atkCost = atkCost;
        this.atkSpeed = atkSpeed;
        this.atks = atks;
    }
    draw() {
        $ctx.globalAlpha = 1;
        _F.setShadow(this.color);
        $ctx.drawImage(this.sprite, this.x, this.y, def.playW, def.playH);
        $ctx.globalAlpha = 0.5;
        if (this.dir === 1)
            $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
        if (this.dir === 3)
            $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y + def.playH + 5, def.cursorSize, def.cursorSize);
        if (this.dir === 4)
            $ctx.fillRect(this.x - def.cursorSize - 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
        if (this.dir === 2)
            $ctx.fillRect(this.x + def.playW + 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
        _F.resetPen();
    }
    freeze() {
        if (isFrozen)
            return false;
        isFrozen = true;
        unfreezeThisPlayer();
        return true;
    }
    atk() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze())
            return;
        if (this.mana < this.atkCost)
            return;
        this.mana -= this.atkCost;
        const atk = new Atk(this.id, "sim", this.x + def.playW / 2, this.y + def.playH / 2, this.dir);
        this.atks.push(atk);
        atk.draw();
        _F.updateServer();
    }
    superAtk() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze())
            return;
        if (this.mana < this.atkCost * def.superManaMult)
            return;
        this.mana -= this.atkCost * def.superManaMult;
        const atk = new Atk(this.id, "sup", this.x + def.playW / 2 - def.atkW, this.y + def.playH / 2 - def.atkH, this.dir);
        this.atks.push(atk);
        atk.draw();
        _F.updateServer();
    }
    heal() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze())
            return;
        if (this.hp + this.healPow > this.maxHp)
            this.hp = this.maxHp;
        if (this.hp === this.maxHp)
            return;
        this.hp += this.healPow;
        _F.updateServer();
    }
    regen() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze())
            return;
        if (this.mana + this.regenPow > this.maxMana)
            this.mana = this.maxMana;
        if (this.mana === this.maxMana)
            return;
        this.mana += this.regenPow;
        _F.updateServer();
    }
    enrage() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze())
            return console.log("Rage disabled in freeze mode");
        if (this.rage || this.hp > this.maxHp * def.rageThreshold)
            return console.log("Already enraged or HP above threshold");
        this.rage = true;
        this.speed *= def.rageSpeedMult;
        this.strength *= def.rageStrengthMult;
        this.atkSpeed *= def.rageAtkSpeedMult;
        this.regenPow *= def.rageRegenFactor;
        this.healPow *= def.rageHealFactor;
        this.sprite.src = this.getRageImg();
        if (this.id === "A")
            $character1.style.color = def.rageTextColor;
        else if (this.id === "B")
            $character2.style.color = def.rageTextColor;
        setTimeout(() => this.unRage(this.img), def.rageDuration);
        _F.updateServer();
    }
    unRage(defaultSpriteSrc) {
        this.sprite.src = defaultSpriteSrc;
        this.speed = characterStats[this.charId].speed;
        this.strength = characterStats[this.charId].strength;
        this.regenPow = characterStats[this.charId].regenPow;
        this.healPow = characterStats[this.charId].healPow;
        if (this.id === "A")
            $character1.style.color = def.normalTextColor;
        else if (this.id === "B")
            $character2.style.color = def.normalTextColor;
        this.rage = false;
        _F.updateServer();
    }
    getRageImg() {
        return this.sprite.src.replace("char", "rage");
    }
    moveUp() {
        if (this.y < 0)
            return;
        this.dir = 1;
        this.y -= this.speed;
        _F.drawAll();
        _F.updateServer();
    }
    moveDown() {
        if (this.y > def.canvasHeight - def.playH)
            return;
        this.dir = 3;
        this.y += this.speed;
        _F.drawAll();
        _F.updateServer();
    }
    moveLeft() {
        if (this.x < 0)
            return;
        this.dir = 4;
        this.x -= this.speed;
        _F.drawAll();
        _F.updateServer();
    }
    moveRight() {
        if (this.x > def.canvasWidth - def.playW)
            return;
        this.dir = 2;
        this.x += this.speed;
        _F.drawAll();
        _F.updateServer();
    }
    moveUpRight() {
        if (this.y < 0 || this.x > def.canvasWidth - def.playW)
            return;
        this.dir = 2;
        this.x += this.speed / Math.SQRT2;
        this.y -= this.speed / Math.SQRT2;
        _F.drawAll();
        _F.updateServer();
    }
    moveUpLeft() {
        if (this.y < 0 || this.x < 0)
            return;
        this.dir = 4;
        this.x -= this.speed / Math.SQRT2;
        this.y -= this.speed / Math.SQRT2;
        _F.drawAll();
        _F.updateServer();
    }
    moveDownRight() {
        if (this.y > def.canvasHeight - def.playH || this.x > def.canvasWidth - def.playW)
            return;
        this.dir = 2;
        this.x += this.speed / Math.SQRT2;
        this.y += this.speed / Math.SQRT2;
        _F.drawAll();
        _F.updateServer();
    }
    moveDownLeft() {
        if (this.y > def.canvasHeight - def.playH || this.x < 0)
            return;
        this.dir = 4;
        this.x -= this.speed / Math.SQRT2;
        this.y += this.speed / Math.SQRT2;
        _F.drawAll();
        _F.updateServer();
    }
}
class Atk {
    id;
    type;
    x;
    y;
    dir;
    constructor(owner, type, x, y, dir) {
        this.id = owner;
        this.type = type;
        this.x = x;
        this.y = y;
        this.dir = dir;
    }
    draw() {
        const owner = _F.getPlayer(this.id);
        _F.setShadow(owner.color);
        if (this.type === "sim")
            $ctx.drawImage(owner.atkSprite, this.x, this.y, def.atkW, def.atkH);
        if (this.type === "sup")
            $ctx.drawImage(owner.atkSprite, this.x, this.y, def.atkW * def.superSizeMult, def.atkH * def.superSizeMult);
        _F.resetPen();
    }
    move() {
        const owner = _F.thisPlayer.id === this.id ? _F.thisPlayer : _F.oppPlayer;
        if (this.dir == 4)
            this.x -= owner.atkSpeed;
        if (this.dir == 2)
            this.x += owner.atkSpeed;
        if (this.dir == 1)
            this.y -= owner.atkSpeed;
        if (this.dir == 3)
            this.y += owner.atkSpeed;
        this.checkCollisionWithBorder(owner);
        this.checkCollisionWithOpp(owner);
    }
    checkCollisionWithBorder(owner) {
        if (this.dir == 4 && this.x <= 0)
            this.destroy(owner);
        if (this.dir == 2 && this.x >= def.canvasWidth - def.atkW)
            this.destroy(owner);
        if (this.dir == 1 && this.y <= 0)
            this.destroy(owner);
        if (this.dir == 3 && this.y >= def.canvasHeight - def.atkH)
            this.destroy(owner);
    }
    checkCollisionWithOpp(owner) {
        const opp = _F.thisPlayer.id === this.id ? _F.oppPlayer : _F.thisPlayer;
        const oppCenter = { x: opp.x + def.playW / 2, y: opp.y + def.playH * 0.4 };
        const thisAtkCenter = { x: this.x + def.atkW / 2, y: this.y + def.atkH / 2 };
        const distance = Math.sqrt(Math.pow(oppCenter.x - thisAtkCenter.x, 2) + Math.pow(oppCenter.y - thisAtkCenter.y, 2));
        if (distance < def.collisionDist) {
            opp.hp -= this.type === "sim" ? owner.strength : owner.strength * def.superDamageMult;
            this.destroy(owner);
        }
    }
    destroy(owner) {
        owner.atks.splice(owner.atks.indexOf(this), 1);
        _F.updateServer();
    }
}
class Fight {
    thisPlayer;
    oppPlayer;
    roomId;
    mode;
    state;
    pressedKeys = new Set();
    frameCount = 0;
    constructor(roomId, mode, state) {
        this.roomId = roomId;
        this.mode = mode;
        this.state = state;
    }
    getPlayer(playerId) {
        return playerId === this.thisPlayer.id ? this.thisPlayer : this.oppPlayer;
    }
    aiAction() {
        const aiActions = ["move", "move", "atk", "super", "heal", "regen", "rage"];
        let attempt = 0;
        const maxAttempts = 10;
        while (attempt < maxAttempts) {
            const aiChoice = aiActions[Math.floor(Math.random() * aiActions.length)];
            if (aiChoice === "move") {
                const xDiff = this.thisPlayer.x - this.oppPlayer.x;
                const yDiff = this.thisPlayer.y - this.oppPlayer.y;
                const threshold = def.playW / 3;
                let horizontalDirection = null;
                let verticalDirection = null;
                if (xDiff > threshold)
                    horizontalDirection = 2;
                else if (xDiff < -threshold)
                    horizontalDirection = 4;
                if (yDiff > threshold)
                    verticalDirection = 3;
                else if (yDiff < -threshold)
                    verticalDirection = 1;
                if (horizontalDirection === 2 && verticalDirection === 1)
                    this.oppPlayer.moveUpRight();
                else if (horizontalDirection === 2 && verticalDirection === 3)
                    this.oppPlayer.moveDownRight();
                else if (horizontalDirection === 4 && verticalDirection === 1)
                    this.oppPlayer.moveUpLeft();
                else if (horizontalDirection === 4 && verticalDirection === 3)
                    this.oppPlayer.moveDownLeft();
                else if (horizontalDirection === 2)
                    this.oppPlayer.moveRight();
                else if (horizontalDirection === 4)
                    this.oppPlayer.moveLeft();
                else if (verticalDirection === 1)
                    this.oppPlayer.moveUp();
                else if (verticalDirection === 3)
                    this.oppPlayer.moveDown();
            }
            else if (aiChoice === "atk") {
                this.oppPlayer.atk();
                break;
            }
            else if (aiChoice === "super" && this.oppPlayer.mana >= this.oppPlayer.atkCost * def.superManaMult) {
                this.oppPlayer.superAtk();
                break;
            }
            else if (aiChoice === "heal" && this.oppPlayer.hp < this.oppPlayer.maxHp + this.oppPlayer.healPow) {
                this.oppPlayer.heal();
                break;
            }
            else if (aiChoice === "regen" && this.oppPlayer.mana < this.oppPlayer.maxMana + this.oppPlayer.regenPow) {
                this.oppPlayer.regen();
                break;
            }
            else if (aiChoice === "rage" && !this.oppPlayer.rage && this.oppPlayer.hp <= this.oppPlayer.maxHp * def.rageThreshold) {
                this.oppPlayer.enrage();
                break;
            }
            attempt++;
        }
    }
    buildPlayers(thisPlayer, oppPlayer) {
        _F.thisPlayer = new Player(thisPlayer.id, thisPlayer.charId, thisPlayer.charName, thisPlayer.color, thisPlayer.img, thisPlayer.score, thisPlayer.x, thisPlayer.y, thisPlayer.dir, thisPlayer.speed, thisPlayer.hp, thisPlayer.maxHp, thisPlayer.healPow, thisPlayer.mana, thisPlayer.maxMana, thisPlayer.regenPow, thisPlayer.strength, thisPlayer.atkImg, thisPlayer.atkCost, thisPlayer.atkSpeed, []);
        _F.oppPlayer = new Player(oppPlayer.id, oppPlayer.charId, oppPlayer.charName, oppPlayer.color, oppPlayer.img, oppPlayer.score, oppPlayer.x, oppPlayer.y, oppPlayer.dir, oppPlayer.speed, oppPlayer.hp, oppPlayer.maxHp, oppPlayer.healPow, oppPlayer.mana, oppPlayer.maxMana, oppPlayer.regenPow, oppPlayer.strength, oppPlayer.atkImg, oppPlayer.atkCost, oppPlayer.atkSpeed, []);
        _F.oppPlayer.sprite.src = _F.oppPlayer.img;
        _F.oppPlayer.atkSprite.src = _F.oppPlayer.atkImg;
        _F.thisPlayer.sprite.src = _F.thisPlayer.img;
        _F.thisPlayer.atkSprite.src = _F.thisPlayer.atkImg;
    }
    updatePlayers(thisPlayer, oppPlayer) {
        _F.thisPlayer.rage = thisPlayer[0];
        _F.thisPlayer.x = thisPlayer[1];
        _F.thisPlayer.y = thisPlayer[2];
        _F.thisPlayer.dir = thisPlayer[3];
        _F.thisPlayer.hp = thisPlayer[4];
        _F.thisPlayer.mana = thisPlayer[5];
        _F.thisPlayer.atks = this.rebuildAtkArray(thisPlayer[6]);
        _F.oppPlayer.rage = oppPlayer[0];
        _F.oppPlayer.x = oppPlayer[1];
        _F.oppPlayer.y = oppPlayer[2];
        _F.oppPlayer.dir = oppPlayer[3];
        _F.oppPlayer.hp = oppPlayer[4];
        _F.oppPlayer.mana = oppPlayer[5];
        _F.oppPlayer.atks = this.rebuildAtkArray(oppPlayer[6]);
    }
    getPlayerDeltaAttributes(player) {
        return [player.rage, Math.round(player.x), Math.round(player.y), player.dir, Math.round(player.hp), Math.round(player.mana), this.getAtkDeltaAttributes(player.atks)];
    }
    getAtkDeltaAttributes(atks) {
        return atks.map((atk) => [atk.id, atk.type, atk.x, atk.y, atk.dir]);
    }
    updateServer() {
        if (_F.mode === "solo")
            return;
        if (thisPlayerId == "A")
            socket.emit("update", { roomId: _F.roomId, A: this.getPlayerDeltaAttributes(_F.thisPlayer), B: this.getPlayerDeltaAttributes(_F.oppPlayer) });
        else if (thisPlayerId == "B")
            socket.emit("update", { roomId: _F.roomId, A: this.getPlayerDeltaAttributes(_F.oppPlayer), B: this.getPlayerDeltaAttributes(_F.thisPlayer) });
    }
    ;
    drawAll() {
        $ctx.clearRect(0, 0, def.canvasWidth, def.canvasHeight);
        this.thisPlayer.draw();
        this.oppPlayer.draw();
        this.thisPlayer.atks.forEach((atk) => atk.draw());
        this.oppPlayer.atks.forEach((atk) => atk.draw());
        const playerA = this.thisPlayer.id === "A" ? this.thisPlayer : this.oppPlayer;
        const playerB = this.thisPlayer.id === "B" ? this.thisPlayer : this.oppPlayer;
        $character1.style.color = playerA.rage ? def.rageTextColor : def.normalTextColor;
        $character2.style.color = playerB.rage ? def.rageTextColor : def.normalTextColor;
        const hpPercentA = (playerA.hp / playerA.maxHp) * 100;
        $hpBar1.style.width = `${hpPercentA}%`;
        $hpBar1.style.backgroundColor = playerA.hp <= playerA.maxHp * def.rageThreshold ? def.rageTextColor : '#ff4d4d';
        $hp1.innerText = playerA.hp.toFixed(0);
        const manaPercentA = (playerA.mana / playerA.maxMana) * 100;
        $manaBar1.style.width = `${manaPercentA}%`;
        $mana1.innerText = playerA.mana.toFixed(0);
        const hpPercentB = (playerB.hp / playerB.maxHp) * 100;
        $hpBar2.style.width = `${hpPercentB}%`;
        $hpBar2.style.backgroundColor = playerB.hp <= playerB.maxHp * def.rageThreshold ? def.rageTextColor : '#ff4d4d';
        $hp2.innerText = playerB.hp.toFixed(0);
        const manaPercentB = (playerB.mana / playerB.maxMana) * 100;
        $manaBar2.style.width = `${manaPercentB}%`;
        $mana2.innerText = playerB.mana.toFixed(0);
    }
    rebuildAtkArray(flattedAtkArray) {
        return flattedAtkArray.map((atk) => new Atk(atk[0], atk[1], atk[2], atk[3], atk[4]));
    }
    resetPen() {
        $ctx.globalAlpha = 1;
        $ctx.shadowBlur = 0;
        $ctx.shadowOffsetX = 0;
        $ctx.shadowOffsetY = 0;
        $ctx.shadowColor = "black";
    }
    setShadow(color) {
        $ctx.shadowBlur = def.shadowBlur;
        $ctx.shadowColor = color;
    }
    handleActionKeys(key) {
        switch (key) {
            case "z":
                _F.thisPlayer.atk();
                break;
            case "d":
                _F.thisPlayer.heal();
                break;
            case "q":
                _F.thisPlayer.regen();
                break;
            case "s":
                _F.thisPlayer.superAtk();
                break;
            case " ":
                _F.thisPlayer.enrage();
                break;
        }
    }
    updateMovement() {
        if (this.frameCount % def.move60fpsRAFDivider === 0) {
            const player = _F.thisPlayer;
            const movingUp = this.pressedKeys.has("ArrowUp");
            const movingRight = this.pressedKeys.has("ArrowRight");
            const movingDown = this.pressedKeys.has("ArrowDown");
            const movingLeft = this.pressedKeys.has("ArrowLeft");
            if (movingUp && movingRight)
                player.moveUpRight();
            else if (movingUp && movingLeft)
                player.moveUpLeft();
            else if (movingDown && movingRight)
                player.moveDownRight();
            else if (movingDown && movingLeft)
                player.moveDownLeft();
            else if (movingUp)
                player.moveUp();
            else if (movingRight)
                player.moveRight();
            else if (movingDown)
                player.moveDown();
            else if (movingLeft)
                player.moveLeft();
        }
        this.frameCount++;
        requestAnimationFrame(this.updateMovement.bind(this));
    }
}
const $popup = document.querySelector("#popup");
const $home = document.querySelector("#home");
const $restart = document.querySelector("#restart");
$restart.addEventListener("click", () => window.location.reload());
$home.addEventListener("click", () => window.location.href = "/");
function displayPopup(msg, displayRestart) {
    $popup.style.display = 'flex';
    $popup.querySelector("#message").textContent = msg;
    if (displayRestart)
        $restart.style.display = 'flex';
    else
        $restart.style.display = 'none';
}
const $loadingScreen = document.querySelector("#loading-screen");
const randomImg = Math.floor(Math.random() * 5);
$loadingScreen.style.backgroundImage = `url(/img/wait/${randomImg}.gif)`;
displayPopup("Chargement en cours...", false);
const stadium = localStorage.getItem("stadium");
const $wallpaper = document.querySelector("#wallpaper");
$wallpaper.style.backgroundImage = `url(/img/back/${stadium})`;
$wallpaper.style.backgroundImage = `url(/img/back/${stadium})`;
let thisPlayerId;
const mode = localStorage.getItem("mode");
const roomId = parseInt(localStorage.getItem("roomId"));
const _F = new Fight(roomId, mode, "playing");
let isFrozen = false;
function unfreezeThisPlayer() {
    setTimeout(() => isFrozen = false, def.freezeDelay);
}
function soloGameSetup() {
    const thisScore = parseInt(localStorage.getItem("score"));
    thisPlayerId = "A";
    const thisCharacterId = localStorage.getItem("characterId");
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer = new Player("A", thisCharacterId, thisCharacter.name, thisCharacter.color, thisCharacter.img, thisScore, defPos.A.x, defPos.A.y, 2, thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healPow, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPow, thisCharacter.strength, thisCharacter.atkImg, thisCharacter.atkCost, thisCharacter.atkSpeed, []);
    const charactersIdList = Object.keys(characterStats).filter((id) => id !== thisCharacterId);
    const aiCharacterId = charactersIdList[Math.floor(Math.random() * charactersIdList.length)];
    const aiCharacter = characterStats[aiCharacterId];
    const aiPlayer = new Player("B", aiCharacterId, aiCharacter.name, aiCharacter.color, aiCharacter.img, 0, defPos.B.x, defPos.B.y, 4, aiCharacter.speed, aiCharacter.hp, aiCharacter.maxHp, aiCharacter.healPow, aiCharacter.mana, aiCharacter.maxMana, aiCharacter.regenPow, aiCharacter.strength, aiCharacter.atkImg, aiCharacter.atkCost, aiCharacter.atkSpeed, []);
    const aiLevel = localStorage.getItem("aiLevel");
    _F.buildPlayers(thisPlayer, aiPlayer);
    $character1.innerText = thisPlayer.charName;
    $score1.innerText = thisScore.toString();
    $character2.innerText = aiPlayer.charName;
    $score2.innerText = "0";
    showGameScreen();
    soloGameRefresh();
    aiActionInterval(aiLevel);
}
function showGameScreen() {
    $playScreen.style.display = "flex";
    $loadingScreen.style.display = "none";
    $popup.style.display = "none";
}
function soloGameRefresh() {
    setInterval(() => {
        if (_F.state === "over")
            return;
        if (_F.thisPlayer.hp <= 0 || _F.oppPlayer.hp <= 0) {
            _F.state = "over";
            const winnerName = _F.thisPlayer.hp <= 0 ? _F.oppPlayer.charName : _F.thisPlayer.charName;
            if (_F.thisPlayer.hp <= 0)
                displayPopup(`Tu as perdu face à ${winnerName}.`, true);
            else if (_F.oppPlayer.hp <= 0) {
                localStorage.setItem("score", (_F.thisPlayer.score + 1).toString());
                displayPopup(`Tu as gagné avec ${winnerName} !`, true);
            }
        }
        _F.thisPlayer.atks.forEach((atk) => atk.move());
        _F.oppPlayer.atks.forEach((atk) => atk.move());
        _F.drawAll();
    }, def.refreshRate);
}
function aiActionInterval(aiLevel) {
    setInterval(() => {
        if (_F.state === "over")
            return;
        _F.aiAction(), def.aiLvlInterval[aiLevel];
    }, def.aiLvlInterval[aiLevel]);
}
function dualGameRefresh() {
    setInterval(() => {
        if (_F.state === "over")
            return;
        _F.thisPlayer.atks.forEach((atk) => atk.move());
        _F.oppPlayer.atks.forEach((atk) => atk.move());
        _F.drawAll();
    }, def.refreshRate);
}
document.addEventListener("keydown", (event) => {
    _F.pressedKeys.add(event.key);
    _F.handleActionKeys(event.key);
});
document.addEventListener("keyup", (event) => {
    _F.pressedKeys.delete(event.key);
});
_F.updateMovement();
const socket = io();
if (_F.mode === "dual")
    socket.emit("askId", _F.roomId);
else if (_F.mode === "solo")
    soloGameSetup();
socket.on("stop", () => {
    displayPopup("Ton adversaire s'est deconnecté.", false);
});
socket.on("busy", () => {
    displayPopup("Cette partie est occupée, choisis un autre ID de jeu.", false);
});
socket.on("getId", (playerId) => {
    if (!thisPlayerId)
        thisPlayerId = playerId;
    displayPopup("En attente de l'adversaire...", false);
    const thisScore = parseInt(localStorage.getItem("score"));
    const thisCharacterId = localStorage.getItem("characterId");
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer = {
        id: playerId, charId: thisCharacterId, charName: thisCharacter.name, color: thisCharacter.color, img: thisCharacter.img, score: thisScore, rage: false, x: defPos[playerId].x, y: defPos[playerId].y, dir: thisPlayerId === "A" ? 2 : 4, speed: thisCharacter.speed, hp: thisCharacter.hp, maxHp: thisCharacter.maxHp, healPow: thisCharacter.healPow, mana: thisCharacter.mana, maxMana: thisCharacter.maxMana, regenPow: thisCharacter.regenPow, strength: thisCharacter.strength, atkImg: thisCharacter.atkImg, atkCost: thisCharacter.atkCost, atkSpeed: thisCharacter.atkSpeed
    };
    socket.emit("postPlayer", { thisPlayer, roomId: _F.roomId, playerId });
});
socket.on("start", (msg) => {
    thisPlayerId === "A" ? _F.buildPlayers(msg.A, msg.B) : _F.buildPlayers(msg.B, msg.A);
    const playerA = _F.thisPlayer.id === "A" ? _F.thisPlayer : _F.oppPlayer;
    const playerB = _F.thisPlayer.id === "B" ? _F.thisPlayer : _F.oppPlayer;
    $character1.innerText = playerA.charName;
    $score1.innerText = playerA.score.toString();
    $character2.innerText = playerB.charName;
    $score2.innerText = playerB.score.toString();
    showGameScreen();
    dualGameRefresh();
});
socket.on("update", (msg) => {
    thisPlayerId === "A" ? _F.updatePlayers(msg.A, msg.B) : _F.updatePlayers(msg.B, msg.A);
    _F.drawAll();
});
socket.on("over", (msg) => {
    if (msg === thisPlayerId)
        localStorage.setItem("score", (_F.thisPlayer.score + 1).toString());
    displayPopup(`Le joueur ${msg === "A" ? "1" : "2"} a gagné!`, false);
});
