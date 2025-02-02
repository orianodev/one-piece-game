// CHARACTERS
const characterStats = {
    ace: {
        name: "Portgas D. Ace",
        img: "/img/char/ace.png",
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
        atkImg: "/img/atk/fireball.png",
        atkCost: 10,
        atkSpeed: 18,
    },
    baggy: {
        name: "Baggy le Clown",
        img: "/img/char/baggy.png",
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
        atkImg: "/img/atk/knife.png",
        atkCost: 6,
        atkSpeed: 18,
    },
    bellamy: {
        name: "Bellamy",
        img: "/img/char/bellamy.png",
        type: "balance",
        color: "yellow",
        speed: 9,
        hp: 220,
        maxHp: 275,
        healPow: 2,
        mana: 90,
        maxMana: 180,
        regenPow: 6,
        strength: 13,
        atkImg: "/img/atk/spring.png",
        atkCost: 9,
        atkSpeed: 19,
    },
    brook: {
        name: "Brook",
        img: "/img/char/brook.png",
        type: "kunoichi",
        color: "white",
        speed: 14,
        hp: 150,
        maxHp: 350,
        healPow: 3,
        mana: 120,
        maxMana: 200,
        regenPow: 10,
        strength: 15,
        atkImg: "/img/atk/music.png",
        atkCost: 10,
        atkSpeed: 20,
    },
    chopper: {
        name: "Tony Tony Chopper",
        img: "/img/char/chopper.png",
        type: "doctor",
        color: "red",
        speed: 8,
        hp: 180,
        maxHp: 280,
        healPow: 8,
        mana: 120,
        maxMana: 250,
        regenPow: 12,
        strength: 9,
        atkImg: "/img/atk/hoof.png",
        atkCost: 9,
        atkSpeed: 19,
    },
    crocodile: {
        name: "Sir Crocodile",
        img: "/img/char/crocodile.png",
        type: "balance",
        color: "brown",
        speed: 7,
        hp: 220,
        maxHp: 300,
        healPow: 2.5,
        mana: 130,
        maxMana: 240,
        regenPow: 9,
        strength: 16,
        atkImg: "/img/atk/sand.png",
        atkCost: 12,
        atkSpeed: 18,
    },
    franky: {
        name: "Franky",
        img: "/img/char/franky.png",
        type: "balance",
        color: "blue",
        speed: 9,
        hp: 200,
        maxHp: 250,
        healPow: 2,
        mana: 150,
        maxMana: 300,
        regenPow: 12,
        strength: 15,
        atkImg: "/img/atk/canon.png",
        atkCost: 10,
        atkSpeed: 20,
    },
    hancock: {
        name: "Boa Hancock",
        img: "/img/char/hancock.png",
        type: "balance",
        color: "pink",
        speed: 7.5,
        hp: 250,
        maxHp: 320,
        healPow: 3.5,
        mana: 160,
        maxMana: 250,
        regenPow: 10,
        strength: 12,
        atkImg: "/img/atk/heart.png",
        atkCost: 11,
        atkSpeed: 18,
    },
    jinbe: {
        name: "Jinbei",
        img: "/img/char/jinbe.png",
        type: "tank",
        color: "blue",
        speed: 5,
        hp: 300,
        maxHp: 400,
        healPow: 1.5,
        mana: 140,
        maxMana: 300,
        regenPow: 5,
        strength: 20,
        atkImg: "/img/atk/wave.png",
        atkCost: 20,
        atkSpeed: 11,
    },
    katakuri: {
        name: "Charlotte Katakuri",
        img: "/img/char/katakuri.png",
        type: "tank",
        color: "purple",
        speed: 7,
        hp: 350,
        maxHp: 400,
        healPow: 3,
        mana: 110,
        maxMana: 200,
        regenPow: 7,
        strength: 18,
        atkImg: "/img/atk/mochi.png",
        atkCost: 15,
        atkSpeed: 15,
    },
    kid: {
        name: "Eustass Captain Kid",
        img: "/img/char/kid.png",
        type: "tank",
        color: "grey",
        speed: 6.5,
        hp: 260,
        maxHp: 330,
        healPow: 3,
        mana: 110,
        maxMana: 200,
        regenPow: 7,
        strength: 18,
        atkImg: "/img/atk/metal.png",
        atkCost: 13,
        atkSpeed: 17,
    },
    kuma: {
        name: "Bartholomew Kuma",
        img: "/img/char/kuma.png",
        type: "tank",
        color: "black",
        speed: 4,
        hp: 400,
        maxHp: 450,
        healPow: 2,
        mana: 100,
        maxMana: 200,
        regenPow: 8,
        strength: 18,
        atkImg: "/img/atk/pad.png",
        atkCost: 20,
        atkSpeed: 7,
    },
    kuzan: {
        name: "Kuzan",
        img: "/img/char/kuzan.png",
        type: "tank",
        color: "lightblue",
        speed: 8,
        hp: 300,
        maxHp: 350,
        healPow: 4,
        mana: 120,
        maxMana: 250,
        regenPow: 8,
        strength: 14,
        atkImg: "/img/atk/ice.png",
        atkCost: 12,
        atkSpeed: 17,
    },
    law: {
        name: "Trafalgar D. Law",
        img: "/img/char/law.png",
        type: "doctor",
        color: "brown",
        speed: 10,
        hp: 150,
        maxHp: 200,
        healPow: 10,
        mana: 100,
        maxMana: 190,
        regenPow: 15,
        strength: 11,
        atkImg: "/img/atk/scalpel.png",
        atkCost: 10,
        atkSpeed: 20,
    },
    luffy: {
        name: "Monkey D. Luffy",
        img: "/img/char/luffy.png",
        type: "balance",
        color: "red",
        speed: 11.5,
        hp: 230,
        maxHp: 330,
        healPow: 5,
        mana: 90,
        maxMana: 250,
        regenPow: 10,
        strength: 11,
        atkImg: "/img/atk/punch.png",
        atkCost: 11,
        atkSpeed: 20,
    },
    marco: {
        name: "Marco le Phoenix",
        img: "/img/char/marco.png",
        type: "balance",
        color: "cyan",
        speed: 8.5,
        hp: 200,
        maxHp: 280,
        healPow: 7,
        mana: 160,
        maxMana: 300,
        regenPow: 12,
        strength: 12,
        atkImg: "/img/atk/phoenix.png",
        atkCost: 11,
        atkSpeed: 20,
    },
    nami: {
        name: "Nami",
        img: "/img/char/nami.png",
        type: "kunoichi",
        color: "orange",
        speed: 9,
        hp: 130,
        maxHp: 200,
        healPow: 5,
        mana: 250,
        maxMana: 250,
        regenPow: 10,
        strength: 7,
        atkImg: "/img/atk/bolt.png",
        atkCost: 10,
        atkSpeed: 31,
    },
    perona: {
        name: "Perona",
        img: "/img/char/perona.png",
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
        atkImg: "/img/atk/ghost.png",
        atkCost: 10,
        atkSpeed: 23.5,
    },
    robin: {
        name: "Nico Robin",
        img: "/img/char/robin.png",
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
        atkImg: "/img/atk/arm.png",
        atkCost: 11,
        atkSpeed: 21,
    },
    sabo: {
        name: "Sabo",
        img: "/img/char/sabo.png",
        type: "balance",
        color: "orange",
        speed: 9,
        hp: 220,
        maxHp: 300,
        healPow: 3,
        mana: 130,
        maxMana: 200,
        regenPow: 8,
        strength: 14,
        atkImg: "/img/atk/flame.png",
        atkCost: 12,
        atkSpeed: 20,
    },
    sanji: {
        name: "Vinsmoke Sanji",
        img: "/img/char/sanji.png",
        type: "balance",
        color: "yellow",
        speed: 8,
        hp: 200,
        maxHp: 275,
        healPow: 3,
        mana: 150,
        maxMana: 200,
        regenPow: 10,
        strength: 10,
        atkImg: "/img/atk/kick.png",
        atkCost: 10,
        atkSpeed: 19,
    },
    smoker: {
        name: "Smoker",
        img: "/img/char/smoker.png",
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
        atkImg: "/img/atk/smoke.png",
        atkCost: 10,
        atkSpeed: 19,
    },
    usopp: {
        name: "Usopp",
        img: "/img/char/usopp.png",
        type: "kunoichi",
        color: "green",
        speed: 8,
        hp: 140,
        maxHp: 200,
        healPow: 4,
        mana: 200,
        maxMana: 200,
        regenPow: 9,
        strength: 6,
        atkImg: "/img/atk/plant.png",
        atkCost: 8,
        atkSpeed: 30,
    },
    zoro: {
        name: "Roronoa Zoro",
        img: "/img/char/zoro.png",
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
        atkImg: "/img/atk/tornado.png",
        atkCost: 10,
        atkSpeed: 22,
    }
};


