export function charSpritePathFromId(id) {
    return `/img/char/${id}.png`;
}
export function attackSpritePathFromName(name) {
    return `/img/attack/${name}.png`;
}
export const characterStats = {
    ace: {
        id: "ace",
        name: "Portgas D. Ace",
        type: "balance",
        color: "orange",
        speed: 9,
        hp: 250,
        maxHp: 250,
        healPow: 3,
        mana: 120,
        maxMana: 250,
        regenPow: 10,
        strength: 15,
        attackName: "fireball",
        attackCost: 10,
        attackSpeed: 18,
    },
    baggy: {
        id: "baggy",
        name: "Baggy le Clown",
        type: "kunoichi",
        color: "cyan",
        speed: 6.5,
        hp: 160,
        maxHp: 220,
        healPow: 4,
        mana: 180,
        maxMana: 180,
        regenPow: 6,
        strength: 9,
        attackName: "knife",
        attackCost: 6,
        attackSpeed: 18,
    },
    brook: {
        id: "brook",
        name: "Brook",
        type: "kunoichi",
        color: "white",
        speed: 14,
        hp: 150,
        maxHp: 300,
        healPow: 3,
        mana: 120,
        maxMana: 200,
        regenPow: 10,
        strength: 15,
        attackName: "music",
        attackCost: 10,
        attackSpeed: 20,
    },
    chopper: {
        id: "chopper",
        name: "Tony Tony Chopper",
        type: "doctor",
        color: "red",
        speed: 8,
        hp: 180,
        maxHp: 220,
        healPow: 7,
        mana: 120,
        maxMana: 250,
        regenPow: 12,
        strength: 9,
        attackName: "hoof",
        attackCost: 9,
        attackSpeed: 19,
    },
    franky: {
        id: "franky",
        name: "Franky",
        type: "balance",
        color: "blue",
        speed: 9,
        hp: 200,
        maxHp: 230,
        healPow: 2,
        mana: 150,
        maxMana: 300,
        regenPow: 12,
        strength: 10,
        attackName: "canon",
        attackCost: 10,
        attackSpeed: 20,
    },
    hancock: {
        id: "hancock",
        name: "Boa Hancock",
        type: "balance",
        color: "pink",
        speed: 7.5,
        hp: 240,
        maxHp: 240,
        healPow: 3.5,
        mana: 160,
        maxMana: 250,
        regenPow: 10,
        strength: 12,
        attackName: "heart",
        attackCost: 11,
        attackSpeed: 18,
    },
    jinbe: {
        id: "jinbe",
        name: "Jinbei",
        type: "tank",
        color: "blue",
        speed: 5,
        hp: 300,
        maxHp: 300,
        healPow: 1.5,
        mana: 140,
        maxMana: 300,
        regenPow: 5,
        strength: 20,
        attackName: "wave",
        attackCost: 20,
        attackSpeed: 11,
    },
    katakuri: {
        id: "katakuri",
        name: "Charlotte Katakuri",
        type: "tank",
        color: "purple",
        speed: 7,
        hp: 300,
        maxHp: 300,
        healPow: 3,
        mana: 110,
        maxMana: 200,
        regenPow: 7,
        strength: 18,
        attackName: "mochi",
        attackCost: 15,
        attackSpeed: 15,
    },
    kuma: {
        id: "kuma",
        name: "Bartholomew Kuma",
        type: "tank",
        color: "black",
        speed: 4,
        hp: 300,
        maxHp: 300,
        healPow: 2,
        mana: 100,
        maxMana: 200,
        regenPow: 8,
        strength: 18,
        attackName: "pad",
        attackCost: 20,
        attackSpeed: 7,
    },
    kuzan: {
        id: "kuzan",
        name: "Kuzan",
        type: "tank",
        color: "lightblue",
        speed: 8,
        hp: 300,
        maxHp: 300,
        healPow: 4,
        mana: 120,
        maxMana: 250,
        regenPow: 8,
        strength: 12,
        attackName: "ice",
        attackCost: 12,
        attackSpeed: 17,
    },
    law: {
        id: "law",
        name: "Trafalgar D. Law",
        type: "doctor",
        color: "brown",
        speed: 10,
        hp: 150,
        maxHp: 180,
        healPow: 7,
        mana: 100,
        maxMana: 190,
        regenPow: 15,
        strength: 9,
        attackName: "scalpel",
        attackCost: 10,
        attackSpeed: 20,
    },
    luffy: {
        id: "luffy",
        name: "Monkey D. Luffy",
        type: "balance",
        color: "red",
        speed: 11.5,
        hp: 230,
        maxHp: 300,
        healPow: 4.5,
        mana: 90,
        maxMana: 250,
        regenPow: 10,
        strength: 11,
        attackName: "punch",
        attackCost: 11,
        attackSpeed: 20,
    },
    marco: {
        id: "marco",
        name: "Marco le Phoenix",
        type: "balance",
        color: "cyan",
        speed: 8.5,
        hp: 200,
        maxHp: 250,
        healPow: 5,
        mana: 160,
        maxMana: 300,
        regenPow: 12,
        strength: 12,
        attackName: "phoenix",
        attackCost: 11,
        attackSpeed: 20,
    },
    nami: {
        id: "nami",
        name: "Nami",
        type: "kunoichi",
        color: "orange",
        speed: 9,
        hp: 140,
        maxHp: 200,
        healPow: 3.5,
        mana: 250,
        maxMana: 250,
        regenPow: 10,
        strength: 7,
        attackName: "bolt",
        attackCost: 5,
        attackSpeed: 40,
    },
    perona: {
        id: "perona",
        name: "Perona",
        type: "kunoichi",
        color: "pink",
        speed: 8.5,
        hp: 180,
        maxHp: 230,
        healPow: 5,
        mana: 255,
        maxMana: 255,
        regenPow: 12,
        strength: 10,
        attackName: "ghost",
        attackCost: 10,
        attackSpeed: 23.5,
    },
    robin: {
        id: "robin",
        name: "Nico Robin",
        type: "kunoichi",
        color: "pink",
        speed: 8.5,
        hp: 170,
        maxHp: 240,
        healPow: 6,
        mana: 140,
        maxMana: 230,
        regenPow: 10,
        strength: 10,
        attackName: "arm",
        attackCost: 11,
        attackSpeed: 21,
    },
    sanji: {
        id: "sanji",
        name: "Vinsmoke Sanji",
        type: "balance",
        color: "yellow",
        speed: 8,
        hp: 200,
        maxHp: 275,
        healPow: 3,
        mana: 150,
        maxMana: 200,
        regenPow: 10,
        strength: 11,
        attackName: "kick",
        attackCost: 10,
        attackSpeed: 20,
    },
    smoker: {
        id: "smoker",
        name: "Smoker",
        type: "balance",
        color: "gray",
        speed: 7,
        hp: 250,
        maxHp: 300,
        healPow: 4,
        mana: 110,
        maxMana: 210,
        regenPow: 7,
        strength: 13,
        attackName: "smoke",
        attackCost: 10,
        attackSpeed: 19,
    },
    usopp: {
        id: "usopp",
        name: "Usopp",
        type: "kunoichi",
        color: "green",
        speed: 8,
        hp: 140,
        maxHp: 200,
        healPow: 4,
        mana: 200,
        maxMana: 200,
        regenPow: 9,
        strength: 7.5,
        attackName: "plant",
        attackCost: 8,
        attackSpeed: 35,
    },
    zoro: {
        id: "zoro",
        name: "Roronoa Zoro",
        type: "balance",
        color: "purple",
        speed: 7.5,
        hp: 220,
        maxHp: 300,
        healPow: 5,
        mana: 100,
        maxMana: 200,
        regenPow: 10,
        strength: 10,
        attackName: "tornado",
        attackCost: 10,
        attackSpeed: 22,
    }
};
