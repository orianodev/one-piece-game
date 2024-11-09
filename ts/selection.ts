
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
if (idFromUrl) $textId.value = idFromUrl;

$copyId.addEventListener("click", () => {
    const link = window.location.href + "?id=" + $textId.value;
    navigator.clipboard.writeText(link);
    const $icon = document.querySelector("#copy-id > i");
    $icon?.setAttribute("class", "fas fa-check");
})

$randomId.addEventListener("click", () => {
    const generatedRoomId = Math.floor(Math.random() * 1_000);
    $textId.value = generatedRoomId.toString();
});

// AI LEVEL SELECTION
const $aiLvlSelect = document.querySelector("select#ai-level") as HTMLSelectElement;
const previousAiLvl = localStorage.getItem("aiLevel");
if (previousAiLvl) $aiLvlSelect.value = previousAiLvl;

// STADIUM SELECTION
const $stadiumSelect = document.querySelector("select#stadium") as HTMLSelectElement;
const previousStadium = localStorage.getItem("stadium");
if (previousStadium) $stadiumSelect.value = previousStadium;

// VALIDATION AND REDIRECTION
const $validate = document.querySelector("#submit") as HTMLButtonElement;
$validate.addEventListener("click", () => {
    const $selectedCharacter = document.querySelector('input[name="character"]:checked') as HTMLInputElement;
    if (!$textId.value || !$selectedCharacter || !$selectedCharacter.value) return alert("Please fill in both the room ID and character selection.");
    if (!localStorage.getItem("score")) localStorage.setItem("score", "0");
    localStorage.setItem("mode", modeSelected);
    localStorage.setItem("roomId", $textId.value);
    localStorage.setItem("characterId", $selectedCharacter.value);
    localStorage.setItem("aiLevel", $aiLvlSelect.value);
    localStorage.setItem("stadium", $stadiumSelect.value);
    window.location.href = "/play.html";
});