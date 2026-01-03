document.addEventListener("DOMContentLoaded", () => {

  const sections = document.querySelectorAll(".section");
  document.querySelectorAll("[data-section]").forEach(btn => {
    btn.onclick = () => {
      sections.forEach(s => s.classList.remove("active"));
      document.getElementById(btn.dataset.section).classList.add("active");
    };
  });

  const cases = [
    {
      name: "Redline Case",
      price: 0.50,
      img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_redline_light_large.6e0c0f5b1c.png"
    },
    {
      name: "Asiimov Case",
      price: 1.20,
      img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_awp_cu_asiimov_light_large.5f2a6f52ef.png"
    },
    {
      name: "Knife Case",
      price: 5.00,
      img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_karambit_cu_doppler_light_large.0c1e21f6d3.png"
    }
  ];

  const grid = document.getElementById("caseGrid");

  cases.forEach(c => {
    const div = document.createElement("div");
    div.className = "case-card";
    div.innerHTML = `
      <img src="${c.img}">
      <h4>${c.name}</h4>
      <div class="case-price">€${c.price}</div>
    `;
    grid.appendChild(div);
  });

});