// DEFAULT SETTINGS
const def: SettingsInt = {
    canvasWidth: 800,
    canvasHeight: 500,
    canvasScaleMult: 4,
    playW: 80,
    playH: 120,
    atkW: 30,
    atkH: 30,
    refreshRate: 50,
    move60fpsRAFDivider: 5,
    freezeDelay: 150,
    collisionDist: 67,
    superSizeMult: 3,
    superManaMult: 10,
    superDamageMult: 5,
    rageThreshold: 0.25,
    rageDuration: 10000,
    rageSpeedMult: 1.3,
    rageStrengthMult: 1.3,
    rageAtkSpeedMult: 1.3,
    rageRegenFactor: 1.3,
    rageHealFactor: 1.3,
    normalTextColor: "whitesmoke",
    rageTextColor: "red",
    shadowBlur: 150,
    cursorSize: 10,
    aiLvlInterval: {
        "easy": 250,
        "medium": 180,
        "hard": 160,
    }
}
const defPos: { A: Position, B: Position } = { A: { x: 0, y: def.canvasHeight / 2 - def.playH }, B: { x: def.canvasWidth - def.playW, y: def.canvasHeight / 2 - def.playH } }


// DISPLAY ELEMENTS
const $playScreen = document.querySelector("#play") as HTMLDivElement;
const $canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const $ctx = $canvas.getContext("2d") as CanvasRenderingContext2D;
$canvas.width = def.canvasWidth * def.canvasScaleMult;
$canvas.height = def.canvasHeight * def.canvasScaleMult;
$canvas.style.width = `${def.canvasWidth}px`;
$canvas.style.height = `${def.canvasHeight}px`;
$ctx.scale(def.canvasScaleMult, def.canvasScaleMult);
const $character1 = document.querySelector("#character-1") as HTMLSpanElement;
const $hpBar1 = document.querySelector("#hp-bar-1") as HTMLDivElement;
const $hp1 = document.querySelector("#hp-1") as HTMLSpanElement;
const $manaBar1 = document.querySelector("#mana-bar-1") as HTMLDivElement;
const $mana1 = document.querySelector("#mana-1") as HTMLSpanElement;
const $score1 = document.querySelector("#score-1") as HTMLSpanElement;
const $character2 = document.querySelector("#character-2") as HTMLSpanElement;
const $hpBar2 = document.querySelector("#hp-bar-2") as HTMLDivElement;
const $hp2 = document.querySelector("#hp-2") as HTMLSpanElement;
const $manaBar2 = document.querySelector("#mana-bar-2") as HTMLDivElement;
const $mana2 = document.querySelector("#mana-2") as HTMLSpanElement;
const $score2 = document.querySelector("#score-2") as HTMLSpanElement;


