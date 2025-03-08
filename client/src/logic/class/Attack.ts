import { PlayerId, AttackType as AttackType, MoveDirections } from "../../../../shared/Types";
import { def } from "../../data/settings.js";
import { Fight } from "../play.js";
import { $ctx } from "../ui.js";
import { Player } from "./Player.js";

export class Attack {
    readonly id: PlayerId;
    readonly type: AttackType;
    public x: number;
    public y: number;
    public dir: MoveDirections;

    constructor(player: PlayerId, type: AttackType, x: number, y: number, dir: MoveDirections) {
        this.id = player
        this.type = type
        this.x = x
        this.y = y
        this.dir = dir
    }
    draw() {
        const player = this.id === Fight.thisPlayerId ? Fight.thisPlayer : Fight.oppPlayer;
        Fight.setShadow(player.color);
        if (this.type === 0) $ctx.drawImage(player.attackSprite, this.x, this.y, def.attackW, def.attackH);
        if (this.type === 1) $ctx.drawImage(player.attackSprite, this.x, this.y, def.attackW * def.superSizeMult, def.attackH * def.superSizeMult);
        Fight.resetPen();
    }
    move() {
        const player = Fight.thisPlayer.id === this.id ? Fight.thisPlayer : Fight.oppPlayer;
        switch (this.dir) {
            case 1: // Up
                this.y -= player.attackSpeed;
                break;
            case 2: // Up-Right
                this.x += player.attackSpeed / Math.SQRT2;
                this.y -= player.attackSpeed / Math.SQRT2;
                break;
            case 3: // Right
                this.x += player.attackSpeed;
                break;
            case 4: // Down-Right
                this.x += player.attackSpeed / Math.SQRT2;
                this.y += player.attackSpeed / Math.SQRT2;
                break;
            case 5: // Down
                this.y += player.attackSpeed;
                break;
            case 6: // Down-Left
                this.x -= player.attackSpeed / Math.SQRT2;
                this.y += player.attackSpeed / Math.SQRT2;
                break;
            case 7: // Left
                this.x -= player.attackSpeed;
                break;
            case 8: // Up-Left
                this.x -= player.attackSpeed / Math.SQRT2;
                this.y -= player.attackSpeed / Math.SQRT2;
                break;
        }
        this.checkCollisionWithBorder(player);
        this.checkCollisionWithOpp(player);
    }
    checkCollisionWithBorder(player: Player) {
        if (this.x <= 0 || this.x >= def.canvasWidth - def.attackW || this.y <= 0 || this.y >= def.canvasHeight - def.attackH) this.destroy(player)
    }
    checkCollisionWithOpp(player: Player) {
        const opp = Fight.thisPlayer.id === this.id ? Fight.oppPlayer : Fight.thisPlayer
        const oppCenter = { x: opp.x + def.playW / 2, y: opp.y + def.playH * 0.4 }
        const thisAttackCenter = { x: this.x + def.attackW / 2, y: this.y + def.attackH / 2 }
        const distance = Math.sqrt(Math.pow(oppCenter.x - thisAttackCenter.x, 2) + Math.pow(oppCenter.y - thisAttackCenter.y, 2))
        if (distance < def.collisionDist) {
            this.hit(player.strength, opp)
            this.destroy(player)
        }
    }
    hit(playerStrength: number, opp: Player) {
        opp.hp -= this.type === 0 ? playerStrength : playerStrength * def.superDamageMult
        opp.mana += this.type === 1 ? playerStrength / def.manaGainOnHitDivider : playerStrength / def.manaGainOnHitDivider * def.superDamageMult
    }
    destroy(player: Player) {
        player.attacks.splice(player.attacks.indexOf(this), 1)
        Fight.updateServer()
    }
}