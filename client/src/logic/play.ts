import { Game } from "./class/Game.js";
import { setLoadingScreen, setStadium } from "./ui.js";
import { soloGameSetup } from "./setupSolo.js";
import { socket } from "./socketHandlers.js";

export const $loadingScreen = setLoadingScreen()
export const stadium = setStadium()
export const Fight = new Game("loading");

if (Fight.mode === "dual") socket.emit("askId", Fight.roomId);
else if (Fight.mode === "solo") soloGameSetup()