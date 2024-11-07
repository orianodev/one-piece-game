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

type MoveDirections = "up" | "right" | "down" | "left";
type Position = { x: number; y: number };
type PlayerId = "A" | "B"
type AttackType = "simple" | "special"
type AiLevel = "easy" | "medium" | "hard";
type StadiumChoice = "eni" | "imp" | "log" | "mar" | "sab" | "thr";

interface SettingsInt {
    playH: number; // Player Height (default: 50)
    playW: number; // Player Width (default: 50)
    projH: number; // Projectile Height (default: 10)
    projW: number; // Projectile Width (default: 10)
    freezeDelay: number; // Delay before player can attack/heal/regen again (default: 150)
    collisionDistance: number; // Distance for collision detection (default: 20)
    specialManaMultiplier: number; // Multiplier for Special Attack (default: 10)
    specialDamageMultiplier: number; // Multiplier for Special Attack (default: 4)
    cursorSize: number; // Cursor Size (default: 10)
}
interface CharacterStats {
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

const setting: SettingsInt = {
    playH: 80,
    playW: 80,
    projH: 30,
    projW: 30,
    freezeDelay: 150,
    collisionDistance: 30,
    specialManaMultiplier: 10,
    specialDamageMultiplier: 4,
    cursorSize: 10,
}
const defaultPosition: { A: Position, B: Position } = { A: { x: 0, y: $canvas.height / 2 - setting.playH }, B: { x: $canvas.width - setting.playW, y: $canvas.height / 2 - setting.playH } }

const characterStats: { luffy: CharacterStats, zoro: CharacterStats, sanji: CharacterStats, ace: CharacterStats } = {
    luffy: {
        name: "Monkey D Luffy",
        sprite: "/images/players/luffy.png",
        color: "red",
        speed: 20,
        hp: 200,
        maxHp: 200,
        healingPower: 5,
        mana: 100,
        maxMana: 100,
        regenPower: 10,
        attackSprite: "/images/attacks/punch.png",
        attackCost: 10,
        attackSpeed: 20,
        attackStrength: 10,
    },
    zoro: {
        name: "Roronoa Zoro",
        sprite: "/images/players/zoro.png",
        color: "green",
        speed: 13,
        hp: 180,
        maxHp: 190,
        healingPower: 4,
        mana: 100,
        maxMana: 100,
        regenPower: 10,
        attackSprite: "/images/attacks/tornado.png",
        attackCost: 10,
        attackSpeed: 25,
        attackStrength: 9,
    },
    sanji: {
        name: "Vinsmoke Sanji",
        sprite: "/images/players/sanji.png",
        color: "yellow",
        speed: 15,
        hp: 170,
        maxHp: 170,
        healingPower: 3,
        mana: 100,
        maxMana: 100,
        regenPower: 10,
        attackSprite: "/images/attacks/kick.png",
        attackCost: 10,
        attackSpeed: 19,
        attackStrength: 10,
    },
    ace: {
        name: "Portgas D Ace",
        sprite: "/images/players/ace.png",
        color: "orange",
        speed: 18,
        hp: 200,
        maxHp: 250,
        healingPower: 3,
        mana: 100,
        maxMana: 100,
        regenPower: 10,
        attackSprite: "/images/attacks/flame.png",
        attackCost: 10,
        attackSpeed: 17,
        attackStrength: 15,
    }
}

// PLAYER
class Player {
    public id: PlayerId;
    public characterId: string;
    public characterName: string;
    public color: string;
    public sprite: string;
    public score: number;
    public x: number;
    public y: number;
    public direction: MoveDirections;
    public speed: number;
    public hp: number;
    public maxHp: number;
    public healingPower: number;
    public mana: number;
    public maxMana: number;
    public regenPower: number;
    public attackSprite: string;
    public attackCost: number;
    public attackSpeed: number;
    public attackStrength: number;
    public thrownProjectiles: Projectile[];
    public opponentPosition: Position;

