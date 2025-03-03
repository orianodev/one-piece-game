import { characterStats } from "./data/charactersInfos.js";
import { def, defPos } from "./data/defaultSettings.js";
const $dom = {
    1: {
        character: document.querySelector("#character-1"),
        hpBar: document.querySelector("#hp-bar-1"),
        hp: document.querySelector("#hp-1"),
        manaBar: document.querySelector("#mana-bar-1"),
        mana: document.querySelector("#mana-1"),
        score: document.querySelector("#score-1"),
    },
    2: {
        character: document.querySelector("#character-2"),
        hpBar: document.querySelector("#hp-bar-2"),
        hp: document.querySelector("#hp-2"),
        manaBar: document.querySelector("#mana-bar-2"),
        mana: document.querySelector("#mana-2"),
        score: document.querySelector("#score-2"),
    }
};
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
        switch (this.dir) {
            case 1:
                $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
            case 2:
                $ctx.fillRect(this.x + def.playW + 5, this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
            case 3:
                $ctx.fillRect(this.x + def.playW + 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
                break;
            case 4:
                $ctx.fillRect(this.x + def.playW + 5, this.y + def.playH + 5, def.cursorSize, def.cursorSize);
                break;
            case 5:
                $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y + def.playH + 5, def.cursorSize, def.cursorSize);
                break;
            case 6:
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y + def.playH + 5, def.cursorSize, def.cursorSize);
                break;
            case 7:
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
                break;
            case 8:
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
        }
        _F.resetPen();
    }
    freeze() {
        if (_F.isThisPlayerFrozen)
            return false;
        _F.isThisPlayerFrozen = true;
        _F.unfreezeThisPlayer();
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
            $dom[1].character.style.color = def.rageTextColor;
        else if (this.id === "B")
            $dom[2].character.style.color = def.rageTextColor;
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
            $dom[1].character.style.color = def.normalTextColor;
        else if (this.id === "B")
            $dom[2].character.style.color = def.normalTextColor;
        this.rage = false;
        _F.updateServer();
    }
    getRageImg() {
        return this.sprite.src.replace("char", "rage");
    }
    move(direction) {
        switch (direction) {
            case 1:
                if (this.y < 0)
                    return;
                this.y -= this.speed;
                break;
            case 2:
                if (this.y < 0 || this.x > def.canvasWidth - def.playW)
                    return;
                this.x += this.speed / Math.SQRT2;
                this.y -= this.speed / Math.SQRT2;
                break;
            case 3:
                if (this.x > def.canvasWidth - def.playW)
                    return;
                this.x += this.speed;
                break;
            case 4:
                if (this.y > def.canvasHeight - def.playH || this.x > def.canvasWidth - def.playW)
                    return;
                this.x += this.speed / Math.SQRT2;
                this.y += this.speed / Math.SQRT2;
                break;
            case 5:
                if (this.y > def.canvasHeight - def.playH)
                    return;
                this.y += this.speed;
                break;
            case 6:
                if (this.y > def.canvasHeight - def.playH || this.x < 0)
                    return;
                this.x -= this.speed / Math.SQRT2;
                this.y += this.speed / Math.SQRT2;
                break;
            case 7:
                if (this.x < 0)
                    return;
                this.x -= this.speed;
                break;
            case 8:
                if (this.y < 0 || this.x < 0)
                    return;
                this.x -= this.speed / Math.SQRT2;
                this.y -= this.speed / Math.SQRT2;
                break;
        }
        this.dir = direction;
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
        switch (this.dir) {
            case 1:
                this.y -= owner.atkSpeed;
                break;
            case 2:
                this.x += owner.atkSpeed / Math.SQRT2;
                this.y -= owner.atkSpeed / Math.SQRT2;
                break;
            case 3:
                this.x += owner.atkSpeed;
                break;
            case 4:
                this.x += owner.atkSpeed / Math.SQRT2;
                this.y += owner.atkSpeed / Math.SQRT2;
                break;
            case 5:
                this.y += owner.atkSpeed;
                break;
            case 6:
                this.x -= owner.atkSpeed / Math.SQRT2;
                this.y += owner.atkSpeed / Math.SQRT2;
                break;
            case 7:
                this.x -= owner.atkSpeed;
                break;
            case 8:
                this.x -= owner.atkSpeed / Math.SQRT2;
                this.y -= owner.atkSpeed / Math.SQRT2;
                break;
        }
        this.checkCollisionWithBorder(owner);
        this.checkCollisionWithOpp(owner);
    }
    checkCollisionWithBorder(owner) {
        if (this.x <= 0 || this.x >= def.canvasWidth - def.atkW || this.y <= 0 || this.y >= def.canvasHeight - def.atkH)
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
    isThisPlayerFrozen = false;
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
    unfreezeThisPlayer() {
        setTimeout(() => this.isThisPlayerFrozen = false, def.freezeDelay);
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
                    this.oppPlayer.move(2);
                else if (horizontalDirection === 2 && verticalDirection === 3)
                    this.oppPlayer.move(4);
                else if (horizontalDirection === 4 && verticalDirection === 1)
                    this.oppPlayer.move(8);
                else if (horizontalDirection === 4 && verticalDirection === 3)
                    this.oppPlayer.move(6);
                else if (horizontalDirection === 2)
                    this.oppPlayer.move(3);
                else if (horizontalDirection === 4)
                    this.oppPlayer.move(7);
                else if (verticalDirection === 1)
                    this.oppPlayer.move(1);
                else if (verticalDirection === 3)
                    this.oppPlayer.move(5);
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
        this.updateLateralColumns(playerA);
        this.updateLateralColumns(playerB);
    }
    updateLateralColumns(player) {
        const playerDom = player.id === "A" ? $dom[1] : $dom[2];
        playerDom.character.style.color = player.rage ? def.rageTextColor : def.normalTextColor;
        const hpPercent = (player.hp / player.maxHp) * 100;
        const manaPercent = (player.mana / player.maxMana) * 100;
        playerDom.hpBar.style.width = `${hpPercent}%`;
        playerDom.hpBar.style.backgroundColor = player.hp <= player.maxHp * def.rageThreshold ? def.rageTextColor : def.normalHpColor;
        playerDom.hp.innerText = player.hp.toFixed(0);
        playerDom.manaBar.style.width = `${manaPercent}%`;
        playerDom.mana.innerText = player.mana.toFixed(0);
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
    preloadImages(thisPlayer, callback) {
        const imagePaths = [`/img/back/${stadium}`, thisPlayer.img, thisPlayer.atkImg, thisPlayer.img.replace("char", "rage")];
        let loadedImages = 0;
        const totalImages = imagePaths.length;
        imagePaths.forEach((path) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                loadedImages++;
                if (loadedImages === totalImages && callback)
                    callback();
            };
            img.onerror = () => {
                console.warn(`Failed to load image at ${path}`);
                loadedImages++;
                if (loadedImages === totalImages && callback)
                    callback();
            };
        });
        console.log("All images preloaded, starting the game...");
    }
    attachKeyboardEvent() {
        document.addEventListener("keydown", (event) => {
            _F.pressedKeys.add(event.key);
            _F.handleActionKeys(event.key);
        });
        document.addEventListener("keyup", (event) => {
            _F.pressedKeys.delete(event.key);
        });
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
                player.move(2);
            else if (movingUp && movingLeft)
                player.move(8);
            else if (movingDown && movingRight)
                player.move(4);
            else if (movingDown && movingLeft)
                player.move(6);
            else if (movingUp)
                player.move(1);
            else if (movingRight)
                player.move(3);
            else if (movingDown)
                player.move(5);
            else if (movingLeft)
                player.move(7);
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
let thisPlayerId;
const mode = localStorage.getItem("mode");
const roomId = parseInt(localStorage.getItem("roomId"));
const _F = new Fight(roomId, mode, "playing");
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
    $dom[1].character.innerText = thisPlayer.charName;
    $dom[1].score.innerText = thisScore.toString();
    $dom[2].character.innerText = aiPlayer.charName;
    $dom[2].score.innerText = "0";
    _F.preloadImages(thisPlayer, () => {
        _F.preloadImages(aiPlayer, () => {
            showGameScreen();
            soloGameRefresh();
            aiActionInterval(aiLevel);
        });
    });
    _F.attachKeyboardEvent();
    _F.updateMovement();
}
let $ctx;
function showGameScreen() {
    const $canvas = document.querySelector("#canvas");
    $canvas.width = def.canvasWidth * def.canvasScaleMult;
    $canvas.height = def.canvasHeight * def.canvasScaleMult;
    $canvas.style.width = `${def.canvasWidth}px`;
    $canvas.style.height = `${def.canvasHeight}px`;
    $ctx = $canvas.getContext("2d");
    $ctx.scale(def.canvasScaleMult, def.canvasScaleMult);
    const $playScreen = document.querySelector("#play");
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
    _F.preloadImages(thisPlayer, () => {
        socket.emit("postPlayer", { thisPlayer, roomId: _F.roomId, playerId });
    });
});
socket.on("start", (msg) => {
    thisPlayerId === "A" ? _F.buildPlayers(msg.A, msg.B) : _F.buildPlayers(msg.B, msg.A);
    const playerA = _F.thisPlayer.id === "A" ? _F.thisPlayer : _F.oppPlayer;
    const playerB = _F.thisPlayer.id === "B" ? _F.thisPlayer : _F.oppPlayer;
    $dom[1].score.innerText = playerA.charName;
    $dom[1].score.innerText = playerA.score.toString();
    $dom[2].score.innerText = playerB.charName;
    $dom[2].score.innerText = playerB.score.toString();
    _F.attachKeyboardEvent();
    _F.updateMovement();
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
