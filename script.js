"use strict";
// @ts-ignore
const socket = io();
let player;
let aVal = 0;
let bVal = 0;
const aValText = document.querySelector("#A");
const showPlayer = document.querySelector("#showPlayer");
const bValText = document.querySelector("#B");
const joinBtn = document.querySelector("#join");
const incBtn = document.querySelector("#inc");
const pickA = document.querySelector("#pickA");
const pickB = document.querySelector("#pickB");
joinBtn.addEventListener("click", (e) => {
    socket.emit("joinRoom", "room1");
});
incBtn.addEventListener("click", (e) => {
    console.log(player, aVal, bVal);
    if (player == "A") {
        console.log("Emit inc for :", player);
        socket.emit("inc", { A: aVal + 1, B: bVal });
    }
    else if (player == "B") {
        console.log("Emit inc for :", player);
        socket.emit("inc", { A: aVal, B: bVal + 1 });
    }
});
pickA.addEventListener("click", (e) => {
    player = "A";
    showPlayer.innerText = player;
});
pickB.addEventListener("click", (e) => {
    player = "B";
    showPlayer.innerText = player;
});
socket.on("inc", (msg) => {
    aVal = msg.A;
    aValText.innerText = aVal.toString();
    bVal = msg.B;
    bValText.innerText = bVal.toString();
});
