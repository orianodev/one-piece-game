"use strict";
// Canvas API
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.shadowBlur = 30;
ctx.shadowOffsetX = 3;
ctx.shadowOffsetY = 3;
// Import data
const background_url = {
    luffy_law: {
        name: "Luffy and Law",
        url: "./images/wallpapers/luffy-and-law.webp",
    },
    sabaody: {
        name: "Luffy and Law",
        url: "./images/wallpapers/sabaody.webp",
    },
    marineford: {
        name: "Luffy and Law",
        url: "./images/wallpapers/marineford.webp",
    },
};
const players = {
    ace: {
        name: "Portgas D. Ace",
        spriteImage: "/images/players/ace.png",
        shadowColor: "orange",
        hp: 270,
        mana: 50,
        healingAbility: 1.5,
        attackStrength: 15,
        attackSpeed: 2,
        attackSound: "#fireballMp3",
        attackSprite: "/images/attacks/fireball.png",
        specialAttackStrength: 50,
        specialAttackSpeed: 5,
        specialAttackSound: "#aceMp3",
        specialAttackSprite: "/images/players/ace.webm",
    },
    luffy: {
        name: "Monkey D. Luffy",
        spriteImage: "/images/players/luffy.png",
        shadowColor: "red",
        hp: 250,
        mana: 70,
        healingAbility: 1.5,
        attackStrength: 10,
        attackSpeed: 3,
        attackSound: "#swooshMp3",
        attackSprite: "/images/attacks/punch.png",
        specialAttackStrength: 35,
        specialAttackSpeed: 10,
        specialAttackSound: "#luffyMp3",
        specialAttackSprite: "/images/players/luffy.webm",
    },
    zoro: {
        name: "Roronoa Zoro",
        spriteImage: "/images/players/zoro.png",
        shadowColor: "green",
        hp: 300,
        mana: 60,
        healingAbility: 1.5,
        attackStrength: 12,
        attackSpeed: 2.7,
        attackSound: "#slashMp3",
        attackSprite: "/images/attacks/slash.png",
        specialAttackStrength: 40,
        specialAttackSpeed: 7,
        specialAttackSound: "#zoroMp3",
        specialAttackSprite: "/images/players/zoro.webm",
    },
    franky: {
        name: "Fanky, Cuty Flam",
        spriteImage: "/images/players/franky.png",
        shadowColor: "blue",
        hp: 240,
        mana: 110,
        healingAbility: 1.5,
        attackStrength: 11,
        attackSpeed: 3.1,
        attackSound: "#cannonballMp3",
        attackSprite: "/images/attacks/cannonball.png",
        specialAttackStrength: 40,
        specialAttackSpeed: 8,
        specialAttackSound: "#frankyMp3",
        specialAttackSprite: "/images/players/franky.webm",
    },
};
const settings = {
    playerHeight: 200,
    playerWidth: 100,
    collisionMargin: 15,
    playerStep: 35,
    playerSizeVariation: 20,
    attackSpriteHeight: 40,
    attackSpriteWidth: 40,
    maxHp: 350,
    maxMana: 150,
    healingSizeTime: 50,
    simpleAttackDelay: 200,
    specialAttackDelay: 1000,
    specialAttackAudioDelay: 2000,
    player1DefaultPosition: { x: 0, y: 0 },
    player2DefaultPosition: { x: canvas.width - 100, y: 0 },
    refreshRate: 1000 / 100,
};
// Control game
const start = document.querySelector("#start");
const restart = document.querySelector("#restart");
const winner = document.querySelector("#winner");
const radioInputs = document.querySelectorAll('input[type="radio"]');
// Change background wallpaper
const bg = document.querySelector("#wallpaper");
bg.style.backgroundImage = `url(${background_url.luffy_law.url})`;
document.body.addEventListener("change", (e) => {
    let target = e.target; // Use type assertion to HTMLElement
    switch (target.id) {
        case "marineford":
            bg.style.backgroundImage = `url(${background_url.marineford.url})`;
            break;
        case "sabaody":
            bg.style.backgroundImage = `url(${background_url.sabaody.url})`;
            break;
        case "luffy_law":
            bg.style.backgroundImage = `url(${background_url.luffy_law.url})`;
            break;
    }
});
// Change players
document.body.addEventListener("change", (e) => {
    let target = e.target;
    switch (target.id) {
        case "luffy1":
            player1 = players.luffy;
            break;
        case "ace1":
            player1 = players.ace;
            break;
        case "zoro1":
            player1 = players.zoro;
            break;
        case "franky1":
            player1 = players.franky;
            break;
        case "luffy2":
            player2 = players.luffy;
            break;
        case "ace2":
            player2 = players.ace;
            break;
        case "zoro2":
            player2 = players.zoro;
            break;
        case "franky2":
            player2 = players.franky;
            break;
    }
});
// Sounds
const fireballMp3 = document.querySelector("#fireballMp3");
const swooshMp3 = document.querySelector("#swooshMp3");
const slashMp3 = document.querySelector("#slashMp3");
const cannonballMp3 = document.querySelector("#cannonballMp3");
const aceMp3 = document.querySelector("#aceMp3");
const luffyMp3 = document.querySelector("#luffyMp3");
const zoroMp3 = document.querySelector("#zoroMp3");
const frankyMp3 = document.querySelector("#frankyMp3");
const healMp3 = document.querySelector("#healMp3");
const hitMp3 = document.querySelector("#hitMp3");
const yeahMp3 = document.querySelector("#yeahMp3");
const gearSecondMp3 = document.querySelector("#gearSecondMp3");
const overtakenMp3 = document.querySelector("#overtakenMp3");
healMp3.volume = 0.4;
hitMp3.volume = 0.4;
yeahMp3.volume = 0.5;
gearSecondMp3.volume = 0.8;
overtakenMp3.volume = 0.3;
// Display infos
const p1_name = document.querySelector("#p1_name");
const p1_hp = document.querySelector("#p1_hp");
const p1_hp_display = document.querySelector("#p1_hp_display");
const p1_mana = document.querySelector("#p1_mana");
const p1_mana_display = document.querySelector("#p1_mana_display");
const p1_score = document.querySelector("#p1_score");
const p2_name = document.querySelector("#p2_name");
const p2_hp = document.querySelector("#p2_hp");
const p2_hp_display = document.querySelector("#p2_hp_display");
const p2_mana = document.querySelector("#p2_mana");
const p2_mana_display = document.querySelector("#p2_mana_display");
const p2_score = document.querySelector("#p2_score");
// Video player settings
const v1 = document.querySelector("#v1");
const v2 = document.querySelector("#v2");
const video_space = document.querySelector("#video_space");
video_space.style.minWidth = `${canvas.width - settings.playerWidth * 4}px`;
v1.width = settings.playerWidth * 2;
v1.height = settings.playerHeight * 1.2;
v1.loop = true;
v2.width = settings.playerWidth * 2;
v2.height = settings.playerHeight * 1.2;
v2.loop = true;
// OOP
class Player {
    constructor(x, y, name, spriteImage, shadowColor, hp, mana, healingAbility, attackStrength, attackSpeed, attackSound, attackSprite, specialAttackStrength, specialAttackSpeed, specialAttackSound, specialAttackSprite, enemy) {
        this.x = x;
        this.y = y;
        this.width = settings.playerWidth;
        this.height = settings.playerHeight;
        this.name = name;
        this.currentSprite = this.createSprite(spriteImage);
        this.spriteImage = this.createSprite(spriteImage);
        this.shadowColor = shadowColor;
        this.hp = hp;
        this.mana = mana;
        this.healingAbility = healingAbility;
        this.attackStrength = attackStrength;
        this.attackSpeed = attackSpeed;
        this.attackSound = this.createSound(attackSound, "simple");
        this.attackSprite = this.createSprite(attackSprite);
        this.specialAttackStrength = specialAttackStrength;
        this.specialAttackSpeed = specialAttackSpeed;
        this.specialAttackSound = this.createSound(specialAttackSound, "special");
        this.specialAttackSprite = specialAttackSprite;
        this.enemy = enemy;
        this.attacks = [];
        this.isUsingAttack = false;
        this.isUsingSpecialAttack = false;
        this.score = 0;
    }
    createSprite(imageUrl) {
        const newSprite = new Image();
        newSprite.src = imageUrl;
        return newSprite;
    }
    createSound(soundId, attackType) {
        const newSound = document.querySelector(soundId);
        newSound.volume = attackType === "simple" ? 0.4 : 0.9;
        return newSound;
    }
    drawPlayer() {
        ctx.shadowColor = this.shadowColor;
        ctx.drawImage(this.currentSprite, this.x, this.y, this.width, this.height);
    }
    moveUp() {
        if (this.y > 0) {
            this.y -= settings.playerStep;
        }
    }
    moveDown() {
        if (this.y < canvas.height - settings.playerHeight) {
            this.y += settings.playerStep;
        }
    }
    simpleAttack() {
        if (!this.isUsingSpecialAttack && !this.isUsingAttack) {
            this.isUsingAttack = true;
            this.attackSound.currentTime = 0;
            this.attackSound.play();
            this.attacks.push(new Attack(this, "simple", settings.attackSpriteWidth, settings.attackSpriteHeight, this.attackSprite));
            this.height += settings.playerSizeVariation;
            setTimeout(() => {
                this.isUsingAttack = false;
                this.height -= settings.playerSizeVariation;
            }, settings.simpleAttackDelay);
        }
    }
    runSpecialVideo() {
        const video = this === fight.player1 ? v1 : v2;
        video.style.transform =
            this === fight.player1
                ? `translateY(${this.y}px)`
                : `translateY(${this.y}px) scale(-1, 1)`;
        video.src = this.specialAttackSprite;
        video.play();
        setTimeout(() => {
            video.src = "";
        }, settings.specialAttackDelay);
    }
    specialAttack() {
        if (!this.isUsingSpecialAttack && !this.isUsingAttack && this.mana > 99) {
            this.specialAttackSound.currentTime = 0;
            this.specialAttackSound.play();
            this.isUsingSpecialAttack = true;
            setTimeout(() => {
                this.currentSprite = this.createSprite("images/players/empty.png");
                this.runSpecialVideo();
                this.attacks.push(new Attack(this, "special", settings.attackSpriteWidth * 2, settings.attackSpriteHeight * 2, this.attackSprite));
                this.mana -= 100;
                this.height += settings.playerSizeVariation * 2;
                this.width += settings.playerSizeVariation * 4;
                if (this === fight.player2)
                    this.x -= settings.playerSizeVariation * 4;
                setTimeout(() => {
                    this.currentSprite = this.spriteImage;
                    this.height -= settings.playerSizeVariation * 2;
                    this.width -= settings.playerSizeVariation * 4;
                    if (this === fight.player2)
                        this.x += settings.playerSizeVariation * 4;
                    this.isUsingSpecialAttack = false;
                }, settings.specialAttackDelay);
            }, settings.specialAttackAudioDelay);
        }
    }
    reloadMana() {
        if (this.mana < settings.maxMana && !this.isUsingSpecialAttack) {
            this.mana += 0.1;
        }
    }
    heal() {
        if (this.hp < settings.maxHp) {
            healMp3.currentTime = 0;
            healMp3.play();
            this.hp += Math.random() * this.healingAbility;
            this.height -= settings.playerSizeVariation;
            setTimeout(() => {
                this.height += settings.playerSizeVariation;
            }, settings.healingSizeTime);
        }
    }
    win() {
        fight.blockRadioInput(false);
        fight.isPlaying = false;
        yeahMp3.currentTime = 0;
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
            console.log("hit");
            hitMp3.currentTime = 0;
            hitMp3.play();
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
        const detectionMargin = settings.collisionMargin;
        if (this.owner === fight.player1) {
            if (this.x >= fight.player2.x - this.width + detectionMargin &&
                this.y > fight.player2.y - this.height + detectionMargin &&
                this.y < fight.player2.y + fight.player2.height - detectionMargin) {
                this.inflictDamage();
                this.removeAttack();
            }
            else if (this.x > canvas.width - settings.attackSpriteWidth / 2) {
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
            else if (this.x < 0 - settings.attackSpriteWidth / 2) {
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
        this.playStartSound = () => {
            gearSecondMp3.currentTime = 0;
            gearSecondMp3.play();
            overtakenMp3.currentTime = 0;
            overtakenMp3.play();
        };
        this.blockRadioInput = (blockStatus) => {
            radioInputs.forEach((input) => {
                input.disabled = blockStatus;
            });
        };
        this.player1 = new Player(settings.player1DefaultPosition.x, settings.player1DefaultPosition.y, player1.name, player1.spriteImage, player1.shadowColor, player1.hp, player1.mana, player1.healingAbility, player1.attackStrength, player1.attackSpeed, player1.attackSound, player1.attackSprite, player1.specialAttackStrength, player1.specialAttackSpeed, player1.specialAttackSound, player1.specialAttackSprite, null);
        this.player2 = new Player(settings.player2DefaultPosition.x, settings.player2DefaultPosition.y, player2.name, player2.spriteImage, player2.shadowColor, player2.hp, player2.mana, player2.healingAbility, player2.attackStrength, player2.attackSpeed, player2.attackSound, player2.attackSprite, player2.specialAttackStrength, player2.specialAttackSpeed, player2.specialAttackSound, player2.specialAttackSprite, null);
        this.isPlaying = false;
    }
    defaultDisplay() {
        // Display the default positions
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
        }, settings.refreshRate);
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
        this.player1.hp = player1.hp;
        this.player1.mana = player1.mana;
        this.player2.x = canvas.width - settings.playerWidth;
        this.player2.y = 0;
        this.player2.attacks = [];
        this.player2.hp = player2.hp;
        this.player2.mana = player2.mana;
    }
}
let player1 = players.luffy;
let player2 = players.ace;
const fight = new Game();
start.onclick = () => {
    fight.playStartSound();
    setTimeout(() => {
        // Update player 1
        fight.player1.name = player1.name;
        fight.player1.spriteImage = fight.player1.createSprite(player1.spriteImage);
        fight.player1.currentSprite = fight.player1.spriteImage;
        fight.player1.shadowColor = player1.shadowColor;
        fight.player1.hp = player1.hp;
        fight.player1.mana = player1.mana;
        fight.player1.healingAbility = player1.healingAbility;
        fight.player1.attackStrength = player1.attackStrength;
        fight.player1.attackSpeed = player1.attackSpeed;
        fight.player1.attackSound = fight.player1.createSound(player1.attackSound, "simple");
        fight.player1.attackSprite = fight.player1.createSprite(player1.attackSprite);
        fight.player1.specialAttackStrength = player1.specialAttackStrength;
        fight.player1.specialAttackSpeed = player1.specialAttackSpeed;
        fight.player1.specialAttackSound = fight.player1.createSound(player1.specialAttackSound, "special");
        fight.player1.specialAttackSprite = player1.specialAttackSprite;
        // Update player 2
        fight.player2.name = player2.name;
        fight.player2.spriteImage = fight.player2.createSprite(player2.spriteImage);
        fight.player2.currentSprite = fight.player2.spriteImage;
        fight.player2.shadowColor = player2.shadowColor;
        fight.player2.hp = player2.hp;
        fight.player2.mana = player2.mana;
        fight.player2.healingAbility = player2.healingAbility;
        fight.player2.attackStrength = player2.attackStrength;
        fight.player2.attackSpeed = player2.attackSpeed;
        fight.player2.attackSound = fight.player2.createSound(player2.attackSound, "simple");
        fight.player2.attackSprite = fight.player2.createSprite(player2.attackSprite);
        fight.player2.specialAttackStrength = player2.specialAttackStrength;
        fight.player2.specialAttackSpeed = player2.specialAttackSpeed;
        fight.player2.specialAttackSound = fight.player2.createSound(player2.specialAttackSound, "special");
        fight.player2.specialAttackSprite = player2.specialAttackSprite;
        fight.blockRadioInput(true);
        fight.isPlaying = true;
        start.style.display = "none";
        fight.setEnemies();
        fight.defaultDisplay();
        fight.runGame();
    }, 1000);
    restart.onclick = () => {
        fight.playStartSound();
        setTimeout(() => {
            // Update player 1
            fight.player1.name = player1.name;
            fight.player1.spriteImage = fight.player1.createSprite(player1.spriteImage);
            fight.player1.currentSprite = fight.player1.spriteImage;
            fight.player1.shadowColor = player1.shadowColor;
            fight.player1.hp = player1.hp;
            fight.player1.mana = player1.mana;
            fight.player1.healingAbility = player1.healingAbility;
            fight.player1.attackStrength = player1.attackStrength;
            fight.player1.attackSpeed = player1.attackSpeed;
            fight.player1.attackSound = fight.player1.createSound(player1.attackSound, "simple");
            fight.player1.attackSprite = fight.player1.createSprite(player1.attackSprite);
            fight.player1.specialAttackStrength = player1.specialAttackStrength;
            fight.player1.specialAttackSpeed = player1.specialAttackSpeed;
            fight.player1.specialAttackSound = fight.player1.createSound(player1.specialAttackSound, "special");
            fight.player1.specialAttackSprite = player1.specialAttackSprite;
            // Update player 2
            fight.player2.name = player2.name;
            fight.player2.spriteImage = fight.player2.createSprite(player2.spriteImage);
            fight.player2.currentSprite = fight.player2.spriteImage;
            fight.player2.shadowColor = player2.shadowColor;
            fight.player2.hp = player2.hp;
            fight.player2.mana = player2.mana;
            fight.player2.healingAbility = player2.healingAbility;
            fight.player2.attackStrength = player2.attackStrength;
            fight.player2.attackSpeed = player2.attackSpeed;
            fight.player2.attackSound = fight.player2.createSound(player2.attackSound, "simple");
            fight.player2.attackSprite = fight.player2.createSprite(player2.attackSprite);
            fight.player2.specialAttackStrength = player2.specialAttackStrength;
            fight.player2.specialAttackSpeed = player2.specialAttackSpeed;
            fight.player2.specialAttackSound = fight.player2.createSound(player2.specialAttackSound, "special");
            fight.player2.specialAttackSprite = player2.specialAttackSprite;
            fight.blockRadioInput(true);
            fight.isPlaying = true;
            winner.style.display = "none";
            restart.style.display = "none";
            fight.resetGame();
            fight.defaultDisplay();
            fight.runGame();
        }, 1000);
    };
};
