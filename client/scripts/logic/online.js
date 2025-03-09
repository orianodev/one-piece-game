import { $loadingScreen, Fight, stadium } from "./play.js";
import { displayPopup, $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { defDir, defPosition } from "../data/settings.js";
import { characterStats } from "../data/characters.js";
import { Player } from "./class/Player.js";
export const socket = io();
socket.on("getId", (playerId) => {
    displayPopup("En attente de l'adversaire...", false, false);
    Fight.selfId = playerId;
    Fight.enemyId = playerId === "p1" ? "p2" : "p1";
    const selfScore = parseInt(localStorage.getItem("scoreThis"));
    const selfCharacterId = localStorage.getItem("characterId");
    const selfCharacter = characterStats[selfCharacterId];
    const selfPosition = defPosition(Fight.selfId, selfCharacter.width, selfCharacter.height);
    Fight.self = new Player(playerId, selfScore, selfCharacterId, selfCharacter.name, selfCharacter.color, Fight.createImage(selfCharacter.id, selfCharacter.width, selfCharacter.height, "normal"), Fight.createImage(selfCharacter.id, selfCharacter.width, selfCharacter.height, "rage"), selfCharacter.width, selfCharacter.height, selfPosition.x, selfPosition.y, selfPosition.x, selfPosition.y, defDir[playerId], selfCharacter.speed, selfCharacter.hp, selfCharacter.maxHp, selfCharacter.healPow, selfCharacter.mana, selfCharacter.maxMana, selfCharacter.regenPow, selfCharacter.strength, selfCharacter.attackName, Fight.createImage(selfCharacter.attackName, selfCharacter.attackWidth, selfCharacter.attackHeight, "attack"), selfCharacter.attackWidth, selfCharacter.attackHeight, selfCharacter.attackCost, selfCharacter.attackSpeed, []);
    preloadImages(stadium, Fight.self, null, () => {
        socket.emit("postPlayer", { player: Fight.self, roomId: Fight.roomId, playerId });
    });
});
socket.on("start", (msg) => {
    const enemy = msg[Fight.enemyId];
    const enemyPosition = defPosition(enemy.id, enemy.width, enemy.height);
    Fight.enemy = new Player(enemy.id, enemy.score, enemy.charId, enemy.charName, enemy.color, Fight.createImage(enemy.charId, enemy.width, enemy.height, "normal"), Fight.createImage(enemy.charId, enemy.width, enemy.height, "rage"), enemy.width, enemy.height, enemyPosition.x, enemyPosition.y, enemyPosition.x, enemyPosition.y, defDir[enemy.id], enemy.speed, enemy.hp, enemy.maxHp, enemy.healPow, enemy.mana, enemy.maxMana, enemy.regenPow, enemy.strength, enemy.attackName, Fight.createImage(enemy.attackName, enemy.attackWidth, enemy.attackHeight, "attack"), enemy.attackWidth, enemy.attackHeight, enemy.attackCost, enemy.attackSpeed, []);
    const player1 = Fight.self.id === "p1" ? Fight.self : Fight.enemy;
    const player2 = Fight.self.id === "p2" ? Fight.self : Fight.enemy;
    $infosBar.p1.score.innerText = player1.charName;
    $infosBar.p1.score.innerText = player1.score.toString();
    $infosBar.p2.score.innerText = player2.charName;
    $infosBar.p2.score.innerText = player2.score.toString();
    showGameScreen($loadingScreen);
    Fight.attachKeyboardEvent();
    Fight.updateMovement();
    Fight.status = "playing";
    Fight.startTimer();
});
socket.on("update", (msg) => {
    Fight.updatePlayers(msg[Fight.selfId], "self");
    Fight.updatePlayers(msg[Fight.enemyId], "enemy");
    Fight.drawAll();
});
socket.on("over", (winningPlayerId) => {
    Fight.status = "over";
    Fight.stopTimer();
    if (winningPlayerId === Fight.selfId)
        localStorage.setItem("scoreThis", (Fight.self.score + 1).toString());
    displayPopup(`Le joueur ${winningPlayerId} a gagné!`, true, true);
});
socket.on("stop", () => {
    Fight.status = "over";
    Fight.stopTimer();
    displayPopup("Ton adversaire s'est deconnecté.", false, true);
});
socket.on("busy", () => {
    displayPopup("Cette partie est occupée, choisis un autre ID de jeu.", false, true);
});
