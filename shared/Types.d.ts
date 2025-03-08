import { CharacterID } from "./data/charactersInfos";

export type StaticHeaders = { "Content-Type": string, "Cache-Control"?: string }

export type RoomID = number;
export type GameState = { 1: PlayerAttributes | {}, 2: PlayerAttributes | {} }
export type GameStateCollection = { [key: RoomID]: GameState }

export type PostMessage = { player: PlayerAttributes, roomId: RoomID, playerId: PlayerId }
export type UpdateMessage = { roomId: RoomID, 1: PlayerAttributesTuple, 2: PlayerAttributesTuple }

export type PlayerAttributesTuple = [rage: boolean, x: number, y: number, dir: MoveDirections, hp: number, mana: number, attacks: AttackAttributesTuple[]];
export type AttackAttributesTuple = [id: PlayerId, type: AttackType, x: number, y: number, dir: MoveDirections];

export type PlayerAttributes = {
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
    attackName: string;
    attackCost: number;
    attackSpeed: number;
    attacks: Attack[];
}

export type CharacterID = string;
export type PlayerId = 1 | 2;
export type MoveDirections = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type AttackType = 0 | 1; // 0: simple, 1: super

export type GameStatus = "loading" | "playing" | "over";
export type Mode = "dual" | "solo";
export type BotLevel = "easy" | "medium" | "hard";

export type OneCharacterStats = {
    id: CharacterID;
    name: string;
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
    attackName: string;
    attackCost: number;
    attackSpeed: number;
}