import { defPlayerDirections, defPlayerPositions } from "../data/settings.js";
import { characterStats } from "../data/characters.js";
import { $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { $loadingScreen, Fight, stadium } from "./play.js";
import { Player } from "./class/Player.js";
export function soloGameSetup() {
    const thisScore = parseInt(localStorage.getItem("scoreThis"));
    const aiScore = parseInt(localStorage.getItem("scoreAi"));
    Fight.thisPlayerId = "A";
    const thisCharacterId = localStorage.getItem("characterId");
    const thisCharacter = characterStats[thisCharacterId];
    const thisPlayer = new Player("A", thisCharacterId, thisCharacter.name, thisCharacter.color, thisCharacter.img, thisScore, defPlayerPositions.A.x, defPlayerPositions.A.y, defPlayerDirections.A, thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healPow, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPow, thisCharacter.strength, thisCharacter.attackImg, thisCharacter.attackCost, thisCharacter.attackSpeed, []);
    const charactersIdList = Object.keys(characterStats).filter((id) => id !== thisCharacterId);
    const aiCharacterId = charactersIdList[Math.floor(Math.random() * charactersIdList.length)];
    const aiCharacter = characterStats[aiCharacterId];
    const aiPlayer = new Player("B", aiCharacterId, aiCharacter.name, aiCharacter.color, aiCharacter.img, aiScore, defPlayerPositions.B.x, defPlayerPositions.B.y, defPlayerDirections.B, aiCharacter.speed, aiCharacter.hp, aiCharacter.maxHp, aiCharacter.healPow, aiCharacter.mana, aiCharacter.maxMana, aiCharacter.regenPow, aiCharacter.strength, aiCharacter.attackImg, aiCharacter.attackCost, aiCharacter.attackSpeed, []);
    const aiLevel = localStorage.getItem("aiLevel");
    Fight.buildPlayers(thisPlayer, aiPlayer);
    $infosBar[1].character.innerText = thisPlayer.charName;
    $infosBar[1].score.innerText = thisScore.toString();
    $infosBar[2].character.innerText = aiPlayer.charName;
    $infosBar[2].score.innerText = aiScore.toString();
    preloadImages(thisPlayer, stadium, () => {
        preloadImages(aiPlayer, stadium, () => {
            showGameScreen($loadingScreen);
            Fight.soloGameRefresh();
            Fight.aiActionInterval(aiLevel);
        });
    });
    Fight.attachKeyboardEvent();
    Fight.updateMovement();
    Fight.status = "playing";
    Fight.startTimer();
}
