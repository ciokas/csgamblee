/* ===== SKINS ===== */
const skins = [
    { name: "AK-47 | Redline", img: "images/ak47_redline.png", chance: 30, value: 15 },
    { name: "AWP | Asiimov", img: "images/awp_asiimov.png", chance: 20, value: 25 },
    { name: "Desert Eagle | Blaze", img: "images/deagle_blaze.png", chance: 20, value: 20 },
    { name: "M4A4 | Howl", img: "images/m4a4_howl.png", chance: 15, value: 40 },
    { name: "Karambit | Doppler", img: "images/karambit_doppler.png", chance: 5, value: 80 }
];

let inventory = [];

/* ===== RNG ===== */
function getRandomSkin() {
    let rand = Math.random() * 100;
    let total = 0;
    for (let s of skins) {
        total += s.chance;
        if (rand <= total) return s;
    }
}

/* ===== CASE OPEN ===== */
function openCase() {
    const skin = getRandomSkin();
    inventory.push(skin);

    document.getElementById("caseResult").innerHTML = `
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
    inventory.forEach(s => {
        inv.innerHTML += `
            <div class="item">
                <img src="${s.img}">
                <small>${s.name}</small>
            </div>
        `;
    });
}

/* ===== MINES ===== */
let mines = [], revealed = [], gameActive = false, multiplier = 1;

function startMines() {
    mines = [];
    revealed = [];
    multiplier = 1;
    gameActive = true;

    document.getElementById("multiplier").innerText = "1.00x";
    document.getElementById("minesStatus").innerText = "";

    let count = parseInt(document.getElementById("bombCount").value);
    while (mines.length < count) {
        let r = Math.floor(Math.random() * 25);
        if (!mines.includes(r)) mines.push(r);
    }
    renderGrid();
}

function renderGrid() {
    const g = document.getElementById("minesGrid");
    g.innerHTML = "";
    for (let i = 0; i < 25; i++) {
        const c = document.createElement("div");
        c.className = "cell";
        c.onclick = () => clickCell(i, c);
        g.appendChild(c);
    }
}

function clickCell(i, c) {
    if (!gameActive || revealed.includes(i)) return;
    if (mines.includes(i)) {
        c.innerText = "💣";
        gameActive = false;
        document.getElementById("minesStatus").innerText = "💥 Pralaimėjai";
        revealAll();
    } else {
        c.innerText = "💎";
        revealed.push(i);
        multiplier += 0.2;
        document.getElementById("multiplier").innerText = multiplier.toFixed(2) + "x";
    }
}

function revealAll() {
    document.querySelectorAll(".cell").forEach((c, i) => {
        if (mines.includes(i)) c.innerText = "💣";
    });
}

function cashoutMines() {
    if (!gameActive) return;
    gameActive = false;
    document.getElementById("minesStatus").innerText =
        "💰 Cashout: " + multiplier.toFixed(2) + "x";
    revealAll();
}

/* ===== CASE BATTLE ===== */
function rollItem(s) {
    return `<div class="roll-item"><img src="${s.img}"></div>`;
}

function startAnimatedBattle() {
    const pRoll = document.getElementById("playerRoll");
    const bRoll = document.getElementById("botRoll");
    pRoll.innerHTML = "";
    bRoll.innerHTML = "";

    const pFinal = getRandomSkin();
    const bFinal = getRandomSkin();

    for (let i = 0; i < 25; i++) {
        pRoll.innerHTML += rollItem(getRandomSkin());
        bRoll.innerHTML += rollItem(getRandomSkin());
    }

    pRoll.innerHTML += rollItem(pFinal);
    bRoll.innerHTML += rollItem(bFinal);

    pRoll.style.transform = "translateX(-3000px)";
    bRoll.style.transform = "translateX(-3000px)";

    setTimeout(() => {
        let res = "🤝 Lygiosios";
        if (pFinal.value > bFinal.value) {
            res = "🏆 TU LAIMĖJAI!";
            inventory.push(pFinal);
        } else if (pFinal.value < bFinal.value) {
            res = "🤖 BOTAS LAIMĖJO!";
        }
        document.getElementById("battleResult").innerText = res;
        renderInventory();
    }, 2600);
}
