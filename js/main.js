/* =======================
   GLOBAL STATE
======================= */
let balance = Number(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let selectedCases = [];
let instaSpin = false;

/* =======================
   CASE DATA
   (nuotraukos įkelti į assets/img/)
======================= */
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

/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", () => {
  updateBalance();
  updateXP();
  loadCases();
  showSection("cases");
});

/* =======================
   UI HELPERS
======================= */
function updateBalance() {
  document.querySelector(".balance").innerText = `Balance: €${balance.toFixed(2)}`;
  localStorage.setItem("balance", balance);
}

function updateXP() {
  level = Math.floor(xp / 100) + 1;
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* =======================
   CASES
======================= */
function loadCases() {
  const grid = document.getElementById("caseGrid");
  grid.innerHTML = "";
  cases.forEach(c => {
    const div = document.createElement("div");
    div.className = "case-card";
    div.innerHTML = `
      <img src="${c.img}" width="80">
      <h4>${c.name}</h4>
      <p>€${c.price}</p>
    `;
    div.onclick = () => selectCase(c);
    grid.appendChild(div);
  });
}

function selectCase(c) {
  const count = Number(document.getElementById("caseCount").value) || 1;
  selectedCases = [];
  for (let i = 0; i < count; i++) selectedCases.push(c);
  openCaseModal();
}

function openCaseModal() {
  const modal = document.getElementById("caseModal");
  modal.style.display = "flex";
  document.getElementById("caseTitle").innerText = `Opening ${selectedCases.length} case(s)`;
  document.getElementById("caseStrip").innerHTML = "";
}

/* =======================
   CASE OPEN
======================= */
document.getElementById("instaSpinBtn").onclick = () => {
  instaSpin = !instaSpin;
  document.getElementById("instaSpinBtn").innerText = `Insta Spin: ${instaSpin ? "ON" : "OFF"}`;
};

document.getElementById("openCaseBtn").onclick = () => {
  if (selectedCases.length === 0) return;

  const stripContainer = document.getElementById("caseStrip");
  stripContainer.innerHTML = "";

  selectedCases.forEach((c, index) => {
    openSingleCase(c, stripContainer, index);
  });
};

document.getElementById("exitCaseBtn").onclick = () => {
  document.getElementById("caseModal").style.display = "none";
  selectedCases = [];
};

/* =======================
   OPEN SINGLE CASE
======================= */
function openSingleCase(c, container, index) {
  if (balance < c.price) { alert("Not enough balance"); return; }

  balance -= c.price;
  updateBalance();
  xp += 10; updateXP();

  const strip = document.createElement("div");
  strip.className = "spinner";
  strip.style.marginBottom = "10px";
  container.appendChild(strip);

  const caseStrip = document.createElement("div");
  caseStrip.style.display = "flex";
  strip.appendChild(caseStrip);

  const indicator = document.createElement("div");
  indicator.className = "indicator";
  strip.appendChild(indicator);

  const total = 20;
  const center = Math.floor(total / 2);
  let winSkin = c.skins[Math.floor(Math.random() * c.skins.length)];

  for (let i = 0; i < total; i++) {
    const skin = i === center ? winSkin : c.skins[Math.floor(Math.random() * c.skins.length)];
    const div = document.createElement("div");
    div.className = `caseItem ${skin.rarity}`;
    div.innerHTML = `
      <img src="${skin.img}" width="60" height="60"><br>
      <small>${skin.rarity === "legendary" ? "???" : skin.name}</small>
    `;
    caseStrip.appendChild(div);
  }

  const speed = instaSpin ? 0.5 : 3.2;
  requestAnimationFrame(() => {
    caseStrip.style.transition = `transform ${speed}s cubic-bezier(0.15,0.8,0.2,1)`;
    caseStrip.style.transform = `translateX(${-(center * 110 - 200)}px)`;
  });

  setTimeout(() => {
    if (winSkin.rarity === "legendary") {
      startMysterySpin(c, winSkin);
    } else {
      finishCase(winSkin);
    }
  }, speed * 1000);
}

/* =======================
   MYSTERY SPIN
======================= */
function startMysterySpin(c, originalSkin) {
  const modal = document.getElementById("caseModal");
  const stripContainer = document.getElementById("caseStrip");
  stripContainer.innerHTML = "";

  const strip = document.createElement("div");
  strip.className = "spinner";
  stripContainer.appendChild(strip);

  const caseStrip = document.createElement("div");
  caseStrip.style.display = "flex";
  strip.appendChild(caseStrip);

  const indicator = document.createElement("div");
  indicator.className = "indicator";
  strip.appendChild(indicator);

  const legSkins = c.skins.filter(s => s.rarity === "legendary");
  const total = 20;
  const center = Math.floor(total / 2);
  const winSkin = legSkins[Math.floor(Math.random() * legSkins.length)];

  for (let i = 0; i < total; i++) {
    const skin = legSkins[Math.floor(Math.random() * legSkins.length)];
    const div = document.createElement("div");
    div.className = `caseItem legendary`;
    div.innerHTML = `<img src="${skin.img}" width="60" height="60"><br><small>???</small>`;
    caseStrip.appendChild(div);
  }

  const speed = instaSpin ? 0.5 : 3.2;
  requestAnimationFrame(() => {
    caseStrip.style.transition = `transform ${speed}s cubic-bezier(0.15,0.8,0.2,1)`;
    caseStrip.style.transform = `translateX(${-(center * 110 - 200)}px)`;
  });

  setTimeout(() => finishCase(winSkin), speed * 1000);
}

/* =======================
   FINISH CASE
======================= */
function finishCase(winSkin) {
  inventory.push(winSkin);
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderInventory();

  alert(`You won ${winSkin.name} (€${winSkin.value})`);
}

/* =======================
   INVENTORY
======================= */
function renderInventory() {
  const inv = document.getElementById("inventoryGrid");
  inv.innerHTML = "";
  inventory.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = `inv-item ${item.rarity}`;
    div.innerHTML = `
      <img src="${item.img}" width="60">
      <p>${item.name}</p>
      <span>€${item.value}</span>
      <button onclick="sellItem(${index})">SELL</button>
    `;
    inv.appendChild(div);
  });
}

