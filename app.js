"use strict";
// Canvas API
const canvas = document.querySelector("#screen_canvas");
const ctx = canvas.getContext("2d");
ctx.shadowBlur = 30;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;
const players = {
  luffy: {
    name: "Monkey D. Luffy",
    spriteImage: "images/players/luffy.png",
    shadowColor: "red",
    step: canvas.height / 11,
    hp: 250,
    healingSpeed: 2.5,
    mana: 70,
    manaCost: 100,
    manaSpeed: 1,
    attackStrength: 10,
    attackSpeed: 3,
    attackSound: "#swooshMp3",
    attackSprite: "images/attacks/punch.png",
    specialAttackStrength: 35,
    specialAttackSpeed: 10,
    specialAttackSound: "#luffySpeMp3",
    specialAttackSprite: "images/special/luffy.gif",
    victorySound: "#luffyWinMp3",
  },
  ace: {
    name: "Portgas D. Ace",
    spriteImage: "images/players/ace.png",
    shadowColor: "orange",
    step: canvas.height / 12,
    hp: 270,
    healingSpeed: 2,
    mana: 50,
    manaCost: 125,
    manaSpeed: 1,
    attackStrength: 15,
    attackSpeed: 2,
    attackSound: "#fireballMp3",
    attackSprite: "images/attacks/fireball.png",
    specialAttackStrength: 50,
    specialAttackSpeed: 5,
    specialAttackSound: "#aceSpeMp3",
    specialAttackSprite: "images/special/ace.gif",
    victorySound: "#aceWinMp3",
  },
  zoro: {
    name: "Roronoa Zoro",
    spriteImage: "images/players/zoro.png",
    shadowColor: "green",
    step: canvas.height / 13,
    hp: 300,
    healingSpeed: 2,
    mana: 60,
    manaCost: 110,
    manaSpeed: 1.2,
    attackStrength: 12,
    attackSpeed: 2.7,
    attackSound: "#slashMp3",
    attackSprite: "images/attacks/slash.png",
    specialAttackStrength: 40,
    specialAttackSpeed: 7,
    specialAttackSound: "#zoroSpeMp3",
    specialAttackSprite: "images/special/zoro.gif",
    victorySound: "#zoroWinMp3",
  },
  franky: {
    name: "Fanky, Cuty Flam",
    spriteImage: "images/players/franky.png",
    shadowColor: "blue",
    step: canvas.height / 12,
    hp: 240,
    healingSpeed: 2.1,
    mana: 110,
    manaCost: 90,
    manaSpeed: 1.1,
    attackStrength: 11,
    attackSpeed: 3.1,
    attackSound: "#cannonballMp3",
    attackSprite: "images/attacks/cannonball.png",
    specialAttackStrength: 40,
    specialAttackSpeed: 8,
    specialAttackSound: "#frankySpeMp3",
    specialAttackSprite: "images/special/franky.gif",
    victorySound: "#frankyWinMp3",
  },
  sanji: {
    name: "Vinsmoke Sanji",
    spriteImage: "images/players/sanji.png",
    shadowColor: "yellow",
    step: canvas.height / 12,
    hp: 250,
    healingSpeed: 2,
    mana: 100,
    manaCost: 80,
    manaSpeed: 1,
    attackStrength: 12,
    attackSpeed: 3.4,
    attackSound: "#swooshMp3",
    attackSprite: "images/attacks/slash.png",
    specialAttackStrength: 37,
    specialAttackSpeed: 9,
    specialAttackSound: "#sanjiSpeMp3",
    specialAttackSprite: "images/special/sanji.gif",
    victorySound: "#sanjiWinMp3",
  },
  brook: {
    name: "Brook",
    spriteImage: "images/players/brook.png",
    shadowColor: "black",
    step: canvas.height / 10,
    hp: 280,
    healingSpeed: 1.5,
    mana: 90,
    manaCost: 85,
    manaSpeed: 1,
    attackStrength: 9,
    attackSpeed: 3.8,
    attackSound: "#swooshMp3",
    attackSprite: "images/attacks/music.png",
    specialAttackStrength: 30,
    specialAttackSpeed: 9.5,
    specialAttackSound: "#brookSpeMp3",
    specialAttackSprite: "images/special/brook.gif",
    victorySound: "#brookWinMp3",
  },
  law: {
    name: "Trafalgar Law",
    spriteImage: "images/players/law.png",
    shadowColor: "brown",
    step: canvas.height / 9,
    hp: 220,
    healingSpeed: 3,
    mana: 95,
    manaCost: 110,
    manaSpeed: 1.3,
    attackStrength: 5,
    attackSpeed: 5,
    attackSound: "#swooshMp3",
    attackSprite: "images/attacks/slash.png",
    specialAttackStrength: 25,
    specialAttackSpeed: 12,
    specialAttackSound: "#lawSpeMp3",
    specialAttackSprite: "images/special/law.gif",
    victorySound: "#lawWinMp3",
  },
  jinbe: {
    name: "Jinbe",
    spriteImage: "images/players/jinbe.png",
    shadowColor: "cyan",
    step: canvas.height / 14,
    hp: 250,
    healingSpeed: 1.5,
    mana: 100,
    manaCost: 110,
    manaSpeed: 1,
    attackStrength: 12,
    attackSpeed: 3,
    attackSound: "#waveMp3",
    attackSprite: "images/attacks/wave.png",
    specialAttackStrength: 40,
    specialAttackSpeed: 9,
    specialAttackSound: "#jinbeSpeMp3",
    specialAttackSprite: "images/special/jinbe.gif",
    victorySound: "#jinbeWinMp3",
  },
};
const settings = {
  playerHeight: canvas.height / 2.5,
  playerWidth: canvas.width / 9,
  collisionMargin: 15,
  playerSizeVariation: 20,
  attackSpriteHeight: canvas.height / 10,
  attackSpriteWidth: canvas.height / 10,
  maxHp: 350,
  maxMana: 150,
  healingTime: 150,
  simpleAttackDelay: 150,
  specialAttackDelay: 1500,
  specialAttackAudioDelay: 1500,
  player1DefaultPosition: { x: 0, y: 0 },
  player2DefaultPosition: { x: canvas.width - canvas.width / 9, y: 0 },
  refreshRate: 10,
  aiPlayRate: 100,
  step: canvas.height / 10,
};
const background_url = {
  loguetown: "images/wallpapers/loguetown.webp",
  enies_lobby: "images/wallpapers/enies_lobby.webp",
  thriller_bark: "images/wallpapers/thriller_bark.webp",
  sabaody: "images/wallpapers/sabaody.webp",
  impel_down: "images/wallpapers/impel_down.webp",
  marineford: "images/wallpapers/marineford.webp",
};
// Control game
const start = document.querySelector("#controls_start");
const restart = document.querySelector("#controls_restart");
const winner = document.querySelector("#controls_winner");
const help_btn = document.querySelector("#help_btn");
const help = document.querySelector("#main_help");
help.style.display = "none";
const ai_btn = document.querySelector("#settings_ai");
const radioInputs = document.querySelectorAll('input[type="radio"]');

