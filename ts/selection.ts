
const randomId = document.querySelector("#random-id") as HTMLButtonElement;
const roomId = document.querySelector("#room-id") as HTMLInputElement;
const joinRoom = document.querySelector("#submit") as HTMLButtonElement;

randomId.addEventListener("click", () => {
    const generatedRoomId = Math.floor(Math.random() * 1_000);
    roomId.value = generatedRoomId.toString();
});

joinRoom.addEventListener("click", () => {
    const selectedCharacter = document.querySelector('input[name="select-character"]:checked') as HTMLInputElement;
    if (!roomId.value || !selectedCharacter.value) return alert("Please fill in both the room ID and character selection.");
    if (!localStorage.getItem("score")) localStorage.setItem("score", "0");
    localStorage.setItem("roomID", roomId.value);
    localStorage.setItem("characterID", selectedCharacter.value);
    window.location.href = "/play.html";
});