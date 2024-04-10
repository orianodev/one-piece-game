// Attach 2 PNG to DOM
const body = document.querySelector('body');
const luffy = document.createElement("img")
const zoro = document.createElement("img")
luffy.style.height = "50px"
zoro.style.height = "50px"
luffy.src = "images/luffy.png"
zoro.src = "images/zoro.png"
body?.appendChild(luffy)
body?.appendChild(zoro)
// Create Player class for each player
class Player {
    public name: string
    public hp: number
    constructor(name: string, hp: number) {
        this.name = name;
        this.hp = hp;
    }
}
// Remove 1 HP every second