function sellItem(index) {
  const item = inventory[index];
  balance += item.value;
  inventory.splice(index, 1);
  localStorage.setItem("inventory", JSON.stringify(inventory));
  updateBalance();
  renderInventory();
}

/* =======================
   ROULETTE
======================= */
function placeBet(color) {
  const bet = Number(document.getElementById("betAmount").value);
  if (!bet || bet > balance) { alert("Invalid bet"); return; }
  balance -= bet;
  updateBalance();

  const wheel = document.getElementById("rouletteWheel");
  wheel.innerHTML = "";

  const colors = [];
  for (let i = 0; i < 50; i++) {
    const r = Math.random();
    if (r < 0.45) colors.push("red");
    else if (r < 0.9) colors.push("black");
    else colors.push("green");
  }

  colors.forEach(c => {
    const div = document.createElement("div");
    div.className = `roulette-item ${c}`;
    div.innerText = c.toUpperCase();
    wheel.appendChild(div);
  });

  const winIndex = Math.floor(Math.random() * colors.length);
  const offset = winIndex * 80 - wheel.offsetWidth / 2 + 40;

  requestAnimationFrame(() => {
    wheel.style.transition = "transform 3.2s cubic-bezier(0.15,0.8,0.2,1)";
    wheel.style.transform = `translateX(-${offset}px)`;
  });

  setTimeout(() => {
    let multiplier = color === "green" ? 14 : 2;
    if (colors[winIndex] === color) balance += bet * multiplier;
    updateBalance();
    alert(colors[winIndex] === color ? `You won €${bet*multiplier} (${color})` : `You lost! Result: ${colors[winIndex]}`);
  }, 3300);
}

/* =======================
   CASE BATTLE (demo)
======================= */
function startCaseBattle() {
  const playerStrip = document.getElementById("battlePlayer");
  const enemyStrip = document.getElementById("battleEnemy");
  playerStrip.innerHTML = "";
  enemyStrip.innerHTML = "";

  // Player spin
  const playerSkin = selectedCases[0].skins[Math.floor(Math.random() * selectedCases[0].skins.length)];
  const enemySkin = selectedCases[0].skins[Math.floor(Math.random() * selectedCases[0].skins.length)];

  playerStrip.innerHTML = `<p>You got ${playerSkin.name} (€${playerSkin.value})</p><img src="${playerSkin.img}" width="60">`;
  enemyStrip.innerHTML = `<p>Enemy got ${enemySkin.name} (€${enemySkin.value})</p><img src="${enemySkin.img}" width="60">`;

  let resultText = "Draw!";
  if (playerSkin.value > enemySkin.value) resultText = "You win!";
  else if (playerSkin.value < enemySkin.value) resultText = "You lose!";
  document.getElementById("battleResult").innerText = resultText;

  // Add winnings if player wins
  if (playerSkin.value > enemySkin.value) {
    balance += playerSkin.value;
    updateBalance();
  }
}
