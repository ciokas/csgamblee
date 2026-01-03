let balance = 100;
let inventory = [];
let currentCase = null;

/* CASES */
const cases = [{
  name:"Starter Case",
  price:5,
  img:"assets/img/starter_case.png",
  skins:[
    {name:"AK-47 | Redline",value:25,rarity:"rare",img:"assets/img/ak47_redline.png"},
    {name:"AWP | Asiimov",value:60,rarity:"epic",img:"assets/img/awp_asiimov.png"},
    {name:"★ Karambit | Doppler",value:950,rarity:"legendary",img:"assets/img/karambit_doppler.png"}
  ]
}];

/* INIT */
renderCases();
update();

/* UI */
function show(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
function update(){
  balance=Math.round(balance*100)/100;
  document.getElementById("balance").innerText="€"+balance;
}

/* CASES */
function renderCases(){
  const g=document.getElementById("caseGrid");
  g.innerHTML="";
  cases.forEach(c=>{
    const d=document.createElement("div");
    d.className="case-card";
    d.innerHTML=`<img src="${c.img}"><br>${c.name}<br>€${c.price}`;
    d.onclick=()=>openModal(c);
    g.appendChild(d);
  });
}

function openModal(c){
  currentCase=c;
  document.getElementById("caseTitle").innerText=c.name;
  document.getElementById("caseModal").style.display="flex";
}
function closeModal(){
  document.getElementById("caseModal").style.display="none";
}

/* OPEN CASE + MYSTERY */
function openCase(){
  if(balance<currentCase.price)return alert("No balance");
  balance-=currentCase.price;update();

  const strip=document.getElementById("strip");
  strip.innerHTML="";
  strip.style.transition="none";
  strip.style.transform="translateX(0)";

  const win=currentCase.skins[Math.floor(Math.random()*currentCase.skins.length)];

  for(let i=0;i<25;i++){
    const s=currentCase.skins[Math.floor(Math.random()*currentCase.skins.length)];
    strip.innerHTML+=`<div class="item ${s.rarity}"><img src="${s.img}"><br>${s.name}</div>`;
  }

  requestAnimationFrame(()=>{
    strip.style.transition="3s";
    strip.style.transform="translateX(-900px)";
  });

  setTimeout(()=>{
    if(win.rarity==="legendary"){
      document.getElementById("result").innerHTML="<b class='legendary'>CIOKAS</b>";
      setTimeout(()=>legendarySpin(),1000);
    }else{
      inventory.push(win);
      renderInv();
      document.getElementById("result").innerText="Won "+win.name;
    }
  },3000);
}

/* LEGENDARY MYSTERY */
function legendarySpin(){
  const legends=currentCase.skins.filter(s=>s.rarity==="legendary");
  const win=legends[Math.floor(Math.random()*legends.length)];
  inventory.push(win);
  renderInv();
  document.getElementById("result").innerText="LEGENDARY → "+win.name;
}

/* INVENTORY */
function renderInv(){
  const i=document.getElementById("inv");
  i.innerHTML="";
  inventory.forEach(s=>{
    i.innerHTML+=`<div class="inv-item ${s.rarity}">
      <img src="${s.img}"><br>${s.name}<br>€${s.value}
    </div>`;
  });
}

/* CASE BATTLE */
function startBattle(){
  const my=currentCase?.skins[Math.floor(Math.random()*currentCase.skins.length)];
  const bot=currentCase?.skins[Math.floor(Math.random()*currentCase.skins.length)];
  document.getElementById("battleLog").innerHTML=
    `YOU: ${my.name} (€${my.value})<br>BOT: ${bot.name} (€${bot.value})`;
}

/* ROULETTE */
function spin(color){
  const bet=+document.getElementById("bet").value;
  if(balance<bet)return;
  balance-=bet;update();

  const wheel=document.getElementById("wheel");
  wheel.innerHTML="";
  const pool=[
    ...Array(45).fill("red"),
    ...Array(45).fill("black"),
    ...Array(10).fill("green")
  ];

  for(let i=0;i<40;i++){
    const c=pool[Math.floor(Math.random()*pool.length)];
    wheel.innerHTML+=`<div class="roulette-item ${c}">${c}</div>`;
  }

  const win=pool[Math.floor(Math.random()*pool.length)];
  setTimeout(()=>{
    if(win===color){
      balance+=color==="green"?bet*14:bet*2;
      update();
    }
    alert("Result: "+win);
  },3000);
}
