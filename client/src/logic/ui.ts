import { PlayerAttributes } from "../../../shared/Types";
import { def } from "../data/settings.js";
import { StadiumID } from "../data/stadiums.js";
import { Player } from "../logic/class/Player.js";

export const $infosBar = {
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

const $popup = document.querySelector("#popup") as HTMLDivElement;
const $home = document.querySelector("#home") as HTMLButtonElement;
const $restart = document.querySelector("#restart") as HTMLButtonElement;
$restart.addEventListener("click", () => window.location.reload());
$home.addEventListener("click", () => window.location.href = "/");

export let $ctx: CanvasRenderingContext2D;

export function setLoadingScreen(): HTMLDivElement {
    const $loadingScreen = document.querySelector("#loading-screen") as HTMLDivElement;
    const randomImg = Math.floor(Math.random() * 5);
    $loadingScreen.style.backgroundImage = `url(/img/wait/${randomImg}.gif)`;
    displayPopup("Chargement en cours...", false);
    return $loadingScreen;
}

export function setStadium(): StadiumID {
    const stadium: StadiumID = localStorage.getItem("stadium") as StadiumID;
    const $wallpaper = document.querySelector("#wallpaper") as HTMLDivElement;
    $wallpaper.style.backgroundImage = `url(/img/stadium/${stadium}.webp)`;
    return stadium;
}

export function displayPopup(msg: string, displayRestart: boolean) {
    $popup.style.display = 'flex';
    $popup.querySelector("#message")!.textContent = msg;
    if (displayRestart) $restart.style.display = 'flex';
    else $restart.style.display = 'none';
}

export function updateLateralColumns(player: Player) {
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

export function showGameScreen($loadingScreen: HTMLDivElement) {
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

export function preloadImages(thisPlayer: Player | Omit<PlayerAttributes, "attacks">, stadium: StadiumID, callback: { (): void; (): void; }) {
    const imagePaths = [`/img/stadium/${stadium}.webp`, thisPlayer.img, thisPlayer.attackImg, thisPlayer.img.replace("char", "rage")];

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