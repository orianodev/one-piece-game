import { def } from "../../data/settings.js";
import { $ctx, displayPopup, updateLateralColumns } from "../ui.js";
import { socket } from "../online.js";
import { Player } from "./Player.js";
import { Attack } from "./Attack.js";
export class Game {
    thisPlayerId = 1;
    oppPlayerId = 2;
    thisPlayer;
    oppPlayer;
    isThisPlayerFrozen = false;
    roomId = parseInt(localStorage.getItem("roomId"));
    mode = localStorage.getItem("mode");
    status = "loading";
    pressedKeys = new Set();
    frameCount = 0;
    timerInterval;
    timerSeconds = 0;
    botActionLoop;
    constructor(state) {
        this.status = state;
    }
    startTimer() {
        this.timerSeconds = 0;
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            this.updateTimerDisplay();
        }, 1000);
    }
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
        }
    }
    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        const timerElement = document.querySelector("#game-timer");
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    unfreezeThisPlayer() {
        setTimeout(() => this.isThisPlayerFrozen = false, def.freezeDelay);
    }
    botAction() {
        if (this.thisPlayer.hp <= 0 || this.oppPlayer.hp <= 0)
            this.endSoloGame();
        const botActions = ["move", "move", "attack", "super", "heal", "regen", "rage"];
        let attempt = 0;
        const maxAttempts = 10;
        while (attempt < maxAttempts) {
            const botChoice = botActions[Math.floor(Math.random() * botActions.length)];
            if (botChoice === "move") {
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
            else if (botChoice === "attack") {
                this.oppPlayer.attack();
                break;
            }
            else if (botChoice === "super" && this.oppPlayer.mana >= this.oppPlayer.attackCost * def.superManaMult) {
                this.oppPlayer.superAttack();
                break;
            }
            else if (botChoice === "heal" && this.oppPlayer.hp < this.oppPlayer.maxHp + this.oppPlayer.healPow) {
                this.oppPlayer.heal();
                break;
            }
            else if (botChoice === "regen" && this.oppPlayer.mana < this.oppPlayer.maxMana + this.oppPlayer.regenPow) {
                this.oppPlayer.regen();
                break;
            }
            else if (botChoice === "rage" && !this.oppPlayer.rage && this.oppPlayer.hp <= this.oppPlayer.maxHp * def.rageThreshold) {
                this.oppPlayer.enrage();
                break;
            }
            attempt++;
        }
    }
    buildPlayers(thisPlayer, oppPlayer) {
        this.thisPlayer = new Player(thisPlayer.id, thisPlayer.charId, thisPlayer.charName, thisPlayer.color, thisPlayer.img, thisPlayer.score, thisPlayer.x, thisPlayer.y, thisPlayer.dir, thisPlayer.speed, thisPlayer.hp, thisPlayer.maxHp, thisPlayer.healPow, thisPlayer.mana, thisPlayer.maxMana, thisPlayer.regenPow, thisPlayer.strength, thisPlayer.attackName, thisPlayer.attackCost, thisPlayer.attackSpeed, []);
        this.oppPlayer = new Player(oppPlayer.id, oppPlayer.charId, oppPlayer.charName, oppPlayer.color, oppPlayer.img, oppPlayer.score, oppPlayer.x, oppPlayer.y, oppPlayer.dir, oppPlayer.speed, oppPlayer.hp, oppPlayer.maxHp, oppPlayer.healPow, oppPlayer.mana, oppPlayer.maxMana, oppPlayer.regenPow, oppPlayer.strength, oppPlayer.attackName, oppPlayer.attackCost, oppPlayer.attackSpeed, []);
        this.oppPlayer.sprite.src = this.oppPlayer.img;
        this.oppPlayer.attackSprite.src = this.oppPlayer.attackName;
        this.thisPlayer.sprite.src = this.thisPlayer.img;
        this.thisPlayer.attackSprite.src = this.thisPlayer.attackName;
    }
    updatePlayers(thisPlayer, oppPlayer) {
        this.thisPlayer.rage = thisPlayer[0];
        this.thisPlayer.x = thisPlayer[1];
        this.thisPlayer.y = thisPlayer[2];
        this.thisPlayer.dir = thisPlayer[3];
        this.thisPlayer.hp = thisPlayer[4];
        this.thisPlayer.mana = thisPlayer[5];
        this.thisPlayer.attacks = this.rebuildAttackArray(thisPlayer[6]);
        this.oppPlayer.rage = oppPlayer[0];
        this.oppPlayer.x = oppPlayer[1];
        this.oppPlayer.y = oppPlayer[2];
        this.oppPlayer.dir = oppPlayer[3];
        this.oppPlayer.hp = oppPlayer[4];
        this.oppPlayer.mana = oppPlayer[5];
        this.oppPlayer.attacks = this.rebuildAttackArray(oppPlayer[6]);
    }
    getPlayerDeltaAttributes(player) {
        return [player.rage, Math.round(player.x), Math.round(player.y), player.dir, Math.round(player.hp), Math.round(player.mana), this.getAttackDeltaAttributes(player.attacks)];
    }
    getAttackDeltaAttributes(attacks) {
        return attacks.map((attack) => [attack.id, attack.type, attack.x, attack.y, attack.dir]);
    }
    updateServer() {
        if (this.mode === "dual") {
            socket.emit("update", { roomId: this.roomId, 1: this.getPlayerDeltaAttributes(this.thisPlayerId == 1 ? this.thisPlayer : this.oppPlayer), 2: this.getPlayerDeltaAttributes(this.thisPlayerId == 1 ? this.oppPlayer : this.thisPlayer) });
        }
    }
    ;
    drawAll() {
        $ctx.clearRect(0, 0, def.canvasWidth, def.canvasHeight);
        this.thisPlayer.draw();
        this.oppPlayer.draw();
        this.thisPlayer.attacks.forEach((attack) => attack.draw());
        this.oppPlayer.attacks.forEach((attack) => attack.draw());
        updateLateralColumns(this.thisPlayer);
        updateLateralColumns(this.oppPlayer);
    }
    rebuildAttackArray(flattedAttackArray) {
        return flattedAttackArray.map((attack) => new Attack(attack[0], attack[1], attack[2], attack[3], attack[4]));
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
    attachKeyboardEvent() {
        document.addEventListener("keydown", (event) => {
            this.pressedKeys.add(event.key);
            this.handleActionKeys(event.key);
        });
        document.addEventListener("keyup", (event) => {
            this.pressedKeys.delete(event.key);
        });
    }
    handleActionKeys(key) {
        switch (key) {
            case "z":
                this.thisPlayer.attack();
                break;
            case "d":
                this.thisPlayer.heal();
                break;
            case "q":
                this.thisPlayer.regen();
                break;
            case "s":
                this.thisPlayer.superAttack();
                break;
            case " ":
                this.thisPlayer.enrage();
                break;
        }
    }
    startBotActionLoop(botLevel) {
        this.botActionLoop = setInterval(this.botAction.bind(this), def.botLvlInterval[botLevel]);
    }
    updateMovement() {
        if (this.frameCount % def.refresh60fpsDivider === 0) {
            if (this.status === "playing") {
                this.thisPlayer.attacks.forEach((attack) => attack.move());
                this.oppPlayer.attacks.forEach((attack) => attack.move());
                const movingUp = this.pressedKeys.has("ArrowUp");
                const movingRight = this.pressedKeys.has("ArrowRight");
                const movingDown = this.pressedKeys.has("ArrowDown");
                const movingLeft = this.pressedKeys.has("ArrowLeft");
                if (movingUp && movingRight)
                    this.thisPlayer.move(2);
                else if (movingUp && movingLeft)
                    this.thisPlayer.move(8);
                else if (movingDown && movingRight)
                    this.thisPlayer.move(4);
                else if (movingDown && movingLeft)
                    this.thisPlayer.move(6);
                else if (movingUp)
                    this.thisPlayer.move(1);
                else if (movingRight)
                    this.thisPlayer.move(3);
                else if (movingDown)
                    this.thisPlayer.move(5);
                else if (movingLeft)
                    this.thisPlayer.move(7);
                this.drawAll();
            }
        }
        this.frameCount++;
        requestAnimationFrame(this.updateMovement.bind(this));
    }
    endSoloGame() {
        this.status = "over";
        this.stopTimer();
        clearInterval(this.botActionLoop);
        this.botActionLoop = undefined;
        const winnerName = this.thisPlayer.hp <= 0 ? this.oppPlayer.charName : this.thisPlayer.charName;
        if (this.thisPlayer.hp <= 0) {
            localStorage.setItem("scoreBot", (this.oppPlayer.score + 1).toString());
            displayPopup(`Tu as perdu face à ${winnerName}.`, true, true);
        }
        else if (this.oppPlayer.hp <= 0) {
            localStorage.setItem("scoreThis", (this.thisPlayer.score + 1).toString());
            displayPopup(`Tu as gagné avec ${winnerName} !`, true, true);
        }
    }
}
