import { CharacterID } from '../data/charactersInfos.js';
import { Mode } from '../Types.js';
import './generateCharactersList.js';
import './generateStadiumsList.js';

document.addEventListener('DOMContentLoaded', () => {
    const $dualModeToggle = document.querySelector("button.dual") as HTMLButtonElement;
    const $soloModeToggle = document.querySelector("button.solo") as HTMLButtonElement;
    const $dualModeMenu = document.querySelector("div.dual") as HTMLDivElement;
    const $soloModeMenu = document.querySelector("div.solo") as HTMLDivElement;

    // MODE SELECTION
    let modeSelected: Mode = "dual"

    function changeMode(mode: Mode) {
        if (mode === "solo") {
            modeSelected = "solo";
            $soloModeMenu.style.display = "block";
            $dualModeMenu.style.display = "none";
        } else if (mode === "dual") {
            mode = "dual";
            modeSelected = "dual";
            $dualModeMenu.style.display = "block";
            $soloModeMenu.style.display = "none";
        }
    }

    const previousMode: Mode = localStorage.getItem("mode") as Mode;
    if (previousMode) changeMode(previousMode)

    $soloModeToggle.addEventListener("click", () => changeMode("solo"));
    $dualModeToggle.addEventListener("click", () => changeMode("dual"));

    // ROOM ID GENERATION AND STORAGE
    const $randomId = document.querySelector("#random-id") as HTMLButtonElement;
    const $copyId = document.querySelector("#copy-id") as HTMLButtonElement;
    const $textId = document.querySelector("#text-id") as HTMLInputElement;

    const previousRoomId = localStorage.getItem("roomId");
    if (previousRoomId) $textId.value = previousRoomId;

    const params = new URLSearchParams(document.location.search);
    const idFromUrl = params.get("id");
    if (idFromUrl) {
        $textId.value = idFromUrl
        changeMode("dual")
    };

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

    // AI LEVEL SELECTION
    const $aiLvlSelect = document.querySelector("select#ai-level") as HTMLSelectElement;
    const previousAiLvl = localStorage.getItem("aiLevel");
    if (previousAiLvl) $aiLvlSelect.value = previousAiLvl;

    // PLAYER PRE-SELECTION
    const previousCharacterId: CharacterID = localStorage.getItem("characterId") as CharacterID
    const $previousCharacterRadio = document.querySelector(`input#${previousCharacterId}`) as HTMLInputElement;
    if (previousCharacterId) { $previousCharacterRadio.checked = true }

    // STADIUM SELECTION
    const $stadiumSelect = document.querySelector("select#stadium-list") as HTMLSelectElement;
    const previousStadium = localStorage.getItem("stadium");
    if (previousStadium) $stadiumSelect.value = previousStadium;

    // VALIDATION AND REDIRECTION
    const $validate = document.querySelector("#submit") as HTMLButtonElement;
    $validate.addEventListener("click", () => {
        const $selectedCharacterRadio = document.querySelector('input[name="character"]:checked') as HTMLInputElement;
        if (modeSelected === "dual" && !$textId.value) return alert("Choisis un identifiant de jeu.");
        if (!$selectedCharacterRadio) return alert("Choisis un personnage.");

        const $selectedCharacter: CharacterID | "random" = $selectedCharacterRadio.value as CharacterID | "random";
        const characterIDList: CharacterID[] = ["luffy", "zoro", "sanji", "ace", "jinbe", "law", "franky", "brook", "baggy", "chopper", "kuma", "nami", "robin", "sabo", "smoker", "usopp", "kid", "perona", "crocodile", "marco"]

        if ($selectedCharacter === "random") localStorage.setItem("characterId", characterIDList[Math.floor(Math.random() * characterIDList.length)] as CharacterID);
        else localStorage.setItem("characterId", $selectedCharacter);

        if (!localStorage.getItem("scoreThis")) localStorage.setItem("scoreThis", "0");
        if (!localStorage.getItem("scoreAi")) localStorage.setItem("scoreAi", "0");
        localStorage.setItem("mode", modeSelected);
        localStorage.setItem("roomId", $textId.value);
        localStorage.setItem("aiLevel", $aiLvlSelect.value);
        localStorage.setItem("stadium", $stadiumSelect.value);
        window.location.href = "/play";
    });
});