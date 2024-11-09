// server.ts
interface PlayerAttributesDeltas {
    rage: boolean;
    x: number;
    y: number;
    dir: MoveDirections;
    hp: number;
    mana: number;
    atks: Atk[];
}

interface PlayerAttributes extends PlayerAttributesDeltas {
    id: PlayerId;
    charId: CharacterID;
    charName: string;
    color: string;
    img: string;
    score: number;
    speed: number;
    maxHp: number;
    healPow: number;
    maxMana: number;
    regenPow: number;
    strength: number;
    atkImg: string;
    atkCost: number;
    atkSpeed: number;
}

type GameState = { A: PlayerAttributes | {}, B: PlayerAttributes | {} }
type GameStateCollection = { [key: RoomID]: GameState }
type RoomID = number;

// index.html/selection.ts -> LocalStorage
type Mode = "dual" | "solo";
type StadiumChoice = "eni" | "imp" | "log" | "mar" | "sab" | "thr";
type AiLevel = "easy" | "medium" | "hard";
type CharacterID = "luffy" | "zoro" | "sanji" | "ace" | "jinbe" | "law" | "franky" | "brook";

type PlayerId = "A" | "B"
type MoveDirections = "up" | "right" | "down" | "left";
type AtkType = "sim" | "sup"
type Position = { x: number; y: number };

// play.html/play.ts
interface SettingsInt {
    playW: number;
    playH: number;
    atkW: number;
    atkH: number;
    refreshRate: number;
    move60fpsRAFDivider: number;
    freezeDelay: number;
    superManaMult: number;
    superDamageMult: number;
    rageThreshold: number;
    rageDuration: number;
    rageSpeedMult: number;
    rageStrengthMult: number;
    rageAtkSpeedMult: number;
    rageRegenFactor: number;
    collisionDist: number;
    normalTextColor: string;
    rageTextColor: string;
    cursorSize: number;
    aiLvlInterval: { [key in AiLevel]: number };
}

interface OneCharacterStats {
    name: string;
    img: string;
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