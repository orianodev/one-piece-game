import { def } from "../../data/settings.js";
import { characterStats } from "../../data/characters.js";
import { $ctx, $infosBar } from "../ui.js";
import { Fight } from "../play.js";
import { Attack } from "./Attack.js";
export class Player {
    id;
    score;
    charId;
    charName;
    color;
    spriteNormal;
    spriteRage;
    rage = false;
    width;
    height;
    x;
    y;
    oldX;
    oldY;
    dir;
    speed;
    hp;
    maxHp;
    healPow;
    mana;
    maxMana;
    regenPow;
    strength;
    attackName;
    attackSprite;
    attackWidth;
    attackHeight;
    attackCost;
    attackSpeed;
    attacks;
    constructor(id, score, charId, charName, color, spriteNormal, spriteRage, width, height, x, y, oldX, oldY, dir, speed, hp, maxHp, healPow, mana, maxMana, regenPow, strength, attackName, attackSprite, attackWidth, attackHeight, attackCost, attackSpeed, attacks) {
        this.id = id;
        this.score = score;
        this.charId = charId;
        this.charName = charName;
        this.color = color;
        this.spriteNormal = spriteNormal;
        this.spriteRage = spriteRage;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.oldX = oldX;
        this.oldY = oldY;
        this.dir = dir;
        this.speed = speed;
        this.hp = hp;
        this.maxHp = maxHp;
        this.healPow = healPow;
        this.mana = mana;
        this.maxMana = maxMana;
        this.regenPow = regenPow;
        this.strength = strength;
        this.attackName = attackName;
        this.attackSprite = attackSprite;
        this.attackWidth = attackWidth;
        this.attackHeight = attackHeight;
        this.attackCost = attackCost;
        this.attackSpeed = attackSpeed;
        this.attacks = attacks;
    }
    draw() {
        $ctx.globalAlpha = 1;
        Fight.setShadow(this.color);
        $ctx.drawImage(this.rage ? this.spriteRage : this.spriteNormal, this.x, this.y, this.width, this.height);
        $ctx.globalAlpha = 0.5;
        switch (this.dir) {
            case 1:
                $ctx.fillRect(this.x + (this.width / 2 - 5), this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
            case 2:
                $ctx.fillRect(this.x + this.width + 5, this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
            case 3:
                $ctx.fillRect(this.x + this.width + 5, this.y + this.height / 2 - 5, def.cursorSize, def.cursorSize);
                break;
            case 4:
                $ctx.fillRect(this.x + this.width + 5, this.y + this.height + 5, def.cursorSize, def.cursorSize);
                break;
            case 5:
                $ctx.fillRect(this.x + (this.width / 2 - 5), this.y + this.height + 5, def.cursorSize, def.cursorSize);
                break;
            case 6:
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y + this.height + 5, def.cursorSize, def.cursorSize);
                break;
            case 7:
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y + this.height / 2 - 5, def.cursorSize, def.cursorSize);
                break;
            case 8:
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
        }
        Fight.resetPen();
    }
    freeze() {
        if (Fight.isThisPlayerFrozen)
            return false;
        Fight.isThisPlayerFrozen = true;
        Fight.unfreezeThisPlayer();
        return true;
    }
    attack() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze())
            return;
        if (this.mana < this.attackCost)
            return;
        this.mana -= this.attackCost;
        const attack = new Attack(this.id, "simple", this.dir, this.x + this.width / 2, this.y + this.height / 2);
        this.attacks.push(attack);
        attack.draw();
        Fight.updateServer();
    }
    superAttack() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze())
            return;
        if (this.mana < this.attackCost * def.superManaMult)
            return;
        this.mana -= this.attackCost * def.superManaMult;
        const attack = new Attack(this.id, "super", this.dir, this.x + this.width / 2 - this.attackWidth, this.y + this.height / 2 - this.attackHeight);
        this.attacks.push(attack);
        attack.draw();
        Fight.updateServer();
    }
    heal() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze())
            return;
        if (this.hp + this.healPow > this.maxHp)
            this.hp = this.maxHp;
        if (this.hp === this.maxHp)
            return;
        this.hp += this.healPow;
        Fight.updateServer();
    }
    regen() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze())
            return;
        if (this.mana + this.regenPow > this.maxMana)
            this.mana = this.maxMana;
        if (this.mana === this.maxMana)
            return;
        this.mana += this.regenPow;
        Fight.updateServer();
    }
    enrage() {
        if ((Fight.mode === "dual" || this.id === "p1") && !this.freeze())
            return;
        if (this.rage || this.hp > this.maxHp * def.rageThreshold)
            return;
        this.rage = true;
        this.speed *= def.rageSpeedMult;
        this.strength *= def.rageStrengthMult;
        this.attackSpeed *= def.rageAttackSpeedMult;
        this.regenPow *= def.rageRegenFactor;
        this.healPow *= def.rageHealFactor;
        $infosBar[this.id].character.style.color = def.rageTextColor;
        setTimeout(() => this.unRage(), def.rageDuration);
        Fight.updateServer();
    }
    unRage() {
        this.speed = characterStats[this.charId].speed;
        this.strength = characterStats[this.charId].strength;
        this.regenPow = characterStats[this.charId].regenPow;
        this.healPow = characterStats[this.charId].healPow;
        $infosBar[this.id].character.style.color = def.normalTextColor;
        this.rage = false;
        Fight.updateServer();
    }
    move(direction, type) {
        let step = this.speed;
        if (type === "dash") {
            if (this.mana < def.dashCost)
                return;
            this.mana -= def.dashCost;
            step *= def.dashSpeedMult;
        }
        switch (direction) {
            case 1:
                if (this.y < 0)
                    return;
                this.y -= step;
                break;
            case 2:
                if (this.y < 0 || this.x > def.canvasWidth - this.width)
                    return;
                this.x += step / Math.SQRT2;
                this.y -= step / Math.SQRT2;
                break;
            case 3:
                if (this.x > def.canvasWidth - this.width)
                    return;
                this.x += step;
                break;
            case 4:
                if (this.y > def.canvasHeight - this.height || this.x > def.canvasWidth - this.width)
                    return;
                this.x += step / Math.SQRT2;
                this.y += step / Math.SQRT2;
                break;
            case 5:
                if (this.y > def.canvasHeight - this.height)
                    return;
                this.y += step;
                break;
            case 6:
                if (this.y > def.canvasHeight - this.height || this.x < 0)
                    return;
                this.x -= step / Math.SQRT2;
                this.y += step / Math.SQRT2;
                break;
            case 7:
                if (this.x < 0)
                    return;
                this.x -= step;
                break;
            case 8:
                if (this.y < 0 || this.x < 0)
                    return;
                this.x -= step / Math.SQRT2;
                this.y -= step / Math.SQRT2;
                break;
        }
        this.dir = direction;
        Fight.drawAll();
        Fight.updateServer();
    }
    getDeltaAttributes() {
        return [this.rage, Math.round(this.x), Math.round(this.y), this.dir, Math.round(this.hp), Math.round(this.mana), this.attacks.map((attack) => attack.getDeltaAttackTuple())];
    }
}
