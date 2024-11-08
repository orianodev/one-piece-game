// @ts-ignore
const socket = io();

// DOM
const $canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const $ctx = $canvas.getContext("2d") as CanvasRenderingContext2D;
const $character1 = document.querySelector("#character-1") as HTMLSpanElement;
const $hp1 = document.querySelector("#hp-1") as HTMLSpanElement;
const $mana1 = document.querySelector("#mana-1") as HTMLSpanElement;
const $score1 = document.querySelector("#score-1") as HTMLSpanElement;
const $character2 = document.querySelector("#character-2") as HTMLSpanElement;
const $hp2 = document.querySelector("#hp-2") as HTMLSpanElement;
const $mana2 = document.querySelector("#mana-2") as HTMLSpanElement;
const $score2 = document.querySelector("#score-2") as HTMLSpanElement;

// DEFAULT SETTINGS
const def: SettingsInt = {
    playW: 50,
    playH: 70,
    atkW: 30,
    atkH: 30,
    refreshRate: 50,
    freezeDelay: 150,
    collisionDist: 30,
    superManaMult: 10,
    superDamageMult: 5,
    rageThreshold: 0.2,
    rageSpeedMult: 1.3,
    rageStrengthMult: 1.3,
    rageAtkSpeedMult: 1.3,
    rageRegenFactor: 1.3,
    normalColor: "whitesmoke",
    rageColor: "red",
    cursorSize: 10,
    aiLvlInterval: {
        "easy": 300,
        "medium": 200,
        "hard": 100,
    }
}
const defPos: { A: Position, B: Position } = { A: { x: 0, y: $canvas.height / 2 - def.playH }, B: { x: $canvas.width - def.playW, y: $canvas.height / 2 - def.playH } }

// CHARACTERS
const characterStats: { [key in CharacterID]: OneCharacterStats } = {
    luffy: {
        name: "Monkey D Luffy",
        img: "/img/players/luffy.png",
        color: "red",
        speed: 20,
        hp: 40,
        maxHp: 200,
        healPow: 5,
        mana: 100,
        maxMana: 100,
        regenPow: 10,
        strength: 10,
        atkImg: "/img/atk/punch.png",
        atkCost: 10,
        atkSpeed: 20,
    },
    zoro: {
        name: "Roronoa Zoro",
        img: "/img/players/zoro.png",
        color: "green",
        speed: 13,
        hp: 40,
        maxHp: 190,
        healPow: 4,
        mana: 100,
        maxMana: 100,
        regenPow: 10,
        strength: 9,
        atkImg: "/img/atk/tornado.png",
        atkCost: 10,
        atkSpeed: 25,
    },
    sanji: {
        name: "Vinsmoke Sanji",
        img: "/img/players/sanji.png",
        color: "yellow",
        speed: 15,
        hp: 40,
        maxHp: 170,
        healPow: 3,
        mana: 100,
        maxMana: 100,
        regenPow: 10,
        strength: 10,
        atkImg: "/img/atk/kick.png",
        atkCost: 10,
        atkSpeed: 19,
    },
    ace: {
        name: "Portgas D Ace",
        img: "/img/players/ace.png",
        color: "orange",
        speed: 18,
        hp: 40,
        maxHp: 250,
        healPow: 3,
        mana: 100,
        maxMana: 100,
        regenPow: 10,
        strength: 15,
        atkImg: "/img/atk/flame.png",
        atkCost: 10,
        atkSpeed: 17,
    }
}

// PLAYER
class Player {
    readonly id: PlayerId;
    readonly charId: CharacterID;
    readonly charName: string;
    readonly color: string;
    public img: string;
    readonly score: number;
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
    protected isRage: boolean = false;

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
        newImg.src = this.img;
        $ctx.drawImage(newImg, this.x, this.y, def.playW, def.playH);

