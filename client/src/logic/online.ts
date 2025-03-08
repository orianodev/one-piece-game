import { PlayerId, PlayerAttributes, PostMessage, UpdateMessage } from "../../../shared/Types";
import { $loadingScreen, Fight, stadium } from "./play.js";
import { displayPopup, $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { defPlayerDirections, defPlayerPositions } from "../data/settings.js";
import { attackSpritePathFromName, CharacterID, characterStats, charSpritePathFromId } from "../data/characters.js";
import { Player } from "./class/Player.js";

// @ts-expect-error
export const socket = io();

socket.on("getId", (playerId: PlayerId) => {
    displayPopup("En attente de l'adversaire...", false, false);

    Fight.thisPlayerId = playerId;
    Fight.oppPlayerId = playerId === 1 ? 2 : 1;
    const thisCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const thisScore = parseInt(localStorage.getItem("scoreThis") as string) as number;
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer: PlayerAttributes = {
        id: playerId, charId: thisCharacterId, charName: thisCharacter.name, color: thisCharacter.color, img: charSpritePathFromId(thisCharacterId), score: thisScore, rage: false, x: defPlayerPositions[playerId].x, y: defPlayerPositions[playerId].y, dir: defPlayerDirections[Fight.thisPlayerId], speed: thisCharacter.speed, hp: thisCharacter.hp, maxHp: thisCharacter.maxHp, healPow: thisCharacter.healPow, mana: thisCharacter.mana, maxMana: thisCharacter.maxMana, regenPow: thisCharacter.regenPow, strength: thisCharacter.strength, attackName: attackSpritePathFromName(thisCharacter.attackName), attackCost: thisCharacter.attackCost, attackSpeed: thisCharacter.attackSpeed, attacks: []
    }
    preloadImages(stadium, thisPlayer, null, () => {
        socket.emit("postPlayer", { player: thisPlayer, roomId: Fight.roomId, playerId } as PostMessage)
    });
})

socket.on("start", (msg: { 1: Player, 2: Player }) => {
    Fight.buildPlayers(msg[Fight.thisPlayerId], msg[Fight.oppPlayerId])
    const player1 = Fight.thisPlayer.id === 1 ? Fight.thisPlayer : Fight.oppPlayer;
    const player2 = Fight.thisPlayer.id === 2 ? Fight.thisPlayer : Fight.oppPlayer;

    $infosBar[1].score.innerText = player1.charName;
    $infosBar[1].score.innerText = player1.score.toString();
    $infosBar[2].score.innerText = player2.charName;
    $infosBar[2].score.innerText = player2.score.toString();

    showGameScreen($loadingScreen)
    Fight.attachKeyboardEvent();
    Fight.updateMovement();
    Fight.status = "playing";
    Fight.startTimer();
});

socket.on("update", (msg: UpdateMessage) => {
    Fight.updatePlayers(msg[Fight.thisPlayerId], msg[Fight.oppPlayerId])
    Fight.drawAll()
});

socket.on("over", (winningPlayerId: PlayerId) => {
    Fight.status = "over";
    Fight.stopTimer();
    if (winningPlayerId === Fight.thisPlayerId) localStorage.setItem("scoreThis", (Fight.thisPlayer.score + 1).toString());
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