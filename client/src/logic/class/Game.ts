import { Mode, PlayerId, PlayerAttributesTuple, BotLevel, GameStatus, ImgFolder, UpdateMessage, Action, AttackAttributesTuple } from "../../../../shared/Types";
import { def } from "../../data/settings.js";
import { spritePath } from "../../data/characters.js";
import { $ctx, displayPopup, updateLateralColumns } from "../ui.js";
import { socket } from "../online.js";
import { Player } from "./Player.js";
import { Attack } from "./Attack.js";

export class Game {
    public selfId: PlayerId = "p1";
    public enemyId: PlayerId = "p2";
    // @ts-expect-error
    public self: Player;
    // @ts-expect-error
    public enemy: Player;
    isThisPlayerFrozen = false;
    readonly roomId: number = parseInt(localStorage.getItem("roomId") as string) || 0;
    readonly mode: Mode = localStorage.getItem("mode") as Mode || "solo";
    public status: GameStatus = "loading";
    public pressedKeys: Set<string> = new Set<string>();
    private frameCount: number = 0;
    private timerInterval: NodeJS.Timeout | undefined;
    private timerSeconds: number = 0;
    public botActionLoop: NodeJS.Timeout | undefined;
    constructor(state: GameStatus) {
        this.status = state
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
        const timerElement = document.querySelector("#game-timer") as HTMLDivElement;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    unfreezeThisPlayer() {
        setTimeout(() => this.isThisPlayerFrozen = false, def.freezeDelay);
    }
    botAction(): void {
        if (this.self.hp <= 0 || this.enemy.hp <= 0) this.endSoloGame();

        const botActions: Action[] = ["move", "move", "attack", "super", "heal", "regen", "rage"];
        let attempt = 0;
        const maxAttempts = 10;

        while (attempt < maxAttempts) {
            const botChoice = botActions[Math.floor(Math.random() * botActions.length)] as Action;
            if (botChoice === "move") {
                const xDiff = this.self.x - this.enemy.x;
                const yDiff = this.self.y - this.enemy.y;
                const threshold = this.enemy.width / 3;

                // Determine the horizontal and vertical directions
                let horizontalDirection: 4 | 2 | null = null;
                let verticalDirection: 1 | 3 | null = null;

                if (xDiff > threshold) horizontalDirection = 2;
                else if (xDiff < -threshold) horizontalDirection = 4;
                if (yDiff > threshold) verticalDirection = 3;
                else if (yDiff < -threshold) verticalDirection = 1;

                // Execute movement based on determined directions
                if (horizontalDirection === 2 && verticalDirection === 1) this.enemy.move(2, "move");
                else if (horizontalDirection === 2 && verticalDirection === 3) this.enemy.move(4, "move");
                else if (horizontalDirection === 4 && verticalDirection === 1) this.enemy.move(8, "move");
                else if (horizontalDirection === 4 && verticalDirection === 3) this.enemy.move(6, "move");
                else if (horizontalDirection === 2) this.enemy.move(3, "move");
                else if (horizontalDirection === 4) this.enemy.move(7, "move");
                else if (verticalDirection === 1) this.enemy.move(1, "move");
                else if (verticalDirection === 3) this.enemy.move(5, "move");

            } else if (botChoice === "attack") {
                this.enemy.attack();
                break;
            } else if (botChoice === "super" && this.enemy.mana >= this.enemy.attackCost * def.superManaMult) {
                this.enemy.superAttack();
                break;
            } else if (botChoice === "heal" && this.enemy.hp < this.enemy.maxHp + this.enemy.healPow) {
                this.enemy.heal();
                break;
            } else if (botChoice === "regen" && this.enemy.mana < this.enemy.maxMana + this.enemy.regenPow) {
                this.enemy.regen();
                break;
            } else if (botChoice === "rage" && !this.enemy.rage && this.enemy.hp <= this.enemy.maxHp * def.rageThreshold) {
                this.enemy.enrage();
                break;
            }
            attempt++;
        }
    }
    createImage(id: string, width: number, height: number, folder: ImgFolder): HTMLImageElement {
        const img = new Image(width, height);
        img.src = spritePath(id, folder);
        return img;
    }
    rebuildAttackArray(flattedAttackArray: AttackAttributesTuple[]): Attack[] {
        return flattedAttackArray.map((attack) => new Attack(attack[0] === 1 ? "p1" : "p2", attack[1] === 1 ? "simple" : "super", attack[2], attack[3], attack[4]))
    }
    updatePlayers(player: PlayerAttributesTuple, role: "self" | "enemy") {
        this[role].rage = player[0]
        this[role].x = player[1]
        this[role].y = player[2]
        this[role].dir = player[3]
        this[role].hp = player[4]
        this[role].mana = player[5]
        this[role].attacks = this.rebuildAttackArray(player[6]);
    }
    updateServer() {
        if (this.mode === "dual") {
            const updateMessage = {
                roomId: this.roomId,
                p1: this.selfId == "p1" ? this.self.getDeltaAttributes() : this.enemy.getDeltaAttributes(),
                p2: this.selfId == "p1" ? this.enemy.getDeltaAttributes() : this.self.getDeltaAttributes()
            }
            socket.emit("update", updateMessage as UpdateMessage);
        }
    }
    drawAll() {
        $ctx.clearRect(0, 0, def.canvasWidth, def.canvasHeight);

        // Draw players
        this.self.draw();
        this.enemy.draw();

        // Draw attacks
        this.self.attacks.forEach((attack) => attack.draw());
        this.enemy.attacks.forEach((attack) => attack.draw());

        // Update lateral infos bars
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
    setShadow(color: string) {
        $ctx.shadowBlur = def.shadowBlur;
        $ctx.shadowColor = color;
    }
    attachKeyboardEvent() {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            this.pressedKeys.add(event.key);
            this.handleActionKeys(event.key);
        });

        document.addEventListener("keyup", (event: KeyboardEvent) => {
            this.pressedKeys.delete(event.key);
        });
    }
    handleActionKeys(key: string) {
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
    startBotActionLoop(botLevel: BotLevel) {
        this.botActionLoop = setInterval(this.botAction.bind(this), def.botLvlInterval[botLevel]);
    }
    updateMovement() {
        if (this.frameCount % def.refresh60fpsDivider === 0) {
            if (this.status === "playing") {
                // Move attacks
                this.self.attacks.forEach((attack) => attack.move());
                this.enemy.attacks.forEach((attack) => attack.move());
                const moveType = this.pressedKeys.has("Shift") ? "dash" : "move";

                // Get pressed keys
                const movingUp = this.pressedKeys.has("ArrowUp");
                const movingRight = this.pressedKeys.has("ArrowRight");
                const movingDown = this.pressedKeys.has("ArrowDown");
                const movingLeft = this.pressedKeys.has("ArrowLeft");

                // Move local player
                if (movingUp && movingRight) this.self.move(2, moveType);
                else if (movingUp && movingLeft) this.self.move(8, moveType);
                else if (movingDown && movingRight) this.self.move(4, moveType);
                else if (movingDown && movingLeft) this.self.move(6, moveType);
                else if (movingUp) this.self.move(1, moveType);
                else if (movingRight) this.self.move(3, moveType);
                else if (movingDown) this.self.move(5, moveType);
                else if (movingLeft) this.self.move(7, moveType);

                this.drawAll();
            }
        }
        this.frameCount++;
        requestAnimationFrame(this.updateMovement.bind(this));
    }
    endSoloGame() {
        this.status = "over"
        this.stopTimer();
        clearInterval(this.botActionLoop);
        this.botActionLoop = undefined;
        const winnerName = this.self.hp <= 0 ? this.enemy.charName : this.self.charName

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