    constructor(id: PlayerId, characterId: string, characterName: string, color: string, sprite: string, score: number, x: number, y: number, direction: MoveDirections, speed: number, hp: number, maxHp: number, healingPower: number, mana: number, maxMana: number, regenPower: number, attackSprite: string, attackCost: number, attackSpeed: number, attackStrength: number, thrownProjectile: Projectile[] | [], opponentPosition: Position) {
        this.id = id
        this.characterId = characterId
        this.characterName = characterName
        this.color = color
        this.sprite = sprite
        this.score = score
        this.x = x
        this.y = y
        this.direction = direction
        this.speed = speed
        this.hp = hp
        this.maxHp = maxHp
        this.healingPower = healingPower
        this.mana = mana
        this.maxMana = maxMana
        this.regenPower = regenPower
        this.attackSprite = attackSprite
        this.attackCost = attackCost
        this.attackSpeed = attackSpeed
        this.attackStrength = attackStrength
        this.thrownProjectiles = thrownProjectile
        this.opponentPosition = opponentPosition
    }
    draw() {
        $ctx.globalAlpha = 1;
        _F.setShadow(this.color)
        const newSprite = new Image(setting.playW, setting.playH);
        newSprite.src = this.sprite;
        $ctx.drawImage(newSprite, this.x, this.y, setting.playW, setting.playH);

        $ctx.globalAlpha = 0.5;
        if (this.direction === "up") $ctx.fillRect(this.x + (setting.playW / 2 - 5), this.y - setting.cursorSize - 5, setting.cursorSize, setting.cursorSize);
        if (this.direction === "down") $ctx.fillRect(this.x + (setting.playW / 2 - 5), this.y + setting.playH + 5, setting.cursorSize, setting.cursorSize);
        if (this.direction === "left") $ctx.fillRect(this.x - setting.cursorSize - 5, this.y + setting.playH / 2 - 5, setting.cursorSize, setting.cursorSize);
        if (this.direction === "right") $ctx.fillRect(this.x + setting.playW + 5, this.y + setting.playH / 2 - 5, setting.cursorSize, setting.cursorSize);
        _F.resetPen()
    }
    attack() {
        if (isFrozen) return;
        if (this.mana < this.attackCost) return;
        isFrozen = true;
        this.mana -= this.attackCost;
        const projectile = new Projectile(
            this.id,
            "simple",
            this.color,
            this.attackSprite,
            this.x + setting.playW / 2,
            this.y + setting.playH / 2,
            this.direction
        );
        this.thrownProjectiles.push(projectile);
        projectile.draw();
        this.updateServer();
        unfreezeThisPlayer();
    }
    specialAttack() {
        if (isFrozen) return;
        if (this.mana < this.attackCost * setting.specialManaMultiplier) return
        isFrozen = true;
        this.mana -= this.attackCost * setting.specialManaMultiplier
        const projectile = new Projectile(this.id, "special", this.color, this.attackSprite, this.x + setting.playW / 2, this.y + setting.playH / 2, this.direction);
        this.thrownProjectiles.push(projectile)
        projectile.draw()
        this.updateServer()
        unfreezeThisPlayer();
    }
    heal() {
        if (isFrozen) return;
        if (this.hp + this.healingPower > this.maxHp) return
        isFrozen = true;
        this.hp += this.healingPower
        this.updateServer()
        unfreezeThisPlayer();
    }
    regen() {
        if (isFrozen) return;
        if (this.mana + this.regenPower > this.maxMana) return
        isFrozen = true;
        this.mana += this.regenPower
        this.updateServer()
        unfreezeThisPlayer();
    }
    moveUp() {
        if (this.y < 0) return
        if (this.y == this.opponentPosition!.y + setting.playH && this.x + setting.playW > this.opponentPosition!.x && this.x < this.opponentPosition!.x + setting.playW) return
        this.direction = "up"
        this.y -= this.speed
        this.updateServer()
    }
    moveDown() {
        if (this.y > $canvas.height - setting.playH) return
        if (this.y + setting.playH == this.opponentPosition!.y && this.x + setting.playW > this.opponentPosition!.x && this.x < this.opponentPosition!.x + setting.playW) return
        this.direction = "down"
        this.y += this.speed
        this.updateServer()
    }
    moveLeft() {
        if (this.x < 0) return
        if (this.y + setting.playH > this.opponentPosition!.y && this.y < this.opponentPosition!.y + setting.playH && this.x == this.opponentPosition!.x + setting.playW) return
        this.direction = "left"
        this.x -= this.speed
        this.updateServer()
    }
    moveRight() {
        if (this.x > $canvas.width - setting.playW) return
        if (this.y + setting.playH > this.opponentPosition!.y && this.y < this.opponentPosition!.y + setting.playH && this.x + setting.playW == this.opponentPosition!.x) return
        this.direction = "right"
        this.x += this.speed
        this.updateServer()
    }
    updateServer() {
        if (this.id == "A") socket.emit("update", { roomId: _F.roomId, A: _F.thisPlayer, B: _F.opponentPlayer });
        else if (this.id == "B") socket.emit("update", { roomId: _F.roomId, A: _F.opponentPlayer, B: _F.thisPlayer });
    };
}

class Projectile {
    public throwerId: PlayerId;
    public type: AttackType;
    public color: string;
    public sprite: string;
    public x: number;
    public y: number;
    public direction: MoveDirections;

