let balance = 100;
let inventory = [];
let selectedCase = null;

const cases = [
  {
    name: "Starter Case",
    price: 5,
    img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_redline_light_large.png",
    skins: [
      { name: "AK-47 Redline", value: 25, rarity: "rare", img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_redline_light_large.png" },
      { name: "AWP Asiimov", value: 60, rarity: "epic", img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_awp_cu_asiimov_light_large.png" },
      { name: "Karambit Doppler", value: 950, rarity: "legendary", img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_karambit_cu_doppler_light_large.png" }
    ]
  }
];

function updateBalance() {
  document.querySelector(".balance").innerText = `Balance: €${balance.toFixed(2)}`;
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function loadCases() {
  const grid = document.getElementById("caseGrid");
  cases.forEach(c => {
    const div = document.createElement("div");
    div.className = "case-card";
    div.innerHTML = `<img src="${c.img}"><h4>${c.name}</h4><p>€${c.price}</p>`;
    div.onclick = () => openCase(c);
    grid.appendChild(div);
  });
}

function openCase(c) {
  selectedCase = c;
  document.getElementById("caseModal").style.display = "flex";
  document.getElementById("caseTitle").innerText = c.name;
}

document.getElementById("openCaseBtn").onclick = () => {
  if (balance < selectedCase.price) return alert("Not enough balance");
  balance -= selectedCase.price;
  updateBalance();

  const win = selectedCase.skins[Math.floor(Math.random() * selectedCase.skins.length)];
  inventory.push(win);
  renderInventory();

  document.getElementById("resultText").innerText = win.name + " (€" + win.value + ")";
  document.getElementById("resultImg").src = win.img;
};

function renderInventory() {
  const inv = document.getElementById("inventoryGrid");
  inv.innerHTML = "";
  inventory.forEach(i => {
    inv.innerHTML += `
      <div class="inv-item ${i.rarity}">
        <img src="${i.img}">
        <p>${i.name}</p>
        <span>€${i.value}</span>
      </div>`;
  });
}

/* ROULETTE */
function placeBet(color) {
  const bet = Number(document.getElementById("betAmount").value);
  if (balance < bet) return alert("No money");

  balance -= bet;
  updateBalance();

  const colors = ["red", "black", "black", "red", "green"];
  const result = colors[Math.floor(Math.random() * colors.length)];

  if (result === color) {
    balance += color === "green" ? bet * 14 : bet * 2;
    updateBalance();
    alert("You won: " + result);
  } else {
    alert("You lost: " + result);
  }
}

updateBalance();
loadCases();
showSection("cases");
