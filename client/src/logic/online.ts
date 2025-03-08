import { PlayerId, PlayerAttributes, PlayerAttributesTuple } from "../../../shared/Types";
import { $loadingScreen, Fight, stadium } from "./play.js";
import { displayPopup, $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { defPlayerDirections, defPlayerPositions } from "../data/settings.js";
import { CharacterID, characterStats } from "../data/characters.js";
import { Player } from "./class/Player.js";

// @ts-expect-error
export const socket = io();

socket.on("getId", (playerId: PlayerId) => {
    Fight.thisPlayerId = playerId;
    displayPopup("En attente de l'adversaire...", false, false);
    const thisScore = parseInt(localStorage.getItem("scoreThis") as string) as number;
    const thisCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer: Omit<PlayerAttributes, "attacks"> = {
        id: playerId, charId: thisCharacterId, charName: thisCharacter.name, color: thisCharacter.color, img: thisCharacter.img, score: thisScore, rage: false, x: defPlayerPositions[playerId].x, y: defPlayerPositions[playerId].y, dir: Fight.thisPlayerId === "A" ? defPlayerDirections.A : defPlayerDirections.B, speed: thisCharacter.speed, hp: thisCharacter.hp, maxHp: thisCharacter.maxHp, healPow: thisCharacter.healPow, mana: thisCharacter.mana, maxMana: thisCharacter.maxMana, regenPow: thisCharacter.regenPow, strength: thisCharacter.strength, attackImg: thisCharacter.attackImg, attackCost: thisCharacter.attackCost, attackSpeed: thisCharacter.attackSpeed
    }
    preloadImages(thisPlayer, stadium, () => {
        socket.emit("postPlayer", { thisPlayer, roomId: Fight.roomId, playerId })
    });
})

socket.on("start", (msg: { A: Player, B: Player }) => {
    Fight.thisPlayerId === "A" ? Fight.buildPlayers(msg.A, msg.B) : Fight.buildPlayers(msg.B, msg.A);
    const playerA = Fight.thisPlayer.id === "A" ? Fight.thisPlayer : Fight.oppPlayer;
    const playerB = Fight.thisPlayer.id === "B" ? Fight.thisPlayer : Fight.oppPlayer;
    $infosBar[1].score.innerText = playerA.charName;
    $infosBar[1].score.innerText = playerA.score.toString();
    $infosBar[2].score.innerText = playerB.charName;
    $infosBar[2].score.innerText = playerB.score.toString();

    showGameScreen($loadingScreen)
    Fight.attachKeyboardEvent();
    Fight.updateMovement();
    // Fight.dualGameRefresh()
    Fight.status = "playing";
    Fight.startTimer();
});

socket.on("update", (msg: { A: PlayerAttributesTuple, B: PlayerAttributesTuple }) => {
    Fight.thisPlayerId === "A" ? Fight.updatePlayers(msg.A, msg.B) : Fight.updatePlayers(msg.B, msg.A);
    Fight.drawAll()
});

socket.on("over", (winningPlayerId: PlayerId) => {
    if (winningPlayerId === Fight.thisPlayerId) localStorage.setItem("scoreThis", (Fight.thisPlayer.score + 1).toString());
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