// PLAYER
class Player {
    readonly id: PlayerId;
    readonly charId: CharacterID;
    readonly charName: string;
    readonly color: string;
    readonly img: string;
    readonly score: number;
    public rage: boolean = false;
    public x: number;
    public y: number;
    public dir: MoveDirections;
    public speed: number;
    public hp: number;
    readonly maxHp: number;
    public healPow: number;
    public mana: number;
    readonly maxMana: number;
    public regenPow: number;
    public strength: number;
    readonly atkImg: string;
    readonly atkCost: number;
    public atkSpeed: number;
    public atks: Atk[];

    constructor(id: PlayerId, charId: CharacterID, charName: string, color: string, img: string, score: number, x: number, y: number, dir: MoveDirections, speed: number, hp: number, maxHp: number, healPow: number, mana: number, maxMana: number, regenPow: number, strength: number, atkImg: string, atkCost: number, atkSpeed: number, atks: Atk[] | []) {
        this.id = id
        this.charId = charId
        this.charName = charName
        this.color = color
        this.img = img
        this.score = score
        this.x = x
        this.y = y
        this.dir = dir
        this.speed = speed
        this.hp = hp
        this.maxHp = maxHp
        this.healPow = healPow
        this.mana = mana
        this.maxMana = maxMana
        this.regenPow = regenPow
        this.strength = strength
        this.atkImg = atkImg
        this.atkCost = atkCost
        this.atkSpeed = atkSpeed
        this.atks = atks
    }
    draw() {
        $ctx.globalAlpha = 1;
        _F.setShadow(this.color)

        const newImg = new Image(def.playW, def.playH);
        newImg.src = this.rage === false ? this.img : this.getRageImg()
        $ctx.drawImage(newImg, this.x, this.y, def.playW, def.playH);

        $ctx.globalAlpha = 0.5;
        if (this.dir === 1) $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
        if (this.dir === 3) $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y + def.playH + 5, def.cursorSize, def.cursorSize);
        if (this.dir === 4) $ctx.fillRect(this.x - def.cursorSize - 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
        if (this.dir === 2) $ctx.fillRect(this.x + def.playW + 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
        _F.resetPen()
    }
    freeze(): boolean {
        if (isFrozen) return false;
        isFrozen = true;
        unfreezeThisPlayer();
        return true;
    }
    atk() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return;
        if (this.mana < this.atkCost) return;
        this.mana -= this.atkCost;
        const atk = new Atk(this.id, "sim", this.x + def.playW / 2, this.y + def.playH / 2, this.dir);
        this.atks.push(atk);
        atk.draw();
        _F.updateServer();
    }
    superAtk() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return;
        if (this.mana < this.atkCost * def.superManaMult) return
        this.mana -= this.atkCost * def.superManaMult
        const atk = new Atk(this.id, "sup", this.x + def.playW / 2 - def.atkW, this.y + def.playH / 2 - def.atkH, this.dir);
        this.atks.push(atk)
        atk.draw()
        _F.updateServer()
    }
    heal() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return;
        if (this.hp + this.healPow > this.maxHp) this.hp = this.maxHp
        if (this.hp === this.maxHp) return
        this.hp += this.healPow
        _F.updateServer()
    }
    regen() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return;
        if (this.mana + this.regenPow > this.maxMana) this.mana = this.maxMana
        if (this.mana === this.maxMana) return
        this.mana += this.regenPow
        _F.updateServer()
    }
    enrage() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return console.log("Rage disabled in freeze mode");
        if (this.rage || this.hp > this.maxHp * def.rageThreshold) return console.log("Already enraged or HP above threshold");
        this.rage = true;
        this.speed *= def.rageSpeedMult
        this.strength *= def.rageStrengthMult
        this.atkSpeed *= def.rageAtkSpeedMult
        this.regenPow *= def.rageRegenFactor
        this.healPow *= def.rageHealFactor
        if (this.id === "A") $character1.style.color = def.rageTextColor
        else if (this.id === "B") $character2.style.color = def.rageTextColor
        setTimeout(() => this.unRage(), def.rageDuration)
        _F.updateServer()
    }
    unRage() {
        this.speed = characterStats[this.charId].speed
        this.strength = characterStats[this.charId].strength
        this.regenPow = characterStats[this.charId].regenPow
        this.healPow = characterStats[this.charId].healPow
        if (this.id === "A") $character1.style.color = def.normalTextColor
        else if (this.id === "B") $character2.style.color = def.normalTextColor
        this.rage = false;
        _F.updateServer()
    }
    getRageImg() {
        return this.img.replace("char", "rage")
    }
    moveUp() {
        if (this.y < 0) return
        // const oppPos: Position = { x: _F.oppPlayer.x, y: _F.oppPlayer.y }
        // if (this.y == oppPos!.y + def.playH && this.x + def.playW > oppPos!.x && this.x < oppPos!.x + def.playW) return
        this.dir = 1
        this.y -= this.speed
        _F.drawAll()
        _F.updateServer()
    }
    moveDown() {
        if (this.y > def.canvasHeight - def.playH) return
        // const oppPos: Position = { x: _F.oppPlayer.x, y: _F.oppPlayer.y }
        // if (this.y + def.playH == oppPos!.y && this.x + def.playW > oppPos!.x && this.x < oppPos!.x + def.playW) return
        this.dir = 3
        this.y += this.speed
        _F.drawAll()
        _F.updateServer()
    }
    moveLeft() {
        if (this.x < 0) return
        // const oppPos: Position = { x: _F.oppPlayer.x, y: _F.oppPlayer.y }
        // if (this.y + def.playH > oppPos!.y && this.y < oppPos!.y + def.playH && this.x == oppPos!.x + def.playW) return
        this.dir = 4
        this.x -= this.speed
        _F.drawAll()
        _F.updateServer()
    }
    moveRight() {
        if (this.x > def.canvasWidth - def.playW) return
        // const oppPos: Position = { x: _F.oppPlayer.x, y: _F.oppPlayer.y }
        // if (this.y + def.playH > oppPos!.y && this.y < oppPos!.y + def.playH && this.x + def.playW == oppPos!.x) return
        this.dir = 2
        this.x += this.speed
        _F.drawAll()
        _F.updateServer()
    }
    moveUpRight() {
        if (this.y < 0 || this.x > def.canvasWidth - def.playW) return
        this.dir = 2
        this.x += this.speed / Math.SQRT2;
        this.y -= this.speed / Math.SQRT2;
        _F.drawAll()
        _F.updateServer()
    }
    moveUpLeft() {
        if (this.y < 0 || this.x < 0) return
        this.dir = 4
        this.x -= this.speed / Math.SQRT2;
        this.y -= this.speed / Math.SQRT2;
        _F.drawAll()
        _F.updateServer()
    }
    moveDownRight() {
        if (this.y > def.canvasHeight - def.playH || this.x > def.canvasWidth - def.playW) return
        this.dir = 2
        this.x += this.speed / Math.SQRT2;
        this.y += this.speed / Math.SQRT2;
        _F.drawAll()
        _F.updateServer()
    }
    moveDownLeft() {
        if (this.y > def.canvasHeight - def.playH || this.x < 0) return
        this.dir = 4
        this.x -= this.speed / Math.SQRT2;
        this.y += this.speed / Math.SQRT2;
        _F.drawAll()
        _F.updateServer()
    }
}

