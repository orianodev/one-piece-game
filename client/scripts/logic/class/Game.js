import { def } from "../../data/settings.js";
import { spritePath } from "../../data/characters.js";
import { $ctx, displayPopup, updateLateralColumns } from "../ui.js";
import { socket } from "../online.js";
import { Attack } from "./Attack.js";
export class Game {
    selfId = "p1";
    enemyId = "p2";
    self;
    enemy;
    isThisPlayerFrozen = false;
    roomId = parseInt(localStorage.getItem("roomId")) || 0;
    mode = localStorage.getItem("mode") || "solo";
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
        if (this.self.hp <= 0 || this.enemy.hp <= 0)
            this.endSoloGame();
        const botActions = ["move", "move", "attack", "super", "heal", "regen", "rage"];
        let attempt = 0;
        const maxAttempts = 10;
        while (attempt < maxAttempts) {
            const botChoice = botActions[Math.floor(Math.random() * botActions.length)];
            if (botChoice === "move") {
                const xDiff = this.self.x - this.enemy.x;
                const yDiff = this.self.y - this.enemy.y;
                const threshold = this.enemy.width / 3;
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
                    this.enemy.move(2, "move");
                else if (horizontalDirection === 2 && verticalDirection === 3)
                    this.enemy.move(4, "move");
                else if (horizontalDirection === 4 && verticalDirection === 1)
                    this.enemy.move(8, "move");
                else if (horizontalDirection === 4 && verticalDirection === 3)
                    this.enemy.move(6, "move");
                else if (horizontalDirection === 2)
                    this.enemy.move(3, "move");
                else if (horizontalDirection === 4)
                    this.enemy.move(7, "move");
                else if (verticalDirection === 1)
                    this.enemy.move(1, "move");
                else if (verticalDirection === 3)
                    this.enemy.move(5, "move");
            }
            else if (botChoice === "attack") {
                this.enemy.attack();
                break;
            }
            else if (botChoice === "super" && this.enemy.mana >= this.enemy.attackCost * def.superManaMult) {
                this.enemy.superAttack();
                break;
            }
            else if (botChoice === "heal" && this.enemy.hp < this.enemy.maxHp + this.enemy.healPow) {
                this.enemy.heal();
                break;
            }
            else if (botChoice === "regen" && this.enemy.mana < this.enemy.maxMana + this.enemy.regenPow) {
                this.enemy.regen();
                break;
            }
            else if (botChoice === "rage" && !this.enemy.rage && this.enemy.hp <= this.enemy.maxHp * def.rageThreshold) {
                this.enemy.enrage();
                break;
            }
            attempt++;
        }
    }
    createImage(id, width, height, folder) {
        const img = new Image(width, height);
        img.src = spritePath(id, folder);
        return img;
    }
    rebuildAttackArray(flattedAttackArray) {
        return flattedAttackArray.map((attack) => new Attack(attack[0] === 1 ? "p1" : "p2", attack[1] === 1 ? "simple" : "super", attack[2], attack[3], attack[4]));
    }
    updatePlayers(player, role) {
        this[role].rage = player[0];
        this[role].x = player[1];
        this[role].y = player[2];
        this[role].dir = player[3];
        this[role].hp = player[4];
        this[role].mana = player[5];
        this[role].attacks = this.rebuildAttackArray(player[6]);
    }
    updateServer() {
        if (this.mode === "dual") {
            const updateMessage = {
                roomId: this.roomId,
                p1: this.selfId == "p1" ? this.self.getDeltaAttributes() : this.enemy.getDeltaAttributes(),
                p2: this.selfId == "p1" ? this.enemy.getDeltaAttributes() : this.self.getDeltaAttributes()
            };
            socket.emit("update", updateMessage);
        }
    }
    drawAll() {
        $ctx.clearRect(0, 0, def.canvasWidth, def.canvasHeight);
        this.self.draw();
        this.enemy.draw();
        this.self.attacks.forEach((attack) => attack.draw());
        this.enemy.attacks.forEach((attack) => attack.draw());
        updateLateralColumns(this.self);
        updateLateralColumns(this.enemy);
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
                this.self.attack();
                break;
            case "d":
                this.self.heal();
                break;
            case "q":
                this.self.regen();
                break;
            case "s":
                this.self.superAttack();
                break;
            case " ":
                this.self.enrage();
                break;
            case "Z":
                this.self.attack();
                break;
            case "D":
                this.self.heal();
                break;
            case "Q":
                this.self.regen();
                break;
            case "S":
                this.self.superAttack();
                break;
        }
    }
    startBotActionLoop(botLevel) {
        this.botActionLoop = setInterval(this.botAction.bind(this), def.botLvlInterval[botLevel]);
    }
    updateMovement() {
        if (this.frameCount % def.refresh60fpsDivider === 0) {
            if (this.status === "playing") {
                this.self.attacks.forEach((attack) => attack.move());
                this.enemy.attacks.forEach((attack) => attack.move());
                const moveType = this.pressedKeys.has("Shift") ? "dash" : "move";
                const movingUp = this.pressedKeys.has("ArrowUp");
                const movingRight = this.pressedKeys.has("ArrowRight");
                const movingDown = this.pressedKeys.has("ArrowDown");
                const movingLeft = this.pressedKeys.has("ArrowLeft");
                if (movingUp && movingRight)
                    this.self.move(2, moveType);
                else if (movingUp && movingLeft)
                    this.self.move(8, moveType);
                else if (movingDown && movingRight)
                    this.self.move(4, moveType);
                else if (movingDown && movingLeft)
                    this.self.move(6, moveType);
                else if (movingUp)
                    this.self.move(1, moveType);
                else if (movingRight)
                    this.self.move(3, moveType);
                else if (movingDown)
                    this.self.move(5, moveType);
                else if (movingLeft)
                    this.self.move(7, moveType);
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
        const winnerName = this.self.hp <= 0 ? this.enemy.charName : this.self.charName;
        if (this.self.hp <= 0) {
            localStorage.setItem("scoreBot", (this.enemy.score + 1).toString());
            displayPopup(`Tu as perdu face à ${winnerName}.`, true, true);
        }
        else if (this.enemy.hp <= 0) {
            localStorage.setItem("scoreThis", (this.self.score + 1).toString());
            displayPopup(`Tu as gagné avec ${winnerName} !`, true, true);
        }
    }
}
