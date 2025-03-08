import { Mode, PlayerId, PlayerAttributesTuple, AttackAttributesTuple, AiLevel, GameStatus } from "../../../../shared/Types";
import { def } from "../../data/settings.js";
import { $ctx, displayPopup, updateLateralColumns } from "../ui.js";
import { socket } from "../online.js";
import { Player } from "./Player.js";
import { Attack } from "./Attack.js";

export class Game {
    public thisPlayerId: PlayerId | undefined;
    // @ts-expect-error
    public thisPlayer: Player;
    // @ts-expect-error
    public oppPlayer: Player;
    isThisPlayerFrozen = false;
    readonly roomId: number = parseInt(localStorage.getItem("roomId") as string)
    readonly mode: Mode = localStorage.getItem("mode") as Mode;
    public status: GameStatus;
    public pressedKeys: Set<string> = new Set<string>();
    private frameCount: number = 0;
    private timerInterval: NodeJS.Timeout | undefined;
    private timerSeconds: number = 0;
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

    getPlayer(playerId: PlayerId): Player {
        return playerId === this.thisPlayer.id ? this.thisPlayer : this.oppPlayer
    }
    unfreezeThisPlayer() {
        setTimeout(() => this.isThisPlayerFrozen = false, def.freezeDelay);
    }
    aiAction(): void {
        const aiActions = ["move", "move", "attack", "super", "heal", "regen", "rage"];
        let attempt = 0;
        const maxAttempts = 10;

        while (attempt < maxAttempts) {
            const aiChoice = aiActions[Math.floor(Math.random() * aiActions.length)];
            if (aiChoice === "move") {
                const xDiff = this.thisPlayer.x - this.oppPlayer.x;
                const yDiff = this.thisPlayer.y - this.oppPlayer.y;
                const threshold = def.playW / 3;

                // Determine the horizontal and vertical directions
                let horizontalDirection: 4 | 2 | null = null;
                let verticalDirection: 1 | 3 | null = null;

                if (xDiff > threshold) horizontalDirection = 2;
                else if (xDiff < -threshold) horizontalDirection = 4;
                if (yDiff > threshold) verticalDirection = 3;
                else if (yDiff < -threshold) verticalDirection = 1;

                // Execute movement based on determined directions
                if (horizontalDirection === 2 && verticalDirection === 1) this.oppPlayer.move(2);
                else if (horizontalDirection === 2 && verticalDirection === 3) this.oppPlayer.move(4);
                else if (horizontalDirection === 4 && verticalDirection === 1) this.oppPlayer.move(8);
                else if (horizontalDirection === 4 && verticalDirection === 3) this.oppPlayer.move(6);
                else if (horizontalDirection === 2) this.oppPlayer.move(3);
                else if (horizontalDirection === 4) this.oppPlayer.move(7);
                else if (verticalDirection === 1) this.oppPlayer.move(1);
                else if (verticalDirection === 3) this.oppPlayer.move(5);

            } else if (aiChoice === "attack") {
                this.oppPlayer.attack();
                break;
            } else if (aiChoice === "super" && this.oppPlayer.mana >= this.oppPlayer.attackCost * def.superManaMult) {
                this.oppPlayer.superAttack();
                break;
            } else if (aiChoice === "heal" && this.oppPlayer.hp < this.oppPlayer.maxHp + this.oppPlayer.healPow) {
                this.oppPlayer.heal();
                break;
            } else if (aiChoice === "regen" && this.oppPlayer.mana < this.oppPlayer.maxMana + this.oppPlayer.regenPow) {
                this.oppPlayer.regen();
                break;
            } else if (aiChoice === "rage" && !this.oppPlayer.rage && this.oppPlayer.hp <= this.oppPlayer.maxHp * def.rageThreshold) {
                this.oppPlayer.enrage();
                break;
            }
            attempt++;
        }
    }
    buildPlayers(thisPlayer: Player, oppPlayer: Player) {
        this.thisPlayer = new Player(thisPlayer.id, thisPlayer.charId, thisPlayer.charName, thisPlayer.color, thisPlayer.img, thisPlayer.score, thisPlayer.x, thisPlayer.y, thisPlayer.dir, thisPlayer.speed, thisPlayer.hp, thisPlayer.maxHp, thisPlayer.healPow, thisPlayer.mana, thisPlayer.maxMana, thisPlayer.regenPow, thisPlayer.strength, thisPlayer.attackImg, thisPlayer.attackCost, thisPlayer.attackSpeed, []);
        this.oppPlayer = new Player(oppPlayer.id, oppPlayer.charId, oppPlayer.charName, oppPlayer.color, oppPlayer.img, oppPlayer.score, oppPlayer.x, oppPlayer.y, oppPlayer.dir, oppPlayer.speed, oppPlayer.hp, oppPlayer.maxHp, oppPlayer.healPow, oppPlayer.mana, oppPlayer.maxMana, oppPlayer.regenPow, oppPlayer.strength, oppPlayer.attackImg, oppPlayer.attackCost, oppPlayer.attackSpeed, []);
        this.oppPlayer.sprite.src = this.oppPlayer.img
        this.oppPlayer.attackSprite.src = this.oppPlayer.attackImg
        this.thisPlayer.sprite.src = this.thisPlayer.img
        this.thisPlayer.attackSprite.src = this.thisPlayer.attackImg
    }
    updatePlayers(thisPlayer: PlayerAttributesTuple, oppPlayer: PlayerAttributesTuple) {
        this.thisPlayer.rage = thisPlayer[0]
        this.thisPlayer.x = thisPlayer[1]
        this.thisPlayer.y = thisPlayer[2]
        this.thisPlayer.dir = thisPlayer[3]
        this.thisPlayer.hp = thisPlayer[4]
        this.thisPlayer.mana = thisPlayer[5]
        this.thisPlayer.attacks = this.rebuildAttackArray(thisPlayer[6])

        this.oppPlayer.rage = oppPlayer[0]
        this.oppPlayer.x = oppPlayer[1]
        this.oppPlayer.y = oppPlayer[2]
        this.oppPlayer.dir = oppPlayer[3]
        this.oppPlayer.hp = oppPlayer[4]
        this.oppPlayer.mana = oppPlayer[5]
        this.oppPlayer.attacks = this.rebuildAttackArray(oppPlayer[6])
    }
    getPlayerDeltaAttributes(player: Player): PlayerAttributesTuple {
        return [player.rage, Math.round(player.x), Math.round(player.y), player.dir, Math.round(player.hp), Math.round(player.mana), this.getAttackDeltaAttributes(player.attacks)]
    }
    getAttackDeltaAttributes(attacks: Attack[]): AttackAttributesTuple[] {
        return attacks.map((attack) => [attack.id, attack.type, attack.x, attack.y, attack.dir]);
    }
    updateServer() {
        if (this.mode === "solo") return;
        if (this.thisPlayerId == "A") socket.emit("update", { roomId: this.roomId, A: this.getPlayerDeltaAttributes(this.thisPlayer), B: this.getPlayerDeltaAttributes(this.oppPlayer) });
        else if (this.thisPlayerId == "B") socket.emit("update", { roomId: this.roomId, A: this.getPlayerDeltaAttributes(this.oppPlayer), B: this.getPlayerDeltaAttributes(this.thisPlayer) });
    };
    drawAll() {
        $ctx.clearRect(0, 0, def.canvasWidth, def.canvasHeight);
        this.thisPlayer.draw();
        this.oppPlayer.draw();

        this.thisPlayer.attacks.forEach((attack) => attack.draw());
        this.oppPlayer.attacks.forEach((attack) => attack.draw());

        const playerA = this.thisPlayer.id === "A" ? this.thisPlayer : this.oppPlayer;
        const playerB = this.thisPlayer.id === "B" ? this.thisPlayer : this.oppPlayer;
        updateLateralColumns(playerA);
        updateLateralColumns(playerB);
    }
    rebuildAttackArray(flattedAttackArray: AttackAttributesTuple[]): Attack[] {
        return flattedAttackArray.map((attack) => new Attack(attack[0], attack[1], attack[2], attack[3], attack[4]))
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
    updateMovement() {
        if (this.frameCount % def.move60fpsRAFDivider === 0) {
            if (this.status === "over") return
            this.thisPlayer.attacks.forEach((attack) => attack.move())
            this.oppPlayer.attacks.forEach((attack) => attack.move())
            this.drawAll()

            if (this.mode === "solo") {
                if (this.thisPlayer.hp <= 0 || this.oppPlayer.hp <= 0) this.endSoloGame();
            }
            const player = this.thisPlayer;

            const movingUp = this.pressedKeys.has("ArrowUp");
            const movingRight = this.pressedKeys.has("ArrowRight");
            const movingDown = this.pressedKeys.has("ArrowDown");
            const movingLeft = this.pressedKeys.has("ArrowLeft");

            if (movingUp && movingRight) player.move(2);
            else if (movingUp && movingLeft) player.move(8);
            else if (movingDown && movingRight) player.move(4);
            else if (movingDown && movingLeft) player.move(6);
            else if (movingUp) player.move(1);
            else if (movingRight) player.move(3);
            else if (movingDown) player.move(5);
            else if (movingLeft) player.move(7);
        }
        this.frameCount++;
        requestAnimationFrame(this.updateMovement.bind(this));
    }
    endSoloGame() {
        this.status = "over"
        this.stopTimer();
        const winnerName = this.thisPlayer.hp <= 0 ? this.oppPlayer.charName : this.thisPlayer.charName
        if (this.thisPlayer.hp <= 0) {
            localStorage.setItem("scoreAi", (this.oppPlayer.score + 1).toString());
            displayPopup(`Tu as perdu face à ${winnerName}.`, true);
        }
        else if (this.oppPlayer.hp <= 0) {
            localStorage.setItem("scoreThis", (this.thisPlayer.score + 1).toString());
            displayPopup(`Tu as gagné avec ${winnerName} !`, true);
        }
    }
    aiActionInterval(aiLevel: AiLevel) {
        setInterval(() => {
            if (this.status === "over") return
            this.aiAction(), def.aiLvlInterval[aiLevel]
        }, def.aiLvlInterval[aiLevel]);
    }
}