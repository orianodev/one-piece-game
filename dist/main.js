"use strict";
const doc = document;
// CANVAS Parameters
const $canvas = doc.querySelector("canvas");
const ctx = $canvas.getContext("2d");
const canvasShadow = (context = ctx) => {
    context.shadowBlur = 30;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
};
canvasShadow(ctx);
// DATA Characters
const characters = {
    luffy: {
        name: "Monkey D. Luffy",
        spriteImage: "images/players/luffy.png",
        shadowColor: "red",
        step: 11,
        hp: 250,
        healingSpeed: 2.5,
        mana: 70,
        manaCost: 100,
        manaSpeed: 1,
        attackStrength: 10,
        attackSpeed: 3,
        attackSound: "#swooshMp3",
        attackSprite: "images/attacks/punch.png",
        specialAttackStrength: 35,
        specialAttackSpeed: 10,
        specialAttackSound: "#luffySpeMp3",
        specialAttackSprite: "images/special/luffy.gif",
        victorySound: "#luffyWinMp3",
    },
    ace: {
        name: "Portgas D. Ace",
        spriteImage: "images/players/ace.png",
        shadowColor: "orange",
        step: 12,
        hp: 270,
        healingSpeed: 2,
        mana: 50,
        manaCost: 125,
        manaSpeed: 1,
        attackStrength: 15,
        attackSpeed: 2,
        attackSound: "#fireballMp3",
        attackSprite: "images/attacks/fireball.png",
        specialAttackStrength: 50,
        specialAttackSpeed: 5,
        specialAttackSound: "#aceSpeMp3",
        specialAttackSprite: "images/special/ace.gif",
        victorySound: "#aceWinMp3",
    },
    zoro: {
        name: "Roronoa Zoro",
        spriteImage: "images/players/zoro.png",
        shadowColor: "green",
        step: 13,
        hp: 300,
        healingSpeed: 2,
        mana: 60,
        manaCost: 110,
        manaSpeed: 1.2,
        attackStrength: 12,
        attackSpeed: 2.7,
        attackSound: "#slashMp3",
        attackSprite: "images/attacks/slash.png",
        specialAttackStrength: 40,
        specialAttackSpeed: 7,
        specialAttackSound: "#zoroSpeMp3",
        specialAttackSprite: "images/special/zoro.gif",
        victorySound: "#zoroWinMp3",
    },
    franky: {
        name: "Fanky, Cuty Flam",
        spriteImage: "images/players/franky.png",
        shadowColor: "blue",
        step: 12,
        hp: 240,
        healingSpeed: 2.1,
        mana: 110,
        manaCost: 90,
        manaSpeed: 1.1,
        attackStrength: 11,
        attackSpeed: 3.1,
        attackSound: "#cannonballMp3",
        attackSprite: "images/attacks/cannonball.png",
        specialAttackStrength: 40,
        specialAttackSpeed: 8,
        specialAttackSound: "#frankySpeMp3",
        specialAttackSprite: "images/special/franky.gif",
        victorySound: "#frankyWinMp3",
    },
    sanji: {
        name: "Vinsmoke Sanji",
        spriteImage: "images/players/sanji.png",
        shadowColor: "yellow",
        step: 12,
        hp: 250,
        healingSpeed: 2,
        mana: 100,
        manaCost: 80,
        manaSpeed: 1,
        attackStrength: 12,
        attackSpeed: 3.4,
        attackSound: "#swooshMp3",
        attackSprite: "images/attacks/slash.png",
        specialAttackStrength: 37,
        specialAttackSpeed: 9,
        specialAttackSound: "#sanjiSpeMp3",
        specialAttackSprite: "images/special/sanji.gif",
        victorySound: "#sanjiWinMp3",
    },
    brook: {
        name: "Brook",
        spriteImage: "images/players/brook.png",
        shadowColor: "black",
        step: 10,
        hp: 280,
        healingSpeed: 1.5,
        mana: 90,
        manaCost: 85,
        manaSpeed: 1,
        attackStrength: 9,
        attackSpeed: 3.8,
        attackSound: "#swooshMp3",
        attackSprite: "images/attacks/music.png",
        specialAttackStrength: 30,
        specialAttackSpeed: 9.5,
        specialAttackSound: "#brookSpeMp3",
        specialAttackSprite: "images/special/brook.gif",
        victorySound: "#brookWinMp3",
    },
    law: {
        name: "Trafalgar Law",
        spriteImage: "images/players/law.png",
        shadowColor: "brown",
        step: 9,
        hp: 220,
        healingSpeed: 3,
        mana: 95,
        manaCost: 110,
        manaSpeed: 1.3,
        attackStrength: 5,
        attackSpeed: 5,
        attackSound: "#swooshMp3",
        attackSprite: "images/attacks/slash.png",
        specialAttackStrength: 25,
        specialAttackSpeed: 12,
        specialAttackSound: "#lawSpeMp3",
        specialAttackSprite: "images/special/law.gif",
        victorySound: "#lawWinMp3",
    },
    jinbe: {
        name: "Jinbe",
        spriteImage: "images/players/jinbe.png",
        shadowColor: "cyan",
        step: 14,
        hp: 250,
        healingSpeed: 1.5,
        mana: 100,
        manaCost: 110,
        manaSpeed: 1,
        attackStrength: 12,
        attackSpeed: 3,
        attackSound: "#waveMp3",
        attackSprite: "images/attacks/wave.png",
        specialAttackStrength: 40,
        specialAttackSpeed: 9,
        specialAttackSound: "#jinbeSpeMp3",
        specialAttackSprite: "images/special/jinbe.gif",
        victorySound: "#jinbeWinMp3",
    },
};
const settings = {
    playerHeight: $canvas.height / 2.5,
    playerWidth: $canvas.width / 9,
    collisionMargin: 15,
    playerSizeVariation: 20,
    attackSpriteHeight: $canvas.height / 10,
    attackSpriteWidth: $canvas.height / 10,
    maxHp: 350,
    maxMana: 150,
    healingTime: 150,
    simpleAttackDelay: 150,
    specialAttackDelay: 1500,
    specialAttackAudioDelay: 1500,
    player1DefaultPosition: { x: 0, y: 0 },
    player2DefaultPosition: { x: $canvas.width - $canvas.width / 9, y: 0 },
    refreshRate: 10,
    aiPlayRate: 100,
    step: $canvas.height / 10,
    musicVolume: 0.3,
    sfxVolume: 0.3,
};
const backgroundUrl = {
    loguetown: "images/wallpapers/loguetown.webp",
    enies_lobby: "images/wallpapers/enies_lobby.webp",
    thriller_bark: "images/wallpapers/thriller_bark.webp",
    sabaody: "images/wallpapers/sabaody.webp",
    impel_down: "images/wallpapers/impel_down.webp",
    marineford: "images/wallpapers/marineford.webp",
};
// SELECT Characters
doc.body.addEventListener("click", (e) => {
    const element = e.target;
    const choice = element.value;
    if (choice === "luffy-1")
        console.log(choice);
    if (choice === "ace-1")
        console.log(choice);
    if (choice === "zoro-1")
        console.log(choice);
    if (choice === "franky-1")
        console.log(choice);
    if (choice === "sanji-1")
        console.log(choice);
    if (choice === "brook-1")
        console.log(choice);
    if (choice === "law-1")
        console.log(choice);
    if (choice === "jinbe-1")
        console.log(choice);
    if (choice === "luffy-2")
        console.log(choice);
    if (choice === "ace-2")
        console.log(choice);
    if (choice === "zoro-2")
        console.log(choice);
    if (choice === "franky-2")
        console.log(choice);
    if (choice === "sanji-2")
        console.log(choice);
    if (choice === "brook-2")
        console.log(choice);
    if (choice === "law-2")
        console.log(choice);
    if (choice === "jinbe-2")
        console.log(choice);
});
// SOUND Elements
const $sounds = {
    fireballMp3: doc.querySelector("#fireballMp3"),
    swooshMp3: doc.querySelector("#swooshMp3"),
    slashMp3: doc.querySelector("#slashMp3"),
    cannonballMp3: doc.querySelector("#cannonballMp3"),
    waveMp3: doc.querySelector("#waveMp3"),
    aceSpeMp3: doc.querySelector("#aceSpeMp3"),
    luffySpeMp3: doc.querySelector("#luffySpeMp3"),
    zoroSpeMp3: doc.querySelector("#zoroSpeMp3"),
    frankySpeMp3: doc.querySelector("#frankySpeMp3"),
    sanjiSpeMp3: doc.querySelector("#sanjiSpeMp3"),
    brookSpeMp3: doc.querySelector("#brookSpeMp3"),
    lawSpeMp3: doc.querySelector("#lawSpeMp3"),
    jinbeSpeMp3: doc.querySelector("#jinbeSpeMp3"),
    aceWinMp3: doc.querySelector("#aceWinMp3"),
    luffyWinMp3: doc.querySelector("#luffyWinMp3"),
    zoroWinMp3: doc.querySelector("#zoroWinMp3"),
    frankyWinMp3: doc.querySelector("#frankyWinMp3"),
    sanjiWinMp3: doc.querySelector("#sanjiWinMp3"),
    brookWinMp3: doc.querySelector("#brookWinMp3"),
    lawWinMp3: doc.querySelector("#lawWinMp3"),
    jinbekWinMp3: doc.querySelector("#jinbeWinMp3"),
    healMp3: doc.querySelector("#healMp3"),
    hitMp3: doc.querySelector("#hitMp3"),
    yeahMp3: doc.querySelector("#yeahMp3"),
    gearSecondMp3: doc.querySelector("#gearSecondMp3"),
    overtakenMp3: doc.querySelector("#overtakenMp3"),
    thrillerBarkMp3: doc.querySelector("#thrillerBarkMp3"),
    eniesLobbyMp3: doc.querySelector("#eniesLobbyMp3"),
    eniesLobbyMarchMp3: doc.querySelector("#eniesLobbyMarchMp3"),
    difficultMp3: doc.querySelector("#difficultMp3"),
    katakuriMp3: doc.querySelector("#katakuriMp3"),
};
// VOLUME Settings
const adjustVolume = () => {
    $sounds.healMp3.volume = settings.sfxVolume;
    $sounds.hitMp3.volume = settings.sfxVolume;
    $sounds.yeahMp3.volume = settings.sfxVolume;
    $sounds.gearSecondMp3.volume = settings.sfxVolume;
    $sounds.overtakenMp3.volume = settings.musicVolume;
    $sounds.thrillerBarkMp3.volume = settings.musicVolume;
    $sounds.eniesLobbyMp3.volume = settings.musicVolume;
    $sounds.eniesLobbyMarchMp3.volume = settings.musicVolume;
    $sounds.difficultMp3.volume = settings.musicVolume;
    $sounds.katakuriMp3.volume = settings.musicVolume;
};
adjustVolume();
// DOM Selectors
const $help = doc.querySelector("#help");
const $volume = doc.querySelector("#volume");
const $stadium = doc.querySelector("#stadium");
const $mode = doc.querySelector("#mode");
// STADIUM Selection
const $stadiumSelect = doc.querySelector("#stadiumSelect");
const $shadowCanvas = doc.querySelector("#shadowCanvas");
let $currentOst;
const selectStadium = (stadium, ost) => {
    $shadowCanvas.style.backgroundImage = `url(${stadium})`;
    $shadowCanvas.style.filter = "brightness(0.9) blur(5px)";
    $currentOst = ost;
};
selectStadium(backgroundUrl.loguetown, $sounds.overtakenMp3);
$stadiumSelect.addEventListener("change", (e) => {
    const choice = $stadiumSelect.value;
    if (choice === "loguetown")
        selectStadium(backgroundUrl.loguetown, $sounds.overtakenMp3);
    if (choice === "enies_lobby")
        selectStadium(backgroundUrl.enies_lobby, $sounds.eniesLobbyMp3);
    if (choice === "thriller_bark")
        selectStadium(backgroundUrl.thriller_bark, $sounds.thrillerBarkMp3);
    if (choice === "sabaody")
        selectStadium(backgroundUrl.sabaody, $sounds.eniesLobbyMarchMp3);
    if (choice === "impel_down")
        selectStadium(backgroundUrl.impel_down, $sounds.katakuriMp3);
    if (choice === "marineford")
        selectStadium(backgroundUrl.marineford, $sounds.difficultMp3);
});
// MODE Selection
const $modeSelect = doc.querySelector("#modeSelect");
let isAiActivated = true;
$mode.onclick = () => {
    isAiActivated = !isAiActivated;
    $mode.innerText = isAiActivated ? "Mode IA activé" : "Mode 2 joueurs";
};
let iaLevel = 1;
$modeSelect.addEventListener("change", (e) => {
    const choice = $modeSelect.value;
    if (choice === "ia1")
        iaLevel = 1;
    if (choice === "ia2")
        iaLevel = 2;
    if (choice === "ia3")
        iaLevel = 3;
});
