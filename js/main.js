const skins = [
    { name: "AK-47 | Redline", img: "images/ak47_redline.png", chance: 30 },
    { name: "AWP | Asiimov", img: "images/awp_asiimov.png", chance: 20 },
    { name: "Desert Eagle | Blaze", img: "images/deagle_blaze.png", chance: 20 },
    { name: "M4A4 | Howl", img: "images/m4a4_howl.png", chance: 15 },
    { name: "Karambit | Doppler", img: "images/karambit_doppler.png", chance: 5 }
];

let inventory = [];

function getRandomSkin() {
    let rand = Math.random() * 100;
    let cumulative = 0;

    for (let skin of skins) {
        cumulative += skin.chance;
        if (rand <= cumulative) return skin;
    }
}

function openCase() {
    const skin = getRandomSkin();
    inventory.push(skin);

    document.getElementById("result").innerHTML = `
        <div class="item">
            <img src="${skin.img}">
            <p>${skin.name}</p>
        </div>
    `;

    renderInventory();
}

function renderInventory() {
    const inv = document.getElementById("inventory");
    inv.innerHTML = "";

    inventory.forEach(skin => {
        inv.innerHTML += `
            <div class="item">
                <img src="${skin.img}">
                <p>${skin.name}</p>
            </div>
        `;
    });
}

function playRoulette() {
    const win = Math.random() < 0.45 ? "WIN" : "LOSE";
    document.getElementById("rouletteResult").innerText =
        win === "WIN" ? "🟢 Laimėjai!" : "🔴 Pralaimėjai!";
    let mines = [];
let revealed = [];
let gameActive = false;
let multiplier = 1;

function startMines() {
    const bombCount = parseInt(document.getElementById("bombCount").value);
    mines = [];
    revealed = [];
    gameActive = true;
    multiplier = 1;

    document.getElementById("multiplier").innerText = "1.00x";
    document.getElementById("minesStatus").innerText = "";

    // sugeneruojam minas
    while (mines.length < bombCount) {
        let r = Math.floor(Math.random() * 25);
        if (!mines.includes(r)) mines.push(r);
    }

    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById("minesGrid");
    grid.innerHTML = "";

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = () => clickCell(i, cell);
        grid.appendChild(cell);
    }
}

function clickCell(index, cell) {
    if (!gameActive || revealed.includes(index)) return;

    if (mines.includes(index)) {
        cell.innerText = "💣";
        cell.classList.add("bomb");
        document.getElementById("minesStatus").innerText = "💥 Pralaimėjai!";
        gameActive = false;
        revealAll();
    } else {
        cell.innerText = "💎";
        revealed.push(index);
        multiplier += 0.2;
        document.getElementById("multiplier").innerText = multiplier.toFixed(2) + "x";
    }
}

function revealAll() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
        if (mines.includes(i)) cell.innerText = "💣";
    });
}

function cashoutMines() {
    if (!gameActive) return;
    gameActive = false;
    document.getElementById("minesStatus").innerText =
        "💰 Cashout: " + multiplier.toFixed(2) + "x";
    revealAll();
}

}