const infos = document.querySelector("#disqus_thread");
const infos_btn = document.querySelector("#infos_btn");
const messageInput = document.querySelector("form input[name='message']");
const nameInput = document.querySelector("form input[name='name']");
const buttonInput = document.querySelector("form input[name='button']");
const messageListElement = document.querySelector("#messages-list");
infos.style.display = "none";
infos_btn.onclick = () => {
  infos.style.display = infos.style.display === "none" ? "flex" : "none";
};
// Fetch messages from Node/MongoDB backend server
const fetchMessages = () => {
  fetch("https://message-6o0q.onrender.com/api/messages")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched messages :", data);
      displayMessages(data);
    }) // Call displayMessages function with data from GET messages API
    .catch((error) => console.error(error));
};
// Display the fetched messages from GET API
const displayMessages = (messages) => {
  messages.forEach((message) => {
    const listItem = document.createElement("li");
    listItem.textContent = message.date
      ? `${message.name} (${message.date}) : ${message.content}`
      : `${message.name} : ${message.content}`;
    messageListElement.appendChild(listItem);
  });
};
fetchMessages();

// Send form data (message infos) to Node/MongoDB backend server
const sendFormData = () => {
  const newMessage = {
    name: nameInput.value,
    content: messageInput.value,
    date: new Date(),
  };
  console.log("Message to send :", newMessage);
  fetch("https://message-6o0q.onrender.com/api/messages", {
    method: "POST",
    // headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(newMessage),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Sent message :", data);
      alert("Ton message a bien été envoyé !");
      location.reload();
    })
    .catch((error) => console.error(error));
};

