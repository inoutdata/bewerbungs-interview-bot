
let P, I, B, used = new Set();

Promise.all([
  fetch("profile.json").then(r=>r.json()),
  fetch("intents.json").then(r=>r.json()),
  fetch("blocks.json").then(r=>r.json())
]).then(([p,i,b])=>{ P=p; I=i; B=b; });

const pick = a => a[Math.floor(Math.random()*a.length)];
const uniq = f => { let r; do{ r=f(); }while(used.has(r)); used.add(r); return r; };

function detectIntent(q){
  q=q.toLowerCase();
  for(const k in I){
    if(I[k].some(w=>q.includes(w))) return k;
  }
  return "problem";
}

function buildAnswer(intent){
  return uniq(()=>{
    if(intent==="salary") return P.salary + " " + pick(B.counter);
    if(intent==="intro") return `Gerne. ${P.role}. ${P.experience} ` + pick(B.counter);
    let a = `${pick(B.thinking)} ${pick(B.mindset)} ${pick(B.logic)} ${pick(B.examples)}. ${pick(B.counter)}`;
    if(intent==="stress") a += " " + pick(B.stress_addon);
    return a;
  });
}

function speak(t){
  const u = new SpeechSynthesisUtterance(t);
  u.lang="de-DE";
  speechSynthesis.speak(u);
}

function answer(){
  const q=document.getElementById("q").value;
  const i=detectIntent(q);
  const a=buildAnswer(i);
  document.getElementById("a").innerText=a;
  speak(a);
}

function listen(){
  const r=new webkitSpeechRecognition();
  r.lang="de-DE";
  r.onresult=e=>{ document.getElementById("q").value=e.results[0][0].transcript; answer(); };
  r.start();
}
