let balance=100;
let inventory=[];
let selectedCase=null;

const cases=[{
  name:"Starter Case",
  price:5,
  img:"assets/img/starter_case.png",
  skins:[
    {name:"AK-47 | Redline",value:25,rarity:"rare",img:"assets/img/ak47_redline.png"},
    {name:"AWP | Asiimov",value:60,rarity:"epic",img:"assets/img/awp_asiimov.png"},
    {name:"★ Karambit | Doppler",value:950,rarity:"legendary",img:"assets/img/karambit_doppler.png"}
  ]
}];

document.addEventListener("DOMContentLoaded",()=>{
  updateBalance();loadCases();showSection("cases");
});

function updateBalance(){
  document.querySelector(".balance").innerText=`Balance: €${balance.toFixed(2)}`;
}

function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function loadCases(){
  const g=document.getElementById("caseGrid");
  g.innerHTML="";
  cases.forEach(c=>{
    const d=document.createElement("div");
    d.className="case-card";
    d.innerHTML=`<img src="${c.img}" width="90"><h4>${c.name}</h4><p>€${c.price}</p>`;
    d.onclick=()=>openCase(c);
    g.appendChild(d);
  });
}

function openCase(c){
  selectedCase=c;
  document.getElementById("caseTitle").innerText=c.name;
  document.getElementById("caseModal").style.display="flex";
}

function closeCase(){
  document.getElementById("caseModal").style.display="none";
}

document.getElementById("openCaseBtn").onclick=()=>{
  const count=Number(document.getElementById("caseCount").value);
  const insta=document.getElementById("instaSpin").checked;
  const price=selectedCase.price*count;
  if(balance<price)return alert("Not enough balance");
  balance-=price;updateBalance();

  const strip=document.getElementById("caseStrip");
  strip.innerHTML="";
  strip.style.transition="none";
  strip.style.transform="translateX(0)";

  const speed=insta?600:3000;
  let wins=[];

  for(let i=0;i<count;i++){
    let roll=Math.random();
    let win;
    if(roll<0.03) win=selectedCase.skins.find(s=>s.rarity==="legendary");
    else if(roll<0.15) win=selectedCase.skins.find(s=>s.rarity==="epic");
    else win=selectedCase.skins[0];
    wins.push(win);
  }

  const items=[];
  for(let i=0;i<40;i++){
    items.push(selectedCase.skins[Math.floor(Math.random()*selectedCase.skins.length)]);
  }
  items.splice(20,wins.length,...wins);

  items.forEach(s=>{
    const d=document.createElement("div");
    d.className="caseItem";
    d.innerHTML=`<img src="${s.img}" width="60"><br><small>${s.name}</small>`;
    strip.appendChild(d);
  });

  requestAnimationFrame(()=>{
    strip.style.transition=`transform ${speed}ms cubic-bezier(.15,.8,.2,1)`;
    strip.style.transform="translateX(-1800px)";
  });

  setTimeout(()=>{
    wins.forEach(w=>{
      if(w.rarity==="legendary") mysterySpin(w);
      else inventory.push(w);
    });
    renderInventory();
  },speed+100);
};

function mysterySpin(item){
  const legends=selectedCase.skins.filter(s=>s.rarity==="legendary");
  const final=legends[Math.floor(Math.random()*legends.length)];
  inventory.push(final);
}

function renderInventory(){
  const inv=document.getElementById("inventoryGrid");
  inv.innerHTML="";
  inventory.forEach((i,idx)=>{
    const d=document.createElement("div");
    d.className="inv-item";
    d.innerHTML=`
      <img src="${i.img}" width="60">
      <p>${i.name}</p>
      <span>€${i.value}</span>
      <button class="sell-btn" onclick="sellItem(${idx})">Sell</button>
    `;
    inv.appendChild(d);
  });
}

function sellItem(i){
  balance+=inventory[i].value;
  inventory.splice(i,1);
  updateBalance();
  renderInventory();
}

/* ROULETTE – real chances */
function placeBet(color){
  const bet=Number(betAmount.value);
  if(bet<=0||balance<bet)return alert("Invalid bet");
  balance-=bet;updateBalance();

  const wheel=document.getElementById("rouletteWheel");
  wheel.innerHTML="";
  wheel.style.transition="none";
  wheel.style.transform="translateX(0)";

  const layout=[];
  for(let i=0;i<24;i++) layout.push("red","black");
  layout.push("green");

  const seq=[];
  for(let i=0;i<60;i++){
    seq.push(layout[Math.floor(Math.random()*layout.length)]);
    const d=document.createElement("div");
    d.className=`roulette-item ${seq[i]}`;
    d.innerText=seq[i].toUpperCase();
    wheel.appendChild(d);
  }

  const winIndex=Math.floor(Math.random()*seq.length);
  const offset=winIndex*80-200;

  requestAnimationFrame(()=>{
    wheel.style.transition="transform 3s cubic-bezier(.15,.8,.2,1)";
    wheel.style.transform=`translateX(-${offset}px)`;
  });

  setTimeout(()=>{
    if(seq[winIndex]===color){
      balance+=color==="green"?bet*14:bet*2;
    }
    updateBalance();
  },3100);
}