class Atk {
    readonly id: PlayerId;
    readonly type: AtkType;
    public x: number;
    public y: number;
    public dir: MoveDirections;

    constructor(owner: PlayerId, type: AtkType, x: number, y: number, dir: MoveDirections) {
        this.id = owner
        this.type = type
        this.x = x
        this.y = y
        this.dir = dir
    }
    draw() {
        _F.setShadow(_F.getPlayer(this.id).color)
        const newImg = new Image(def.playW, def.playH);
        // newImg.src = this.img.replace(".png", "-" + this.dir[0] + ".png");
        newImg.src = _F.getPlayer(this.id).atkImg;
        if (this.type === "sim") $ctx.drawImage(newImg, this.x, this.y, def.atkW, def.atkH);
        if (this.type === "sup") $ctx.drawImage(newImg, this.x, this.y, def.atkW * def.superSizeMult, def.atkH * def.superSizeMult);
        _F.resetPen()
    }
    move() {
        const owner = _F.thisPlayer.id === this.id ? _F.thisPlayer : _F.oppPlayer
        if (this.dir == 4) this.x -= owner.atkSpeed
        if (this.dir == 2) this.x += owner.atkSpeed
        if (this.dir == 1) this.y -= owner.atkSpeed
        if (this.dir == 3) this.y += owner.atkSpeed
        this.checkCollisionWithBorder(owner)
        this.checkCollisionWithOpp(owner)
    }
    checkCollisionWithBorder(owner: Player) {
        if (this.dir == 4 && this.x <= 0) this.destroy(owner)
        if (this.dir == 2 && this.x >= def.canvasWidth - def.atkW) this.destroy(owner)
        if (this.dir == 1 && this.y <= 0) this.destroy(owner)
        if (this.dir == 3 && this.y >= def.canvasHeight - def.atkH) this.destroy(owner)
    }
    checkCollisionWithOpp(owner: Player) {
        const opp = _F.thisPlayer.id === this.id ? _F.oppPlayer : _F.thisPlayer
        const oppCenter: Position = { x: opp.x + def.playW / 2, y: opp.y + def.playH * 0.4 }
        const thisAtkCenter: Position = { x: this.x + def.atkW / 2, y: this.y + def.atkH / 2 }
        const distance = Math.sqrt(Math.pow(oppCenter.x - thisAtkCenter.x, 2) + Math.pow(oppCenter.y - thisAtkCenter.y, 2))
        if (distance < def.collisionDist) {
            opp.hp -= this.type === "sim" ? owner.strength : owner.strength * def.superDamageMult
            this.destroy(owner)
        }
    }
    destroy(owner: Player) {
        owner.atks.splice(owner.atks.indexOf(this), 1)
        _F.updateServer()
    }
}

