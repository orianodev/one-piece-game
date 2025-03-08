import { defPlayerDirections, defPlayerPositions } from "../data/settings.js";
import { attackSpritePathFromName as attackSpritePath, characterStats, charSpritePathFromId as charSpritePath } from "../data/characters.js";
import { $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { $loadingScreen, Fight, stadium } from "./play.js";
import { Player } from "./class/Player.js";
export function soloGameSetup() {
    Fight.thisPlayerId = 1;
    const thisCharacterId = localStorage.getItem("characterId");
    const thisScore = parseInt(localStorage.getItem("scoreThis"));
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer = new Player(1, thisCharacterId, thisCharacter.name, thisCharacter.color, charSpritePath(thisCharacter.id), thisScore, defPlayerPositions[1].x, defPlayerPositions[1].y, defPlayerDirections[1], thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healPow, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPow, thisCharacter.strength, attackSpritePath(thisCharacter.attackName), thisCharacter.attackCost, thisCharacter.attackSpeed, []);
    Fight.oppPlayerId = 2;
    const botCharChoices = Object.keys(characterStats).filter((id) => id !== thisCharacterId);
    const botCharacterId = botCharChoices[Math.floor(Math.random() * botCharChoices.length)];
    const botScore = parseInt(localStorage.getItem("scoreBot"));
    const botCharacter = characterStats[botCharacterId];
    const botPlayer = new Player(2, botCharacterId, botCharacter.name, botCharacter.color, charSpritePath(botCharacter.id), botScore, defPlayerPositions[2].x, defPlayerPositions[2].y, defPlayerDirections[2], botCharacter.speed, botCharacter.hp, botCharacter.maxHp, botCharacter.healPow, botCharacter.mana, botCharacter.maxMana, botCharacter.regenPow, botCharacter.strength, attackSpritePath(botCharacter.attackName), botCharacter.attackCost, botCharacter.attackSpeed, []);
    const botLevel = localStorage.getItem("botLevel");
    Fight.buildPlayers(thisPlayer, botPlayer);
    $infosBar[1].character.innerText = thisPlayer.charName;
    $infosBar[1].score.innerText = thisScore.toString();
    $infosBar[2].character.innerText = botPlayer.charName;
    $infosBar[2].score.innerText = botScore.toString();
    preloadImages(stadium, thisPlayer, botPlayer, () => {
        showGameScreen($loadingScreen);
        Fight.startBotActionLoop(botLevel);
        Fight.attachKeyboardEvent();
        Fight.updateMovement();
        Fight.status = "playing";
        Fight.startTimer();
    });
}
