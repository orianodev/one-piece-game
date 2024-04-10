"use strict";
// Attach 2 PNG to DOM
const body = document.querySelector('body');
const luffy = document.createElement("img");
const zoro = document.createElement("img");
luffy.style.height = "50px";
zoro.style.height = "50px";
luffy.src = "images/luffy.png";
zoro.src = "images/zoro.png";
body === null || body === void 0 ? void 0 : body.appendChild(luffy);
body === null || body === void 0 ? void 0 : body.appendChild(zoro);
// Create Player class for each player
class Player {
    constructor(name, hp) {
        this.name = name;
        this.hp = hp;
    }
}
// Remove 1 HP every second
