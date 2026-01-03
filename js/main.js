/* =========================
  GLOBAL STATE
========================= */
let balance = 100;
let inventory = [];
let selectedCases = [];
let xp = 0;
let level = 1;

/* =========================
  CASE DATA
========================= */
const cases = [
  {
    name:"Starter Case",
    price:5,
    img:"assets/img/starter_case.png",
    skins:[
      {name:"AK-47 | Redline", value:25, rarity:"rare", img:"assets/img/ak47_redline.png"},
      {name:"AWP | Asiimov", value:60, rarity:"epic", img:"assets/img/awp_asiimov.png"},
      {name:"★ Karambit | Doppler", value:950, rarity:"legendary", img:"assets/img/karambit_doppler.png"}
    ]
  },
  {
    name:"Blue Case",
    price:15,
    img:"assets/img/blue_case.png",
    skins:[
      {name:"M4A4 | Howl", value:800, rarity:"legendary", img:"assets/img/m4a4_howl.png"},
      {name:"Desert Eagle | Blaze", value:150, rarity:"epic", img:"assets/img/deagle_blaze.png"}
    ]
  }
];

/* =========================
  INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  updateBalance();
  loadCases();
  showSection("cases");
  renderInventory();
  document.getElementById("closeCaseModalBtn").onclick = () => {
    document.getElementById("caseModal").style.display = "none";
  };
});

/* =========================
  UI HELPERS
========================= */
function updateBalance(){document.querySelector(".balance").innerText=`Balance: €${balance.toFixed(2)}`;}
function showSection(id){document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));document.getElementById(id).classList.remove("hidden");}

/* =========================
  CASES
========================= */
function loadCases(){
  const grid = document.getElementById("caseGrid");
  grid.innerHTML="";
  cases.forEach(c=>{
    const div=document.createElement("div");
    div.className="case-card";
    div.innerHTML=`<img src="${c.img}" width="80"><h4>${c.name}</h4><p>€${c.price}</p>`;
    div.onclick=()=>openCases([c]);
    grid.appendChild(div);
  });
}

function openCases(selected){
  const multi=document.getElementById("multiOpen").value;
  selectedCases=[];
  for(let i=0;i<Number(multi);i++){selectedCases.push(...selected);}
  const container=document.getElementById("spinnerContainer");
  container.innerHTML="";
  selectedCases.forEach((c,i)=>{
    const div=document.createElement("div");
    div.className="spinner";
    div.id="caseStrip_"+i;
    container.appendChild(div);
  });
  document.getElementById("caseModal").style.display="flex";
  startCaseOpen(0);
}

function startCaseOpen(index){
  if(index>=selectedCases.length)return;
  const c=selectedCases[index];
  if(balance<c.price){alert("Not enough balance");return;}
  balance-=c.price;
  updateBalance();

  const strip=document.getElementById("caseStrip_"+index);
  strip.innerHTML="";
  const total=30;
  const center=Math.floor(total/2);
  const winSkin=c.skins[Math.floor(Math.random()*c.skins.length)];

  for(let i=0;i<total;i++){
    const skin=i===center?winSkin:c.skins[Math.floor(Math.random()*c.skins.length)];
    const div=document.createElement("div");
    div.className=`caseItem ${skin.rarity}`;
    div.innerHTML=`<img src="${skin.img}" width="60" height="60"><br><small>${skin.name}</small>`;
    strip.appendChild(div);
  }

  strip.style.transform="translateX(0)";
  strip.style.transition="transform 3.2s cubic-bezier(0.15,0.8,0.2,1)";
  strip.style.transform=`translateX(${-(center*110-200)}px)`;

  setTimeout(()=>{
    inventory.push(winSkin);
    renderInventory();
    xp+=10;checkLevel();
    if(winSkin.rarity==="legendary"){startMysterySpin(winSkin);}
    startCaseOpen(index+1);
  },3300);
}

function renderInventory(){
  const inv=document.getElementById("inventoryGrid");
  inv.innerHTML="";
  inventory.forEach(item=>{
    const div=document.createElement("div");
    div.className=`inv-item ${item.rarity}`;
    div.innerHTML=`<img src="${item.img}" width="60"><p>${item.name}</p><span>€${item.value}</span>`;
    inv.appendChild(div);
  });
}

/* =========================
  LEVEL SYSTEM
========================= */
function checkLevel(){
  const needed=level*100;
  if(xp>=needed){level++;xp-=needed;updateProfile();}
  updateProfile();
}
function updateProfile(){
  document.getElementById("xpCount").innerText=xp;
  document.getElementById("levelCount").innerText=level;
}

/* =========================
  MYSTERY SPIN
========================= */
function startMysterySpin(legendarySkin){
  alert("Legendary obtained! Mystery Spin!");
  // čia galime atidaryti modal su mygtuku spin ir parodyti tik legendary skins
}

/* =========================
  ROULETTE
========================= */
function placeBet(color){
  const bet=Number(document.getElementById("betAmount").value);
  if(bet<=0||balance<bet){alert("Invalid bet");return;}
  balance-=bet;updateBalance();

  const wheel=document.getElementById("rouletteWheel");
  wheel.innerHTML="";

  const segments=[];
  const colors=[];

  // reali tikimybė: red 45%, black 45%, green 10%
  for(let i=0;i<45;i++){segments.push("red");}
  for(let i=0;i<45;i++){segments.push("black");}
  for(let i=0;i<10;i++){segments.push("green");}

  segments.forEach(c=>{
    const div=document.createElement("div");
    div.className=`roulette-item ${c}`;
    div.innerText=c.toUpperCase();
    wheel.appendChild(div);
  });

  const winIndex=Math.floor(Math.random()*segments.length);
  const offset=winIndex*80-wheel.offsetWidth/2+40;

  wheel.style.transition="transform 3s cubic-bezier(0.15,0.8,0.2,1)";
  wheel.style.transform=`translateX(-${offset}px)`;

  setTimeout(()=>{
    const result=segments[winIndex];
    let winAmount=0;
    if(result===color)winAmount=color==="green"?bet*14:bet*2;
    balance+=winAmount;updateBalance();
    alert(winAmount>0?`You won €${winAmount}! (${result})`:`You lost! Result: ${result}`);
  },3100);
}

/* =========================
  CASE BATTLE, MINI GAMES
========================= */
function startTower(){alert("Tower mini game start");}
function startMines(){alert("Mines mini game start");}
function startCrash(){alert("Crash mini game start");}
document.getElementById("startBattleBtn").onclick=()=>{alert("Case Battle start vs Bot!");};
document.getElementById("sellAllBtn").onclick=()=>{balance+=inventory.reduce((a,i)=>a+i.value,0);inventory=[];renderInventory();updateBalance();};
