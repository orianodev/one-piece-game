import { $loadingScreen, Fight, stadium } from "./play.js";
import { displayPopup, $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { defPlayerDirections, defPlayerPositions } from "../data/settings.js";
import { attackSpritePathFromName, characterStats, charSpritePathFromId } from "../data/characters.js";
export const socket = io();
socket.on("getId", (playerId) => {
    Fight.thisPlayerId = playerId;
    displayPopup("En attente de l'adversaire...", false, false);
    const thisScore = parseInt(localStorage.getItem("scoreThis"));
    const thisCharacterId = localStorage.getItem("characterId");
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer = {
        id: playerId, charId: thisCharacterId, charName: thisCharacter.name, color: thisCharacter.color, img: charSpritePathFromId(thisCharacterId), score: thisScore, rage: false, x: defPlayerPositions[playerId].x, y: defPlayerPositions[playerId].y, dir: Fight.thisPlayerId === "A" ? defPlayerDirections.A : defPlayerDirections.B, speed: thisCharacter.speed, hp: thisCharacter.hp, maxHp: thisCharacter.maxHp, healPow: thisCharacter.healPow, mana: thisCharacter.mana, maxMana: thisCharacter.maxMana, regenPow: thisCharacter.regenPow, strength: thisCharacter.strength, attackName: attackSpritePathFromName(thisCharacter.attackName), attackCost: thisCharacter.attackCost, attackSpeed: thisCharacter.attackSpeed
    };
    preloadImages(stadium, thisPlayer, null, () => {
        socket.emit("postPlayer", { thisPlayer, roomId: Fight.roomId, playerId });
    });
});
socket.on("start", (msg) => {
    Fight.thisPlayerId === "A" ? Fight.buildPlayers(msg.A, msg.B) : Fight.buildPlayers(msg.B, msg.A);
    const playerA = Fight.thisPlayer.id === "A" ? Fight.thisPlayer : Fight.oppPlayer;
    const playerB = Fight.thisPlayer.id === "B" ? Fight.thisPlayer : Fight.oppPlayer;
    $infosBar[1].score.innerText = playerA.charName;
    $infosBar[1].score.innerText = playerA.score.toString();
    $infosBar[2].score.innerText = playerB.charName;
    $infosBar[2].score.innerText = playerB.score.toString();
    showGameScreen($loadingScreen);
    Fight.attachKeyboardEvent();
    Fight.updateMovement();
    Fight.status = "playing";
    Fight.startTimer();
});
socket.on("update", (msg) => {
    Fight.thisPlayerId === "A" ? Fight.updatePlayers(msg.A, msg.B) : Fight.updatePlayers(msg.B, msg.A);
    Fight.drawAll();
});
socket.on("over", (winningPlayerId) => {
    if (winningPlayerId === Fight.thisPlayerId)
        localStorage.setItem("scoreThis", (Fight.thisPlayer.score + 1).toString());
    displayPopup(`Le joueur ${winningPlayerId === "A" ? "1" : "2"} a gagné!`, true, true);
    Fight.status = "over";
    Fight.stopTimer();
});
socket.on("stop", () => {
    displayPopup("Ton adversaire s'est deconnecté.", false, true);
    Fight.status = "over";
    Fight.stopTimer();
});
socket.on("busy", () => {
    displayPopup("Cette partie est occupée, choisis un autre ID de jeu.", false, true);
});
