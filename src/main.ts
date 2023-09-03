const doc: Document = document;
// CANVAS Parameters
const $canvas = doc.querySelector("canvas") as HTMLCanvasElement;
const ctx = $canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasShadow = (context: CanvasRenderingContext2D = ctx): void => {
  context.shadowBlur = 30;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
};
canvasShadow(ctx);

// INTERFACES Types
interface PlayerStats {
  name: string;
  spriteImage: string;
  shadowColor: string;
  step: number;
  hp: number;
  healingSpeed: number;
  mana: number;
  manaCost: number;
  manaSpeed: number;
  attackStrength: number;
  attackSpeed: number;
  attackSound: string;
  attackSprite: string;
  specialAttackStrength: number;
  specialAttackSpeed: number;
  specialAttackSound: string;
  specialAttackSprite: string;
  victorySound: string;
}
interface PlayerStatsCollection {
  ace: PlayerStats;
  luffy: PlayerStats;
  zoro: PlayerStats;
  franky: PlayerStats;
  sanji: PlayerStats;
  brook: PlayerStats;
  law: PlayerStats;
  jinbe: PlayerStats;
}
interface Settings {
  playerHeight: number;
  playerWidth: number;
  collisionMargin: number;
  playerSizeVariation: number;
  attackSpriteHeight: number;
  attackSpriteWidth: number;
  maxHp: number;
  maxMana: number;
  healingTime: number;
  simpleAttackDelay: number;
  specialAttackDelay: number;
  specialAttackAudioDelay: number;
  player1DefaultPosition: { x: number; y: number };
  player2DefaultPosition: { x: number; y: number };
  refreshRate: number;
  aiPlayRate: number;
  step: number;
  musicVolume: number;
  sfxVolume: number;
}
interface Stadium {
  loguetown: string;
  enies_lobby: string;
  thriller_bark: string;
  sabaody: string;
  impel_down: string;
  marineford: string;
}
interface Sounds {
  fireballMp3: HTMLAudioElement;
  swooshMp3: HTMLAudioElement;
  slashMp3: HTMLAudioElement;
  cannonballMp3: HTMLAudioElement;
  waveMp3: HTMLAudioElement;
  aceSpeMp3: HTMLAudioElement;
  luffySpeMp3: HTMLAudioElement;
  zoroSpeMp3: HTMLAudioElement;
  frankySpeMp3: HTMLAudioElement;
  sanjiSpeMp3: HTMLAudioElement;
  brookSpeMp3: HTMLAudioElement;
  lawSpeMp3: HTMLAudioElement;
  jinbeSpeMp3: HTMLAudioElement;
  aceWinMp3: HTMLAudioElement;
  luffyWinMp3: HTMLAudioElement;
  zoroWinMp3: HTMLAudioElement;
  frankyWinMp3: HTMLAudioElement;
  sanjiWinMp3: HTMLAudioElement;
  brookWinMp3: HTMLAudioElement;
  lawWinMp3: HTMLAudioElement;
  jinbekWinMp3: HTMLAudioElement;
  healMp3: HTMLAudioElement;
  hitMp3: HTMLAudioElement;
  yeahMp3: HTMLAudioElement;
  gearSecondMp3: HTMLAudioElement;
  overtakenMp3: HTMLAudioElement;
  thrillerBarkMp3: HTMLAudioElement;
  eniesLobbyMp3: HTMLAudioElement;
  eniesLobbyMarchMp3: HTMLAudioElement;
  difficultMp3: HTMLAudioElement;
  katakuriMp3: HTMLAudioElement;
}

