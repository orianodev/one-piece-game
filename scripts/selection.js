"use strict";
const randomId = document.querySelector("#random-id");
const roomId = document.querySelector("#room-id");
const joinRoom = document.querySelector("#submit");
randomId.addEventListener("click", () => {
    const generatedRoomId = Math.floor(Math.random() * 1000);
    roomId.value = generatedRoomId.toString();
});
joinRoom.addEventListener("click", () => {
    const selectedCharacter = document.querySelector('input[name="select-character"]:checked');
    if (!roomId.value || !selectedCharacter.value)
        return alert("Please fill in both the room ID and character selection.");
    if (!localStorage.getItem("score"))
        localStorage.setItem("score", "0");
    localStorage.setItem("roomID", roomId.value);
    localStorage.setItem("characterID", selectedCharacter.value);
    window.location.href = "/play.html";
});
