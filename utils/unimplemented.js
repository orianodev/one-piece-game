"AI Action without diagonale directions"
// if (aiChoice === "move") {
//     if (this.oppPlayer.x < this.thisPlayer.x - def.playW / 3) {
//         this.oppPlayer.moveRight();
//         this.oppPlayer.moveRight();
//         break;
//     } else if (this.oppPlayer.x > this.thisPlayer.x + def.playW / 3) {
//         this.oppPlayer.moveLeft();
//         this.oppPlayer.moveLeft();
//         break;
//     } else if (this.oppPlayer.y < this.thisPlayer.y - def.playW / 3) {
//         this.oppPlayer.moveDown();
//         this.oppPlayer.moveDown();
//         break;
//     } else if (this.oppPlayer.y > this.thisPlayer.y + def.playH / 3) {
//         this.oppPlayer.moveUp();
//         this.oppPlayer.moveUp();
//         break;
//     }

"Mobile controls JS"
// MOBILE CONTROLS
// if (localStorage.getItem("hideMobileControls") !== "true" && (window.innerWidth <= 768 || 'ontouchstart' in window || /Mobi|Android/i.test(navigator.userAgent))) {
//     const mobileControlsLeft = document.querySelector('#mobile-controls-left') as HTMLDivElement;
//     const mobileControlsRight = document.querySelector('#mobile-controls-right') as HTMLDivElement;
//     mobileControlsLeft.style.display = 'block';
//     mobileControlsRight.style.display = 'block';

//     const $up = document.querySelector("#up") as HTMLButtonElement;
//     const $down = document.querySelector("#down") as HTMLButtonElement;
//     const $right = document.querySelector("#right") as HTMLButtonElement;
//     const $left = document.querySelector("#left") as HTMLButtonElement;
//     const $atk = document.querySelector("#atk") as HTMLButtonElement;
//     const $heal = document.querySelector("#heal") as HTMLButtonElement;
//     const $regen = document.querySelector("#regen") as HTMLButtonElement;
//     const $super = document.querySelector("#super") as HTMLButtonElement;

//     $up.addEventListener("click", () => _F.thisPlayer.moveUp());
//     $down.addEventListener("click", () => _F.thisPlayer.moveDown());
//     $right.addEventListener("click", () => _F.thisPlayer.moveRight());
//     $left.addEventListener("click", () => _F.thisPlayer.moveLeft());
//     $atk.addEventListener("click", () => _F.thisPlayer.atk());
//     $heal.addEventListener("click", () => _F.thisPlayer.heal());
//     $regen.addEventListener("click", () => _F.thisPlayer.regen());
//     $super.addEventListener("click", () => _F.thisPlayer.superAtk());
// }

"Keyboard controls without diagonales and rAF"
// document.addEventListener("keydown", (event: KeyboardEvent) => {
//     switch (event.key) {
//         case "ArrowUp":
//             _F.thisPlayer.moveUp();
//             break;
//         case "ArrowDown":
//             _F.thisPlayer.moveDown();
//             break;
//         case "ArrowRight":
//             _F.thisPlayer.moveRight();
//             break;
//         case "ArrowLeft":
//             _F.thisPlayer.moveLeft();
//             break;
//         case "z":
//             _F.thisPlayer.atk();
//             break;
//         case "d":
//             _F.thisPlayer.heal();
//             break;
//         case "q":
//             _F.thisPlayer.regen();
//             break;
//         case "s":
//             _F.thisPlayer.superAtk();
//             break;
//         case " ":
//             _F.thisPlayer.rage();
//             break;
//     }
// });