class Fight {
    // @ts-ignore
    public thisPlayer: Player;
    // @ts-ignore
    public oppPlayer: Player;
    readonly roomId: number;
    readonly mode: Mode;
    public state: "playing" | "over";
    constructor(roomId: number, mode: Mode, state: "playing" | "over") {
        this.roomId = roomId
        this.mode = mode
        this.state = state
    }
    getPlayer(playerId: PlayerId): Player {
        return playerId === this.thisPlayer.id ? this.thisPlayer : this.oppPlayer
    }
    aiAction(): void {
        const aiActions = ["move", "move", "atk", "super", "heal", "regen", "rage"];
        let attempt = 0;
        const maxAttempts = 10;

        while (attempt < maxAttempts) {
            const aiChoice = aiActions[Math.floor(Math.random() * aiActions.length)];
            if (aiChoice === "move") {
                const xDiff = this.thisPlayer.x - this.oppPlayer.x;
                const yDiff = this.thisPlayer.y - this.oppPlayer.y;
                const threshold = def.playW / 3;

                // Determine the horizontal and vertical directions
                let horizontalDirection: 4 | 2 | null = null;
                let verticalDirection: 1 | 3 | null = null;

                if (xDiff > threshold) horizontalDirection = 2;
                else if (xDiff < -threshold) horizontalDirection = 4;
                if (yDiff > threshold) verticalDirection = 3;
                else if (yDiff < -threshold) verticalDirection = 1;

                // Execute movement based on determined directions
                if (horizontalDirection === 2 && verticalDirection === 1) this.oppPlayer.moveUpRight();
                else if (horizontalDirection === 2 && verticalDirection === 3) this.oppPlayer.moveDownRight();
                else if (horizontalDirection === 4 && verticalDirection === 1) this.oppPlayer.moveUpLeft();
                else if (horizontalDirection === 4 && verticalDirection === 3) this.oppPlayer.moveDownLeft();
                else if (horizontalDirection === 2) this.oppPlayer.moveRight();
                else if (horizontalDirection === 4) this.oppPlayer.moveLeft();
                else if (verticalDirection === 1) this.oppPlayer.moveUp();
                else if (verticalDirection === 3) this.oppPlayer.moveDown();

            } else if (aiChoice === "atk") {
                this.oppPlayer.atk();
                break;
            } else if (aiChoice === "super" && this.oppPlayer.mana >= this.oppPlayer.atkCost * def.superManaMult) {
                this.oppPlayer.superAtk();
                break;
            } else if (aiChoice === "heal" && this.oppPlayer.hp < this.oppPlayer.maxHp + this.oppPlayer.healPow) {
                this.oppPlayer.heal();
                break;
            } else if (aiChoice === "regen" && this.oppPlayer.mana < this.oppPlayer.maxMana + this.oppPlayer.regenPow) {
                this.oppPlayer.regen();
                break;
            } else if (aiChoice === "rage" && !this.oppPlayer.rage && this.oppPlayer.hp <= this.oppPlayer.maxHp * def.rageThreshold) {
                this.oppPlayer.enrage();
                break;
            }
            attempt++;
        }
    }
    buildPlayers(thisPlayer: Player, oppPlayer: Player) {
        _F.thisPlayer = new Player(thisPlayer.id, thisPlayer.charId, thisPlayer.charName, thisPlayer.color, thisPlayer.img, thisPlayer.score, thisPlayer.x, thisPlayer.y, thisPlayer.dir, thisPlayer.speed, thisPlayer.hp, thisPlayer.maxHp, thisPlayer.healPow, thisPlayer.mana, thisPlayer.maxMana, thisPlayer.regenPow, thisPlayer.strength, thisPlayer.atkImg, thisPlayer.atkCost, thisPlayer.atkSpeed, []);
        _F.oppPlayer = new Player(oppPlayer.id, oppPlayer.charId, oppPlayer.charName, oppPlayer.color, oppPlayer.img, oppPlayer.score, oppPlayer.x, oppPlayer.y, oppPlayer.dir, oppPlayer.speed, oppPlayer.hp, oppPlayer.maxHp, oppPlayer.healPow, oppPlayer.mana, oppPlayer.maxMana, oppPlayer.regenPow, oppPlayer.strength, oppPlayer.atkImg, oppPlayer.atkCost, oppPlayer.atkSpeed, []);
    }
    updatePlayers(thisPlayer: PlayerAttributesDeltasTuple, oppPlayer: PlayerAttributesDeltasTuple) {
        _F.thisPlayer.rage = thisPlayer[0]
        _F.thisPlayer.x = thisPlayer[1]
        _F.thisPlayer.y = thisPlayer[2]
        _F.thisPlayer.dir = thisPlayer[3]
        _F.thisPlayer.hp = thisPlayer[4]
        _F.thisPlayer.mana = thisPlayer[5]
        _F.thisPlayer.atks = this.rebuildAtkArray(thisPlayer[6])

        _F.oppPlayer.rage = oppPlayer[0]
        _F.oppPlayer.x = oppPlayer[1]
        _F.oppPlayer.y = oppPlayer[2]
        _F.oppPlayer.dir = oppPlayer[3]
        _F.oppPlayer.hp = oppPlayer[4]
        _F.oppPlayer.mana = oppPlayer[5]
        _F.oppPlayer.atks = this.rebuildAtkArray(oppPlayer[6])
    }
    getPlayerDeltaAttributes(player: Player): PlayerAttributesDeltasTuple {
        return [player.rage, Math.round(player.x), Math.round(player.y), player.dir, player.hp, player.mana, this.getAtkDeltaAttributes(player.atks)]
    }
    getAtkDeltaAttributes(atks: Atk[]): AtkAttributesDeltasTuple[] {
        return atks.map((atk) => [atk.id, atk.type, atk.x, atk.y, atk.dir]);
    }
    updateServer() {
        if (_F.mode === "solo") return;
        if (thisPlayerId == "A") socket.emit("update", { roomId: _F.roomId, A: this.getPlayerDeltaAttributes(_F.thisPlayer), B: this.getPlayerDeltaAttributes(_F.oppPlayer) });
        else if (thisPlayerId == "B") socket.emit("update", { roomId: _F.roomId, A: this.getPlayerDeltaAttributes(_F.oppPlayer), B: this.getPlayerDeltaAttributes(_F.thisPlayer) });
    };
    drawAll() {
        $ctx.clearRect(0, 0, def.canvasWidth, def.canvasHeight);
        this.drawGrid();
        this.thisPlayer.draw();
        this.oppPlayer.draw();

        this.thisPlayer.atks.forEach((atk) => atk.draw());
        this.oppPlayer.atks.forEach((atk) => atk.draw());

        const playerA = this.thisPlayer.id === "A" ? this.thisPlayer : this.oppPlayer;
        const playerB = this.thisPlayer.id === "B" ? this.thisPlayer : this.oppPlayer;

        $character1.style.color = playerA.rage ? def.rageTextColor : def.normalTextColor;
        $character2.style.color = playerB.rage ? def.rageTextColor : def.normalTextColor;

        // Update HP Bar for Player A
        const hpPercentA = (playerA.hp / playerA.maxHp) * 100;
        $hpBar1.style.width = `${hpPercentA}%`;
        $hpBar1.style.backgroundColor = playerA.hp <= playerA.maxHp * def.rageThreshold ? def.rageTextColor : '#ff4d4d';
        $hp1.innerText = playerA.hp.toFixed(0);

        // Update Mana Bar for Player A
        const manaPercentA = (playerA.mana / playerA.maxMana) * 100;
        $manaBar1.style.width = `${manaPercentA}%`;
        $mana1.innerText = playerA.mana.toFixed(0);

        // Update HP Bar for Player B
        const hpPercentB = (playerB.hp / playerB.maxHp) * 100;
        $hpBar2.style.width = `${hpPercentB}%`;
        $hpBar2.style.backgroundColor = playerB.hp <= playerB.maxHp * def.rageThreshold ? def.rageTextColor : '#ff4d4d';
        $hp2.innerText = playerB.hp.toFixed(0);

        // Update Mana Bar for Player B
        const manaPercentB = (playerB.mana / playerB.maxMana) * 100;
        $manaBar2.style.width = `${manaPercentB}%`;
        $mana2.innerText = playerB.mana.toFixed(0);
    }