        $ctx.globalAlpha = 0.5;
        if (this.dir === "up") $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
        if (this.dir === "down") $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y + def.playH + 5, def.cursorSize, def.cursorSize);
        if (this.dir === "left") $ctx.fillRect(this.x - def.cursorSize - 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
        if (this.dir === "right") $ctx.fillRect(this.x + def.playW + 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
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
        const atk = new Atk(
            this.id,
            "simple",
            this.color,
            this.atkImg,
            this.x + def.playW / 2,
            this.y + def.playH / 2,
            this.dir
        );
        this.atks.push(atk);
        atk.draw();
        _F.updateServer();
    }
    superAtk() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return;
        if (this.mana < this.atkCost * def.superManaMult) return
        this.mana -= this.atkCost * def.superManaMult
        const atk = new Atk(this.id, "super", this.color, this.atkImg, this.x + def.playW / 2, this.y + def.playH / 2, this.dir);
        this.atks.push(atk)
        atk.draw()
        _F.updateServer()
    }
    heal() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return;
        if (this.hp + this.healPow > this.maxHp) return
        this.hp += this.healPow
        _F.updateServer()
    }
    regen() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return;
        if (this.mana + this.regenPow > this.maxMana) return
        this.mana += this.regenPow
        _F.updateServer()
    }
    rage() {
        if ((_F.mode === "dual" || this.id === "A") && !this.freeze()) return console.log("freeze disabled in rage mode");
        if (this.isRage || this.hp > this.maxHp * def.rageThreshold) return console.log("Not enough HP to rage");
        this.isRage = true;
        this.img = this.img.replace("char", "rage")
        this.speed *= def.rageSpeedMult
        this.strength *= def.rageStrengthMult
        this.atkSpeed *= def.rageAtkSpeedMult
        this.regenPow *= def.rageRegenFactor
        if (this.id === "A") $character1.style.color = "red"
        else if (this.id === "B") $character2.style.color = "red"
        setTimeout(() => this.unRage(), 5000)
        _F.updateServer()
    }
    unRage() {
        this.img = characterStats[this.charId].img
        this.speed = characterStats[this.charId].speed
        this.strength = characterStats[this.charId].strength
        this.regenPow = characterStats[this.charId].regenPow
        if (this.id === "A") $character1.style.color = "whitesmoke"
        else if (this.id === "B") $character2.style.color = "whitesmoke"
        _F.updateServer()
    }
    getRage(): boolean {
        return this.isRage
    }
    moveUp() {
        if (this.y < 0) return
        const oppPos: Position = { x: _F.oppPlayer.x, y: _F.oppPlayer.y }
        if (this.y == oppPos!.y + def.playH && this.x + def.playW > oppPos!.x && this.x < oppPos!.x + def.playW) return
        this.dir = "up"
        this.y -= this.speed
        _F.updateServer()
    }
    moveDown() {
        if (this.y > $canvas.height - def.playH) return
        const oppPos: Position = { x: _F.oppPlayer.x, y: _F.oppPlayer.y }
        if (this.y + def.playH == oppPos!.y && this.x + def.playW > oppPos!.x && this.x < oppPos!.x + def.playW) return
        this.dir = "down"
        this.y += this.speed
        _F.updateServer()
    }
    moveLeft() {
        if (this.x < 0) return
        const oppPos: Position = { x: _F.oppPlayer.x, y: _F.oppPlayer.y }
        if (this.y + def.playH > oppPos!.y && this.y < oppPos!.y + def.playH && this.x == oppPos!.x + def.playW) return
        this.dir = "left"
        this.x -= this.speed
        _F.updateServer()
    }
    moveRight() {
        if (this.x > $canvas.width - def.playW) return
        const oppPos: Position = { x: _F.oppPlayer.x, y: _F.oppPlayer.y }
        if (this.y + def.playH > oppPos!.y && this.y < oppPos!.y + def.playH && this.x + def.playW == oppPos!.x) return
        this.dir = "right"
        this.x += this.speed
        _F.updateServer()
    }
}

class Atk {
    readonly owner: PlayerId;
    readonly type: AtkType;
    readonly color: string;
    readonly img: string;
    public x: number;
    public y: number;
    public direction: MoveDirections;

