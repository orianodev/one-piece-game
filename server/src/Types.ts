type StaticHeaders = { "Content-Type": string, "Cache-Control"?: string }

type RoomID = number;
type GameState = { A: PlayerAttributes | {}, B: PlayerAttributes | {} }
type GameStateCollection = { [key: RoomID]: GameState }

type PlayerAttributesTuple = [rage: boolean, x: number, y: number, dir: MoveDirections, hp: number, mana: number, attacks: AttackAttributesTuple[]];
type AttackAttributesTuple = [id: PlayerId, type: AttackType, x: number, y: number, dir: MoveDirections];

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
    attackImg: string;
    attackCost: number;
    attackSpeed: number;
    attacks: AttackAttributesTuple[];
}

type CharacterID = string;
type PlayerId = "A" | "B";
type MoveDirections = 1 | 2 | 3 | 4;
type AttackType = "sim" | "sup";