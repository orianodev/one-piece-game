// server.ts
interface PlayerAttributesDeltas {
    img: string;
    x: number;
    y: number;
    direction: MoveDirections;
    speed: number;
    hp: number;
    healPow: number;
    mana: number;
    regenPow: number;
    strength: number;
    atkSpeed: number;
    atks: Atk[];
}

interface PlayerAttributes extends PlayerAttributesDeltas {
    id: PlayerId;
    charId: CharacterID;
    charName: string;
    color: string;
    score: number;
    maxHp: number;
    maxMana: number;
    atkImg: string;
    atkCost: number;
    atks: Atk[];
}

type GameState = { A: PlayerAttributes | {}, B: PlayerAttributes | {} }
type GameStateCollection = { [key: RoomID]: GameState }
type RoomID = number;

// index.html/selection.ts -> LocalStorage
type Mode = "dual" | "solo";
type StadiumChoice = "eni" | "imp" | "log" | "mar" | "sab" | "thr";
type AiLevel = "easy" | "medium" | "hard";
type CharacterID = "luffy" | "zoro" | "sanji" | "ace";

type PlayerId = "A" | "B"
type MoveDirections = "up" | "right" | "down" | "left";
type AtkType = "simple" | "super"
type Position = { x: number; y: number };

// play.html/play.ts
interface SettingsInt {
    playW: number;
    playH: number;
    atkW: number;
    atkH: number;
    refreshRate: number;
    freezeDelay: number;
    superManaMult: number;
    superDamageMult: number;
    rageThreshold: number;
    rageSpeedMult: number;
    rageStrengthMult: number;
    rageAtkSpeedMult: number;
    rageRegenFactor: number;
    collisionDist: number;
    normalColor: string;
    rageColor: string;
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