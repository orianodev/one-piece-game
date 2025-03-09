import { CharacterID } from "./data/charactersInfos";

export type StaticHeaders = { "Content-Type": string, "Cache-Control"?: string }

export type RoomID = number;
export type GameState = { p1: Player | {}, p2: Player | {} }
export type GameStateCollection = { [key: RoomID]: GameState }

export type PostMessage = { player: Player, roomId: RoomID, playerId: PlayerId }
export type UpdateMessage = { roomId: RoomID, p1: PlayerAttributesTuple, p2: PlayerAttributesTuple }

export type PlayerAttributesTuple = [rage: boolean, x: number, y: number, dir: MoveDirections, hp: number, mana: number, attacks: AttackAttributesTuple[]];
export type AttackAttributesTuple = [id: 1 | 2, type: 1 | 2, dir: MoveDirections, x: number, y: number];

export type CharacterID = string;
export type PlayerId = "p1" | "p2";
export type MoveDirections = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type AttackType = "simple" | "super";
export type ImgFolder = "normal" | "rage" | "attack";
export type Action = "move" | "dash" | "attack" | "super" | "heal" | "regen" | "rage";

export type GameStatus = "loading" | "playing" | "over";
export type Mode = "dual" | "solo";
export type BotLevel = "easy" | "medium" | "hard";

export type OneCharacterStats = {
    id: CharacterID;
    name: string;
    type: string | "tank" | "balance" | "kunoichi" | "doctor";
    color: string;
    width: number;
    height: number;
    speed: number;
    hp: number;
    maxHp: number;
    healPow: number;
    mana: number;
    maxMana: number;
    regenPow: number;
    strength: number;
    attackName: string;
    attackWidth: number;
    attackHeight: number;
    attackCost: number;
    attackSpeed: number;
}