// Trigger POST request to send form data
buttonInput.onclick = () => {
  if (messageInput.value !== "") sendFormData();
  else alert("Make sure to fill all the input fields.");
};
help_btn.onclick = () => {
  help.style.display = help.style.display === "none" ? "flex" : "none";
};
let isAiActivated = false;
ai_btn.onclick = () => {
  isAiActivated = !isAiActivated;
  ai_btn.style.backgroundColor = isAiActivated ? "lime" : "whitesmoke";
  ai_btn.innerHTML = isAiActivated ? "Contre l'ordi" : "Mode 2 joueurs";
  settings.simpleAttackDelay *= isAiActivated ? 2 : 0.5;
};
// Change players
document.body.addEventListener("change", (e) => {
  let target = e.target;
  switch (target.id) {
    case "luffy-1":
      player1 = players.luffy;
      break;
    case "ace-1":
      player1 = players.ace;
      break;
    case "zoro-1":
      player1 = players.zoro;
      break;
    case "franky-1":
      player1 = players.franky;
      break;
    case "sanji-1":
      player1 = players.sanji;
      break;
    case "brook-1":
      player1 = players.brook;
      break;
    case "law-1":
      player1 = players.law;
      break;
    case "jinbe-1":
      player1 = players.jinbe;
      break;
    case "luffy-2":
      player2 = players.luffy;
      break;
    case "ace-2":
      player2 = players.ace;
      break;
    case "zoro-2":
      player2 = players.zoro;
      break;
    case "franky-2":
      player2 = players.franky;
      break;
    case "sanji-2":
      player2 = players.sanji;
      break;
    case "brook-2":
      player2 = players.brook;
      break;
    case "law-2":
      player2 = players.law;
      break;
    case "jinbe-2":
      player2 = players.jinbe;
      break;
  }
});
// Sounds
const fireballMp3 = document.querySelector("#fireballMp3");
const swooshMp3 = document.querySelector("#swooshMp3");
const slashMp3 = document.querySelector("#slashMp3");
const cannonballMp3 = document.querySelector("#cannonballMp3");
const waveMp3 = document.querySelector("#waveMp3");
const aceSpeMp3 = document.querySelector("#aceSpeMp3");
const luffySpeMp3 = document.querySelector("#luffySpeMp3");
const zoroSpeMp3 = document.querySelector("#zoroSpeMp3");
const frankySpeMp3 = document.querySelector("#frankySpeMp3");
const sanjiSpeMp3 = document.querySelector("#sanjiSpeMp3");
const brookSpeMp3 = document.querySelector("#brookSpeMp3");
const lawSpeMp3 = document.querySelector("#lawSpeMp3");
const jinbeSpeMp3 = document.querySelector("#jinbeSpeMp3");
const aceWinMp3 = document.querySelector("#aceWinMp3");
const luffyWinMp3 = document.querySelector("#luffyWinMp3");
const zoroWinMp3 = document.querySelector("#zoroWinMp3");
const frankyWinMp3 = document.querySelector("#frankyWinMp3");
const sanjiWinMp3 = document.querySelector("#sanjiWinMp3");
const brookWinMp3 = document.querySelector("#brookWinMp3");
const lawWinMp3 = document.querySelector("#lawWinMp3");
const jinbekWinMp3 = document.querySelector("#jinbeWinMp3");
const healMp3 = document.querySelector("#healMp3");
const hitMp3 = document.querySelector("#hitMp3");
const yeahMp3 = document.querySelector("#yeahMp3");
const gearSecondMp3 = document.querySelector("#gearSecondMp3");
const overtakenMp3 = document.querySelector("#overtakenMp3");
const thrillerBarkMp3 = document.querySelector("#thrillerBarkMp3");
const eniesLobbyMp3 = document.querySelector("#eniesLobbyMp3");
const eniesLobbyMarchMp3 = document.querySelector("#eniesLobbyMarchMp3");
const difficultMp3 = document.querySelector("#difficultMp3");
const katakuriMp3 = document.querySelector("#katakuriMp3");
healMp3.volume = 0.4;
hitMp3.volume = 0.4;
yeahMp3.volume = 0.5;
gearSecondMp3.volume = 0.8;
overtakenMp3.volume = 0.3;
thrillerBarkMp3.volume = 0.3;
eniesLobbyMp3.volume = 0.3;
eniesLobbyMarchMp3.volume = 0.3;
difficultMp3.volume = 0.3;
katakuriMp3.volume = 0.3;
// Change background wallpaper
const wallpaper = document.querySelector("#main_wallpaper");
let currentOst = overtakenMp3;
const wallpaper_select = document.querySelector("#select_wallpaper");
// const jinbe1 = document.querySelector("#jinbe-1") as HTMLInputElement;
// const jinbe2 = document.querySelector("#jinbe-2") as HTMLInputElement;
// jinbe1.disabled = true;
wallpaper_select.options[1].disabled = true;
wallpaper_select.options[2].disabled = true;
wallpaper_select.options[3].disabled = true;
wallpaper_select.options[4].disabled = true;
wallpaper_select.options[5].disabled = true;
wallpaper.style.backgroundImage = `url(${background_url.loguetown})`;
wallpaper_select.addEventListener("change", (e) => {
  switch (wallpaper_select.value) {
    case "loguetown":
      wallpaper.style.backgroundImage = `url(${background_url.loguetown})`;
      currentOst = overtakenMp3;
      break;
    case "enies_lobby":
      wallpaper.style.backgroundImage = `url(${background_url.enies_lobby})`;
      currentOst = eniesLobbyMp3;
      break;
    case "thriller_bark":
      wallpaper.style.backgroundImage = `url(${background_url.thriller_bark})`;
      currentOst = thrillerBarkMp3;
      break;
    case "sabaody":
      wallpaper.style.backgroundImage = `url(${background_url.sabaody})`;
      currentOst = eniesLobbyMarchMp3;
      break;
    case "impel_down":
      wallpaper.style.backgroundImage = `url(${background_url.impel_down})`;
      currentOst = katakuriMp3;
      break;
    case "marineford":
      wallpaper.style.backgroundImage = `url(${background_url.marineford})`;
      currentOst = difficultMp3;
      break;
  }
});
// Display infos
const p1_name = document.querySelector("#stats_name-1");
const p1_score = document.querySelector("#stats_score-1");
const p1_hp = document.querySelector("#stats_hp-1");
const p1_hp_display = document.querySelector("#stats_hearts-1");
const p1_mana = document.querySelector("#stats_mana-1");
const p1_mana_display = document.querySelector("#stats_lightning-1");
const p2_name = document.querySelector("#stats_name-2");
const p2_score = document.querySelector("#stats_score-2");
const p2_hp = document.querySelector("#stats_hp-2");
const p2_hp_display = document.querySelector("#stats_hearts-2");
const p2_mana = document.querySelector("#stats_mana-2");
const p2_mana_display = document.querySelector("#stats_lightning-2");
// Video player settings
const gif1 = document.querySelector("#canvas-virtual_gif-1");
const gif2 = document.querySelector("#canvas-virtual_gif-2");
const gif_space = document.querySelector("#canvas-virtual_gif-separator");
gif_space.style.minWidth = `${canvas.width - settings.playerWidth * 8}px`;
gif1.style.width = settings.playerWidth * 1.4 + "px";
gif1.style.height = settings.playerHeight * 0.7 + "px";
gif2.style.width = settings.playerWidth * 1.4 + "px";
gif2.style.height = settings.playerHeight * 0.7 + "px";
// OOP
class Player {
  constructor(
    x,
    y,
    name,
    spriteImage,
    shadowColor,
    step,
    hp,
    healingSpeed,
    mana,
    manaCost,
    manaSpeed,
    attackStrength,
    attackSpeed,
    attackSound,
    attackSprite,
    specialAttackStrength,
    specialAttackSpeed,
    specialAttackSound,
    specialAttackSprite,
    victorySound,
    enemy
  ) {
    this.x = x;
    this.y = y;
    this.width = settings.playerWidth;
    this.height = settings.playerHeight;
    this.name = name;
    this.currentSprite = this.createSprite(spriteImage);
    this.spriteImage = this.createSprite(spriteImage);
    this.shadowColor = shadowColor;
    this.step = step;
    this.hp = hp;
    this.healingSpeed = healingSpeed;
    this.mana = mana;
    this.manaCost = manaCost;
    this.manaSpeed = manaSpeed;
    this.mana = mana;
    this.attackStrength = attackStrength;
    this.attackSpeed = attackSpeed;
    this.attackSound = this.createSound(attackSound, 0.4);
    this.attackSprite = this.createSprite(attackSprite);
    this.specialAttackStrength = specialAttackStrength;
    this.specialAttackSpeed = specialAttackSpeed;
    this.specialAttackSound = this.createSound(specialAttackSound, 1);
    this.specialAttackSprite = specialAttackSprite;
    this.victorySound = this.createSound(victorySound, 0.7);
    this.enemy = enemy;
    this.attacks = [];
    this.isUsingAttack = false;
    this.isUsingSpecialAttack = false;
    this.score = 0;
  }
  createSprite(imageUrl) {
    const newSprite = new Image();
    newSprite.src = imageUrl;
    return newSprite;
  }
  createSound(soundId, volume) {
    const newSound = document.querySelector(soundId);
    newSound.volume = volume;
    return newSound;
  }
  drawPlayer() {
    ctx.shadowColor = this.shadowColor;
    ctx.drawImage(this.currentSprite, this.x, this.y, this.width, this.height);
  }
  moveUp() {
    console.log(
      settings.step,
      this.y,
      canvas.height,
      this.height,
      (canvas.height - this.height) / settings.step
    );
    if (this.y > 0) {
      this.y -= settings.step;
    }
  }
  moveDown() {
    console.log(
      settings.step,
      this.y,
      canvas.height,
      this.height,
      (canvas.height - this.height) / settings.step
    );
    if (this.y < canvas.height - settings.playerHeight) {
      this.y += settings.step;
    }
  }
  simpleAttack() {
    if (!this.isUsingSpecialAttack && !this.isUsingAttack) {
      this.isUsingAttack = true;
      this.attackSound.currentTime = 0;
      this.attackSound.play();
      this.attacks.push(
        new Attack(
          this,
          "simple",
          settings.attackSpriteWidth,
          settings.attackSpriteHeight,
          this.attackSprite
        )
      );
      this.height += settings.playerSizeVariation;
      setTimeout(() => {
        this.isUsingAttack = false;
        this.height -= settings.playerSizeVariation;
      }, settings.simpleAttackDelay);
    }
  }
  runSpecialVideo() {
    const gif = this === fight.player1 ? gif1 : gif2;
    gif.style.display = "block";
    gif.style.transform =
      this === fight.player1
        ? `translateY(${this.y}px)`
        : `translateY(${this.y}px) scale(-1, 1)`;
    gif.src = this.specialAttackSprite;
    setTimeout(() => {
      gif.style.display = "none";
      gif.src = "";
    }, settings.specialAttackDelay);
  }
  specialAttack() {
    if (
      !this.isUsingSpecialAttack &&
      !this.isUsingAttack &&
      this.mana >= this.manaCost
    ) {
      this.mana -= this.manaCost;
      this.specialAttackSound.currentTime = 0;
      this.specialAttackSound.play();
      this.isUsingSpecialAttack = true;
      setTimeout(() => {
        this.currentSprite = this.createSprite("images/players/empty.png");
        this.runSpecialVideo();
        this.attacks.push(
          new Attack(
            this,
            "special",
            settings.attackSpriteWidth * 2,
            settings.attackSpriteHeight * 2,
            this.attackSprite
          )
        );
        setTimeout(() => {
          this.currentSprite = this.spriteImage;
          this.isUsingSpecialAttack = false;
        }, settings.specialAttackDelay);
      }, settings.specialAttackAudioDelay);
    }
  }
  reloadMana() {
    if (this.mana < settings.maxMana && !this.isUsingSpecialAttack) {
      this.mana += this.manaSpeed / 10;
    }
  }
  heal() {
    if (
      this.hp < settings.maxHp &&
      !this.isUsingAttack &&
      !this.isUsingSpecialAttack
    ) {
      this.isUsingAttack = true;
      healMp3.currentTime = 0;
      healMp3.play();
      this.hp += (1 + Math.random()) * this.healingSpeed;
      this.height -= settings.playerSizeVariation;
      setTimeout(() => {
        this.isUsingAttack = false;
        this.height += settings.playerSizeVariation;
      }, settings.healingTime);
    }
  }
  win() {
    currentOst.pause();
    fight.blockRadioInput(false);
    fight.isPlaying = false;
    this.victorySound.currentTime = 0;
    this.victorySound.play();
    this.score++;
    for (
      let index = 0;
      index <= fight.player1.score + fight.player2.score;
      index++
    ) {
      wallpaper_select.options[index].disabled = false;
    }
    winner.style.display = "block";
    winner.innerText = `Le vainqueur est ${this.name} !`;
    restart.style.display = "block";
  }
}
class Attack {
  constructor(owner, type, width, height, sprite) {
    this.owner = owner;
    this.type = type;
    this.width = width;
    this.height = height;
    this.x =
      this.owner === fight.player1
        ? this.owner.x + this.owner.width
        : this.owner.x - this.width;
    this.y = this.owner.y + this.owner.height / 2 - this.height / 2;
    this.strength =
      this.type === "simple"
        ? this.owner.attackStrength
        : this.owner.specialAttackStrength;
    this.speed =
      this.type === "simple"
        ? this.owner.attackSpeed
        : this.owner.specialAttackSpeed;
    this.sprite = sprite;
  }
  moveTowardEnemy() {
    // Calculate the right direction on the X axis
    const direction = this.owner === fight.player1 ? this.speed : -this.speed;
    this.x += direction;
  }
  inflictDamage() {
    // Reduce HP of the other Player
    if (this.owner.enemy != null) {
      hitMp3.currentTime = 0;
      hitMp3.play();
      this.owner.enemy.hp -=
        this.strength + (Math.random() * this.strength) / 10;
    }
  }
  removeAttack() {
    // Delete the attack from the Player attack list
    this.owner.attacks.splice(this.owner.attacks.indexOf(this), 1);
  }
  detectCollision() {
    // Removes enemy's HP if attack matches the XY enemy's position
    const detectionMargin = settings.collisionMargin;
    if (this.owner === fight.player1) {
      if (
        this.x >= fight.player2.x - this.width + detectionMargin &&
        this.y > fight.player2.y - this.height + detectionMargin &&
        this.y < fight.player2.y + fight.player2.height - detectionMargin
      ) {
        this.inflictDamage();
        this.removeAttack();
      } else if (this.x > canvas.width - settings.attackSpriteWidth / 2) {
        this.removeAttack();
      }
    } else {
      if (
        this.x <= fight.player1.x + this.width + detectionMargin &&
        this.y > fight.player1.y - this.height + detectionMargin &&
        this.y < fight.player1.y + fight.player1.height - detectionMargin
      ) {
        this.inflictDamage();
        this.removeAttack();
      } else if (this.x < 0 - settings.attackSpriteWidth / 2) {
        this.removeAttack();
      }
    }
  }
  drawAttackSprite() {
    // Update X axis, check for collision and display the attack sprite
    this.moveTowardEnemy();
    this.detectCollision();
    ctx.shadowColor = this.owner.shadowColor;
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
class Game {
  constructor() {
    this.playStartSound = () => {
      gearSecondMp3.currentTime = 0;
      gearSecondMp3.play();
      currentOst.pause();
      currentOst.currentTime = 0;
      currentOst.play();
    };
    this.blockRadioInput = (blockStatus) => {
      radioInputs.forEach((input) => {
        input.disabled = blockStatus;
      });
      wallpaper_select.disabled = blockStatus;
      ai_btn.disabled = blockStatus;
    };
    this.player1 = new Player(
      settings.player1DefaultPosition.x,
      settings.player1DefaultPosition.y,
      player1.name,
      player1.spriteImage,
      player1.shadowColor,
      player1.step,
      player1.hp,
      player1.healingSpeed,
      player1.mana,
      player1.manaCost,
      player1.manaSpeed,
      player1.attackStrength,
      player1.attackSpeed,
      player1.attackSound,
      player1.attackSprite,
      player1.specialAttackStrength,
      player1.specialAttackSpeed,
      player1.specialAttackSound,
      player1.specialAttackSprite,
      player1.victorySound,
      null
    );
    this.player2 = new Player(
      settings.player2DefaultPosition.x,
      settings.player2DefaultPosition.y,
      player2.name,
      player2.spriteImage,
      player2.shadowColor,
      player2.step,
      player2.hp,
      player2.healingSpeed,
      player2.mana,
      player2.manaCost,
      player2.manaSpeed,
      player2.attackStrength,
      player2.attackSpeed,
      player2.attackSound,
      player2.attackSprite,
      player2.specialAttackStrength,
      player2.specialAttackSpeed,
      player2.specialAttackSound,
      player2.specialAttackSprite,
      player2.victorySound,
      null
    );
    this.isPlaying = false;
    this.isAiPlaying = false;
    this.refreshInterval = null;
  }
  defaultDisplay() {
    // Display the default positions
    this.resetGame();
    p1_name.innerText = this.player1.name;
    this.player1.drawPlayer();
    p2_name.innerText = this.player2.name;
    this.player2.drawPlayer();
  }
  displayPlayer1() {
    this.player1.reloadMana();
    this.player1.drawPlayer();
    p1_hp.innerText = `HP : ${Math.round(this.player1.hp)}/${settings.maxHp}`;
    p1_hp_display.innerText = "❤".repeat(Math.round(this.player1.hp / 50));
    p1_mana.innerText = `Mana : ${Math.round(this.player1.mana)}/${
      settings.maxMana
    }`;
    p1_mana_display.innerText = "⚡".repeat(Math.round(this.player1.mana / 25));
    p1_score.innerText = `Score : ${this.player1.score}`;
    this.player1.attacks.forEach((attack) => {
      attack.drawAttackSprite();
    });
  }
  displayPlayer2() {
    this.player2.reloadMana();
    this.player2.drawPlayer();
    p2_hp.innerText = `HP : ${Math.round(this.player2.hp)}/${settings.maxHp}`;
    p2_hp_display.innerText = "❤".repeat(Math.round(this.player2.hp / 50));
    p2_mana.innerText = `Mana : ${Math.round(this.player2.mana)}/${
      settings.maxMana
    }`;
    p2_mana_display.innerText = "⚡".repeat(Math.round(this.player1.mana / 25));
    p2_score.innerText = `Score : ${this.player2.score}`;
    this.player2.attacks.forEach((attack) => {
      attack.drawAttackSprite();
    });
  }
  setEnemies() {
    this.player1.enemy = this.player2;
    this.player2.enemy = this.player1;
  }
  exitGame() {
    currentOst.pause();
    fight.isPlaying = false;
    clearInterval(fight.refreshInterval);
    fight.resetGame();
    start.style.display = "block";
    fight.blockRadioInput(false);
  }
  runGame() {
    if (!this.isPlaying) {
      return;
    }
    this.defaultDisplay();
    this.refreshInterval = setInterval(() => {
      if (this.player1.hp <= 1) {
        clearInterval(this.refreshInterval);
        this.player2.win();
      }
      if (this.player2.hp <= 1) {
        clearInterval(this.refreshInterval);
        this.player1.win();
      }
      if (isAiActivated && !this.isAiPlaying)
        this.runAi(Math.floor(Math.random() * 4));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.displayPlayer1();
      this.displayPlayer2();
    }, settings.refreshRate);
  }
  runAi(action) {
    switch (action) {
      case 0:
        fight.player2.simpleAttack();
        break;
      case 1:
        fight.player2.heal();
        break;
      case 2:
        if (fight.player2.y < fight.player1.y) {
          fight.player2.moveDown();
        } else {
          fight.player2.moveUp();
        }
        break;
      case 3:
        fight.player2.specialAttack();
        break;
    }
    this.isAiPlaying = true;
    setTimeout(() => {
      this.isAiPlaying = false;
    }, settings.aiPlayRate);
  }
  checkKeyPress(event) {
    // Keywboard controls
    switch (event.key) {
      case "z":
        this.player1.moveUp();
        break;
      case "s":
        this.player1.moveDown();
        break;
      case "q":
        this.player1.heal();
        break;
      case "d":
        this.player1.simpleAttack();
        break;
      case "e":
        this.player1.specialAttack();
        break;
      case "ArrowUp":
        this.player2.moveUp();
        break;
      case "ArrowDown":
        this.player2.moveDown();
        break;
      case "ArrowRight":
        this.player2.heal();
        break;
      case "ArrowLeft":
        this.player2.simpleAttack();
        break;
      case "PageUp":
        this.player2.specialAttack();
        break;
      case " ":
        this.exitGame();
        break;
    }
  }
  resetGame() {
    this.player1.x = 0;
    this.player1.y = 0;
    this.player1.attacks = [];
    this.player1.hp = player1.hp;
    this.player1.mana = player1.mana;
    this.player2.x = canvas.width - settings.playerWidth;
    this.player2.y = 0;
    this.player2.attacks = [];
    this.player2.hp = player2.hp;
    this.player2.mana = player2.mana;
  }
}
let player1 = players.luffy;
let player2 = players.ace;
const fight = new Game();
start.onclick = () => {
  fight.playStartSound();
  setTimeout(() => {
    // Update player 1
    fight.player1.name = player1.name;
    fight.player1.spriteImage = fight.player1.createSprite(player1.spriteImage);
    fight.player1.currentSprite = fight.player1.spriteImage;
    fight.player1.shadowColor = player1.shadowColor;
    fight.player1.hp = player1.hp;
    fight.player1.mana = player1.mana;
    fight.player1.healingSpeed = player1.healingSpeed;
    fight.player1.attackStrength = player1.attackStrength;
    fight.player1.attackSpeed = player1.attackSpeed;
    fight.player1.attackSound = fight.player1.createSound(
      player1.attackSound,
      0.4
    );
    fight.player1.attackSprite = fight.player1.createSprite(
      player1.attackSprite
    );
    fight.player1.specialAttackStrength = player1.specialAttackStrength;
    fight.player1.specialAttackSpeed = player1.specialAttackSpeed;
    fight.player1.specialAttackSound = fight.player1.createSound(
      player1.specialAttackSound,
      1
    );
    fight.player1.specialAttackSprite = player1.specialAttackSprite;
    fight.player1.victorySound = fight.player1.createSound(
      player1.victorySound,
      0.9
    );
    // Update player 2
    fight.player2.name = player2.name;
    fight.player2.spriteImage = fight.player2.createSprite(player2.spriteImage);
    fight.player2.currentSprite = fight.player2.spriteImage;
    fight.player2.shadowColor = player2.shadowColor;
    fight.player2.hp = player2.hp;
    fight.player2.mana = player2.mana;
    fight.player2.healingSpeed = player2.healingSpeed;
    fight.player2.attackStrength = player2.attackStrength;
    fight.player2.attackSpeed = player2.attackSpeed;
    fight.player2.attackSound = fight.player2.createSound(
      player2.attackSound,
      0.4
    );
    fight.player2.attackSprite = fight.player2.createSprite(
      player2.attackSprite
    );
    fight.player2.specialAttackStrength = player2.specialAttackStrength;
    fight.player2.specialAttackSpeed = player2.specialAttackSpeed;
    fight.player2.specialAttackSound = fight.player2.createSound(
      player2.specialAttackSound,
      1
    );
    fight.player2.specialAttackSprite = player2.specialAttackSprite;
    fight.player2.victorySound = fight.player2.createSound(
      player2.victorySound,
      0.9
    );
    fight.blockRadioInput(true);
    fight.isPlaying = true;
    start.style.display = "none";
    fight.setEnemies();
    fight.defaultDisplay();
    fight.runGame();
  }, 1000);
  restart.onclick = () => {
    fight.playStartSound();
    setTimeout(() => {
      // Update player 1
      fight.player1.name = player1.name;
      fight.player1.spriteImage = fight.player1.createSprite(
        player1.spriteImage
      );
      fight.player1.currentSprite = fight.player1.spriteImage;
      fight.player1.shadowColor = player1.shadowColor;
      fight.player1.step = player1.step;
      fight.player1.hp = player1.hp;
      fight.player1.mana = player1.mana;
      fight.player1.manaCost = player1.manaCost;
      fight.player1.manaSpeed = player1.manaSpeed;
      fight.player1.healingSpeed = player1.healingSpeed;
      fight.player1.attackStrength = player1.attackStrength;
      fight.player1.attackSpeed = player1.attackSpeed;
      fight.player1.attackSound = fight.player1.createSound(
        player1.attackSound,
        0.4
      );
      fight.player1.attackSprite = fight.player1.createSprite(
        player1.attackSprite
      );
      fight.player1.specialAttackStrength = player1.specialAttackStrength;
      fight.player1.specialAttackSpeed = player1.specialAttackSpeed;
      fight.player1.specialAttackSound = fight.player1.createSound(
        player1.specialAttackSound,
        1
      );
      fight.player1.specialAttackSprite = player1.specialAttackSprite;
      fight.player1.victorySound = fight.player1.createSound(
        player1.victorySound,
        1
      );
      // Update player 2
      fight.player2.name = player2.name;
      fight.player2.spriteImage = fight.player2.createSprite(
        player2.spriteImage
      );
      fight.player2.currentSprite = fight.player2.spriteImage;
      fight.player2.shadowColor = player2.shadowColor;
      fight.player2.step = player2.step;
      fight.player2.hp = player2.hp;
      fight.player2.mana = player2.mana;
      fight.player2.manaCost = player2.manaCost;
      fight.player2.manaSpeed = player2.manaSpeed;
      fight.player2.healingSpeed = player2.healingSpeed;
      fight.player2.attackStrength = player2.attackStrength;
      fight.player2.attackSpeed = player2.attackSpeed;
      fight.player2.attackSound = fight.player2.createSound(
        player2.attackSound,
        0.4
      );
      fight.player2.attackSprite = fight.player2.createSprite(
        player2.attackSprite
      );
      fight.player2.specialAttackStrength = player2.specialAttackStrength;
      fight.player2.specialAttackSpeed = player2.specialAttackSpeed;
      fight.player2.specialAttackSound = fight.player2.createSound(
        player2.specialAttackSound,
        1
      );
      fight.player2.specialAttackSprite = player2.specialAttackSprite;
      fight.player2.victorySound = fight.player2.createSound(
        player2.victorySound,
        1
      );
      fight.blockRadioInput(true);
      fight.isPlaying = true;
      winner.style.display = "none";
      restart.style.display = "none";
      fight.resetGame();
      clearInterval(fight.refreshInterval);
      fight.defaultDisplay();
      fight.runGame();
    }, 1000);
  };
};
document.addEventListener("keydown", (event) => {
  fight.checkKeyPress(event);
});
