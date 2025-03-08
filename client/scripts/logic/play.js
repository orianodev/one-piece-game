import { Game } from "./class/Game.js";
import { setLoadingScreen, setStadium } from "./ui.js";
import { soloGameSetup } from "./local.js";
import { socket } from "./online.js";
export const $loadingScreen = setLoadingScreen();
export const stadium = setStadium();
export const Fight = new Game("loading");
if (Fight.mode === "solo")
    soloGameSetup();
else if (Fight.mode === "dual")
    socket.emit("askId", Fight.roomId);