    rebuildAtkArray(flattedAtkArray: AtkAttributesDeltasTuple[]): Atk[] {
        return flattedAtkArray.map((atk) => new Atk(atk[0], atk[1], atk[2], atk[3], atk[4]))
    }
    resetPen() {
        $ctx.globalAlpha = 1;
        $ctx.shadowBlur = 0;
        $ctx.shadowOffsetX = 0;
        $ctx.shadowOffsetY = 0;
        $ctx.shadowColor = "black";
    }
    setShadow(color: string) {
        $ctx.shadowBlur = def.shadowBlur;
        $ctx.shadowColor = color;
    }
    drawGrid(gridSize: number = 10) {
        $ctx.strokeStyle = "#444";
        $ctx.lineWidth = 0.5;
        for (let x = 0; x <= def.canvasWidth; x += gridSize) {
            $ctx.beginPath();
            $ctx.moveTo(x, 0);
            $ctx.lineTo(x, def.canvasHeight);
            $ctx.stroke();
        }
        for (let y = 0; y <= def.canvasHeight; y += gridSize) {
            $ctx.beginPath();
            $ctx.moveTo(0, y);
            $ctx.lineTo(def.canvasWidth, y);
            $ctx.stroke();
        }
    }
}

// END POPUP
const $popup = document.querySelector("#popup") as HTMLDivElement;
const $home = document.querySelector("#home") as HTMLButtonElement;
const $restart = document.querySelector("#restart") as HTMLButtonElement;
$restart.addEventListener("click", () => window.location.reload());
$home.addEventListener("click", () => window.location.href = "/");
function displayPopup(msg: string, displayRestart: boolean) {
    $popup.style.display = 'flex';
    $popup.querySelector("#message")!.textContent = msg;
    if (displayRestart) $restart.style.display = 'flex';
    else $restart.style.display = 'none';
}

