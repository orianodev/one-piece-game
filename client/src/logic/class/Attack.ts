import { PlayerId, AttackType as AttackType, MoveDirections } from "../../Types.js";
import { def } from "../../data/defaultSettings.js";
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
        const player = Fight.getPlayer(this.id)
        Fight.setShadow(player.color)
        if (this.type === "sim") $ctx.drawImage(player.attackSprite, this.x, this.y, def.attackW, def.attackH);
        if (this.type === "sup") $ctx.drawImage(player.attackSprite, this.x, this.y, def.attackW * def.superSizeMult, def.attackH * def.superSizeMult);
        Fight.resetPen()
    }
    // draw() { // Draw the attack sprite on the canvas
    //     const player = Fight.getPlayer(this.id);
    //     Fight.setShadow(player.color);

    //     // Determine the sprite coordinates based on the direction
    //     let spriteX = 0;
    //     let spriteY = 0; // Assuming all frames are in a single row

    //     switch (this.dir) {
    //         case 1: // Up
    //             spriteX = 2 * def.attackW;
    //             break;
    //         case 2: // Up-Right
    //             spriteX = 1 * def.attackW;
    //             break;
    //         case 3: // Right
    //             spriteX = 0;
    //             break;
    //         case 4: // Down-Right
    //             spriteX = 7 * def.attackW;
    //             break;
    //         case 5: // Down
    //             spriteX = 6 * def.attackW;
    //             break;
    //         case 6: // Down-Left
    //             spriteX = 5 * def.attackW;
    //             break;
    //         case 7: // Left
    //             spriteX = 4 * def.attackW;
    //             break;
    //         case 8: // Up-Left
    //             spriteX = 3 * def.attackW;
    //             break;
    //     }

    //     // Draw the image from the sprite sheet
    //     if (this.type === "sim") {
    //         $ctx.drawImage(player.attackSprite, spriteX, spriteY, def.attackW, def.attackH, this.x, this.y, def.attackW, def.attackH);
    //     } else if (this.type === "sup") {
    //         $ctx.drawImage(player.attackSprite, spriteX, spriteY, def.attackW, def.attackH, this.x, this.y, def.attackW * def.superSizeMult, def.attackH * def.superSizeMult);
    //     }

    //     Fight.resetPen();
    // }
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
            opp.hp -= this.type === "sim" ? player.strength : player.strength * def.superDamageMult
            this.destroy(player)
        }
    }
    destroy(player: Player) {
        player.attacks.splice(player.attacks.indexOf(this), 1)
        Fight.updateServer()
    }
}