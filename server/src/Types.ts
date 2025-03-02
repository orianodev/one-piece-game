type RoomID = number;
type GameState = { A: PlayerAttributes | {}, B: PlayerAttributes | {} }
type GameStateCollection = { [key: RoomID]: GameState }

type PlayerAttributesTuple = [rage: boolean, x: number, y: number, dir: MoveDirections, hp: number, mana: number, atks: AtkAttributesTuple[]];
type AtkAttributesTuple = [id: PlayerId, type: AtkType, x: number, y: number, dir: MoveDirections];

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

type CharacterID = "luffy" | "zoro" | "sanji" | "ace" | "jinbe" | "law" | "franky" | "brook" | "baggy" | "chopper" | "kuma" | "nami" | "robin" | "sabo" | "smoker" | "usopp" | "kid" | "perona" | "crocodile" | "marco";
type PlayerId = "A" | "B"
type MoveDirections = 1 | 2 | 3 | 4;
type AtkType = "sim" | "sup"