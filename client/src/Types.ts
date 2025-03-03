import { CharacterID } from "./data/charactersInfos";

export type Mode = "dual" | "solo";
export type AiLevel = "easy" | "medium" | "hard";

export interface SettingsInt {
    canvasWidth: number;
    canvasHeight: number;
    canvasScaleMult: number;
    playW: number;
    playH: number;
    atkW: number;
    atkH: number;
    refreshRate: number;
    move60fpsRAFDivider: number;
    freezeDelay: number;
    superSizeMult: number;
    superManaMult: number;
    superDamageMult: number;
    rageThreshold: number;
    rageDuration: number;
    rageSpeedMult: number;
    rageStrengthMult: number;
    rageAtkSpeedMult: number;
    rageRegenFactor: number;
    rageHealFactor: number;
    collisionDist: number;
    normalTextColor: string;
    normalHpColor: string;
    rageTextColor: string;
    shadowBlur: number;
    cursorSize: number;
    aiLvlInterval: { [key in AiLevel]: number };
}
export type Position = { x: number; y: number };

export interface OneCharacterStats {
    name: string;
    img: string;
    type: string | "tank" | "balance" | "kunoichi" | "doctor";
    color: string;
    speed: number;
    hp: number;
    maxHp: number;
    healPow: number;
    mana: number;
    maxMana: number;
    regenPow: number;
    strength: number;
    atkImg: string;
    atkCost: number;
    atkSpeed: number;
}

export interface PlayerAttributes {
    id: PlayerId;
    charId: CharacterID;
    charName: string;
    color: string;
    img: string;
    score: number;
    rage: boolean;
    x: number;
    y: number;
    dir: MoveDirections;
    speed: number;
    hp: number;
    maxHp: number;
    healPow: number;
    mana: number;
    maxMana: number;
    regenPow: number;
    strength: number;
    atkImg: string;
    atkCost: number;
    atkSpeed: number;
    atks: AtkAttributesTuple[];
}

export type PlayerId = "A" | "B"
export type MoveDirections = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type AtkType = "sim" | "sup"

export type PlayerAttributesTuple = [rage: boolean, x: number, y: number, dir: MoveDirections, hp: number, mana: number, atks: AtkAttributesTuple[]];
export type AtkAttributesTuple = [id: PlayerId, type: AtkType, x: number, y: number, dir: MoveDirections];