    constructor(owner: PlayerId, type: AtkType, color: string, img: string, x: number, y: number, direction: MoveDirections) {
        this.owner = owner
        this.type = type
        this.color = color
        this.img = img
        this.x = x
        this.y = y
        this.direction = direction
    }
    draw() {
        _F.setShadow(this.color)
        const newImg = new Image(def.playW, def.playH);
        newImg.src = this.img.replace(".png", "-" + this.direction[0] + ".png");
        if (this.type === "simple") $ctx.drawImage(newImg, this.x, this.y, def.atkW, def.atkH);
        if (this.type === "super") $ctx.drawImage(newImg, this.x, this.y, def.playW, def.playH);
        _F.resetPen()
    }
    move() {
        const owner = _F.thisPlayer.id === this.owner ? _F.thisPlayer : _F.oppPlayer
        if (this.direction == "left") this.x -= owner.atkSpeed
        if (this.direction == "right") this.x += owner.atkSpeed
        if (this.direction == "up") this.y -= owner.atkSpeed
        if (this.direction == "down") this.y += owner.atkSpeed
        this.checkCollisionWithBorder(owner)
        this.checkCollisionWithOpp(owner)
    }
    checkCollisionWithBorder(owner: Player) {
        if (this.direction == "left" && this.x <= 0) this.destroy(owner)
        if (this.direction == "right" && this.x >= $canvas.width - def.atkW) this.destroy(owner)
        if (this.direction == "up" && this.y <= 0) this.destroy(owner)
        if (this.direction == "down" && this.y >= $canvas.height - def.atkH) this.destroy(owner)
    }
    checkCollisionWithOpp(owner: Player) {
        const opp = _F.thisPlayer.id === this.owner ? _F.oppPlayer : _F.thisPlayer
        const oppCenter: Position = { x: opp.x + def.playW / 2, y: opp.y + def.playH / 2 }
        const thisAtkCenter: Position = { x: this.x + def.atkW / 2, y: this.y + def.atkH / 2 }
        const distance = Math.sqrt(Math.pow(oppCenter.x - thisAtkCenter.x, 2) + Math.pow(oppCenter.y - thisAtkCenter.y, 2))
        if (distance < def.collisionDist) {
            opp.hp -= this.type === "simple" ? owner.strength : owner.strength * def.superDamageMult
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
    aiAction(): void {
        const aiActions = ["move", "atk", "super", "heal", "regen", "rage"];
        let attempt = 0;
        const maxAttempts = 10;

        while (attempt < maxAttempts) {
            const aiChoice = aiActions[Math.floor(Math.random() * aiActions.length)];

            if (aiChoice === "move") {
                if (this.oppPlayer.x < this.thisPlayer.x - def.playW / 2) {
                    this.oppPlayer.moveRight();
                    this.oppPlayer.moveRight();
                    break;
                } else if (this.oppPlayer.x > this.thisPlayer.x + def.playW / 2) {
                    this.oppPlayer.moveLeft();
                    this.oppPlayer.moveLeft();
                    break;
                } else if (this.oppPlayer.y < this.thisPlayer.y - def.playW / 2) {
                    this.oppPlayer.moveDown();
                    this.oppPlayer.moveDown();
                    break;
                } else if (this.oppPlayer.y > this.thisPlayer.y + def.playH / 2) {
                    this.oppPlayer.moveUp();
                    this.oppPlayer.moveUp();
                    break;
                }
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
            } else if (aiChoice === "rage" && !this.oppPlayer.getRage() && this.oppPlayer.hp <= this.oppPlayer.maxHp * def.rageThreshold) {
                this.oppPlayer.rage();
                break;
            }
            attempt++;
        }
    }
    buildPlayers(thisPlayer: Player, oppPlayer: Player) {
        _F.thisPlayer = new Player(thisPlayer.id, thisPlayer.charId, thisPlayer.charName, thisPlayer.color, thisPlayer.img, thisPlayer.score, thisPlayer.x, thisPlayer.y, thisPlayer.dir, thisPlayer.speed, thisPlayer.hp, thisPlayer.maxHp, thisPlayer.healPow, thisPlayer.mana, thisPlayer.maxMana, thisPlayer.regenPow, thisPlayer.strength, thisPlayer.atkImg, thisPlayer.atkCost, thisPlayer.atkSpeed, []);
        _F.oppPlayer = new Player(oppPlayer.id, oppPlayer.charId, oppPlayer.charName, oppPlayer.color, oppPlayer.img, oppPlayer.score, oppPlayer.x, oppPlayer.y, oppPlayer.dir, oppPlayer.speed, oppPlayer.hp, oppPlayer.maxHp, oppPlayer.healPow, oppPlayer.mana, oppPlayer.maxMana, oppPlayer.regenPow, oppPlayer.strength, oppPlayer.atkImg, oppPlayer.atkCost, oppPlayer.atkSpeed, []);
    }
    updatePlayers(thisPlayer: PlayerAttributesDeltas, oppPlayer: PlayerAttributesDeltas) {
        _F.thisPlayer.img = thisPlayer.img
        _F.thisPlayer.x = thisPlayer.x
        _F.thisPlayer.y = thisPlayer.y
        _F.thisPlayer.dir = thisPlayer.direction
        _F.thisPlayer.speed = thisPlayer.speed
        _F.thisPlayer.hp = thisPlayer.hp
        _F.thisPlayer.healPow = thisPlayer.healPow
        _F.thisPlayer.mana = thisPlayer.mana
        _F.thisPlayer.regenPow = thisPlayer.regenPow
        _F.thisPlayer.strength = thisPlayer.strength
        _F.thisPlayer.atkSpeed = thisPlayer.atkSpeed
        _F.thisPlayer.atks = this.rebuildAtkArray(thisPlayer.atks)

        _F.oppPlayer.img = oppPlayer.img
        _F.oppPlayer.x = oppPlayer.x
        _F.oppPlayer.y = oppPlayer.y
        _F.oppPlayer.dir = oppPlayer.direction
        _F.oppPlayer.speed = oppPlayer.speed
        _F.oppPlayer.hp = oppPlayer.hp
        _F.oppPlayer.healPow = oppPlayer.healPow
        _F.oppPlayer.mana = oppPlayer.mana
        _F.oppPlayer.regenPow = oppPlayer.regenPow
        _F.oppPlayer.strength = oppPlayer.strength
        _F.oppPlayer.atkSpeed = oppPlayer.atkSpeed
        _F.oppPlayer.atks = this.rebuildAtkArray(oppPlayer.atks)
    }
    getDeltaAttributes(player: Player): PlayerAttributesDeltas {
        return {
            img: player.img,
            x: player.x,
            y: player.y,
            direction: player.dir,
            speed: player.speed,
            hp: player.hp,
            healPow: player.healPow,
            mana: player.mana,
            regenPow: player.regenPow,
            strength: player.strength,
            atkSpeed: player.atkSpeed,
            atks: player.atks,
        }
    }
    updateServer() {
        if (_F.mode === "solo") return;
        if (thisPlayerId == "A") socket.emit("update", { roomId: _F.roomId, A: this.getDeltaAttributes(_F.thisPlayer), B: this.getDeltaAttributes(_F.oppPlayer) });
        else if (thisPlayerId == "B") socket.emit("update", { roomId: _F.roomId, A: this.getDeltaAttributes(_F.oppPlayer), B: this.getDeltaAttributes(_F.thisPlayer) });
    };
    reDrawAll() {
        $ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        this.drawGrid()
        this.thisPlayer.draw();
        this.oppPlayer.draw();

        this.thisPlayer.atks.forEach((atk) => atk.draw())
        this.oppPlayer.atks.forEach((atk) => atk.draw())
        const playerA = this.thisPlayer.id === "A" ? this.thisPlayer : this.oppPlayer;
        const playerB = this.thisPlayer.id === "B" ? this.thisPlayer : this.oppPlayer;

        $hp1.innerText = playerA.hp.toString();
        $hp1.style.color = playerA.hp <= playerA.maxHp * def.rageThreshold ? def.rageColor : def.normalColor;
        $mana1.innerText = playerA.mana.toString();
        $hp2.innerText = playerB.hp.toString();
        $hp2.style.color = playerB.hp <= playerB.maxHp * def.rageThreshold ? def.rageColor : def.normalColor;
        $mana2.innerText = playerB.mana.toString();
    }
    rebuildAtkArray(flattedAtkArray: Atk[]): Atk[] {
        return flattedAtkArray.map((atk) => new Atk(atk.owner, atk.type, atk.color, atk.img, atk.x, atk.y, atk.direction))
    }
    resetPen() {
        $ctx.globalAlpha = 1;
        $ctx.shadowBlur = 0;
        $ctx.shadowOffsetX = 0;
        $ctx.shadowOffsetY = 0;
        $ctx.shadowColor = "black";
    }
    setShadow(color: string) {
        $ctx.shadowBlur = 10;
        $ctx.shadowOffsetX = 1;
        $ctx.shadowOffsetY = 1;
        $ctx.shadowColor = color;
    }
    drawGrid(gridSize: number = 10) {
        $ctx.strokeStyle = "#444";
        $ctx.lineWidth = 0.5;
        for (let x = 0; x <= $canvas.width; x += gridSize) {
            $ctx.beginPath();
            $ctx.moveTo(x, 0);
            $ctx.lineTo(x, $canvas.height);
            $ctx.stroke();
        }
        for (let y = 0; y <= $canvas.height; y += gridSize) {
            $ctx.beginPath();
            $ctx.moveTo(0, y);
            $ctx.lineTo($canvas.width, y);
            $ctx.stroke();
        }
    }
}

// MATCHMAKING
const stadium: StadiumChoice = localStorage.getItem("stadiumChoice") as StadiumChoice;
const $wallpaper = document.querySelector("#wallpaper") as HTMLDivElement;
$wallpaper.style.backgroundImage = `url(/img/wallpaper/${stadium}.webp)`;

let thisPlayerId: PlayerId;
const mode: Mode = localStorage.getItem("mode") as Mode;
const roomId: number = parseInt(localStorage.getItem("roomId") as string)
const _F = new Fight(roomId, mode, "playing");

if (_F.mode === "dual") socket.emit("askId", _F.roomId);
else if (_F.mode === "solo") soloGameSetup()

let isFrozen = false;
function unfreezeThisPlayer() {
    setTimeout(() => isFrozen = false, def.freezeDelay);
}

function soloGameSetup() {
    const thisScore = parseInt(localStorage.getItem("score") as string) as number;
    thisPlayerId = "A";
    const thisCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const thisCharacter: OneCharacterStats = characterStats[thisCharacterId];
    const thisPlayer = new Player("A", thisCharacterId, thisCharacter.name, thisCharacter.color, thisCharacter.img, thisScore, defPos.A.x, defPos.A.y, "right", thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healPow, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPow, thisCharacter.strength, thisCharacter.atkImg, thisCharacter.atkCost, thisCharacter.atkSpeed, []);

    const charactersIdList: CharacterID[] = Object.keys(characterStats).filter((id) => id !== thisCharacterId) as CharacterID[];
    const aiCharacterId: CharacterID = charactersIdList[Math.floor(Math.random() * charactersIdList.length)] as CharacterID;
    const aiCharacter: OneCharacterStats = characterStats[aiCharacterId];
    const aiPlayer = new Player("B", aiCharacterId, aiCharacter.name, aiCharacter.color, aiCharacter.img, 0, defPos.B.x, defPos.B.y, "left", aiCharacter.speed, aiCharacter.hp, aiCharacter.maxHp, aiCharacter.healPow, aiCharacter.mana, aiCharacter.maxMana, aiCharacter.regenPow, aiCharacter.strength, aiCharacter.atkImg, aiCharacter.atkCost, aiCharacter.atkSpeed, []);

    const aiLevel: AiLevel = localStorage.getItem("aiLevel") as AiLevel;
    _F.buildPlayers(thisPlayer, aiPlayer);

    $character1.innerText = thisPlayer.charName;
    $score1.innerText = thisScore.toString();
    $character2.innerText = aiPlayer.charName;
    $score2.innerText = "0";
    soloGameRefresh()
    aiActionInterval(aiLevel)
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
        _F.reDrawAll()
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
        _F.reDrawAll()
    }, def.refreshRate);
}

