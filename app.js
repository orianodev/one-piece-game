"use strict";
// document.body.style.display = "none";
// Canvas API
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.shadowBlur = 30;
ctx.shadowOffsetX = 3;
ctx.shadowOffsetY = 3;
// Control game
const start = document.querySelector("#start");
const restart = document.querySelector("#restart");
const winner = document.querySelector("#winner");
// Images
const acePng = document.querySelector("#acePng");
const aceGif = document.querySelector("#aceGif");
const luffyPng = document.querySelector("#luffyPng");
const luffyGif = document.querySelector("#luffyGif");
const fireballPng = document.querySelector("#fireballPng");
const punchPng = document.querySelector("#punchPng");
// Sounds
const fireballMp3 = document.querySelector("#fireballMp3");
const swooshMp3 = document.querySelector("#swooshMp3");
const aceMp3 = document.querySelector("#aceMp3");
const luffyMp3 = document.querySelector("#luffyMp3");
const yeahMp3 = document.querySelector("#yeahMp3");
const gearSecondMp3 = document.querySelector("#gearSecondMp3");
const overtakenMp3 = document.querySelector("#overtakenMp3");
fireballMp3.volume = 0.4;
swooshMp3.volume = 0.4;
aceMp3.volume = 0.9;
luffyMp3.volume = 0.9;
yeahMp3.volume = 0.5;
gearSecondMp3.volume = 0.8;
overtakenMp3.volume = 0.3;
// Display infos
const p1_name = document.querySelector("#p1_name");
const p1_hp = document.querySelector("#p1_hp");
const p1_hp_display = document.querySelector("#p1_hp_display");
const p1_mana = document.querySelector("#p1_mana");
const p1_mana_display = document.querySelector("#p1_mana_display");
console.log(p1_mana_display.innerHTML);
const p1_score = document.querySelector("#p1_score");
const p2_name = document.querySelector("#p2_name");
const p2_hp = document.querySelector("#p2_hp");
const p2_hp_display = document.querySelector("#p2_hp_display");
const p2_mana = document.querySelector("#p2_mana");
const p2_mana_display = document.querySelector("#p2_mana_display");
const p2_score = document.querySelector("#p2_score");
const basicSettings = {
    playerHeight: 180,
    playerWidth: 90,
    collisionMargin: 15,
    playerStep: 25,
    playerSizeVariation: 20,
    attackSpriteHeight: 40,
    attackSpriteWidth: 40,
    maxHp: 200,
    healingSizeTime: 50,
    simpleAttackDelay: 200,
    specialAttackDelay: 1000,
    specialAttackAudioDelay: 2000,
    player1DefaultPosition: { x: 0, y: 0 },
    player2DefaultPosition: { x: canvas.width - 100, y: 0 },
    refreshRate: 1000 / 100,
};
class Player {
    constructor(x, y, name, spriteImage, shadowColor, hp, mana, healingAbility, attackStrength, attackSpeed, attackSound, attackSprite, specialAttackStrength, specialAttackSpeed, specialAttackSound, specialAttackSprite, enemy) {
        this.x = x;
        this.y = y;
        this.width = basicSettings.playerWidth;
        this.height = basicSettings.playerHeight;
        this.name = name;
        this.currentSprite = spriteImage;
        this.spriteImage = spriteImage;
        this.shadowColor = shadowColor;
        this.hp = hp;
        this.mana = mana;
        this.healingAbility = healingAbility;
        this.attackStrength = attackStrength;
        this.attackSpeed = attackSpeed;
        this.attackSound = attackSound;
        this.attackSprite = attackSprite;
        this.specialAttackStrength = specialAttackStrength;
        this.specialAttackSpeed = specialAttackSpeed;
        this.specialAttackSound = specialAttackSound;
        this.specialAttackSprite = specialAttackSprite;
        this.enemy = enemy;
        this.attacks = [];
        this.isUsingAttack = false;
        this.isUsingSpecialAttack = false;
        this.score = 0;
    }
    drawPlayer() {
        ctx.shadowColor = this.shadowColor;
        ctx.drawImage(this.currentSprite, this.x, this.y, this.width, this.height);
    }
    moveUp() {
        if (this.y > 0) {
            this.y -= basicSettings.playerStep;
        }
    }
    moveDown() {
        if (this.y < canvas.height - basicSettings.playerHeight) {
            this.y += basicSettings.playerStep;
        }
    }
    simpleAttack() {
        if (!this.isUsingSpecialAttack && !this.isUsingAttack) {
            this.isUsingAttack = true;
            this.attackSound.currentTime = 0; // Rewind sound to the beginning
            this.attackSound.play();
            this.attacks.push(new Attack(this, "simple", basicSettings.attackSpriteWidth, basicSettings.attackSpriteHeight, this.attackSprite));
            this.height += basicSettings.playerSizeVariation;
            setTimeout(() => {
                this.isUsingAttack = false;
                this.height -= basicSettings.playerSizeVariation;
            }, basicSettings.simpleAttackDelay);
        }
    }
    specialAttack() {
        if (!this.isUsingSpecialAttack && !this.isUsingAttack && this.mana > 99) {
            this.specialAttackSound.currentTime = 0; // Rewind sound to the beginning
            this.specialAttackSound.play();
            this.isUsingSpecialAttack = true;
            setTimeout(() => {
                this.attacks.push(new Attack(this, "special", basicSettings.attackSpriteWidth * 2, basicSettings.attackSpriteHeight * 2, this.attackSprite));
                this.currentSprite = this.specialAttackSprite;
                this.mana = 0;
                this.height += basicSettings.playerSizeVariation * 2;
                this.width += basicSettings.playerSizeVariation * 4;
                if (this === fight.player2)
                    this.x -= basicSettings.playerSizeVariation * 4;
                setTimeout(() => {
                    this.currentSprite = this.spriteImage;
                    this.height -= basicSettings.playerSizeVariation * 2;
                    this.width -= basicSettings.playerSizeVariation * 4;
                    if (this === fight.player2)
                        this.x += basicSettings.playerSizeVariation * 4;
                    this.isUsingSpecialAttack = false;
                }, basicSettings.specialAttackDelay);
            }, basicSettings.specialAttackAudioDelay);
        }
    }
    reloadMana() {
        if (this.mana < 100 && !this.isUsingSpecialAttack) {
            this.mana += 0.1;
        }
    }
    heal() {
        if (this.hp < basicSettings.maxHp) {
            this.hp += Math.random() * this.healingAbility;
            this.height -= basicSettings.playerSizeVariation;
            setTimeout(() => {
                this.height += basicSettings.playerSizeVariation;
            }, basicSettings.healingSizeTime);
        }
    }
    win() {
        fight.isPlaying = false;
        yeahMp3.currentTime = 0; // Rewind sound to the beginning
        yeahMp3.play();
        this.score++;
        winner.style.display = "block";
        winner.innerText = `Le vainqueur est ${this.name} !`;
        restart.style.display = "block";
    }
}
class Attack {
    constructor(owner, type, width, height, sprite) {
        this.owner = owner;
        this.type = type;
        this.width = width;
        this.height = height;
        this.x =
            this.owner === fight.player1
                ? this.owner.x + this.owner.width
                : this.owner.x - this.width;
        this.y = this.owner.y + this.owner.height / 2 - this.height / 2;
        this.strength =
            this.type === "simple"
                ? this.owner.attackStrength
                : this.owner.specialAttackStrength;
        this.speed =
            this.type === "simple"
                ? this.owner.attackSpeed
                : this.owner.specialAttackSpeed;
        this.sprite = sprite;
    }
    moveTowardEnemy() {
        // Calculate the right direction on the X axis
        const direction = this.owner === fight.player1 ? this.speed : -this.speed;
        this.x += direction;
    }
    inflictDamage() {
        // Reduce HP of the other Player
        if (this.owner.enemy != null) {
            this.owner.enemy.hp -=
                this.strength + (Math.random() * this.strength) / 10;
        }
    }
    removeAttack() {
        // Delete the attack from the Player attack list
        this.owner.attacks.splice(this.owner.attacks.indexOf(this), 1);
    }
    detectCollision() {
        // Removes enemy's HP if attack matches the XY enemy's position
        const detectionMargin = basicSettings.collisionMargin;
        console.log(this.x);
        if (this.owner === fight.player1) {
            if (this.x >= fight.player2.x - this.width + detectionMargin &&
                this.y > fight.player2.y - this.height + detectionMargin &&
                this.y < fight.player2.y + fight.player2.height - detectionMargin) {
                this.inflictDamage();
                this.removeAttack();
            }
            else if (this.x > canvas.width - basicSettings.attackSpriteWidth / 2) {
                this.removeAttack();
            }
        }
        else {
            if (this.x <= fight.player1.x + this.width + detectionMargin &&
                this.y > fight.player1.y - this.height + detectionMargin &&
                this.y < fight.player1.y + fight.player1.height - detectionMargin) {
                this.inflictDamage();
                this.removeAttack();
            }
            else if (this.x < 0 - basicSettings.attackSpriteWidth / 2) {
                this.removeAttack();
            }
        }
    }
    drawAttackSprite() {
        // Update X axis, check for collision and display the attack sprite
        this.moveTowardEnemy();
        this.detectCollision();
        ctx.shadowColor = this.owner.shadowColor;
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}
class Game {
    constructor() {
        this.player1 = null;
        this.player2 = null;
        this.isPlaying = false;
    }
    defaultDisplay() {
        // Display the default
        p1_name.innerText = this.player1.name;
        this.player1.drawPlayer();
        p2_name.innerText = this.player2.name;
        this.player2.drawPlayer();
    }
    displayPlayer1() {
        this.player1.reloadMana();
        this.player1.drawPlayer();
        p1_hp.innerText = `HP : ${Math.round(this.player1.hp)}`;
        p1_hp_display.innerText = "❤".repeat(Math.round(this.player1.hp / 40) + 1);
        p1_mana.innerText = `Mana : ${Math.round(this.player1.mana)}`;
        p1_mana_display.innerText = "⚡".repeat(Math.round(this.player1.mana / 25));
        p1_score.innerText = `Score : ${this.player1.score}`;
        this.player1.attacks.forEach((attack) => {
            attack.drawAttackSprite();
        });
    }
    displayPlayer2() {
        this.player2.reloadMana();
        this.player2.drawPlayer();
        // p2_position.innerText = `Axe : ${this.player2.x}x ${this.player2.y}y`;
        p2_hp.innerText = `HP : ${Math.round(this.player2.hp)}`;
        p2_hp_display.innerText = "❤".repeat(Math.round(this.player2.hp / 40) + 1);
        p2_mana.innerText = `Mana : ${Math.round(this.player2.mana)}`;
        p2_mana_display.innerText = "⚡".repeat(Math.round(this.player1.mana / 25));
        p2_score.innerText = `Score : ${this.player2.score}`;
        this.player2.attacks.forEach((attack) => {
            attack.drawAttackSprite();
        });
    }
    setEnemies() {
        this.player1.enemy = this.player2;
        this.player2.enemy = this.player1;
    }
    runGame() {
        if (!this.isPlaying)
            return;
        this.defaultDisplay();
        document.addEventListener("keydown", (event) => {
            this.checkKeyPress(event);
        });
        const refresh = setInterval(() => {
            if (this.player1.hp < 1) {
                clearInterval(refresh);
                this.player2.win();
            }
            if (this.player2.hp < 1) {
                clearInterval(refresh);
                this.player1.win();
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.displayPlayer1();
            this.displayPlayer2();
        }, basicSettings.refreshRate);
    }
    checkKeyPress(event) {
        // Keywboard controls
        switch (event.key) {
            case "z":
                this.player1.moveUp();
                break;
            case "s":
                this.player1.moveDown();
                break;
            case "q":
                this.player1.heal();
                break;
            case "d":
                this.player1.simpleAttack();
                break;
            case "e":
                this.player1.specialAttack();
                break;
            case "ArrowUp":
                this.player2.moveUp();
                break;
            case "ArrowDown":
                this.player2.moveDown();
                break;
            case "ArrowRight":
                this.player2.heal();
                break;
            case "ArrowLeft":
                this.player2.simpleAttack();
                break;
            case "PageUp":
                this.player2.specialAttack();
                break;
        }
    }
    resetGame() {
        this.player1.x = 0;
        this.player1.y = 0;
        this.player1.attacks = [];
        this.player1.hp = 150;
        this.player1.mana = 100;
        this.player2.x = canvas.width - basicSettings.playerWidth;
        this.player2.y = 0;
        this.player2.attacks = [];
        this.player2.hp = 150;
        this.player2.mana = 100;
    }
}
const fight = new Game();
start.onclick = () => {
    fight.isPlaying = true;
    gearSecondMp3.currentTime = 0; // Rewind sound to the beginning
    gearSecondMp3.play();
    overtakenMp3.currentTime = 0; // Rewind sound to the beginning
    overtakenMp3.play();
    start.style.display = "none";
    fight.player1 = new Player(basicSettings.player1DefaultPosition.x, basicSettings.player1DefaultPosition.y, "Portgas D. Ace", acePng, "orange", 160, 100, 1.5, 15, 2, fireballMp3, fireballPng, 60, 5, aceMp3, aceGif, null);
    fight.player2 = new Player(basicSettings.player2DefaultPosition.x, basicSettings.player2DefaultPosition.y, "Monkey D. Luffy", luffyPng, "red", 160, 100, 1.5, 10, 3, swooshMp3, punchPng, 40, 10, luffyMp3, luffyGif, null);
    fight.setEnemies();
    fight.defaultDisplay();
    fight.runGame();
    restart.onclick = () => {
        fight.isPlaying = true;
        gearSecondMp3.currentTime = 0; // Rewind sound to the beginning
        gearSecondMp3.play();
        overtakenMp3.currentTime = 0; // Rewind sound to the beginning
        overtakenMp3.play();
        winner.style.display = "none";
        restart.style.display = "none";
        fight.resetGame();
        fight.defaultDisplay();
        fight.runGame();
    };
};