// MATCHMAKING
const $loadingScreen = document.querySelector("#loading-screen") as HTMLDivElement;
const randomImg = Math.floor(Math.random() * 5);
$loadingScreen.style.backgroundImage = `url(/img/wait/${randomImg}.gif)`;
displayPopup("Chargement en cours...", false);

const stadium: Stadium = localStorage.getItem("stadium") as Stadium;
const $wallpaper = document.querySelector("#wallpaper") as HTMLDivElement;
$wallpaper.style.backgroundImage = `url(/img/back/${stadium})`;
$wallpaper.style.backgroundImage = `url(/img/back/${stadium})`;

let thisPlayerId: PlayerId;
const mode: Mode = localStorage.getItem("mode") as Mode;
const roomId: number = parseInt(localStorage.getItem("roomId") as string)
const _F = new Fight(roomId, mode, "playing");

// @ts-ignore
const socket = io();
if (_F.mode === "dual") socket.emit("askId", _F.roomId);
else if (_F.mode === "solo") soloGameSetup()

function preloadImages(imagePaths: string[], callback: { (): void; (): void; }) {
    let loadedImages = 0;
    const totalImages = imagePaths.length;

    imagePaths.forEach((path) => {
        const img = new Image();
        img.src = path;

        img.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages && callback) callback();
        };

        img.onerror = () => {
            console.warn(`Failed to load image at ${path}`);
            loadedImages++;
            if (loadedImages === totalImages && callback) callback();
        };
    });
}

let isFrozen = false;
function unfreezeThisPlayer() {
    setTimeout(() => isFrozen = false, def.freezeDelay);
}

function soloGameSetup() {
    const thisScore = parseInt(localStorage.getItem("score") as string) as number;
    thisPlayerId = "A";
    const thisCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const thisCharacter: OneCharacterStats = characterStats[thisCharacterId];
    const thisPlayer = new Player("A", thisCharacterId, thisCharacter.name, thisCharacter.color, thisCharacter.img, thisScore, defPos.A.x, defPos.A.y, 2, thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healPow, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPow, thisCharacter.strength, thisCharacter.atkImg, thisCharacter.atkCost, thisCharacter.atkSpeed, []);

    const charactersIdList: CharacterID[] = Object.keys(characterStats).filter((id) => id !== thisCharacterId) as CharacterID[];
    const aiCharacterId: CharacterID = charactersIdList[Math.floor(Math.random() * charactersIdList.length)] as CharacterID;
    const aiCharacter: OneCharacterStats = characterStats[aiCharacterId];
    const aiPlayer = new Player("B", aiCharacterId, aiCharacter.name, aiCharacter.color, aiCharacter.img, 0, defPos.B.x, defPos.B.y, 4, aiCharacter.speed, aiCharacter.hp, aiCharacter.maxHp, aiCharacter.healPow, aiCharacter.mana, aiCharacter.maxMana, aiCharacter.regenPow, aiCharacter.strength, aiCharacter.atkImg, aiCharacter.atkCost, aiCharacter.atkSpeed, []);

    const aiLevel: AiLevel = localStorage.getItem("aiLevel") as AiLevel;
    _F.buildPlayers(thisPlayer, aiPlayer);

    $character1.innerText = thisPlayer.charName;
    $score1.innerText = thisScore.toString();
    $character2.innerText = aiPlayer.charName;
    $score2.innerText = "0";
    const imagePaths = [`/img/back/${stadium}`, thisPlayer.img, thisPlayer.getRageImg(), thisPlayer.atkImg, aiPlayer.img, aiPlayer.getRageImg(), aiPlayer.atkImg];
    preloadImages(imagePaths, () => {
        console.log("All images preloaded, starting the game...")
        showGameScreen()
        soloGameRefresh()
        aiActionInterval(aiLevel)
    });
}
function showGameScreen() {
    $playScreen.style.display = "flex";
    $loadingScreen.style.display = "none";
    $popup.style.display = "none";
}

function soloGameRefresh() {
    setInterval(() => {
        if (_F.state === "over") return
        if (_F.thisPlayer.hp <= 0 || _F.oppPlayer.hp <= 0) {
            _F.state = "over"
            const winnerName = _F.thisPlayer.hp <= 0 ? _F.oppPlayer.charName : _F.thisPlayer.charName
            if (_F.thisPlayer.hp <= 0) displayPopup(`Tu as perdu face à ${winnerName}.`, true);
            else if (_F.oppPlayer.hp <= 0) {
                localStorage.setItem("score", (_F.thisPlayer.score + 1).toString());
                displayPopup(`Tu as gagné avec ${winnerName} !`, true);
            }
        }
        _F.thisPlayer.atks.forEach((atk) => atk.move())
        _F.oppPlayer.atks.forEach((atk) => atk.move())
        _F.drawAll()
    }, def.refreshRate)
}

