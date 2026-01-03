document.addEventListener("DOMContentLoaded", () => {

  // NAV
  const sections = document.querySelectorAll(".section");
  document.querySelectorAll("[data-section]").forEach(btn => {
    btn.onclick = () => {
      sections.forEach(s => s.classList.remove("active"));
      document.getElementById(btn.dataset.section).classList.add("active");
    };
  });

  // CASE DATA
  const cases = [
    {
      name: "Redline Case",
      price: 0.50,
      img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_redline_light_large.6e0c0f5b1c.png",
      skins: [
        {name:"AK-47 | Redline", rarity:"common", img:"https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_redline_light_large.6e0c0f5b1c.png", value:25},
        {name:"AWP | Asiimov", rarity:"rare", img:"https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_awp_cu_asiimov_light_large.5f2a6f52ef.png", value:60},
        {name:"★ Karambit | Doppler", rarity:"legendary", img:"https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_karambit_cu_doppler_light_large.0c1e21f6d3.png", value:950}
      ]
    }
  ];

  const grid = document.getElementById("caseGrid");
  const modal = document.getElementById("caseModal");
  const strip = document.getElementById("caseStrip");
  const title = document.getElementById("caseTitle");

  cases.forEach(c => {
    const div = document.createElement("div");
    div.className = "case-card";
    div.innerHTML = `
      <img src="${c.img}">
      <h4>${c.name}</h4>
      <div class="case-price">€${c.price}</div>
    `;
    div.onclick = () => openCase(c);
    grid.appendChild(div);
  });

  let currentCase;

  function openCase(c) {
    currentCase = c;
    title.innerText = c.name;
    modal.classList.add("active");
    strip.innerHTML = "";
    document.getElementById("resultImg").style.display = "none";
    document.getElementById("resultText").innerText = "";
  }

  document.getElementById("openCaseBtn").onclick = () => {
    strip.innerHTML = "";
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";
    strip.style.filter = "blur(3px)";

    const total = 30;
    const center = Math.floor(total / 2);
    const win = currentCase.skins[Math.floor(Math.random() * currentCase.skins.length)];

    for (let i = 0; i < total; i++) {
      const skin = i === center ? win :
        currentCase.skins[Math.floor(Math.random() * currentCase.skins.length)];

      const div = document.createElement("div");
      div.className = `caseItem ${skin.rarity}`;
      div.innerHTML = `<img src="${skin.img}"><br>${skin.name}`;
      strip.appendChild(div);
    }

    requestAnimationFrame(() => {
      strip.style.transition = "transform 3.2s cubic-bezier(0.15,0.8,0.2,1)";
      strip.style.transform = `translateX(${-(center * 110 - 260)}px)`;
    });

    setTimeout(() => {
      strip.style.filter = "blur(0)";
      document.getElementById("resultText").innerHTML =
        `🎉 You won <b style="color:#22c55e">${win.name}</b> (€${win.value})`;
      const img = document.getElementById("resultImg");
      img.src = win.img;
      img.style.display = "block";
    }, 3300);
  };

  modal.onclick = e => {
    if (e.target === modal) modal.classList.remove("active");
  };

});
