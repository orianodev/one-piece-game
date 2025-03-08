import { characterStats } from '../data/characters.js';
import './listCharacters.js';
import './listStadiums.js';
document.addEventListener('DOMContentLoaded', () => {
    const $dualModeToggle = document.querySelector("button.dual");
    const $soloModeToggle = document.querySelector("button.solo");
    const $dualModeMenu = document.querySelector("div.dual");
    const $soloModeMenu = document.querySelector("div.solo");
    let modeSelected = "dual";
    function changeMode(mode) {
        if (mode === "solo") {
            modeSelected = "solo";
            $soloModeMenu.style.display = "block";
            $dualModeMenu.style.display = "none";
        }
        else if (mode === "dual") {
            mode = "dual";
            modeSelected = "dual";
            $dualModeMenu.style.display = "block";
            $soloModeMenu.style.display = "none";
        }
    }
    const previousMode = localStorage.getItem("mode");
    if (previousMode)
        changeMode(previousMode);
    $soloModeToggle.addEventListener("click", () => changeMode("solo"));
    $dualModeToggle.addEventListener("click", () => changeMode("dual"));
    const $randomId = document.querySelector("#random-id");
    const $copyId = document.querySelector("#copy-id");
    const $textId = document.querySelector("#text-id");
    const previousRoomId = localStorage.getItem("roomId");
    if (previousRoomId)
        $textId.value = previousRoomId;
    const params = new URLSearchParams(document.location.search);
    const idFromUrl = params.get("id");
    if (idFromUrl) {
        $textId.value = idFromUrl;
        changeMode("dual");
    }
    ;
    $copyId.addEventListener("click", () => {
        const $icon = document.querySelector("#copy-id > img");
        const url = new URL(window.location.href);
        url.searchParams.set("id", $textId.value);
        navigator.clipboard.writeText(url.href)
            .then(() => $icon?.setAttribute("src", "/img/icon/check.svg"))
            .catch(err => console.error("Failed to copy URL:", err));
    });
    $randomId.addEventListener("click", () => {
        let generatedRoomId = Math.floor(Math.random() * 1_000);
        while (665 < generatedRoomId && generatedRoomId < 667) {
            generatedRoomId = Math.floor(Math.random() * 1_000);
        }
        $textId.value = generatedRoomId.toString();
    });
    const $botLvlSelect = document.querySelector("select#bot-level");
    const previousBotLvl = localStorage.getItem("botLevel");
    if (previousBotLvl)
        $botLvlSelect.value = previousBotLvl;
    const previousCharacterId = localStorage.getItem("characterId");
    const $previousCharacterRadio = document.querySelector(`input#${previousCharacterId}`);
    if (previousCharacterId) {
        $previousCharacterRadio.checked = true;
    }
    const $stadiumSelect = document.querySelector("select#stadium-list");
    const previousStadium = localStorage.getItem("stadium");
    if (previousStadium)
        $stadiumSelect.value = previousStadium;
    const $validate = document.querySelector("#submit");
    $validate.addEventListener("click", () => {
        const $selectedCharacterRadio = document.querySelector('input[name="character"]:checked');
        if (modeSelected === "dual" && !$textId.value)
            return alert("Choisis un identifiant de jeu.");
        if (!$selectedCharacterRadio)
            return alert("Choisis un personnage.");
        const $selectedCharacter = $selectedCharacterRadio.value;
        const characterIDList = Object.keys(characterStats);
        if ($selectedCharacter === "random")
            localStorage.setItem("characterId", characterIDList[Math.floor(Math.random() * characterIDList.length)]);
        else
            localStorage.setItem("characterId", $selectedCharacter);
        if (!localStorage.getItem("scoreThis"))
            localStorage.setItem("scoreThis", "0");
        if (!localStorage.getItem("scoreBot"))
            localStorage.setItem("scoreBot", "0");
        localStorage.setItem("mode", modeSelected);
        localStorage.setItem("roomId", $textId.value);
        localStorage.setItem("botLevel", $botLvlSelect.value);
        localStorage.setItem("stadium", $stadiumSelect.value);
        window.location.href = "/play";
    });
});