function aiActionInterval(aiLevel: AiLevel) {
    setInterval(() => {
        if (_F.state === "over") return
        _F.aiAction(), def.aiLvlInterval[aiLevel]
    }, def.aiLvlInterval[aiLevel]);
}


function dualGameRefresh() {
    setInterval(() => {
        if (_F.state === "over") return
        _F.thisPlayer.atks.forEach((atk) => atk.move())
        _F.oppPlayer.atks.forEach((atk) => atk.move())
        _F.drawAll()
    }, def.refreshRate);
}

socket.on("stop", () => {
    displayPopup("Ton adversaire s'est deconnecté.", false);
})

socket.on("busy", () => {
    displayPopup("Cette partie est occupée, choisis un autre ID de jeu.", false);
})

socket.on("getId", (playerId: PlayerId) => {
    if (!thisPlayerId) thisPlayerId = playerId;
    displayPopup("En attente de l'adversaire...", false);
    const thisScore = parseInt(localStorage.getItem("score") as string) as number;
    const thisCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer: Omit<PlayerAttributes, "atks"> = {
        id: playerId, charId: thisCharacterId, charName: thisCharacter.name, color: thisCharacter.color, img: thisCharacter.img, score: thisScore, rage: false, x: defPos[playerId].x, y: defPos[playerId].y, dir: thisPlayerId === "A" ? 2 : 4, speed: thisCharacter.speed, hp: thisCharacter.hp, maxHp: thisCharacter.maxHp, healPow: thisCharacter.healPow, mana: thisCharacter.mana, maxMana: thisCharacter.maxMana, regenPow: thisCharacter.regenPow, strength: thisCharacter.strength, atkImg: thisCharacter.atkImg, atkCost: thisCharacter.atkCost, atkSpeed: thisCharacter.atkSpeed
    }
    const imagePaths = [`/img/back/${stadium}`, thisPlayer.img, thisPlayer.atkImg, thisPlayer.img.replace("char", "rage")];
    preloadImages(imagePaths, () => {
        console.log("All images preloaded, starting the game...")
        socket.emit("postPlayer", { thisPlayer, roomId: _F.roomId, playerId });
    });
})

socket.on("start", (msg: { A: Player, B: Player }) => {
    thisPlayerId === "A" ? _F.buildPlayers(msg.A, msg.B) : _F.buildPlayers(msg.B, msg.A);
    const playerA = _F.thisPlayer.id === "A" ? _F.thisPlayer : _F.oppPlayer;
    const playerB = _F.thisPlayer.id === "B" ? _F.thisPlayer : _F.oppPlayer;
    $character1.innerText = playerA.charName;
    $score1.innerText = playerA.score.toString();
    $character2.innerText = playerB.charName;
    $score2.innerText = playerB.score.toString();
    showGameScreen()
    dualGameRefresh()
});

socket.on("update", (msg: { A: PlayerAttributesDeltasTuple, B: PlayerAttributesDeltasTuple }) => {
    thisPlayerId === "A" ? _F.updatePlayers(msg.A, msg.B) : _F.updatePlayers(msg.B, msg.A);
    _F.drawAll()
});

socket.on("over", (msg: PlayerId) => {
    if (msg === thisPlayerId) localStorage.setItem("score", (_F.thisPlayer.score + 1).toString());
    displayPopup(`Le joueur ${msg === "A" ? "1" : "2"} a gagné!`, false);
});

// KEYBOARD CONTROLS
const pressedKeys = new Set<string>();

document.addEventListener("keydown", (event: KeyboardEvent) => {
    pressedKeys.add(event.key);
    handleActionKeys(event.key);
});

document.addEventListener("keyup", (event: KeyboardEvent) => {
    pressedKeys.delete(event.key);
});

function handleActionKeys(key: string) {
    switch (key) {
        case "z":
            _F.thisPlayer.atk();
            break;
        case "d":
            _F.thisPlayer.heal();
            break;
        case "q":
            _F.thisPlayer.regen();
            break;
        case "s":
            _F.thisPlayer.superAtk();
            break;
        case " ":
            _F.thisPlayer.enrage();
            break;
    }
}

let frameCount = 0;
function updateMovement() {
    if (frameCount % def.move60fpsRAFDivider === 0) {
        const player = _F.thisPlayer;

        const movingUp = pressedKeys.has("ArrowUp");
        const movingRight = pressedKeys.has("ArrowRight");
        const movingDown = pressedKeys.has("ArrowDown");
        const movingLeft = pressedKeys.has("ArrowLeft");

        if (movingUp && movingRight) player.moveUpRight();
        else if (movingUp && movingLeft) player.moveUpLeft();
        else if (movingDown && movingRight) player.moveDownRight();
        else if (movingDown && movingLeft) player.moveDownLeft();
        else if (movingUp) player.moveUp();
        else if (movingRight) player.moveRight();
        else if (movingDown) player.moveDown();
        else if (movingLeft) player.moveLeft();
    }
    frameCount++;
    requestAnimationFrame(updateMovement);
}
updateMovement();