// DATA Characters
const characters: PlayerStatsCollection = {
  luffy: {
    name: "Monkey D. Luffy",
    spriteImage: "images/players/luffy.png",
    shadowColor: "red",
    step: 11,
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
    step: 12,
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
    step: 13,
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
    step: 12,
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
    step: 12,
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
    step: 10,
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
    step: 9,
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
    step: 14,
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
const settings: Settings = {
  playerHeight: $canvas.height / 2.5,
  playerWidth: $canvas.width / 9,
  collisionMargin: 15,
  playerSizeVariation: 20,
  attackSpriteHeight: $canvas.height / 10,
  attackSpriteWidth: $canvas.height / 10,
  maxHp: 350,
  maxMana: 150,
  healingTime: 150,
  simpleAttackDelay: 150,
  specialAttackDelay: 1500,
  specialAttackAudioDelay: 1500,
  player1DefaultPosition: { x: 0, y: 0 },
  player2DefaultPosition: { x: $canvas.width - $canvas.width / 9, y: 0 },
  refreshRate: 10,
  aiPlayRate: 100,
  step: $canvas.height / 10,
  musicVolume: 0.3,
  sfxVolume: 0.3,
};
const backgroundUrl: Stadium = {
  loguetown: "images/wallpapers/loguetown.webp",
  enies_lobby: "images/wallpapers/enies_lobby.webp",
  thriller_bark: "images/wallpapers/thriller_bark.webp",
  sabaody: "images/wallpapers/sabaody.webp",
  impel_down: "images/wallpapers/impel_down.webp",
  marineford: "images/wallpapers/marineford.webp",
};

// SELECT Characters
doc.body.addEventListener("click", (e: Event) => {
  const element = e.target as HTMLButtonElement;
  const choice: string = element.value;
  if (choice === "luffy-1") console.log(choice);
  if (choice === "ace-1") console.log(choice);
  if (choice === "zoro-1") console.log(choice);
  if (choice === "franky-1") console.log(choice);
  if (choice === "sanji-1") console.log(choice);
  if (choice === "brook-1") console.log(choice);
  if (choice === "law-1") console.log(choice);
  if (choice === "jinbe-1") console.log(choice);
  if (choice === "luffy-2") console.log(choice);
  if (choice === "ace-2") console.log(choice);
  if (choice === "zoro-2") console.log(choice);
  if (choice === "franky-2") console.log(choice);
  if (choice === "sanji-2") console.log(choice);
  if (choice === "brook-2") console.log(choice);
  if (choice === "law-2") console.log(choice);
  if (choice === "jinbe-2") console.log(choice);
});

// SOUND Elements
const $sounds: Sounds = {
  fireballMp3: doc.querySelector("#fireballMp3") as HTMLAudioElement,
  swooshMp3: doc.querySelector("#swooshMp3") as HTMLAudioElement,
  slashMp3: doc.querySelector("#slashMp3") as HTMLAudioElement,
  cannonballMp3: doc.querySelector("#cannonballMp3") as HTMLAudioElement,
  waveMp3: doc.querySelector("#waveMp3") as HTMLAudioElement,

  aceSpeMp3: doc.querySelector("#aceSpeMp3") as HTMLAudioElement,
  luffySpeMp3: doc.querySelector("#luffySpeMp3") as HTMLAudioElement,
  zoroSpeMp3: doc.querySelector("#zoroSpeMp3") as HTMLAudioElement,
  frankySpeMp3: doc.querySelector("#frankySpeMp3") as HTMLAudioElement,
  sanjiSpeMp3: doc.querySelector("#sanjiSpeMp3") as HTMLAudioElement,
  brookSpeMp3: doc.querySelector("#brookSpeMp3") as HTMLAudioElement,
  lawSpeMp3: doc.querySelector("#lawSpeMp3") as HTMLAudioElement,
  jinbeSpeMp3: doc.querySelector("#jinbeSpeMp3") as HTMLAudioElement,

  aceWinMp3: doc.querySelector("#aceWinMp3") as HTMLAudioElement,
  luffyWinMp3: doc.querySelector("#luffyWinMp3") as HTMLAudioElement,
  zoroWinMp3: doc.querySelector("#zoroWinMp3") as HTMLAudioElement,
  frankyWinMp3: doc.querySelector("#frankyWinMp3") as HTMLAudioElement,
  sanjiWinMp3: doc.querySelector("#sanjiWinMp3") as HTMLAudioElement,
  brookWinMp3: doc.querySelector("#brookWinMp3") as HTMLAudioElement,
  lawWinMp3: doc.querySelector("#lawWinMp3") as HTMLAudioElement,
  jinbekWinMp3: doc.querySelector("#jinbeWinMp3") as HTMLAudioElement,

  healMp3: doc.querySelector("#healMp3") as HTMLAudioElement,
  hitMp3: doc.querySelector("#hitMp3") as HTMLAudioElement,
  yeahMp3: doc.querySelector("#yeahMp3") as HTMLAudioElement,
  gearSecondMp3: doc.querySelector("#gearSecondMp3") as HTMLAudioElement,
  overtakenMp3: doc.querySelector("#overtakenMp3") as HTMLAudioElement,
  thrillerBarkMp3: doc.querySelector("#thrillerBarkMp3") as HTMLAudioElement,
  eniesLobbyMp3: doc.querySelector("#eniesLobbyMp3") as HTMLAudioElement,
  eniesLobbyMarchMp3: doc.querySelector(
    "#eniesLobbyMarchMp3"
  ) as HTMLAudioElement,
  difficultMp3: doc.querySelector("#difficultMp3") as HTMLAudioElement,
  katakuriMp3: doc.querySelector("#katakuriMp3") as HTMLAudioElement,
};

// VOLUME Settings
const adjustVolume = (): void => {
  $sounds.healMp3.volume = settings.sfxVolume;
  $sounds.hitMp3.volume = settings.sfxVolume;
  $sounds.yeahMp3.volume = settings.sfxVolume;
  $sounds.gearSecondMp3.volume = settings.sfxVolume;
  $sounds.overtakenMp3.volume = settings.musicVolume;
  $sounds.thrillerBarkMp3.volume = settings.musicVolume;
  $sounds.eniesLobbyMp3.volume = settings.musicVolume;
  $sounds.eniesLobbyMarchMp3.volume = settings.musicVolume;
  $sounds.difficultMp3.volume = settings.musicVolume;
  $sounds.katakuriMp3.volume = settings.musicVolume;
};
adjustVolume();

// DOM Selectors
const $help = doc.querySelector("#help") as HTMLButtonElement;
const $volume = doc.querySelector("#volume") as HTMLButtonElement;
const $stadium = doc.querySelector("#stadium") as HTMLButtonElement;
const $mode = doc.querySelector("#mode") as HTMLButtonElement;

// STADIUM Selection
const $stadiumSelect = doc.querySelector("#stadiumSelect") as HTMLSelectElement;
const $shadowCanvas = doc.querySelector("#shadowCanvas") as HTMLDivElement;
let $currentOst: HTMLAudioElement;

const selectStadium = (stadium: string, ost: HTMLAudioElement): void => {
  $shadowCanvas.style.backgroundImage = `url(${stadium})`;
  $shadowCanvas.style.filter = "brightness(0.9) blur(5px)";
  $currentOst = ost;
};

selectStadium(backgroundUrl.loguetown, $sounds.overtakenMp3);
$stadiumSelect.addEventListener("change", (e: Event) => {
  const choice: string = $stadiumSelect.value;
  if (choice === "loguetown")
    selectStadium(backgroundUrl.loguetown, $sounds.overtakenMp3);
  if (choice === "enies_lobby")
    selectStadium(backgroundUrl.enies_lobby, $sounds.eniesLobbyMp3);
  if (choice === "thriller_bark")
    selectStadium(backgroundUrl.thriller_bark, $sounds.thrillerBarkMp3);
  if (choice === "sabaody")
    selectStadium(backgroundUrl.sabaody, $sounds.eniesLobbyMarchMp3);
  if (choice === "impel_down")
    selectStadium(backgroundUrl.impel_down, $sounds.katakuriMp3);
  if (choice === "marineford")
    selectStadium(backgroundUrl.marineford, $sounds.difficultMp3);
});

// MODE Selection
const $modeSelect = doc.querySelector("#modeSelect") as HTMLSelectElement;
let isAiActivated: boolean = true;
$mode.onclick = () => {
  isAiActivated = !isAiActivated;
  $mode.innerText = isAiActivated ? "Mode IA activé" : "Mode 2 joueurs";
};

let iaLevel: number = 1;
$modeSelect.addEventListener("change", (e: Event) => {
  const choice: string = $modeSelect.value;
  if (choice === "ia1") iaLevel = 1;
  if (choice === "ia2") iaLevel = 2;
  if (choice === "ia3") iaLevel = 3;
});
