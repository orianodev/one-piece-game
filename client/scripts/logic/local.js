import { defPlayerDirections, defPlayerPositions } from "../data/settings.js";
import { attackSpritePathFromName, characterStats, charSpritePathFromId } from "../data/characters.js";
import { $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { $loadingScreen, Fight, stadium } from "./play.js";
import { Player } from "./class/Player.js";
export function soloGameSetup() {
    const thisScore = parseInt(localStorage.getItem("scoreThis"));
    const botScore = parseInt(localStorage.getItem("scoreBot"));
    Fight.thisPlayerId = "A";
    const thisCharacterId = localStorage.getItem("characterId");
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer = new Player("A", thisCharacterId, thisCharacter.name, thisCharacter.color, charSpritePathFromId(thisCharacter.id), thisScore, defPlayerPositions.A.x, defPlayerPositions.A.y, defPlayerDirections.A, thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healPow, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPow, thisCharacter.strength, attackSpritePathFromName(thisCharacter.attackName), thisCharacter.attackCost, thisCharacter.attackSpeed, []);
    const charactersIdList = Object.keys(characterStats).filter((id) => id !== thisCharacterId);
    const botCharacterId = charactersIdList[Math.floor(Math.random() * charactersIdList.length)];
    const botCharacter = characterStats[botCharacterId];
    const botPlayer = new Player("B", botCharacterId, botCharacter.name, botCharacter.color, charSpritePathFromId(botCharacter.id), botScore, defPlayerPositions.B.x, defPlayerPositions.B.y, defPlayerDirections.B, botCharacter.speed, botCharacter.hp, botCharacter.maxHp, botCharacter.healPow, botCharacter.mana, botCharacter.maxMana, botCharacter.regenPow, botCharacter.strength, attackSpritePathFromName(botCharacter.attackName), botCharacter.attackCost, botCharacter.attackSpeed, []);
    const botLevel = localStorage.getItem("botLevel");
    Fight.buildPlayers(thisPlayer, botPlayer);
    $infosBar[1].character.innerText = thisPlayer.charName;
    $infosBar[1].score.innerText = thisScore.toString();
    $infosBar[2].character.innerText = botPlayer.charName;
    $infosBar[2].score.innerText = botScore.toString();
    preloadImages(stadium, thisPlayer, botPlayer, () => {
        showGameScreen($loadingScreen);
        Fight.botActionInterval(botLevel);
        Fight.attachKeyboardEvent();
        Fight.updateMovement();
        Fight.status = "playing";
        Fight.startTimer();
    });
}
