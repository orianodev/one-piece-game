import { def } from "../../data/settings.js";
import { Fight } from "../play.js";
import { $ctx } from "../ui.js";
export class Attack {
    id;
    type;
    dir;
    x;
    y;
    constructor(owner, type, dir, x, y) {
        this.id = owner;
        this.type = type;
        this.dir = dir;
        this.x = x;
        this.y = y;
    }
    draw() {
        const owner = this.id === Fight.selfId ? Fight.self : Fight.enemy;
        Fight.setShadow(owner.color);
        if (this.type === "simple")
            $ctx.drawImage(owner.attackSprite, this.x, this.y, owner.attackWidth, owner.attackHeight);
        if (this.type === "super")
            $ctx.drawImage(owner.attackSprite, this.x, this.y, owner.attackWidth * def.superSizeMult, owner.attackHeight * def.superSizeMult);
        Fight.resetPen();
    }
    move() {
        const owner = Fight.self.id === this.id ? Fight.self : Fight.enemy;
        switch (this.dir) {
            case 1:
                this.y -= owner.attackSpeed;
                break;
            case 2:
                this.x += owner.attackSpeed / Math.SQRT2;
                this.y -= owner.attackSpeed / Math.SQRT2;
                break;
            case 3:
                this.x += owner.attackSpeed;
                break;
            case 4:
                this.x += owner.attackSpeed / Math.SQRT2;
                this.y += owner.attackSpeed / Math.SQRT2;
                break;
            case 5:
                this.y += owner.attackSpeed;
                break;
            case 6:
                this.x -= owner.attackSpeed / Math.SQRT2;
                this.y += owner.attackSpeed / Math.SQRT2;
                break;
            case 7:
                this.x -= owner.attackSpeed;
                break;
            case 8:
                this.x -= owner.attackSpeed / Math.SQRT2;
                this.y -= owner.attackSpeed / Math.SQRT2;
                break;
        }
        this.checkCollisionWithBorder(owner);
        this.checkCollisionWithEnemy(owner);
    }
    checkCollisionWithBorder(owner) {
        if (this.x <= 0 || this.x >= def.canvasWidth - owner.attackWidth || this.y <= 0 || this.y >= def.canvasHeight - owner.attackHeight)
            this.destroy(owner);
    }
    checkCollisionWithEnemy(owner) {
        const enemy = Fight.self.id === this.id ? Fight.enemy : Fight.self;
        const enemyCenter = { x: enemy.x + owner.width / 2, y: enemy.y + owner.height * 0.4 };
        const selfAttackCenter = { x: this.x + owner.attackWidth / 2, y: this.y + owner.attackHeight / 2 };
        const distance = Math.sqrt(Math.pow(enemyCenter.x - selfAttackCenter.x, 2) + Math.pow(enemyCenter.y - selfAttackCenter.y, 2));
        if (distance < def.collisionDist) {
            this.hit(owner, enemy);
        }
    }
    hit(owner, enemy) {
        enemy.hp -= this.type === "simple" ? owner.strength : owner.strength * def.superDamageMult;
        enemy.mana += this.type === "super" ? owner.strength / def.manaGainOnHitDivider : owner.strength / def.manaGainOnHitDivider * def.superDamageMult;
        this.destroy(owner);
    }
    destroy(owner) {
        owner.attacks.splice(owner.attacks.indexOf(this), 1);
        Fight.updateServer();
    }
    getDeltaAttackTuple() {
        return [this.id === "p1" ? 1 : 2, this.type === "simple" ? 1 : 2, this.dir, Math.round(this.x), Math.round(this.y)];
    }
}
