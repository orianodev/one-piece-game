type PlayerAttributesDeltasTuple = [rage, x, y, dir, hp, mana, atks];
type rage = boolean;
type x = number;
type y = number;
type dir = MoveDirections;
type hp = number;
type mana = number;
type atks = AtkAttributesDeltasTuple[];
type AtkAttributesDeltasTuple = [PlayerId, AtkType, x, y, dir];

interface Atk {
    id: PlayerId;
    type: AtkType;
    x: number;
    y: number;
    dir: MoveDirections;
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
    atks: Atk[];
}

type GameState = { A: PlayerAttributes | {}, B: PlayerAttributes | {} }
type GameStateCollection = { [key: RoomID]: GameState }
type RoomID = number;

type Mode = "dual" | "solo";
type Stadium = "eni" | "imp" | "log" | "mar" | "sab" | "thr";
type AiLevel = "easy" | "medium" | "hard";
type CharacterID = "luffy" | "zoro" | "sanji" | "ace" | "jinbe" | "law" | "franky" | "brook" | "baggy" | "chopper" | "kuma" | "nami" | "robin" | "sabo" | "smoker" | "usopp" | "kid" | "perona" | "crocodile" | "marco";

type PlayerId = "A" | "B"
type MoveDirections = 1 | 2 | 3 | 4;
type AtkType = "sim" | "sup"
type Position = { x: number; y: number };

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
    rageTextColor: string;
    shadowBlur: number;
    cursorSize: number;
    aiLvlInterval: { [key in AiLevel]: number };
}

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