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
}
