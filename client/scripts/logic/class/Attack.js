import { def } from "../../data/settings.js";
import { Fight } from "../play.js";
import { $ctx } from "../ui.js";
export class Attack {
    id;
    type;
    x;
    y;
    dir;
    constructor(player, type, x, y, dir) {
        this.id = player;
        this.type = type;
        this.x = x;
        this.y = y;
        this.dir = dir;
    }
    draw() {
        const player = Fight.getPlayer(this.id);
        Fight.setShadow(player.color);
        if (this.type === "sim")
            $ctx.drawImage(player.attackSprite, this.x, this.y, def.attackW, def.attackH);
        if (this.type === "sup")
            $ctx.drawImage(player.attackSprite, this.x, this.y, def.attackW * def.superSizeMult, def.attackH * def.superSizeMult);
        Fight.resetPen();
    }
    move() {
        const player = Fight.thisPlayer.id === this.id ? Fight.thisPlayer : Fight.oppPlayer;
        switch (this.dir) {
            case 1:
                this.y -= player.attackSpeed;
                break;
            case 2:
                this.x += player.attackSpeed / Math.SQRT2;
                this.y -= player.attackSpeed / Math.SQRT2;
                break;
            case 3:
                this.x += player.attackSpeed;
                break;
            case 4:
                this.x += player.attackSpeed / Math.SQRT2;
                this.y += player.attackSpeed / Math.SQRT2;
                break;
            case 5:
                this.y += player.attackSpeed;
                break;
            case 6:
                this.x -= player.attackSpeed / Math.SQRT2;
                this.y += player.attackSpeed / Math.SQRT2;
                break;
            case 7:
                this.x -= player.attackSpeed;
                break;
            case 8:
                this.x -= player.attackSpeed / Math.SQRT2;
                this.y -= player.attackSpeed / Math.SQRT2;
                break;
        }
        this.checkCollisionWithBorder(player);
        this.checkCollisionWithOpp(player);
    }
    checkCollisionWithBorder(player) {
        if (this.x <= 0 || this.x >= def.canvasWidth - def.attackW || this.y <= 0 || this.y >= def.canvasHeight - def.attackH)
            this.destroy(player);
    }
    checkCollisionWithOpp(player) {
        const opp = Fight.thisPlayer.id === this.id ? Fight.oppPlayer : Fight.thisPlayer;
        const oppCenter = { x: opp.x + def.playW / 2, y: opp.y + def.playH * 0.4 };
        const thisAttackCenter = { x: this.x + def.attackW / 2, y: this.y + def.attackH / 2 };
        const distance = Math.sqrt(Math.pow(oppCenter.x - thisAttackCenter.x, 2) + Math.pow(oppCenter.y - thisAttackCenter.y, 2));
        if (distance < def.collisionDist) {
            this.hit(player.strength, opp);
            this.destroy(player);
        }
    }
    hit(playerStrength, opp) {
        opp.hp -= this.type === "sim" ? playerStrength : playerStrength * def.superDamageMult;
        opp.mana += this.type === "sim" ? playerStrength / def.manaGainOnHitDivider : playerStrength / def.manaGainOnHitDivider * def.superDamageMult;
    }
    destroy(player) {
        player.attacks.splice(player.attacks.indexOf(this), 1);
        Fight.updateServer();
    }
}
