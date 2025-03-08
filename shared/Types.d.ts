import { CharacterID } from "./data/charactersInfos";
// import { Attack } from "../client/src/logic/class/Attack";

export type StaticHeaders = { "Content-Type": string, "Cache-Control"?: string }

export type RoomID = number;
export type GameState = { A: PlayerAttributes | {}, B: PlayerAttributes | {} }
export type GameStateCollection = { [key: RoomID]: GameState }

export type PlayerAttributesTuple = [rage: boolean, x: number, y: number, dir: MoveDirections, hp: number, mana: number, attacks: AttackAttributesTuple[]];
export type AttackAttributesTuple = [id: PlayerId, type: AttackType, x: number, y: number, dir: MoveDirections];

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
    attackImg: string;
    attackCost: number;
    attackSpeed: number;
    attacks: Attack[];
}

export type CharacterID = string;
export type PlayerId = "A" | "B";
export type MoveDirections = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type AttackType = "sim" | "sup";

export type GameStatus = "loading" | "playing" | "over";
export type Mode = "dual" | "solo";
export type BotLevel = "easy" | "medium" | "hard";

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
    attackImg: string;
    attackCost: number;
    attackSpeed: number;
}