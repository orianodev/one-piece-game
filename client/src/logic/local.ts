import { OneCharacterStats, BotLevel } from "../../../shared/Types";
import { defDir, defPosition } from "../data/settings.js";
import { CharacterID, characterStats } from "../data/characters.js";
import { $infosBar, preloadImages, showGameScreen } from "./ui.js";
import { $loadingScreen, Fight, stadium } from "./play.js";
import { Player } from "./class/Player.js";

export function soloGameSetup() {
    // Create self player
    Fight.selfId = "p1";
    const selfCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID;
    const selfScore = parseInt(localStorage.getItem("scoreThis") as string);
    const selfCharacter: OneCharacterStats = characterStats[selfCharacterId];
    const selfPosition = defPosition(Fight.selfId, selfCharacter.width, selfCharacter.height);

    Fight.self = new Player(Fight.selfId, selfScore, selfCharacterId, selfCharacter.name, selfCharacter.color, Fight.createImage(selfCharacter.id, selfCharacter.width, selfCharacter.height, "normal"), Fight.createImage(selfCharacter.id, selfCharacter.width, selfCharacter.height, "rage"), selfCharacter.width, selfCharacter.height, selfPosition.x, selfPosition.y, selfPosition.x, selfPosition.y, defDir[Fight.selfId], selfCharacter.speed, selfCharacter.hp, selfCharacter.maxHp, selfCharacter.healPow, selfCharacter.mana, selfCharacter.maxMana, selfCharacter.regenPow, selfCharacter.strength, selfCharacter.attackName, Fight.createImage(selfCharacter.attackName, selfCharacter.attackWidth, selfCharacter.attackHeight, "attack"), selfCharacter.attackWidth, selfCharacter.attackHeight, selfCharacter.attackCost, selfCharacter.attackSpeed, []);

    // Create bot player
    Fight.enemyId = "p2";
    const botCharChoices: CharacterID[] = Object.keys(characterStats).filter((id) => id !== selfCharacterId) as CharacterID[];
    const botCharacterId: CharacterID = botCharChoices[Math.floor(Math.random() * botCharChoices.length)] as CharacterID;
    const botScore = parseInt(localStorage.getItem("scoreBot") as string);
    const botCharacter: OneCharacterStats = characterStats[botCharacterId];
    const botPosition = defPosition(Fight.enemyId, botCharacter.width, botCharacter.height);

    Fight.enemy = new Player(Fight.enemyId, botScore, botCharacter.id, botCharacter.name, botCharacter.color, Fight.createImage(botCharacter.id, botCharacter.width, botCharacter.height, "normal"), Fight.createImage(botCharacter.id, botCharacter.width, botCharacter.height, "rage"), botCharacter.width, botCharacter.height, botPosition.x, botPosition.y, botPosition.x, botPosition.y, defDir[Fight.enemyId], botCharacter.speed, botCharacter.hp, botCharacter.maxHp, botCharacter.healPow, botCharacter.mana, botCharacter.maxMana, botCharacter.regenPow, botCharacter.strength, botCharacter.attackName, Fight.createImage(botCharacter.attackName, botCharacter.attackWidth, botCharacter.attackHeight, "attack"), botCharacter.attackWidth, botCharacter.attackHeight, botCharacter.attackCost, botCharacter.attackSpeed, []);
    const botLevel: BotLevel = localStorage.getItem("botLevel") as BotLevel;

    // Build the UI
    $infosBar.p1.character.innerText = Fight.self.charName;
    $infosBar.p1.score.innerText = selfScore.toString();
    $infosBar.p2.character.innerText = Fight.enemy.charName;
    $infosBar.p2.score.innerText = botScore.toString();

    // Load the fight
    preloadImages(stadium, Fight.self, Fight.enemy, () => {
        showGameScreen($loadingScreen)
        Fight.startBotActionLoop(botLevel)
        Fight.attachKeyboardEvent();
        Fight.updateMovement();
        Fight.status = "playing";
        Fight.startTimer();
    });
}