socket.on("getId", (playerId: PlayerId) => {
    if (!thisPlayerId) thisPlayerId = playerId;
    const thisScore = parseInt(localStorage.getItem("score") as string) as number;
    const thisCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer: Omit<PlayerAttributes, "atks"> = {
        id: playerId, charId: thisCharacterId, charName: thisCharacter.name, color: thisCharacter.color, img: thisCharacter.img, score: thisScore, x: defPos[playerId].x, y: defPos[playerId].y, direction: thisPlayerId === "A" ? "right" : "left", speed: thisCharacter.speed, hp: thisCharacter.hp, maxHp: thisCharacter.maxHp, healPow: thisCharacter.healPow, mana: thisCharacter.mana, maxMana: thisCharacter.maxMana, regenPow: thisCharacter.regenPow, strength: thisCharacter.strength, atkImg: thisCharacter.atkImg, atkCost: thisCharacter.atkCost, atkSpeed: thisCharacter.atkSpeed
    }
    socket.emit("postPlayer", { thisPlayer, roomId: _F.roomId, playerId });
})

socket.on("start", (msg: { A: Player, B: Player }) => {
    thisPlayerId === "A" ? _F.buildPlayers(msg.A, msg.B) : _F.buildPlayers(msg.B, msg.A);
    const playerA = _F.thisPlayer.id === "A" ? _F.thisPlayer : _F.oppPlayer;
    const playerB = _F.thisPlayer.id === "B" ? _F.thisPlayer : _F.oppPlayer;
    $character1.innerText = playerA.charName;
    $score1.innerText = playerA.score.toString();
    $character2.innerText = playerB.charName;
    $score2.innerText = playerB.score.toString();
    dualGameRefresh()
});