    constructor(thrower: PlayerId, type: AttackType, color: string, sprite: string, x: number, y: number, direction: MoveDirections) {
        this.throwerId = thrower
        this.type = type
        this.color = color
        this.sprite = sprite
        this.x = x
        this.y = y
        this.direction = direction
    }
    draw() {
        _F.setShadow(this.color)
        const newSprite = new Image(setting.playW, setting.playH);
        const spriteImg = this.sprite.replace(".png", "-" + this.direction[0] + ".png");
        newSprite.src = spriteImg
        if (this.type === "simple") $ctx.drawImage(newSprite, this.x, this.y, setting.projW, setting.projH);
        if (this.type === "special") $ctx.drawImage(newSprite, this.x, this.y, setting.playW, setting.playH);
        _F.resetPen()
    }
    move() {
        const thrower = _F.thisPlayer.id === this.throwerId ? _F.thisPlayer : _F.opponentPlayer
        if (this.direction == "left") this.x -= thrower.attackSpeed
        if (this.direction == "right") this.x += thrower.attackSpeed
        if (this.direction == "up") this.y -= thrower.attackSpeed
        if (this.direction == "down") this.y += thrower.attackSpeed
        this.checkCollisionWithBorder(thrower)
        this.checkCollisionWithOppenent(thrower)
    }
    checkCollisionWithBorder(thrower: Player) {
        if (this.direction == "left" && this.x <= 0) this.destroy(thrower)
        if (this.direction == "right" && this.x >= $canvas.width - setting.projW) this.destroy(thrower)
        if (this.direction == "up" && this.y <= 0) this.destroy(thrower)
        if (this.direction == "down" && this.y >= $canvas.height - setting.projH) this.destroy(thrower)
    }
    checkCollisionWithOppenent(thrower: Player) {
        const opponent = _F.thisPlayer.id === this.throwerId ? _F.opponentPlayer : _F.thisPlayer
        const opponentCenter: Position = { x: opponent.x + setting.playW / 2, y: opponent.y + setting.playH / 2 }
        const thisProjectileCenter: Position = { x: this.x + setting.projW / 2, y: this.y + setting.projH / 2 }
        const distance = Math.sqrt(Math.pow(opponentCenter.x - thisProjectileCenter.x, 2) + Math.pow(opponentCenter.y - thisProjectileCenter.y, 2))
        if (distance < setting.collisionDistance) {
            opponent.hp -= this.type === "simple" ? thrower.attackStrength : thrower.attackStrength * setting.specialDamageMultiplier
            this.destroy(thrower)
        }
    }
    destroy(thrower: Player) {
        thrower.thrownProjectiles.splice(thrower.thrownProjectiles.indexOf(this), 1)
        _F.thisPlayer.updateServer()
    }
}

class Fight {
    public thisPlayer: Player = new Player("A", "default", "name", "black", "images/players/luffy.png", 0, defaultPosition.A.x, defaultPosition.A.y, "right", 10, 100, 100, 10, 100, 100, 10, "", 10, 10, 10, [], defaultPosition.B);
    public opponentPlayer: Player = new Player("B", "default", "name", "black", "images/players/zoro.png", 0, defaultPosition.B.x, defaultPosition.B.y, "right", 10, 100, 100, 10, 100, 100, 10, "", 10, 10, 10, [], defaultPosition.A);
    public roomId: number;
    constructor(roomId: number) {
        this.roomId = roomId
    }
    rebuildPlayers(msg: { A: Player, B: Player }) {
        if (myPlayerId === "A") {
            _F.thisPlayer = new Player("A", msg.A.characterId, msg.A.characterName, msg.A.color, msg.A.sprite, msg.A.score, msg.A.x, msg.A.y, msg.A.direction, msg.A.speed, msg.A.hp, msg.A.maxHp, msg.A.healingPower, msg.A.mana, msg.A.maxMana, msg.A.regenPower, msg.A.attackSprite, msg.A.attackCost, msg.A.attackSpeed, msg.A.attackStrength, _F.rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
            _F.opponentPlayer = new Player("B", msg.B.characterId, msg.B.characterName, msg.B.color, msg.B.sprite, msg.B.score, msg.B.x, msg.B.y, msg.B.direction, msg.B.speed, msg.B.hp, msg.A.maxHp, msg.B.healingPower, msg.B.mana, msg.B.maxMana, msg.B.regenPower, msg.B.attackSprite, msg.B.attackCost, msg.B.attackSpeed, msg.B.attackStrength, _F.rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
        } else if (myPlayerId === "B") {
            _F.thisPlayer = new Player("B", msg.B.characterId, msg.B.characterName, msg.B.color, msg.B.sprite, msg.B.score, msg.B.x, msg.B.y, msg.B.direction, msg.B.speed, msg.B.hp, msg.A.maxHp, msg.B.healingPower, msg.B.mana, msg.B.maxMana, msg.B.regenPower, msg.B.attackSprite, msg.B.attackCost, msg.B.attackSpeed, msg.B.attackStrength, _F.rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
            _F.opponentPlayer = new Player("A", msg.A.characterId, msg.A.characterName, msg.A.color, msg.A.sprite, msg.A.score, msg.A.x, msg.A.y, msg.A.direction, msg.A.speed, msg.A.hp, msg.A.maxHp, msg.A.healingPower, msg.A.mana, msg.A.maxMana, msg.A.regenPower, msg.A.attackSprite, msg.A.attackCost, msg.A.attackSpeed, msg.A.attackStrength, _F.rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
        }
    }
    reDrawAll() {
        $ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        this.drawGrid()
        this.thisPlayer.draw();
        this.opponentPlayer.draw();
        this.thisPlayer.thrownProjectiles.forEach((projectile) => projectile.draw())
        this.opponentPlayer.thrownProjectiles.forEach((projectile) => projectile.draw())
        const playerA = this.thisPlayer.id === "A" ? this.thisPlayer : this.opponentPlayer;
        const playerB = this.thisPlayer.id === "B" ? this.thisPlayer : this.opponentPlayer;

        $hp1.innerText = playerA.hp.toString();
        $mana1.innerText = playerA.mana.toString();
        $hp2.innerText = playerB.hp.toString();
        $mana2.innerText = playerB.mana.toString();
    }
    rebuildProjectileArray(flattedProjectileArray: Projectile[]): Projectile[] {
        return flattedProjectileArray.map((projectile) => new Projectile(projectile.throwerId, projectile.type, projectile.color, projectile.sprite, projectile.x, projectile.y, projectile.direction))
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

const _F = new Fight(parseInt(localStorage.getItem("roomId") as string));
let myPlayerId: PlayerId;

const stadium: StadiumChoice = localStorage.getItem("stadiumChoice") as StadiumChoice;
const $wallpaper = document.querySelector("#wallpaper") as HTMLDivElement;
$wallpaper.style.backgroundImage = `url(/images/wallpapers/${stadium}.webp)`;

let isFrozen = false;
function unfreezeThisPlayer() {
    setTimeout(() => isFrozen = false, setting.freezeDelay);
}

socket.emit("whereIsMyPlayerId", { roomId: _F.roomId });

socket.on("whereIsMyPlayerId", (playerId: PlayerId) => {
    if (!myPlayerId) myPlayerId = playerId;
    const myScore = parseInt(localStorage.getItem("score") as string) as number;
    const myCharacterId = localStorage.getItem("characterId") as string;
    let pickedCharacter: CharacterStats;
    switch (myCharacterId) {
        case "luffy":
            pickedCharacter = characterStats.luffy;
            break;
        case "zoro":
            pickedCharacter = characterStats.zoro;
            break;
        case "sanji":
            pickedCharacter = characterStats.sanji;
            break;
        case "ace":
            pickedCharacter = characterStats.ace;
            break;
        default:
            pickedCharacter = characterStats.luffy;
            break;
    }
    const myPlayer = new Player(playerId, myCharacterId, pickedCharacter.name, pickedCharacter.color, pickedCharacter.sprite, myScore, defaultPosition[playerId].x, defaultPosition[playerId].y, myPlayerId === "A" ? "right" : "left", pickedCharacter.speed, pickedCharacter.hp, pickedCharacter.maxHp, pickedCharacter.healingPower, pickedCharacter.mana, pickedCharacter.maxMana, pickedCharacter.regenPower, pickedCharacter.attackSprite, pickedCharacter.attackCost, pickedCharacter.attackSpeed, pickedCharacter.attackStrength, [], defaultPosition[playerId === "A" ? "B" : "A"]);
    socket.emit("myPlayerStats", { myPlayer, roomId: _F.roomId, playerId });
})

socket.on("start", (msg: { A: Player, B: Player }) => {
    _F.rebuildPlayers(msg);
    const playerA = _F.thisPlayer.id === "A" ? _F.thisPlayer : _F.opponentPlayer;
    const playerB = _F.thisPlayer.id === "B" ? _F.thisPlayer : _F.opponentPlayer;
    $character1.innerText = playerA.characterName;
    $score1.innerText = playerA.score.toString();
    $character2.innerText = playerB.characterName;
    $score2.innerText = playerB.score.toString();
});

socket.on("move", () => {
    _F.thisPlayer.thrownProjectiles.forEach((projectile) => projectile.move())
    _F.opponentPlayer.thrownProjectiles.forEach((projectile) => projectile.move())
    _F.reDrawAll()
});

socket.on("update", (msg: { A: Player, B: Player }) => {
    _F.rebuildPlayers(msg);
    _F.reDrawAll()
});

socket.on("stop", () => {
    alert("A user disconnected. You will be redirected to the selection page.");
    window.location.href = "/";
});

socket.on("gameOver", (msg: { id: PlayerId, name: string }) => {
    if (msg.id === myPlayerId) localStorage.setItem("score", (_F.thisPlayer.score + 1).toString());
    alert(`Player ${msg.id === "A" ? "1" : "2"} has won with ${msg.name}! You will be redirected to the selection page.`);
    window.location.href = "/";
});


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
            _F.thisPlayer.attack();
            break;
        case "d":
            _F.thisPlayer.heal();
            break;
        case "q":
            _F.thisPlayer.regen();
            break;
        case "s":
            _F.thisPlayer.specialAttack();
            break;
    }
});