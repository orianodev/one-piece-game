"use strict";
const $dualModeToggle = document.querySelector("button.dual");
const $soloModeToggle = document.querySelector("button.solo");
const $dualModeSelection = document.querySelector("div.dual");
const $soloModeSelection = document.querySelector("div.solo");
let modeSelected = "dual";
function changeMode(mode) {
    if (mode === "solo") {
        modeSelected = "solo";
        $soloModeSelection.style.display = "block";
        $dualModeSelection.style.display = "none";
    }
    else if (mode === "dual") {
        mode = "dual";
        modeSelected = "dual";
        $dualModeSelection.style.display = "block";
        $soloModeSelection.style.display = "none";
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
const $roomId = document.querySelector("#room-id");
const previousRoomId = localStorage.getItem("roomId");
console.log(previousRoomId, localStorage);
if (previousRoomId)
    $roomId.value = previousRoomId;
const params = new URLSearchParams(document.location.search);
const idFromUrl = params.get("id");
if (idFromUrl)
    $roomId.value = idFromUrl;
$copyId.addEventListener("click", () => {
    const link = window.location.href + "?id=" + $roomId.value;
    navigator.clipboard.writeText(link);
    const $icon = document.querySelector("#copy-id > i");
    $icon === null || $icon === void 0 ? void 0 : $icon.setAttribute("class", "fas fa-check");
});
$randomId.addEventListener("click", () => {
    const generatedRoomId = Math.floor(Math.random() * 1000);
    $roomId.value = generatedRoomId.toString();
});
// VALIDATION AND REDIRECTION
const $aiLevelSelect = document.querySelector("select#ai-level");
const $stadiumSelect = document.querySelector("select#stadium");
const $validate = document.querySelector("#submit");
$validate.addEventListener("click", () => {
    const $selectedCharacter = document.querySelector('input[name="character"]:checked');
    if (!$roomId.value || !$selectedCharacter || !$selectedCharacter.value)
        return alert("Please fill in both the room ID and character selection.");
    if (!localStorage.getItem("score"))
        localStorage.setItem("score", "0");
    localStorage.setItem("mode", modeSelected);
    localStorage.setItem("roomId", $roomId.value);
    localStorage.setItem("characterId", $selectedCharacter.value);
    localStorage.setItem("aiLevel", $aiLevelSelect.value);
    localStorage.setItem("stadiumChoice", $stadiumSelect.value);
    window.location.href = "/play.html";
});
