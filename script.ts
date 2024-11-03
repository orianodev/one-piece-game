// @ts-ignore
const socket = io();

let player: string;
let aVal = 0;
let bVal = 0;

const aValText = document.querySelector("#A") as HTMLSpanElement;
const showPlayer = document.querySelector("#showPlayer") as HTMLSpanElement;
const bValText = document.querySelector("#B") as HTMLSpanElement;
const joinBtn = document.querySelector("#join") as HTMLButtonElement;
const incBtn = document.querySelector("#inc") as HTMLButtonElement;
const pickA = document.querySelector("#pickA") as HTMLButtonElement;
const pickB = document.querySelector("#pickB") as HTMLButtonElement;

joinBtn.addEventListener("click", (e) => {
    socket.emit("joinRoom", "room1");
});

incBtn.addEventListener("click", (e) => {
    console.log(player, aVal, bVal);
    if (player == "A") {
        console.log("Emit inc for :", player);
        socket.emit("inc", { A: aVal + 1, B: bVal });
    } else if (player == "B") {
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

socket.on("inc", (msg: { A: number, B: number }) => {
    aVal = msg.A;
    aValText.innerText = aVal.toString();
    bVal = msg.B;
    bValText.innerText = bVal.toString();
});