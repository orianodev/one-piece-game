// @ts-ignore
const socket = io();

// DOM
const $canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const $ctx = $canvas.getContext("2d") as CanvasRenderingContext2D;
const $joinBtn = document.querySelector("#join") as HTMLButtonElement;
const $pickA = document.querySelector("#pickA") as HTMLButtonElement;
const $pickB = document.querySelector("#pickB") as HTMLButtonElement;
const $showPlayer = document.querySelector("#showPlayer") as HTMLSpanElement;
const $aX = document.querySelector("#aX") as HTMLSpanElement;
const $aY = document.querySelector("#aY") as HTMLSpanElement;
const $bX = document.querySelector("#bX") as HTMLSpanElement;
const $bY = document.querySelector("#bY") as HTMLSpanElement;

type MoveDirections = "up" | "right" | "down" | "left";
type Position = { x: number; y: number };
type PlayerId = "A" | "B"
interface SettingsInt {
    playH: number; // Player Height (default: 50)
    playW: number; // Player Width (default: 50)
    projH: number; // Projectile Height (default: 10)
    projW: number; // Projectile Width (default: 10)
}

const settings: SettingsInt = {
    playH: 50,
    playW: 50,
    projH: 10,
    projW: 10,
}
const defaultPosition: { A: Position, B: Position } = { A: { x: 0, y: $canvas.height / 2 - settings.playH }, B: { x: $canvas.width - settings.playW, y: $canvas.height / 2 - settings.playH } }

// PLAYER
class Player {
    public id: PlayerId;
    public hp: number;
    public x: number;
    public y: number;
    public direction: MoveDirections;
    public speed: number;
    public attackSpeed: number;
    public score: number;
    public spriteUrl: string;
    public thrownProjectiles: Projectile[];
    public opponentPosition: Position;

    constructor(id: PlayerId, hp: number, x: number, y: number, direction: MoveDirections, speed: number, attackSpeed: number, score: number, spriteUrl: string, thrownProjectile: Projectile[] | [], opponentPosition: Position) {
        this.id = id
        this.hp = hp
        this.x = x
        this.y = y
        this.direction = direction
        this.speed = speed
        this.attackSpeed = attackSpeed
        this.score = score
        this.spriteUrl = spriteUrl
        this.thrownProjectiles = thrownProjectile
        this.opponentPosition = opponentPosition
    }
    draw() {
        const newSprite = new Image(settings.playW, settings.playH);
        newSprite.src = this.spriteUrl;
        $ctx.drawImage(newSprite, this.x, this.y, settings.playW, settings.playH);
    }
    throwProjectile() {
        const projectile = new Projectile(this.id, this.x + settings.playW / 2, this.y + settings.playH / 2, this.direction, "images/fireball.png");
        this.thrownProjectiles.push(projectile)
        projectile.draw()
        this.updateServer()
    }
    moveUp() {
        if (this.y < 0) return
        if (this.y == this.opponentPosition!.y + settings.playH && this.x + settings.playW > this.opponentPosition!.x && this.x < this.opponentPosition!.x + settings.playW) return
        this.direction = "up"
        this.y -= this.speed
        this.updateServer()
    }
    moveDown() {
        if (this.y > $canvas.height - 50) return
        if (this.y + settings.playH == this.opponentPosition!.y && this.x + settings.playW > this.opponentPosition!.x && this.x < this.opponentPosition!.x + settings.playW) return
        this.direction = "down"
        this.y += this.speed
        this.updateServer()
    }
    moveLeft() {
        if (this.x < 0) return
        if (this.y + settings.playH > this.opponentPosition!.y && this.y < this.opponentPosition!.y + settings.playH && this.x == this.opponentPosition!.x + settings.playW) return
        this.direction = "left"
        this.x -= this.speed
        this.updateServer()
    }
    moveRight() {
        if (this.x > $canvas.width - 50) return
        if (this.y + settings.playH > this.opponentPosition!.y && this.y < this.opponentPosition!.y + settings.playH && this.x + settings.playW == this.opponentPosition!.x) return
        this.direction = "right"
        this.x += this.speed
        this.updateServer()
    }
    updateServer() {
        if (this.id == "A") socket.emit("update", { A: _F.thisPlayer, B: _F.opponentPlayer });
        else if (this.id == "B") socket.emit("update", { A: _F.opponentPlayer, B: _F.thisPlayer });
    };
}

class Projectile {
    public throwerId: PlayerId;
    public x: number;
    public y: number;
    public direction: MoveDirections;
    public spriteUrl: string;

