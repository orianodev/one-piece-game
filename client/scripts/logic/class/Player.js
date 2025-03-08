import { def } from "../../data/settings.js";
import { characterStats } from "../../data/characters.js";
import { $ctx, $infosBar } from "../ui.js";
import { Fight } from "../play.js";
import { Attack } from "./Attack.js";
export class Player {
    id;
    charId;
    charName;
    color;
    img;
    sprite = new Image(def.playW, def.playH);
    attackSprite = new Image(def.attackW, def.attackH);
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
    attackName;
    attackCost;
    attackSpeed;
    attacks;
    constructor(id, charId, charName, color, img, score, x, y, dir, speed, hp, maxHp, healPow, mana, maxMana, regenPow, strength, attackName, attackCost, attackSpeed, attacks) {
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
        this.attackName = attackName;
        this.attackCost = attackCost;
        this.attackSpeed = attackSpeed;
        this.attacks = attacks;
    }
    draw() {
        $ctx.globalAlpha = 1;
        Fight.setShadow(this.color);
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
        if ((Fight.mode === "dual" || this.id === "A") && !this.freeze())
            return;
        if (this.mana < this.attackCost)
            return;
        this.mana -= this.attackCost;
        const attack = new Attack(this.id, "sim", this.x + def.playW / 2, this.y + def.playH / 2, this.dir);
        this.attacks.push(attack);
        attack.draw();
        Fight.updateServer();
    }
    superAttack() {
        if ((Fight.mode === "dual" || this.id === "A") && !this.freeze())
            return;
        if (this.mana < this.attackCost * def.superManaMult)
            return;
        this.mana -= this.attackCost * def.superManaMult;
        const attack = new Attack(this.id, "sup", this.x + def.playW / 2 - def.attackW, this.y + def.playH / 2 - def.attackH, this.dir);
        this.attacks.push(attack);
        attack.draw();
        Fight.updateServer();
    }
    heal() {
        if ((Fight.mode === "dual" || this.id === "A") && !this.freeze())
            return;
        if (this.hp + this.healPow > this.maxHp)
            this.hp = this.maxHp;
        if (this.hp === this.maxHp)
            return;
        this.hp += this.healPow;
        Fight.updateServer();
    }
    regen() {
        if ((Fight.mode === "dual" || this.id === "A") && !this.freeze())
            return;
        if (this.mana + this.regenPow > this.maxMana)
            this.mana = this.maxMana;
        if (this.mana === this.maxMana)
            return;
        this.mana += this.regenPow;
        Fight.updateServer();
    }
    enrage() {
        if ((Fight.mode === "dual" || this.id === "A") && !this.freeze())
            return console.log("Rage disabled in freeze mode");
        if (this.rage || this.hp > this.maxHp * def.rageThreshold)
            return console.log("Already enraged or HP above threshold");
        this.rage = true;
        this.speed *= def.rageSpeedMult;
        this.strength *= def.rageStrengthMult;
        this.attackSpeed *= def.rageAttackSpeedMult;
        this.regenPow *= def.rageRegenFactor;
        this.healPow *= def.rageHealFactor;
        this.sprite.src = this.getRageImg();
        if (this.id === "A")
            $infosBar[1].character.style.color = def.rageTextColor;
        else if (this.id === "B")
            $infosBar[2].character.style.color = def.rageTextColor;
        setTimeout(() => this.unRage(this.img), def.rageDuration);
        Fight.updateServer();
    }
    unRage(defaultSpriteSrc) {
        this.sprite.src = defaultSpriteSrc;
        this.speed = characterStats[this.charId].speed;
        this.strength = characterStats[this.charId].strength;
        this.regenPow = characterStats[this.charId].regenPow;
        this.healPow = characterStats[this.charId].healPow;
        if (this.id === "A")
            $infosBar[1].character.style.color = def.normalTextColor;
        else if (this.id === "B")
            $infosBar[2].character.style.color = def.normalTextColor;
        this.rage = false;
        Fight.updateServer();
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
        Fight.drawAll();
        Fight.updateServer();
    }
}
