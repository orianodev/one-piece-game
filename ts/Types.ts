// index.html/selection.ts -> LocalStorage
type Mode = "dual" | "solo";
type StadiumChoice = "eni" | "imp" | "log" | "mar" | "sab" | "thr";
type AiLevel = "easy" | "medium" | "hard";
type CharacterID = "luffy" | "zoro" | "sanji" | "ace";

type PlayerId = "A" | "B"
type MoveDirections = "up" | "right" | "down" | "left";
type AttackType = "simple" | "special"
type Position = { x: number; y: number };

// play.html/play.ts
interface SettingsInt {
    playW: number; // Player Width (default: 50)
    playH: number; // Player Height (default: 50)
    projW: number; // Projectile Width (default: 10)
    projH: number; // Projectile Height (default: 10)
    freezeDelay: number; // Delay before player can attack/heal/regen again (default: 150)
    collisionDistance: number; // Distance for collision detection (default: 20)
    specialManaMultiplier: number; // Multiplier for Special Attack (default: 10)
    specialDamageMultiplier: number; // Multiplier for Special Attack (default: 4)
    transformThreshold: number; // Threshold for low hp to transform (default: 0.1)
    transformSpeedFactor: number; // Factor for multypling when transformed (default: 1.5)
    transformStrengthFactor: number; // Factor for multypling when transformed (default: 1.2)
    transformAttackSpeedFactor: number; // Factor for low hp to transform (default: 1.5)
    transformRegenFactor: number; // Factor for low hp to transform (default: 1.5)
    cursorSize: number; // Cursor Size (default: 10)
    aiLevelInterval: { [key in AiLevel]: number }; // Interval for AI Level (default: 1000)
}

interface OneCharacterStats {
    name: string;
    sprite: string;
    color: string;
    speed: number;
    hp: number;
    maxHp: number;
    healingPower: number;
    mana: number;
    maxMana: number;
    regenPower: number;
    attackSprite: string;
    attackCost: number;
    attackSpeed: number;
    attackStrength: number;
}