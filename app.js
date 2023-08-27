"use strict";
// Canvas API
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
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
// Display infos
const p1_name = document.querySelector("#p1_name");
// const p1_position = document.querySelector("#p1_position") as HTMLSpanElement;
const p1_hp = document.querySelector("#p1_hp");
const p1_mana = document.querySelector("#p1_mana");
const p1_score = document.querySelector("#p1_score");
const p2_name = document.querySelector("#p2_name");
// const p2_position = document.querySelector("#p2_position") as HTMLSpanElement;
const p2_hp = document.querySelector("#p2_hp");
const p2_mana = document.querySelector("#p2_mana");
const p2_score = document.querySelector("#p2_score");
const basicSettings = {
    playerHeight: 100,
    playerWidth: 50,
    collisionMargin: 10,
    playerStep: 20,
    playerSizeVariation: 10,
    attackSpriteHeight: 30,
    attackSpriteWidth: 30,
    player1DefaultPosition: { x: 0, y: 0 },
    player2DefaultPosition: { x: 450, y: 0 },
};
class Player {
    constructor(x, y, name, spriteImage, hp, mana, healingAbility, attackStrength, attackSpeed, attackSound, attackImage, specialAttackSound, specialAttackSprite, enemy) {
        this.x = x;
        this.y = y;
        this.width = basicSettings.playerWidth;
        this.height = basicSettings.playerHeight;
        this.name = name;
        this.currentSprite = spriteImage;
        this.spriteImage = spriteImage;
        this.hp = hp;
        this.mana = mana;
        this.healingAbility = healingAbility;
        this.attackStrength = attackStrength;
        this.attackSpeed = attackSpeed;
        this.attackSound = attackSound;
        this.attackImage = attackImage;
        this.specialAttackSound = specialAttackSound;
        this.specialAttackSprite = specialAttackSprite;
        this.enemy = enemy;
        this.attacks = [];
        this.isUsingSpecialAttack = false;
        this.score = 0;
    }
    drawPlayer() {
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
        if (!this.isUsingSpecialAttack) {
            this.attackSound.currentTime = 0; // Rewind the sound to the beginning
            this.attackSound.play();
            this.attacks.push(new Attack(this, "simple", basicSettings.attackSpriteWidth, basicSettings.attackSpriteHeight, this.attackImage));
            this.height += basicSettings.playerSizeVariation;
            setTimeout(() => {
                this.height -= basicSettings.playerSizeVariation;
            }, 100);
        }
    }
    specialAttack() {
        if (!this.isUsingSpecialAttack) {
            this.specialAttackSound.currentTime = 0; // Rewind the sound to the beginning
            this.specialAttackSound.play();
            this.attacks.push(new Attack(this, "special", basicSettings.attackSpriteWidth * 2, basicSettings.attackSpriteHeight * 2, this.attackImage));
            this.currentSprite = this.specialAttackSprite;
            this.isUsingSpecialAttack = !this.isUsingSpecialAttack;
            this.mana = 0;
            this.height += basicSettings.playerSizeVariation * 2;
            setTimeout(() => {
                this.currentSprite = this.spriteImage;
                this.height -= basicSettings.playerSizeVariation * 2;
                this.isUsingSpecialAttack = !this.isUsingSpecialAttack;
            }, 1000);
        }
    }
    reloadMana() {
        if (this.mana < 100) {
            this.mana += 10;
        }
    }
    heal() {
        if (this.hp < 200) {
            this.hp += Math.floor(Math.random() * this.healingAbility);
            this.height -= basicSettings.playerSizeVariation;
            setTimeout(() => {
                this.height += basicSettings.playerSizeVariation;
            }, 100);
        }
    }
}
class Attack {
    constructor(owner, type, width, height, sprite) {
        this.owner = owner;
        this.type = type;
        this.width = width;
        this.height = height;
        this.x =
            this.owner === game1.player1
                ? this.owner.x + this.owner.width
                : this.owner.x - this.width;
        this.y = this.owner.y + this.owner.height / 2 - this.height / 2;
        this.strength = this.owner.attackStrength;
        this.speed = this.owner.attackSpeed;
        this.sprite = sprite;
    }
    moveTowardEnemy() {
        // Calculate the right direction on the X axis
        const direction = this.owner === game1.player1 ? this.speed : -this.speed;
        this.x += direction;
    }
    inflictDamage() {
        // Reduce HP of the other Player
        this.owner.enemy.hp -= this.strength;
    }
    removeAttack() {
        // Delete the attack from the Player attack list
        this.owner.attacks.splice(this.owner.attacks.indexOf(this), 1);
    }
    detectCollision() {
        // Removes enemy's HP if attack matches the XY enemy's position
        const detectionMargin = 10;
        if (this.owner === game1.player1) {
            if (this.x >= game1.player2.x - this.width + detectionMargin &&
                this.y > game1.player2.y - this.height + detectionMargin &&
                this.y < game1.player2.y + game1.player2.height - detectionMargin) {
                this.inflictDamage();
                this.removeAttack();
            }
            else if (this.x > canvas.width) {
                this.removeAttack();
            }
        }
        else {
            if (this.x <= game1.player1.x + this.width + detectionMargin &&
                this.y > game1.player1.y - this.height - detectionMargin &&
                this.y < game1.player1.y + game1.player1.height - detectionMargin) {
                this.inflictDamage();
                this.removeAttack();
            }
            else if (this.x > canvas.width) {
                this.removeAttack();
            }
        }
    }
    drawAttackSprite() {
        // Update X axis, check for collision and display the attack sprite
        this.moveTowardEnemy();
        this.detectCollision();
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}
class Game {
    constructor() {
        this.player1 = null;
        this.player2 = null;
    }
    defaultDisplay() {
        // Display the default
        p1_name.innerText = "Name : " + this.player1.name;
        this.player1.drawPlayer();
        p2_name.innerText = "Name : " + this.player2.name;
        this.player2.drawPlayer();
    }
    displayPlayer1() {
        this.player1.reloadMana();
        this.player1.drawPlayer();
        // p1_position.innerText = `Axe : ${this.player1.x}x ${this.player1.y}y`;
        p1_hp.innerText = `HP : ${this.player1.hp}`;
        p1_mana.innerText = `Mana : ${this.player1.mana}`;
        p1_score.innerText = `Score : ${this.player1.score}`;
        this.player1.attacks.forEach((attack) => {
            attack.drawAttackSprite();
        });
    }
    displayPlayer2() {
        this.player2.reloadMana();
        this.player2.drawPlayer();
        // p2_position.innerText = `Axe : ${this.player2.x}x ${this.player2.y}y`;
        p2_hp.innerText = `HP : ${this.player2.hp}`;
        p2_mana.innerText = `Mana : ${this.player2.mana}`;
        p2_score.innerText = `Score : ${this.player2.score}`;
        this.player2.attacks.forEach((attack) => {
            attack.drawAttackSprite();
        });
    }
    runGame() {
        this.defaultDisplay();
        document.addEventListener("keydown", (event) => {
            this.checkKeyPress(event);
        });
        const refresh = setInterval(() => {
            if (this.player1.hp <= 0) {
                clearInterval(refresh);
                this.player2.score++;
                winner.style.display = "block";
                winner.innerText = `Le vainqueur est ${this.player2.name} !`;
                restart.style.display = "block";
            }
            if (this.player2.hp <= 0) {
                clearInterval(refresh);
                this.player1.score++;
                winner.style.display = "block";
                winner.innerText = `Le vainqueur est ${this.player2.name} !`;
                restart.style.display = "block";
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.displayPlayer1();
            this.displayPlayer2();
        }, 1000 / 10);
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
        this.player2.x = 450;
        this.player2.y = 0;
        this.player2.attacks = [];
        this.player2.hp = 150;
        this.player2.mana = 100;
    }
}
const game1 = new Game();
start.onclick = () => {
    start.style.display = "none";
    game1.player1 = new Player(0, 0, "Ace", acePng, 150, 100, 3, 10, 10, fireballMp3, fireballPng, aceMp3, aceGif, game1.player2);
    game1.player2 = new Player(450, 0, "Luffy", luffyPng, 150, 100, 3, 10, 10, swooshMp3, punchPng, luffyMp3, luffyGif, game1.player1);
    game1.defaultDisplay();
    game1.runGame();
    restart.onclick = () => {
        game1.resetGame();
        game1.defaultDisplay();
        game1.runGame();
    };
};
