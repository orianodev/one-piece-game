import { OneCharacterStats, BotLevel } from "../../../shared/Types";
import { defPlayerDirections, defPlayerPositions } from "../data/settings.js";
import { attackSpritePathFromName, CharacterID, characterStats, charSpritePathFromId } from "../data/characters.js";
import { $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { $loadingScreen, Fight, stadium } from "./play.js";
import { Player } from "./class/Player.js";

export function soloGameSetup() {
    const thisScore = parseInt(localStorage.getItem("scoreThis") as string) as number;
    const botScore = parseInt(localStorage.getItem("scoreBot") as string) as number;
    Fight.thisPlayerId = "A";

    const thisCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const thisCharacter: OneCharacterStats = characterStats[thisCharacterId];
    const thisPlayer = new Player("A", thisCharacterId, thisCharacter.name, thisCharacter.color, charSpritePathFromId(thisCharacter.id), thisScore, defPlayerPositions.A.x, defPlayerPositions.A.y, defPlayerDirections.A, thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healPow, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPow, thisCharacter.strength, attackSpritePathFromName(thisCharacter.attackName), thisCharacter.attackCost, thisCharacter.attackSpeed, []);

    const charactersIdList: CharacterID[] = Object.keys(characterStats).filter((id) => id !== thisCharacterId) as CharacterID[];

    const botCharacterId: CharacterID = charactersIdList[Math.floor(Math.random() * charactersIdList.length)] as CharacterID;
    const botCharacter: OneCharacterStats = characterStats[botCharacterId];
    const botPlayer = new Player("B", botCharacterId, botCharacter.name, botCharacter.color, charSpritePathFromId(botCharacter.id), botScore, defPlayerPositions.B.x, defPlayerPositions.B.y, defPlayerDirections.B, botCharacter.speed, botCharacter.hp, botCharacter.maxHp, botCharacter.healPow, botCharacter.mana, botCharacter.maxMana, botCharacter.regenPow, botCharacter.strength, attackSpritePathFromName(botCharacter.attackName), botCharacter.attackCost, botCharacter.attackSpeed, []);

    const botLevel: BotLevel = localStorage.getItem("botLevel") as BotLevel;
    Fight.buildPlayers(thisPlayer, botPlayer);

    $infosBar[1].character.innerText = thisPlayer.charName;
    $infosBar[1].score.innerText = thisScore.toString();
    $infosBar[2].character.innerText = botPlayer.charName;
    $infosBar[2].score.innerText = botScore.toString();
    preloadImages(stadium, thisPlayer, botPlayer, () => {
        showGameScreen($loadingScreen)
        Fight.botActionInterval(botLevel)
        Fight.attachKeyboardEvent();
        Fight.updateMovement();
        Fight.status = "playing";
        Fight.startTimer();
    });
}