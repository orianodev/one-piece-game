import { def } from "../data/settings.js";
import { stadiumPathFormId } from "../data/stadiums.js";
export const $infosBar = {
    1: {
        character: document.querySelector("#character-1"),
        hpBar: document.querySelector("#hp-bar-1"),
        hp: document.querySelector("#hp-1"),
        manaBar: document.querySelector("#mana-bar-1"),
        mana: document.querySelector("#mana-1"),
        score: document.querySelector("#score-1"),
    },
    2: {
        character: document.querySelector("#character-2"),
        hpBar: document.querySelector("#hp-bar-2"),
        hp: document.querySelector("#hp-2"),
        manaBar: document.querySelector("#mana-bar-2"),
        mana: document.querySelector("#mana-2"),
        score: document.querySelector("#score-2"),
    }
};
const $popup = document.querySelector("#popup");
const $home = document.querySelector("#home");
const $restart = document.querySelector("#restart");
$restart.addEventListener("click", () => window.location.reload());
$home.addEventListener("click", () => window.location.href = "/");
export let $ctx;
export function setLoadingScreen() {
    const $loadingScreen = document.querySelector("#loading-screen");
    const randomImg = Math.floor(Math.random() * 5);
    $loadingScreen.style.backgroundImage = `url(/img/wait/${randomImg}.gif)`;
    displayPopup("Chargement en cours...", false, false);
    return $loadingScreen;
}
export function setStadium() {
    const stadium = localStorage.getItem("stadium");
    const $wallpaper = document.querySelector("#wallpaper");
    $wallpaper.style.backgroundImage = `url(/img/stadium/${stadium}.webp)`;
    return stadium;
}
export function displayPopup(msg, restart, home) {
    $popup.style.display = 'flex';
    $popup.querySelector("#message").textContent = msg;
    $restart.style.display = restart ? 'flex' : 'none';
    $home.style.display = home ? 'flex' : 'none';
}
export function updateLateralColumns(player) {
    const playerDom = player.id === "A" ? $infosBar[1] : $infosBar[2];
    playerDom.character.style.color = player.rage ? def.rageTextColor : def.normalTextColor;
    const hpPercent = (player.hp / player.maxHp) * 100;
    const manaPercent = (player.mana / player.maxMana) * 100;
    playerDom.hpBar.style.width = `${hpPercent}%`;
    playerDom.hpBar.style.backgroundColor = player.hp <= player.maxHp * def.rageThreshold ? def.rageTextColor : def.normalHpColor;
    playerDom.hp.innerText = player.hp.toFixed(0);
    playerDom.manaBar.style.width = `${manaPercent}%`;
    playerDom.mana.innerText = player.mana.toFixed(0);
}
export function showGameScreen($loadingScreen) {
    const $canvas = document.querySelector("#canvas");
    $canvas.width = def.canvasWidth * def.canvasScaleMult;
    $canvas.height = def.canvasHeight * def.canvasScaleMult;
    $canvas.style.width = `${def.canvasWidth}px`;
    $canvas.style.height = `${def.canvasHeight}px`;
    $ctx = $canvas.getContext("2d");
    $ctx.scale(def.canvasScaleMult, def.canvasScaleMult);
    const $playScreen = document.querySelector("#play");
    $playScreen.style.display = "flex";
    $loadingScreen.style.display = "none";
    $popup.style.display = "none";
}
export function preloadImages(stadium, thisPlayer, oppPlayer, callback) {
    const imagePaths = [stadiumPathFormId(stadium), thisPlayer.img, thisPlayer.attackName, thisPlayer.img.replace("char", "rage")];
    if (oppPlayer)
        imagePaths.push(oppPlayer.img, oppPlayer.attackName, oppPlayer.img.replace("char", "rage"));
    let loadedImages = 0;
    const totalImages = imagePaths.length;
    imagePaths.forEach((path) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages && callback)
                callback();
        };
        img.onerror = () => {
            console.warn(`Failed to load image at ${path}`);
            loadedImages++;
            if (loadedImages === totalImages && callback)
                callback();
        };
    });
}
