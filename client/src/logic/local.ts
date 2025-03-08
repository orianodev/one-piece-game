import { OneCharacterStats, BotLevel } from "../../../shared/Types";
import { defPlayerDirections, defPlayerPositions } from "../data/settings.js";
import { attackSpritePathFromName as attackSpritePath, CharacterID, characterStats, charSpritePathFromId as charSpritePath } from "../data/characters.js";
import { $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { $loadingScreen, Fight, stadium } from "./play.js";
import { Player } from "./class/Player.js";

export function soloGameSetup() {
    // Create player
    Fight.thisPlayerId = 1;
    const thisCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const thisScore = parseInt(localStorage.getItem("scoreThis") as string);
    const thisCharacter: OneCharacterStats = characterStats[thisCharacterId];
    const thisPlayer = new Player(1, thisCharacterId, thisCharacter.name, thisCharacter.color, charSpritePath(thisCharacter.id), thisScore, defPlayerPositions[1].x, defPlayerPositions[1].y, defPlayerDirections[1], thisCharacter.speed, thisCharacter.hp, thisCharacter.maxHp, thisCharacter.healPow, thisCharacter.mana, thisCharacter.maxMana, thisCharacter.regenPow, thisCharacter.strength, attackSpritePath(thisCharacter.attackName), thisCharacter.attackCost, thisCharacter.attackSpeed, []);

    // Create bot
    Fight.oppPlayerId = 2;
    const botCharChoices: CharacterID[] = Object.keys(characterStats).filter((id) => id !== thisCharacterId) as CharacterID[];
    const botCharacterId: CharacterID = botCharChoices[Math.floor(Math.random() * botCharChoices.length)] as CharacterID;
    const botScore = parseInt(localStorage.getItem("scoreBot") as string);
    const botCharacter: OneCharacterStats = characterStats[botCharacterId];
    const botPlayer = new Player(2, botCharacterId, botCharacter.name, botCharacter.color, charSpritePath(botCharacter.id), botScore, defPlayerPositions[2].x, defPlayerPositions[2].y, defPlayerDirections[2], botCharacter.speed, botCharacter.hp, botCharacter.maxHp, botCharacter.healPow, botCharacter.mana, botCharacter.maxMana, botCharacter.regenPow, botCharacter.strength, attackSpritePath(botCharacter.attackName), botCharacter.attackCost, botCharacter.attackSpeed, []);
    const botLevel: BotLevel = localStorage.getItem("botLevel") as BotLevel;

    // Build players
    Fight.buildPlayers(thisPlayer, botPlayer);
    $infosBar[1].character.innerText = thisPlayer.charName;
    $infosBar[1].score.innerText = thisScore.toString();
    $infosBar[2].character.innerText = botPlayer.charName;
    $infosBar[2].score.innerText = botScore.toString();

    // Load the fight
    preloadImages(stadium, thisPlayer, botPlayer, () => {
        showGameScreen($loadingScreen)
        Fight.startBotActionLoop(botLevel)
        Fight.attachKeyboardEvent();
        Fight.updateMovement();
        Fight.status = "playing";
        Fight.startTimer();
    });
}