socket.on("update", (msg: { A: PlayerAttributesDeltas, B: PlayerAttributesDeltas }) => {
    thisPlayerId === "A" ? _F.updatePlayers(msg.A, msg.B) : _F.updatePlayers(msg.B, msg.A);
    _F.reDrawAll()
});

socket.on("stop", () => displayPopup("Ton adversaire s'est deconnecté.", false));

socket.on("over", (msg: PlayerId) => {
    if (msg === thisPlayerId) localStorage.setItem("score", (_F.thisPlayer.score + 1).toString());
    displayPopup(`Le joueur ${msg === "A" ? "1" : "2"} a gagné!`, false);
});

// KEYBOARD CONTROLS
document.addEventListener("keydown", (event: KeyboardEvent) => {
    switch (event.key) {
        case "ArrowUp":
            _F.thisPlayer.moveUp();
            break;
        case "ArrowDown":
            _F.thisPlayer.moveDown();
            break;
        case "ArrowRight":
            _F.thisPlayer.moveRight();
            break;
        case "ArrowLeft":
            _F.thisPlayer.moveLeft();
            break;
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
            _F.thisPlayer.rage();
            break;
    }
});

// MOBILE CONTROLS
if (localStorage.getItem("hideMobileControls") !== "true" && (window.innerWidth <= 768 || 'ontouchstart' in window || /Mobi|Android/i.test(navigator.userAgent))) {
    const mobileControlsLeft = document.querySelector('#mobile-controls-left') as HTMLDivElement;
    const mobileControlsRight = document.querySelector('#mobile-controls-right') as HTMLDivElement;
    mobileControlsLeft.style.display = 'block';
    mobileControlsRight.style.display = 'block';

    const $up = document.querySelector("#up") as HTMLButtonElement;
    const $down = document.querySelector("#down") as HTMLButtonElement;
    const $right = document.querySelector("#right") as HTMLButtonElement;
    const $left = document.querySelector("#left") as HTMLButtonElement;
    const $atk = document.querySelector("#atk") as HTMLButtonElement;
    const $heal = document.querySelector("#heal") as HTMLButtonElement;
    const $regen = document.querySelector("#regen") as HTMLButtonElement;
    const $super = document.querySelector("#super") as HTMLButtonElement;

    $up.addEventListener("click", () => _F.thisPlayer.moveUp());
    $down.addEventListener("click", () => _F.thisPlayer.moveDown());
    $right.addEventListener("click", () => _F.thisPlayer.moveRight());
    $left.addEventListener("click", () => _F.thisPlayer.moveLeft());
    $atk.addEventListener("click", () => _F.thisPlayer.atk());
    $heal.addEventListener("click", () => _F.thisPlayer.heal());
    $regen.addEventListener("click", () => _F.thisPlayer.regen());
    $super.addEventListener("click", () => _F.thisPlayer.superAtk());
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