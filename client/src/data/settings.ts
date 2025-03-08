import { MoveDirections } from "../../../shared/Types"

export const def = {
    canvasWidth: 800,
    canvasHeight: 500,
    canvasScaleMult: 4,
    playW: 90,
    playH: 135,
    attackW: 30,
    attackH: 30,
    refresh60fpsDivider: 3,
    freezeDelay: 150,
    collisionDist: 75,
    manaGainOnHitDivider: 10,
    superSizeMult: 3,
    superManaMult: 11,
    superDamageMult: 6.5,
    rageThreshold: 0.25,
    rageDuration: 10000,
    rageSpeedMult: 1.3,
    rageStrengthMult: 1.3,
    rageAttackSpeedMult: 1.3,
    rageRegenFactor: 1.3,
    rageHealFactor: 1.3,
    normalTextColor: "whitesmoke",
    normalHpColor: "#ff4d4d",
    rageTextColor: "red",
    shadowBlur: 250,
    cursorSize: 15,
    botLvlInterval: {
        "easy": 240,
        "medium": 170,
        "hard": 90,
    }
}

export const defPlayerDirections: { 1: MoveDirections, 2: MoveDirections } = { 1: 3, 2: 7 }
export const defPlayerPositions: { 1: { x: number, y: number }, 2: { x: number, y: number } } = { 1: { x: 0, y: def.canvasHeight / 2 - def.playH }, 2: { x: def.canvasWidth - def.playW, y: def.canvasHeight / 2 - def.playH } }