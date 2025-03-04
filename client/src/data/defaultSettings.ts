import { MoveDirections } from "../Types"

export const def = {
    canvasWidth: 800,
    canvasHeight: 500,
    canvasScaleMult: 4,
    playW: 80,
    playH: 120,
    attackW: 30,
    attackH: 30,
    refreshRate: 50,
    move60fpsRAFDivider: 4,
    freezeDelay: 150,
    collisionDist: 67,
    superSizeMult: 3,
    superManaMult: 10,
    superDamageMult: 5,
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
    shadowBlur: 150,
    cursorSize: 10,
    aiLvlInterval: {
        "easy": 240,
        "medium": 170,
        "hard": 100,
    }
}

export const defPlayerDirections: { A: MoveDirections, B: MoveDirections } = { A: 3, B: 7 }
export const defPlayerPositions: { A: { x: number, y: number }, B: { x: number, y: number } } = { A: { x: 0, y: def.canvasHeight / 2 - def.playH }, B: { x: def.canvasWidth - def.playW, y: def.canvasHeight / 2 - def.playH } }