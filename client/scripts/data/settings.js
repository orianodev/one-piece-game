export const def = {
    canvasWidth: 800,
    canvasHeight: 500,
    canvasScaleMult: 4,
    refresh60fpsDivider: 3,
    freezeDelay: 150,
    dashSpeedMult: 1.5,
    dashCost: 1,
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
};
export const defDir = { "p1": 3, "p2": 7 };
export function defPosition(id, width, height) {
    return { x: id === "p1" ? 0 : def.canvasWidth - width, y: def.canvasHeight / 2 - height };
}
