"use strict";
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
if (idFromUrl)
    $textId.value = idFromUrl;
$copyId.addEventListener("click", () => {
    const $icon = document.querySelector("#copy-id > img");
    const url = new URL(window.location.href);
    url.searchParams.set("id", $textId.value);
    navigator.clipboard.writeText(url.href)
        .then(() => $icon === null || $icon === void 0 ? void 0 : $icon.setAttribute("src", "/img/icon/check.svg"))
        .catch(err => console.error("Failed to copy URL:", err));
});
$randomId.addEventListener("click", () => {
    let generatedRoomId = Math.floor(Math.random() * 1000);
    if (generatedRoomId > 665 && generatedRoomId < 667)
        generatedRoomId = Math.floor(Math.random() * 1000);
    $textId.value = generatedRoomId.toString();
});
const $aiLvlSelect = document.querySelector("select#ai-level");
const previousAiLvl = localStorage.getItem("aiLevel");
if (previousAiLvl)
    $aiLvlSelect.value = previousAiLvl;
const $stadiumSelect = document.querySelector("select#stadium");
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
    const characterIDList = ["luffy", "zoro", "sanji", "ace", "jinbe", "law", "franky", "brook", "baggy", "chopper", "kuma", "nami", "robin", "sabo", "smoker", "usopp", "kid", "perona", "crocodile", "marco"];
    if ($selectedCharacter === "random")
        localStorage.setItem("characterId", characterIDList[Math.floor(Math.random() * characterIDList.length)]);
    else
        localStorage.setItem("characterId", $selectedCharacter);
    if (!localStorage.getItem("score"))
        localStorage.setItem("score", "0");
    localStorage.setItem("mode", modeSelected);
    localStorage.setItem("roomId", $textId.value);
    localStorage.setItem("aiLevel", $aiLvlSelect.value);
    localStorage.setItem("stadium", $stadiumSelect.value);
    window.location.href = "/play";
});
