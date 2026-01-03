/* =======================
   GLOBAL STATE
======================= */
let balance = 100;
let inventory = [];
let selectedCase = null;

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
  loadCases();
  showSection("cases");
});

/* =======================
   UI HELPERS
======================= */
function updateBalance() {
  document.querySelector(".balance").innerText = `Balance: €${balance.toFixed(2)}`;
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
    div.onclick = () => openCase(c);
    grid.appendChild(div);
  });
}

function openCase(c) {
  selectedCase = c;
  document.getElementById("caseModal").style.display = "flex";
  document.getElementById("caseTitle").innerText = c.name;
  document.getElementById("resultText").innerText = "";
  document.getElementById("resultImg").style.display = "none";
}

/* =======================
   CASE OPEN ANIMATION
======================= */
document.getElementById("openCaseBtn").onclick = () => {
  if (!selectedCase) return;
  if (balance < selectedCase.price) {
    alert("Not enough balance");
    return;
  }

  balance -= selectedCase.price;
  updateBalance();

  const strip = document.getElementById("caseStrip");
  strip.innerHTML = "";
  strip.style.transition = "none";
  strip.style.transform = "translateX(0)";
  strip.style.filter = "blur(4px)";

  const total = 30;
  const center = Math.floor(total / 2);
  const winSkin = selectedCase.skins[Math.floor(Math.random() * selectedCase.skins.length)];

  for (let i = 0; i < total; i++) {
    const skin = i === center ? winSkin : selectedCase.skins[Math.floor(Math.random() * selectedCase.skins.length)];
    const div = document.createElement("div");
    div.className = `caseItem ${skin.rarity}`;
    div.innerHTML = `
      <img src="${skin.img}" width="60" height="60"><br>
      <small>${skin.name}</small>
    `;
    strip.appendChild(div);
  }

  requestAnimationFrame(() => {
    strip.style.transition = "transform 3.2s cubic-bezier(0.15,0.8,0.2,1)";
    strip.style.transform = `translateX(${-(center * 110 - 200)}px)`;
  });

  setTimeout(() => {
    strip.style.filter = "blur(0)";
    inventory.push(winSkin);
    renderInventory();

    document.getElementById("resultText").innerHTML = `🎉 You won <b>${winSkin.name}</b> (€${winSkin.value})`;
    const img = document.getElementById("resultImg");
    img.src = winSkin.img;
    img.style.display = "inline-block";
  }, 3300);
};

/* =======================
   INVENTORY
======================= */
function renderInventory() {
  const inv = document.getElementById("inventoryGrid");
  inv.innerHTML = "";

  inventory.forEach(item => {
    const div = document.createElement("div");
    div.className = `inv-item ${item.rarity}`;
    div.innerHTML = `
      <img src="${item.img}" width="60">
      <p>${item.name}</p>
      <span>€${item.value}</span>
    `;
    inv.appendChild(div);
  });
}

/* =======================
   ROULETTE
======================= */
function placeBet(color) {
  const bet = Number(document.getElementById("betAmount").value);
  if (bet <= 0 || balance < bet) {
    alert("Invalid bet");
    return;
  }

  balance -= bet;
  updateBalance();

  const wheel = document.getElementById("rouletteWheel");
  wheel.innerHTML = "";
  wheel.style.transition = "none";
  wheel.style.transform = "translateX(0)";

  const colors = ["red", "black", "black", "red", "green"];
  const segments = [];

  for (let i = 0; i < 50; i++) {
    const c = colors[Math.floor(Math.random() * colors.length)];
    segments.push(c);

    const div = document.createElement("div");
    div.className = `roulette-item ${c}`;
    div.innerText = c.toUpperCase();
    wheel.appendChild(div);
  }

  const winIndex = Math.floor(Math.random() * segments.length);
  const offset = winIndex * 80 - wheel.offsetWidth / 2 + 40;

  requestAnimationFrame(() => {
    wheel.style.transition = "transform 3.2s cubic-bezier(0.15,0.8,0.2,1)";
    wheel.style.transform = `translateX(-${offset}px)`;
  });

  setTimeout(() => {
    const result = segments[winIndex];
    let winAmount = 0;
    if (result === color) winAmount = color === "green" ? bet * 14 : bet * 2;
    balance += winAmount;
    updateBalance();

    wheel.style.transition = "none";
    wheel.style.transform = `translateX(-${offset}px)`;

    alert(winAmount > 0 ? `You won €${winAmount}! (${result})` : `You lost! Result: ${result}`);
  }, 3300);
}

