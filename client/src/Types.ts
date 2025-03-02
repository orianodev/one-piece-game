type Mode = "dual" | "solo";
type Stadium = "eni" | "imp" | "log" | "mar" | "sab" | "thr";
type AiLevel = "easy" | "medium" | "hard";
type CharacterID = "luffy" | "zoro" | "sanji" | "ace" | "jinbe" | "law" | "franky" | "brook" | "baggy" | "chopper" | "kuma" | "nami" | "robin" | "sabo" | "smoker" | "usopp" | "kid" | "perona" | "crocodile" | "marco";

interface SettingsInt {
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
type Position = { x: number; y: number };

interface OneCharacterStats {
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

interface PlayerAttributes {
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

type PlayerId = "A" | "B"
type MoveDirections = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type AtkType = "sim" | "sup"

type PlayerAttributesTuple = [rage: boolean, x: number, y: number, dir: MoveDirections, hp: number, mana: number, atks: AtkAttributesTuple[]];
type AtkAttributesTuple = [id: PlayerId, type: AtkType, x: number, y: number, dir: MoveDirections];