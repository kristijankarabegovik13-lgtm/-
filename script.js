const scene = document.getElementById('scene');
const envelope = document.getElementById('envelope');
const seal = document.getElementById('seal');
const replay = document.getElementById('replay');
const petalLayer = document.getElementById('petalLayer');
const card = document.getElementById('card');
const weddingMusic = document.getElementById('weddingMusic');
const musicToggle = document.getElementById('musicToggle');

const petals = [];
const N = 62;
for (let i=0;i<N;i++){
  const p=document.createElement('span');
  p.className='petal';
  petalLayer.appendChild(p);
  petals.push(p);
}

function scatterPetals(){
  petals.forEach((p,i)=>{
    const x=8+Math.random()*84;
    const y=-8-Math.random()*30;
    p.style.left=x+'%';
    p.style.top=y+'%';
    p.style.opacity='0';
    p.style.transform=`rotate(${Math.random()*360}deg) scale(${.7+Math.random()*.8})`;
  });
}

function heartPoint(t){
  // Classic parametric heart, normalized into card percentages.
  const x=16*Math.pow(Math.sin(t),3);
  const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
  return {x:50+x*1.42, y:53-y*1.32};
}

function formHeart(){
  petals.forEach((p,i)=>{
    const t=(Math.PI*2*i)/N;
    const pt=heartPoint(t);
    const jitter=(i%3-1)*1.4;
    p.style.opacity='1';
    p.style.left=(pt.x+jitter)+'%';
    p.style.top=(pt.y+jitter*.35)+'%';
    p.style.transform=`translate(-50%,-50%) rotate(${(i*37)%360}deg) scale(${.75+(i%5)*.08})`;
  });
}

function burstThenHeart(){
  petals.forEach((p,i)=>{
    const angle=(Math.PI*2*i)/N;
    const radius=15+(i%9)*2.2;
    p.style.transitionDelay=(Math.random()*.18)+'s';
    p.style.opacity='1';
    p.style.left=(50+Math.cos(angle)*radius)+'%';
    p.style.top=(52+Math.sin(angle)*radius*.66)+'%';
    p.style.transform=`translate(-50%,-50%) rotate(${i*29}deg) scale(${.8+(i%4)*.12})`;
  });
  setTimeout(formHeart,950);
}

function openInvitation(){
  if(scene.classList.contains('open')) return;
  scene.classList.add('open');

  weddingMusic.currentTime = 0;
  weddingMusic.volume = 0.75;
  weddingMusic.muted = false;
  weddingMusic.play().then(()=>{
    musicToggle.hidden = false;
    musicToggle.textContent = '🔊';
    musicToggle.setAttribute('aria-label','Исклучи музика');
  }).catch(()=>{
    musicToggle.hidden = false;
    musicToggle.textContent = '▶';
    musicToggle.setAttribute('aria-label','Пушти музика');
  });
  card.setAttribute('aria-hidden','false');
  setTimeout(burstThenHeart,1250);
  setTimeout(()=>{replay.hidden=false;},2800);
}

function resetInvitation(){
  replay.hidden=true;
  musicToggle.hidden=true;
  weddingMusic.pause();
  weddingMusic.currentTime=0;
  scene.classList.remove('open');
  card.setAttribute('aria-hidden','true');
  petals.forEach(p=>p.style.transitionDelay='0s');
  scatterPetals();
}

seal.addEventListener('click',openInvitation);
replay.addEventListener('click',resetInvitation);
musicToggle.addEventListener('click',()=>{
  if(weddingMusic.paused){
    weddingMusic.play();
    weddingMusic.muted=false;
    musicToggle.textContent='🔊';
    musicToggle.setAttribute('aria-label','Исклучи музика');
  } else {
    weddingMusic.muted=!weddingMusic.muted;
    musicToggle.textContent=weddingMusic.muted?'🔇':'🔊';
    musicToggle.setAttribute('aria-label',weddingMusic.muted?'Вклучи музика':'Исклучи музика');
  }
});
seal.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ') openInvitation();});
scatterPetals();