    constructor(thrower: PlayerId, x: number, y: number, direction: MoveDirections, spriteUrl: string) {
        this.throwerId = thrower
        this.x = x
        this.y = y
        this.direction = direction
        this.spriteUrl = spriteUrl
    }
    draw() {
        const newSprite = new Image();
        newSprite.src = this.spriteUrl;
        $ctx.drawImage(newSprite, this.x, this.y, settings.projW, settings.projH);
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
        if (this.direction == "right" && this.x >= $canvas.width - settings.projW) this.destroy(thrower)
        if (this.direction == "up" && this.y <= 0) this.destroy(thrower)
        if (this.direction == "down" && this.y >= $canvas.height - settings.projH) this.destroy(thrower)
    }
    checkCollisionWithOppenent(thrower: Player) {
        const opponent = _F.thisPlayer.id === this.throwerId ? _F.opponentPlayer : _F.thisPlayer
        const opponentCenter: Position = { x: opponent.x + settings.playW / 2, y: opponent.y + settings.playH / 2 }
        const thisProjectileCenter: Position = { x: this.x + settings.projW / 2, y: this.y + settings.projH / 2 }
        const distance = Math.sqrt(Math.pow(opponentCenter.x - thisProjectileCenter.x, 2) + Math.pow(opponentCenter.y - thisProjectileCenter.y, 2))
        console.log("Dist. between proj. and opp. :", distance);
        if (distance < 30) {
            opponent.hp -= 10
            thrower.score++
            this.destroy(thrower)
        }
    }
    destroy(thrower: Player) {
        thrower.thrownProjectiles.splice(thrower.thrownProjectiles.indexOf(this), 1)
        _F.thisPlayer.updateServer()
    }
}

class Fight {
    public thisPlayer: Player | null;
    public opponentPlayer: Player | null;
    constructor(thisPlayer: Player | null, opponentPlayer: Player | null) {
        this.thisPlayer = thisPlayer
        this.opponentPlayer = opponentPlayer
    }

    reDrawAll() {
        $ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        this.drawGrid()
        this.thisPlayer.draw();
        this.opponentPlayer.draw();
        this.thisPlayer.thrownProjectiles.forEach((projectile) => projectile.draw())
        this.opponentPlayer.thrownProjectiles.forEach((projectile) => projectile.draw())
    }
    rebuildProjectileArray(flattedProjectileArray: Projectile[]): Projectile[] {
        return flattedProjectileArray.map((projectile) => new Projectile(projectile.throwerId, projectile.x, projectile.y, projectile.direction, projectile.spriteUrl))
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

const _F = new Fight();

$pickA.addEventListener("click", (e) => {
    _F.thisPlayer = new Player("A", 100, defaultPosition.A.x, defaultPosition.A.y, "right", 10, 10, 0, "images/luffy.png", [], defaultPosition.B);
    _F.opponentPlayer = new Player("B", 100, defaultPosition.B.x, defaultPosition.B.y, "left", 10, 10, 0, "images/zoro.png", [], defaultPosition.A)
    $showPlayer.innerText = _F.thisPlayer.id;
});
$pickB.addEventListener("click", (e) => {
    _F.thisPlayer = new Player("B", 100, defaultPosition.B.x, defaultPosition.B.y, "left", 10, 10, 0, "images/zoro.png", [], defaultPosition.A)
    _F.opponentPlayer = new Player("A", 100, defaultPosition.A.x, defaultPosition.A.y, "right", 10, 10, 0, "images/luffy.png", [], defaultPosition.B);
    $showPlayer.innerText = _F.thisPlayer.id;
});


$joinBtn.addEventListener("click", (e) => {
    socket.emit("joinRoom", "room1");
});

socket.on("move", () => {
    console.log("Received move instruction.");
    _F.thisPlayer.thrownProjectiles.forEach((projectile) => projectile.move())
    _F.opponentPlayer.thrownProjectiles.forEach((projectile) => projectile.move())
    _F.reDrawAll()
})

// window.URL.parse(this.location.href).searchParams.get("room-id")


socket.on("update", (msg: { A: Player, B: Player }) => {
    if (_F.thisPlayer.id == "A") {
        _F.thisPlayer = new Player("A", msg.A.hp, msg.A.x, msg.A.y, msg.A.direction, msg.A.speed, msg.A.attackSpeed, msg.A.score, msg.A.spriteUrl, _F.rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
        _F.opponentPlayer = new Player("B", msg.B.hp, msg.B.x, msg.B.y, msg.B.direction, msg.B.speed, msg.B.attackSpeed, msg.B.score, msg.B.spriteUrl, _F.rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
    } else if (_F.thisPlayer.id = "B") {
        _F.thisPlayer = new Player("B", msg.B.hp, msg.B.x, msg.B.y, msg.B.direction, msg.B.speed, msg.B.attackSpeed, msg.B.score, msg.B.spriteUrl, _F.rebuildProjectileArray(msg.B.thrownProjectiles), { x: msg.A.x, y: msg.A.y });
        _F.opponentPlayer = new Player("A", msg.A.hp, msg.A.x, msg.A.y, msg.A.direction, msg.A.speed, msg.A.attackSpeed, msg.A.score, msg.A.spriteUrl, _F.rebuildProjectileArray(msg.A.thrownProjectiles), { x: msg.B.x, y: msg.B.y });
    }
    $aX.innerText = _F.thisPlayer.id === "A" ? _F.thisPlayer.x.toString() : _F.opponentPlayer.x.toString();
    $aY.innerText = _F.thisPlayer.id === "A" ? _F.thisPlayer.y.toString() : _F.opponentPlayer.y.toString();
    $bX.innerText = _F.thisPlayer.id === "B" ? _F.thisPlayer.x.toString() : _F.opponentPlayer.x.toString();
    $bY.innerText = _F.thisPlayer.id === "B" ? _F.thisPlayer.y.toString() : _F.opponentPlayer.y.toString();
    _F.reDrawAll()
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
        case " ":
            _F.thisPlayer.throwProjectile();
            break;
    }
});