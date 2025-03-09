import { PlayerId, MoveDirections, PlayerAttributesTuple } from "../../../../shared/Types";
import { def } from "../../data/settings.js";
import { CharacterID, characterStats } from "../../data/characters.js";
import { $ctx, $infosBar } from "../ui.js";
import { Fight } from "../play.js";
import { Attack } from "./Attack.js";

export class Player {
    readonly id: PlayerId;
    readonly score: number;
    readonly charId: CharacterID;
    readonly charName: string;
    readonly color: string;
    public spriteNormal: HTMLImageElement;
    public spriteRage: HTMLImageElement;
    public rage: boolean = false;
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public oldX: number;
    public oldY: number;
    public dir: MoveDirections;
    public speed: number;
    public hp: number;
    readonly maxHp: number;
    public healPow: number;
    public mana: number;
    readonly maxMana: number;
    public regenPow: number;
    public strength: number;
    readonly attackName: string;
    public attackSprite: HTMLImageElement;
    public attackWidth: number;
    public attackHeight: number;
    readonly attackCost: number;
    public attackSpeed: number;
    public attacks: Attack[];

    constructor(id: PlayerId, score: number, charId: CharacterID, charName: string, color: string, spriteNormal: HTMLImageElement, spriteRage: HTMLImageElement, width: number, height: number, x: number, y: number, oldX: number, oldY: number, dir: MoveDirections, speed: number, hp: number, maxHp: number, healPow: number, mana: number, maxMana: number, regenPow: number, strength: number, attackName: string, attackSprite: HTMLImageElement, attackWidth: number, attackHeight: number, attackCost: number, attackSpeed: number, attacks: Attack[] | []) {
        this.id = id
        this.score = score
        this.charId = charId
        this.charName = charName
        this.color = color
        this.spriteNormal = spriteNormal
        this.spriteRage = spriteRage
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        this.oldX = oldX
        this.oldY = oldY
        this.dir = dir
        this.speed = speed
        this.hp = hp
        this.maxHp = maxHp
        this.healPow = healPow
        this.mana = mana
        this.maxMana = maxMana
        this.regenPow = regenPow
        this.strength = strength
        this.attackName = attackName
        this.attackSprite = attackSprite
        this.attackWidth = attackWidth
        this.attackHeight = attackHeight
        this.attackCost = attackCost
        this.attackSpeed = attackSpeed
        this.attacks = attacks
    }
    draw() {
        // Draw sprite
        $ctx.globalAlpha = 1;
        Fight.setShadow(this.color)
        $ctx.drawImage(this.rage ? this.spriteRage : this.spriteNormal, this.x, this.y, this.width, this.height);

        // Draw cursor
        $ctx.globalAlpha = 0.5;
        switch (this.dir) {
            case 1: // Up
                $ctx.fillRect(this.x + (this.width / 2 - 5), this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
            case 2: // Up-Right
                $ctx.fillRect(this.x + this.width + 5, this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
            case 3: // Right
                $ctx.fillRect(this.x + this.width + 5, this.y + this.height / 2 - 5, def.cursorSize, def.cursorSize);
                break;
            case 4: // Down-Right
                $ctx.fillRect(this.x + this.width + 5, this.y + this.height + 5, def.cursorSize, def.cursorSize);
                break;
            case 5: // Down
                $ctx.fillRect(this.x + (this.width / 2 - 5), this.y + this.height + 5, def.cursorSize, def.cursorSize);
                break;
            case 6: // Down-Left
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y + this.height + 5, def.cursorSize, def.cursorSize);
                break;
            case 7: // Left
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y + this.height / 2 - 5, def.cursorSize, def.cursorSize);
                break;
            case 8: // Up-Left
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
        }
        Fight.resetPen()
    }
    freeze(): boolean {
        if (Fight.isThisPlayerFrozen) return false;
        Fight.isThisPlayerFrozen = true;
        Fight.unfreezeThisPlayer();
        return true;
    }
    attack() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze()) return;
        if (this.mana < this.attackCost) return;
        this.mana -= this.attackCost;
        const attack = new Attack(this.id, "simple", this.dir, this.x + this.width / 2, this.y + this.height / 2);
        this.attacks.push(attack);
        attack.draw();
        Fight.updateServer();
    }
    superAttack() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze()) return;
        if (this.mana < this.attackCost * def.superManaMult) return
        this.mana -= this.attackCost * def.superManaMult
        const attack = new Attack(this.id, "super", this.dir, this.x + this.width / 2 - this.attackWidth, this.y + this.height / 2 - this.attackHeight);
        this.attacks.push(attack)
        attack.draw()
        Fight.updateServer()
    }
    heal() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze()) return;
        if (this.hp + this.healPow > this.maxHp) this.hp = this.maxHp
        if (this.hp === this.maxHp) return
        this.hp += this.healPow
        Fight.updateServer()
    }
    regen() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze()) return;
        if (this.mana + this.regenPow > this.maxMana) this.mana = this.maxMana
        if (this.mana === this.maxMana) return
        this.mana += this.regenPow
        Fight.updateServer()
    }
    enrage() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze()) return;
        if (this.rage || this.hp > this.maxHp * def.rageThreshold) return;
        this.rage = true;
        this.speed *= def.rageSpeedMult
        this.strength *= def.rageStrengthMult
        this.attackSpeed *= def.rageAttackSpeedMult
        this.regenPow *= def.rageRegenFactor
        this.healPow *= def.rageHealFactor
        $infosBar[this.id].character.style.color = def.rageTextColor
        setTimeout(() => this.unRage(), def.rageDuration)
        Fight.updateServer()
    }
    unRage() {
        this.speed = characterStats[this.charId].speed
        this.strength = characterStats[this.charId].strength
        this.regenPow = characterStats[this.charId].regenPow
        this.healPow = characterStats[this.charId].healPow
        $infosBar[this.id].character.style.color = def.normalTextColor
        this.rage = false;
        Fight.updateServer()
    }
    move(direction: MoveDirections, type: "move" | "dash") {
        let step = this.speed;
        if (type === "dash") {
            if (this.mana < def.dashCost) return;
            this.mana -= def.dashCost;
            step *= def.dashSpeedMult;
        }
        switch (direction) {
            case 1: // Up
                if (this.y < 0) return;
                this.y -= step;
                break;
            case 2: // Up-Right
                if (this.y < 0 || this.x > def.canvasWidth - this.width) return;
                this.x += step / Math.SQRT2;
                this.y -= step / Math.SQRT2;
                break;
            case 3: // Right
                if (this.x > def.canvasWidth - this.width) return;
                this.x += step;
                break;
            case 4: // Down-Right
                if (this.y > def.canvasHeight - this.height || this.x > def.canvasWidth - this.width) return;
                this.x += step / Math.SQRT2;
                this.y += step / Math.SQRT2;
                break;
            case 5: // Down
                if (this.y > def.canvasHeight - this.height) return;
                this.y += step;
                break;
            case 6: // Down-Left
                if (this.y > def.canvasHeight - this.height || this.x < 0) return;
                this.x -= step / Math.SQRT2;
                this.y += step / Math.SQRT2;
                break;
            case 7: // Left
                if (this.x < 0) return;
                this.x -= step;
                break;
            case 8: // Up-Left
                if (this.y < 0 || this.x < 0) return;
                this.x -= step / Math.SQRT2;
                this.y -= step / Math.SQRT2;
                break;
        }
        this.dir = direction;
        Fight.drawAll();
        Fight.updateServer();
    }
    getDeltaAttributes(): PlayerAttributesTuple {
        return [this.rage, Math.round(this.x), Math.round(this.y), this.dir, Math.round(this.hp), Math.round(this.mana), this.attacks.map((attack) => attack.getDeltaAttackTuple())]
    }
}