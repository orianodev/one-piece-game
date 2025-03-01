import { characterStats } from "./charactersStats.js";
import { def, defPos } from "./defaultSettings.js";

const $dom = {
    1: {
        character: document.querySelector("#character-1") as HTMLSpanElement,
        hpBar: document.querySelector("#hp-bar-1") as HTMLDivElement,
        hp: document.querySelector("#hp-1") as HTMLSpanElement,
        manaBar: document.querySelector("#mana-bar-1") as HTMLDivElement,
        mana: document.querySelector("#mana-1") as HTMLSpanElement,
        score: document.querySelector("#score-1") as HTMLSpanElement,
    },
    2: {
        character: document.querySelector("#character-2") as HTMLSpanElement,
        hpBar: document.querySelector("#hp-bar-2") as HTMLDivElement,
        hp: document.querySelector("#hp-2") as HTMLSpanElement,
        manaBar: document.querySelector("#mana-bar-2") as HTMLDivElement,
        mana: document.querySelector("#mana-2") as HTMLSpanElement,
        score: document.querySelector("#score-2") as HTMLSpanElement,
    }
}

// PLAYER
class Player {
    readonly id: PlayerId;
    readonly charId: CharacterID;
    readonly charName: string;
    readonly color: string;
    readonly img: string;
    public sprite: HTMLImageElement = new Image(def.playW, def.playH);
    public atkSprite: HTMLImageElement = new Image(def.atkW, def.atkH);
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
        // Draw sprite
        $ctx.globalAlpha = 1;
        _F.setShadow(this.color)
        $ctx.drawImage(this.sprite, this.x, this.y, def.playW, def.playH);
        // Draw cursor
        $ctx.globalAlpha = 0.5;
        switch (this.dir) {
            case 1: // Up
                $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
            case 2: // Up-Right
                $ctx.fillRect(this.x + def.playW + 5, this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
            case 3: // Right
                $ctx.fillRect(this.x + def.playW + 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
                break;
            case 4: // Down-Right
                $ctx.fillRect(this.x + def.playW + 5, this.y + def.playH + 5, def.cursorSize, def.cursorSize);
                break;
            case 5: // Down
                $ctx.fillRect(this.x + (def.playW / 2 - 5), this.y + def.playH + 5, def.cursorSize, def.cursorSize);
                break;
            case 6: // Down-Left
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y + def.playH + 5, def.cursorSize, def.cursorSize);
                break;
            case 7: // Left
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y + def.playH / 2 - 5, def.cursorSize, def.cursorSize);
                break;
            case 8: // Up-Left
                $ctx.fillRect(this.x - def.cursorSize - 5, this.y - def.cursorSize - 5, def.cursorSize, def.cursorSize);
                break;
        }
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
        this.sprite.src = this.getRageImg();
        if (this.id === "A") $dom[1].character.style.color = def.rageTextColor
        else if (this.id === "B") $dom[2].character.style.color = def.rageTextColor
        setTimeout(() => this.unRage(this.img), def.rageDuration)
        _F.updateServer()
    }
    unRage(defaultSpriteSrc: string) {
        this.sprite.src = defaultSpriteSrc;
        this.speed = characterStats[this.charId].speed
        this.strength = characterStats[this.charId].strength
        this.regenPow = characterStats[this.charId].regenPow
        this.healPow = characterStats[this.charId].healPow
        if (this.id === "A") $dom[1].character.style.color = def.normalTextColor
        else if (this.id === "B") $dom[2].character.style.color = def.normalTextColor
        this.rage = false;
        _F.updateServer()
    }
    getRageImg() {
        return this.sprite.src.replace("char", "rage")
    }
    move(direction: MoveDirections) {
        switch (direction) {
            case 1: // Up
                if (this.y < 0) return;
                this.y -= this.speed;
                break;
            case 2: // Up-Right
                if (this.y < 0 || this.x > def.canvasWidth - def.playW) return;
                this.x += this.speed / Math.SQRT2;
                this.y -= this.speed / Math.SQRT2;
                break;
            case 3: // Right
                if (this.x > def.canvasWidth - def.playW) return;
                this.x += this.speed;
                break;
            case 4: // Down-Right
                if (this.y > def.canvasHeight - def.playH || this.x > def.canvasWidth - def.playW) return;
                this.x += this.speed / Math.SQRT2;
                this.y += this.speed / Math.SQRT2;
                break;
            case 5: // Down
                if (this.y > def.canvasHeight - def.playH) return;
                this.y += this.speed;
                break;
            case 6: // Down-Left
                if (this.y > def.canvasHeight - def.playH || this.x < 0) return;
                this.x -= this.speed / Math.SQRT2;
                this.y += this.speed / Math.SQRT2;
                break;
            case 7: // Left
                if (this.x < 0) return;
                this.x -= this.speed;
                break;
            case 8: // Up-Left
                if (this.y < 0 || this.x < 0) return;
                this.x -= this.speed / Math.SQRT2;
                this.y -= this.speed / Math.SQRT2;
                break;
        }
        this.dir = direction;
        _F.drawAll();
        _F.updateServer();
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
        const owner = _F.getPlayer(this.id)
        _F.setShadow(owner.color)
        if (this.type === "sim") $ctx.drawImage(owner.atkSprite, this.x, this.y, def.atkW, def.atkH);
        if (this.type === "sup") $ctx.drawImage(owner.atkSprite, this.x, this.y, def.atkW * def.superSizeMult, def.atkH * def.superSizeMult);
        _F.resetPen()
    }
    move() {
        const owner = _F.thisPlayer.id === this.id ? _F.thisPlayer : _F.oppPlayer;
        switch (this.dir) {
            case 1: // Up
                this.y -= owner.atkSpeed;
                break;
            case 2: // Up-Right
                this.x += owner.atkSpeed / Math.SQRT2;
                this.y -= owner.atkSpeed / Math.SQRT2;
                break;
            case 3: // Right
                this.x += owner.atkSpeed;
                break;
            case 4: // Down-Right
                this.x += owner.atkSpeed / Math.SQRT2;
                this.y += owner.atkSpeed / Math.SQRT2;
                break;
            case 5: // Down
                this.y += owner.atkSpeed;
                break;
            case 6: // Down-Left
                this.x -= owner.atkSpeed / Math.SQRT2;
                this.y += owner.atkSpeed / Math.SQRT2;
                break;
            case 7: // Left
                this.x -= owner.atkSpeed;
                break;
            case 8: // Up-Left
                this.x -= owner.atkSpeed / Math.SQRT2;
                this.y -= owner.atkSpeed / Math.SQRT2;
                break;
        }
        this.checkCollisionWithBorder(owner);
        this.checkCollisionWithOpp(owner);
    }
    checkCollisionWithBorder(owner: Player) {
        if (this.x <= 0 || this.x >= def.canvasWidth - def.atkW || this.y <= 0 || this.y >= def.canvasHeight - def.atkH) this.destroy(owner)
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
    // @ts-expect-error
    public thisPlayer: Player;
    // @ts-expect-error
    public oppPlayer: Player;
    readonly roomId: number;
    readonly mode: Mode;
    public state: "playing" | "over";
    public pressedKeys: Set<string> = new Set<string>();
    private frameCount: number = 0;
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
                if (horizontalDirection === 2 && verticalDirection === 1) this.oppPlayer.move(2);
                else if (horizontalDirection === 2 && verticalDirection === 3) this.oppPlayer.move(4);
                else if (horizontalDirection === 4 && verticalDirection === 1) this.oppPlayer.move(8);
                else if (horizontalDirection === 4 && verticalDirection === 3) this.oppPlayer.move(6);
                else if (horizontalDirection === 2) this.oppPlayer.move(3);
                else if (horizontalDirection === 4) this.oppPlayer.move(7);
                else if (verticalDirection === 1) this.oppPlayer.move(1);
                else if (verticalDirection === 3) this.oppPlayer.move(5);

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
        _F.oppPlayer.sprite.src = _F.oppPlayer.img
        _F.oppPlayer.atkSprite.src = _F.oppPlayer.atkImg
        _F.thisPlayer.sprite.src = _F.thisPlayer.img
        _F.thisPlayer.atkSprite.src = _F.thisPlayer.atkImg
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
        return [player.rage, Math.round(player.x), Math.round(player.y), player.dir, Math.round(player.hp), Math.round(player.mana), this.getAtkDeltaAttributes(player.atks)]
    }
    getAtkDeltaAttributes(atks: Atk[]): AtkAttributesTuple[] {
        return atks.map((atk) => [atk.id, atk.type, atk.x, atk.y, atk.dir]);
    }
    updateServer() {
        if (_F.mode === "solo") return;
        if (thisPlayerId == "A") socket.emit("update", { roomId: _F.roomId, A: this.getPlayerDeltaAttributes(_F.thisPlayer), B: this.getPlayerDeltaAttributes(_F.oppPlayer) });
        else if (thisPlayerId == "B") socket.emit("update", { roomId: _F.roomId, A: this.getPlayerDeltaAttributes(_F.oppPlayer), B: this.getPlayerDeltaAttributes(_F.thisPlayer) });
    };
    drawAll() {
        $ctx.clearRect(0, 0, def.canvasWidth, def.canvasHeight);
        this.thisPlayer.draw();
        this.oppPlayer.draw();

        this.thisPlayer.atks.forEach((atk) => atk.draw());
        this.oppPlayer.atks.forEach((atk) => atk.draw());

        const playerA = this.thisPlayer.id === "A" ? this.thisPlayer : this.oppPlayer;
        const playerB = this.thisPlayer.id === "B" ? this.thisPlayer : this.oppPlayer;
        this.updateLateralColumns(playerA);
        this.updateLateralColumns(playerB);
    }
    updateLateralColumns(player: Player) {
        const playerDom = player.id === "A" ? $dom[1] : $dom[2];
        console.log(playerDom.character.style.color, player.rage, def.rageTextColor, def.normalTextColor);

        playerDom.character.style.color = player.rage ? def.rageTextColor : def.normalTextColor;
        const hpPercent = (player.hp / player.maxHp) * 100;
        const manaPercent = (player.mana / player.maxMana) * 100;
        playerDom.hpBar.style.width = `${hpPercent}%`;
        playerDom.hpBar.style.backgroundColor = player.hp <= player.maxHp * def.rageThreshold ? def.rageTextColor : def.normalHpColor;
        playerDom.hp.innerText = player.hp.toFixed(0);
        playerDom.manaBar.style.width = `${manaPercent}%`;
        playerDom.mana.innerText = player.mana.toFixed(0);
    }
    rebuildAtkArray(flattedAtkArray: AtkAttributesTuple[]): Atk[] {
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
    attachKeyboardEvent() {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            _F.pressedKeys.add(event.key);
            _F.handleActionKeys(event.key);
        });

        document.addEventListener("keyup", (event: KeyboardEvent) => {
            _F.pressedKeys.delete(event.key);
        });
    }
    handleActionKeys(key: string) {
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
    updateMovement() {
        if (this.frameCount % def.move60fpsRAFDivider === 0) {
            const player = _F.thisPlayer;

            const movingUp = this.pressedKeys.has("ArrowUp");
            const movingRight = this.pressedKeys.has("ArrowRight");
            const movingDown = this.pressedKeys.has("ArrowDown");
            const movingLeft = this.pressedKeys.has("ArrowLeft");

            if (movingUp && movingRight) player.move(2);
            else if (movingUp && movingLeft) player.move(8);
            else if (movingDown && movingRight) player.move(4);
            else if (movingDown && movingLeft) player.move(6);
            else if (movingUp) player.move(1);
            else if (movingRight) player.move(3);
            else if (movingDown) player.move(5);
            else if (movingLeft) player.move(7);
        }
        this.frameCount++;
        requestAnimationFrame(this.updateMovement.bind(this));
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

// function preloadImages(imagePaths: string[], callback: { (): void; (): void; }) {
//     let loadedImages = 0;
//     const totalImages = imagePaths.length;

//     imagePaths.forEach((path) => {
//         const img = new Image();
//         img.src = path;

//         img.onload = () => {
//             loadedImages++;
//             if (loadedImages === totalImages && callback) callback();
//         };

//         img.onerror = () => {
//             console.warn(`Failed to load image at ${path}`);
//             loadedImages++;
//             if (loadedImages === totalImages && callback) callback();
//         };
//     });
// }

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

    $dom[1].character.innerText = thisPlayer.charName;
    $dom[1].score.innerText = thisScore.toString();
    $dom[2].character.innerText = aiPlayer.charName;
    $dom[2].score.innerText = "0";
    // const imagePaths = [`/img/back/${stadium}`, thisPlayer.img, thisPlayer.getRageImg(), thisPlayer.atkImg, aiPlayer.img, aiPlayer.getRageImg(), aiPlayer.atkImg];
    // preloadImages(imagePaths, () => {
    // console.log("All images preloaded, starting the game...")
    showGameScreen()
    soloGameRefresh()
    aiActionInterval(aiLevel)
    // });

    _F.attachKeyboardEvent();
    _F.updateMovement();
}
let $ctx: CanvasRenderingContext2D;
function showGameScreen() {
    const $canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    $canvas.width = def.canvasWidth * def.canvasScaleMult;
    $canvas.height = def.canvasHeight * def.canvasScaleMult;
    $canvas.style.width = `${def.canvasWidth}px`;
    $canvas.style.height = `${def.canvasHeight}px`;
    $ctx = $canvas.getContext("2d") as CanvasRenderingContext2D;
    $ctx.scale(def.canvasScaleMult, def.canvasScaleMult);

    const $playScreen = document.querySelector("#play") as HTMLDivElement;
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

// WEBSOCKET
// @ts-expect-error
const socket = io();
if (_F.mode === "dual") socket.emit("askId", _F.roomId);
else if (_F.mode === "solo") soloGameSetup()

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
    // const imagePaths = [`/img/back/${stadium}`, thisPlayer.img, thisPlayer.atkImg, thisPlayer.img.replace("char", "rage")];
    // preloadImages(imagePaths, () => {
    //     console.log("All images preloaded, starting the game...")
    socket.emit("postPlayer", { thisPlayer, roomId: _F.roomId, playerId });
    // });
})

socket.on("start", (msg: { A: Player, B: Player }) => {
    thisPlayerId === "A" ? _F.buildPlayers(msg.A, msg.B) : _F.buildPlayers(msg.B, msg.A);
    const playerA = _F.thisPlayer.id === "A" ? _F.thisPlayer : _F.oppPlayer;
    const playerB = _F.thisPlayer.id === "B" ? _F.thisPlayer : _F.oppPlayer;
    $dom[1].score.innerText = playerA.charName;
    $dom[1].score.innerText = playerA.score.toString();
    $dom[2].score.innerText = playerB.charName;
    $dom[2].score.innerText = playerB.score.toString();

    _F.attachKeyboardEvent();
    _F.updateMovement();
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