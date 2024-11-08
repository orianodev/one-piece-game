"use strict";
const $dualModeToggle = document.querySelector("button.dual");
const $soloModeToggle = document.querySelector("button.solo");
const $dualModeMenu = document.querySelector("div.dual");
const $soloModeMenu = document.querySelector("div.solo");
// MODE SELECTION
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
// ROOM ID GENERATION AND STORAGE
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
    const link = window.location.href + "?id=" + $textId.value;
    navigator.clipboard.writeText(link);
    const $icon = document.querySelector("#copy-id > i");
    $icon === null || $icon === void 0 ? void 0 : $icon.setAttribute("class", "fas fa-check");
});
$randomId.addEventListener("click", () => {
    const generatedRoomId = Math.floor(Math.random() * 1000);
    $textId.value = generatedRoomId.toString();
});
// VALIDATION AND REDIRECTION
const $aiLvlSelect = document.querySelector("select#ai-level");
const $stadiumSelect = document.querySelector("select#stadium");
const $validate = document.querySelector("#submit");
$validate.addEventListener("click", () => {
    const $selectedCharacter = document.querySelector('input[name="character"]:checked');
    if (!$textId.value || !$selectedCharacter || !$selectedCharacter.value)
        return alert("Please fill in both the room ID and character selection.");
    if (!localStorage.getItem("score"))
        localStorage.setItem("score", "0");
    localStorage.setItem("mode", modeSelected);
    localStorage.setItem("roomId", $textId.value);
    localStorage.setItem("characterId", $selectedCharacter.value);
    localStorage.setItem("aiLevel", $aiLvlSelect.value);
    localStorage.setItem("stadiumChoice", $stadiumSelect.value);
    window.location.href = "/play.html";
});
