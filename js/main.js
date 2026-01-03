/* ===============================
   GLOBAL STATE
================================ */
let balance = 100;
let inventory = [];
let level = 1;
let xp = 0;
let selectedCase = null;

/* ===============================
   CASE DATA
================================ */
const cases = [
  {
    name: "Starter Case",
    price: 5,
    img: "assets/img/starter_case.png",
    skins: [
      { name: "AK-47 | Redline", value: 25, rarity: "rare", img: "assets/img/ak47_redline.png" },
      { name: "AWP | Asiimov", value: 60, rarity: "epic", img: "assets/img/awp_asiimov.png" },
      { name: "★ Karambit | Doppler", value: 950, rarity: "legendary", img: "assets/img/karambit_doppler.png" }
    ]
  },
  {
    name: "Blue Case",
    price: 15,
    img: "assets/img/blue_case.png",
    skins: [
      { name: "M4A4 | Howl", value: 800, rarity: "legendary", img: "assets/img/m4a4_howl.png" },
      { name: "Desert Eagle | Blaze", value: 150, rarity: "epic", img: "assets/img/deagle_blaze.png" }
    ]
  }
];

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  updateBalance();
  loadCases();
  showSection("cases");
});

/* ===============================
   UI
================================ */
function updateBalance() {
  document.getElementById("balanceText").innerText =
    `€${balance.toFixed(2)} | LVL ${level}`;
}

function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ===============================
   CASE LIST
================================ */
function loadCases() {
  const grid = document.getElementById("caseGrid");
  grid.innerHTML = "";

  cases.forEach(c => {
    const div = document.createElement("div");
    div.className = "case-card";
    div.innerHTML = `
      <img src="${c.img}">
      <h4>${c.name}</h4>
      <p>€${c.price}</p>
    `;
    div.onclick = () => openCaseModal(c);
    grid.appendChild(div);
  });
}

/* ===============================
   CASE OPEN
================================ */
function openCaseModal(c) {
  selectedCase = c;
  document.getElementById("caseTitle").innerText = c.name;
  document.getElementById("caseModal").classList.remove("hidden");
  document.getElementById("caseSpins").innerHTML = "";
}

function closeCase() {
  document.getElementById("caseModal").classList.add("hidden");
}

function openSelectedCase() {
  if (!selectedCase || balance < selectedCase.price) return;

  balance -= selectedCase.price;
  gainXP(10);
  updateBalance();

  const spinWrap = document.getElementById("caseSpins");
  spinWrap.innerHTML = "";

  const strip = document.createElement("div");
  strip.className = "spinner";
  const track = document.createElement("div");
  track.className = "caseStrip";

  strip.appendChild(track);
  strip.innerHTML += `<div class="indicator"></div>`;
  spinWrap.appendChild(strip);

  const total = 25;
  const winIndex = Math.floor(Math.random() * total);
  const winSkin = randomSkin(selectedCase.skins);

  for (let i = 0; i < total; i++) {
    const skin = i === winIndex ? winSkin : randomSkin(selectedCase.skins);
    const item = document.createElement("div");
    item.className = "caseItem";
    item.innerHTML = `<img src="${skin.img}"><p>${skin.name}</p>`;
    track.appendChild(item);
  }

  track.style.transform = "translateX(0)";
  track.style.transition = "none";

  requestAnimationFrame(() => {
    track.style.transition = "transform 3s cubic-bezier(.15,.8,.2,1)";
    track.style.transform = `translateX(-${winIndex * 120 - 300}px)`;
  });

  setTimeout(() => {
    handleWin(winSkin);
  }, 3100);
}

function handleWin(skin) {
  if (skin.rarity === "legendary") {
    mysterySpin(selectedCase);
  } else {
    inventory.push(skin);
    renderInventory();
  }
}

/* ===============================
   MYSTERY SPIN (LEGENDARY)
================================ */
function mysterySpin(c) {
  alert("💛 MYSTERY SPIN!");

  const legendary = c.skins.filter(s => s.rarity === "legendary");
  const win = legendary[Math.floor(Math.random() * legendary.length)];

  inventory.push(win);
  renderInventory();
}

/* ===============================
   INVENTORY
================================ */
function renderInventory() {
  const grid = document.getElementById("inventoryGrid");
  grid.innerHTML = "";

  inventory.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "inv-item";
    div.innerHTML = `
      <img src="${item.img}">
      <p>${item.name}</p>
      <button onclick="sellItem(${i})">Sell €${item.value}</button>
    `;
    grid.appendChild(div);
  });
}

function sellItem(index) {
  balance += inventory[index].value;
  inventory.splice(index, 1);
  updateBalance();
  renderInventory();
}

/* ===============================
   ROULETTE
================================ */
function betColor(color) {
  const bet = Number(document.getElementById("betAmount").value);
  if (bet <= 0 || balance < bet) return;

  balance -= bet;
  updateBalance();

  const wheel = document.getElementById("rouletteWheel");
  wheel.innerHTML = "";

  const pool = [];
  for (let i = 0; i < 40; i++) pool.push("red", "black");
  for (let i = 0; i < 4; i++) pool.push("green");

  pool.sort(() => Math.random() - 0.5);

  pool.forEach(c => {
    const d = document.createElement("div");
    d.className = `roulette-item ${c}`;
    d.innerText = c.toUpperCase();
    wheel.appendChild(d);
  });

  const winIndex = Math.floor(Math.random() * pool.length);
  wheel.style.transform = "translateX(0)";
  wheel.style.transition = "none";

  requestAnimationFrame(() => {
    wheel.style.transition = "transform 3s cubic-bezier(.15,.8,.2,1)";
    wheel.style.transform = `translateX(-${winIndex * 80 - 300}px)`;
  });

  setTimeout(() => {
    const result = pool[winIndex];
    if (result === color) {
      const win = color === "green" ? bet * 14 : bet * 2;
      balance += win;
      gainXP(5);
    }
    updateBalance();
  }, 3200);
}

/* ===============================
   CASE BATTLE (VS BOT)
================================ */
function startCaseBattle() {
  const area = document.getElementById("battleArea");
  area.innerHTML = "";

  const my = randomSkin(cases[0].skins);
  const bot = randomSkin(cases[0].skins);

  area.innerHTML = `
    <p>You: ${my.name} (€${my.value})</p>
    <p>Bot: ${bot.name} (€${bot.value})</p>
    <h3>${my.value > bot.value ? "YOU WIN 🎉" : "YOU LOSE ❌"}</h3>
  `;

  if (my.value > bot.value) balance += my.value;
  gainXP(15);
  updateBalance();
}

/* ===============================
   XP SYSTEM
================================ */
function gainXP(amount) {
  xp += amount;
  if (xp >= level * 100) {
    xp = 0;
    level++;
    alert(`LEVEL UP! ${level}`);
  }
}

/* ===============================
   UTILS
================================ */
function randomSkin(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

