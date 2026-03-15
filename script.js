/* ============================================================
   script.js — Rachita's Birthday Site v2
   9 pages · Tabbed gallery · Lightbox nav · Polaroid · Trio
   ============================================================ */

/* ── CUSTOM CURSOR ── */
(function(){
  const dot=document.createElement('div');dot.className='cursor-dot';
  const ring=document.createElement('div');ring.className='cursor-ring';
  document.body.append(dot,ring);
  let mx=-100,my=-100,rx=-100,ry=-100;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  document.addEventListener('mouseleave',()=>{mx=-200;my=-200});
  (function loop(){
    rx+=(mx-rx)*0.14;ry+=(my-ry)*0.14;
    dot.style.left=mx+'px';dot.style.top=my+'px';
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  function addHover(sel){
    document.querySelectorAll(sel).forEach(el=>{
      el.addEventListener('mouseenter',()=>ring.classList.add('big'));
      el.addEventListener('mouseleave',()=>ring.classList.remove('big'));
    });
  }
  addHover('button,a,.g-item,.f-photo,.trio-item,.polaroid,.q-card,.cf-frame');
})();

/* ── NAVIGATION ── */
function goTo(url){
  const w=document.querySelector('.page-wrap');
  if(w){w.classList.add('fade-out');setTimeout(()=>location.href=url,650);}
  else location.href=url;
}
document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>goTo(el.dataset.nav)));

/* ── STAR FIELD ── */
function buildStars(){
  const sf=document.querySelector('.star-field');if(!sf)return;
  for(let i=0;i<140;i++){
    const s=document.createElement('div');s.className='star';
    const sz=0.8+Math.random()*2;
    s.style.cssText=`width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-duration:${2+Math.random()*5}s;animation-delay:${Math.random()*6}s`;
    sf.appendChild(s);
  }
}

/* ── PARTICLE CANVAS ── */
function initParticles(){
  const canvas=document.getElementById('particleCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');let W,H,pts=[];
  function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
  resize();addEventListener('resize',resize);
  const cols=['rgba(232,165,152,','rgba(212,184,150,','rgba(94,207,198,','rgba(191,95,160,','rgba(232,201,122,','rgba(184,168,232,'];
  for(let i=0;i<60;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:-0.15-Math.random()*.25,r:0.8+Math.random()*1.8,op:0.08+Math.random()*0.25,color:cols[Math.floor(Math.random()*cols.length)]});
  (function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.y<-10){p.y=H+10;p.x=Math.random()*W;}
      if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color+p.op+')';ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ── GALLERY TABS ── */
function initGalleryTabs(){
  const tabs=document.querySelectorAll('.g-tab');if(!tabs.length)return;
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.g-section').forEach(s=>s.classList.remove('show'));
      tab.classList.add('active');
      const target=document.getElementById(tab.dataset.section);
      if(target){target.classList.add('show');observeItems(target);}
    });
  });
  // Show first tab
  const first=tabs[0];if(first){first.classList.add('active');const sec=document.getElementById(first.dataset.section);if(sec){sec.classList.add('show');observeItems(sec);}}
}

/* ── INTERSECTION OBSERVER (gallery items) ── */
function observeItems(root){
  const items=(root||document).querySelectorAll('.g-item,.polaroid,.trio-item,.q-card,.tog-item,.film-card');
  if(!items.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach((e,idx)=>{
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),idx*60);io.unobserve(e.target);}
    });
  },{threshold:0.06});
  items.forEach(i=>{if(!i.classList.contains('visible'))io.observe(i);});
}

/* ── LIGHTBOX with prev/next ── */
let lbImages=[],lbIdx=0;
function initLightbox(){
  const lb=document.getElementById('lightbox');
  const img=document.getElementById('lbImg');
  if(!lb||!img)return;

  function openLb(imgs,idx){
    lbImages=imgs;lbIdx=idx;
    img.src=lbImages[lbIdx];
    lb.classList.add('open');
  }

  // Attach to all sections
  document.querySelectorAll('.g-item').forEach((item,i,arr)=>{
    item.addEventListener('click',()=>{
      const allInSection=[...item.closest('.g-grid,.g-together-grid,.g-child-grid,.g-together-grid')?.querySelectorAll('.g-item img')||[]].map(im=>im.src);
      const myIdx=allInSection.indexOf(item.querySelector('img').src);
      openLb(allInSection.length?allInSection:[item.querySelector('img').src],myIdx>=0?myIdx:0);
    });
  });

  document.getElementById('lbClose')?.addEventListener('click',()=>lb.classList.remove('open'));
  lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open');});
  document.getElementById('lbPrev')?.addEventListener('click',e=>{e.stopPropagation();lbIdx=(lbIdx-1+lbImages.length)%lbImages.length;img.src=lbImages[lbIdx];});
  document.getElementById('lbNext')?.addEventListener('click',e=>{e.stopPropagation();lbIdx=(lbIdx+1)%lbImages.length;img.src=lbImages[lbIdx];});
  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('open'))return;
    if(e.key==='ArrowLeft'&&lbImages.length>1){lbIdx=(lbIdx-1+lbImages.length)%lbImages.length;img.src=lbImages[lbIdx];}
    if(e.key==='ArrowRight'&&lbImages.length>1){lbIdx=(lbIdx+1)%lbImages.length;img.src=lbImages[lbIdx];}
    if(e.key==='Escape')lb.classList.remove('open');
  });
}

/* ── FRIENDSHIP SLIDE ── */
function initFriendship(){
  const photos=document.querySelectorAll('.f-photo');if(!photos.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:0.15});
  photos.forEach(p=>io.observe(p));
}

/* ── CHILDHOOD REVEAL ── */
function initChildhood(){
  const frame=document.querySelector('.cf-frame');
  const text=document.querySelector('.cf-text');
  if(!frame&&!text)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');io.unobserve(e.target);
      }
    });
  },{threshold:0.2});
  if(frame)io.observe(frame);
  if(text)io.observe(text);
}

/* ── TOGETHER TRIO REVEAL ── */
function initTogether(){
  const items=document.querySelectorAll('.trio-item');if(!items.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);}});
  },{threshold:0.18});
  items.forEach(i=>io.observe(i));
}

/* ── QUOTES REVEAL ── */
function initQuotes(){
  const cards=document.querySelectorAll('.q-card');if(!cards.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach((e,idx)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),idx*100);io.unobserve(e.target);}});
  },{threshold:0.12});
  cards.forEach(c=>io.observe(c));
}

/* ── ORBIT (surprise) ── */
function buildOrbit(){
  const wrap=document.getElementById('orbitWrap');if(!wrap)return;
  [{radius:180,dur:22,icons:['🌸','💕']},{radius:260,dur:30,icons:['✨','🎀','🌷']},{radius:340,dur:40,icons:['💫','🎊','🌺','💝']}].forEach(ring=>{
    const el=document.createElement('div');el.className='orb-ring';
    el.style.cssText=`width:${ring.radius*2}px;height:${ring.radius*2}px;animation-duration:${ring.dur}s`;
    ring.icons.forEach((icon,i)=>{
      const span=document.createElement('span');span.className='orb-icon';span.textContent=icon;
      const angle=(i/ring.icons.length)*360;
      span.style.cssText=`position:absolute;font-size:1.4rem;top:50%;left:50%;transform:rotate(${angle}deg) translateX(${ring.radius}px);animation-duration:${ring.dur}s;margin:-12px 0 0 -12px`;
      el.appendChild(span);
    });
    wrap.appendChild(el);
  });
}

/* ── CONFETTI ── */
function confetti(){
  const cols=['#e8a598','#d4b896','#5ecfc6','#eddcb8','#f2ccc4','#bf5fa0','#fff','#e8c97a','#b8a8e8'];
  for(let i=0;i<220;i++){
    const c=document.createElement('div');c.className='cf';
    const sz=5+Math.random()*10;
    c.style.cssText=`left:${Math.random()*100}vw;top:-20px;width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random()*cols.length)]};border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${2+Math.random()*3.5}s;animation-delay:${Math.random()*0.9}s`;
    document.body.appendChild(c);c.addEventListener('animationend',()=>c.remove());
  }
}

/* ── BALLOONS ── */
function balloons(){
  ['🎈','🎀','🎊','🎉','💝','🌸','🎁','✨','💕','🌺'].forEach((b,i)=>{
    setTimeout(()=>{
      const el=document.createElement('div');el.className='bl';el.textContent=b;
      el.style.cssText=`left:${5+Math.random()*90}vw;bottom:-80px;font-size:${2.5+Math.random()*2}rem;animation-duration:${4+Math.random()*5}s`;
      document.body.appendChild(el);el.addEventListener('animationend',()=>el.remove());
    },i*200);
  });
}

/* ── MEMORY TYPEWRITER ── */
function typewrite(el,text,speed,cb){
  if(!el)return;
  let i=0;el.textContent='';
  const cur=document.createElement('span');cur.className='tw-cursor';el.after(cur);
  function step(){
    if(i<text.length){el.textContent+=text[i++];setTimeout(step,speed+Math.random()*22);}
    else{setTimeout(()=>cur.remove(),900);if(cb)cb();}
  }
  step();
}
function initMemory(){
  const el=document.getElementById('twText');if(!el)return;
  setTimeout(()=>{
    typewrite(el,"Happy Birthday to the most amazing girl I know, Rachita. You are not just my best friend — you are one of the most beautiful, extraordinary parts of my life.",40,()=>{
      document.getElementById('mBtn')?.classList.add('show');
    });
  },1500);
}

/* ── CELEBRATE ── */
function initCelebrate(){
  const btn=document.getElementById('celBtn');if(!btn)return;
  let fired=false;
  btn.addEventListener('click',()=>{
    confetti();balloons();
    if(!fired){fired=true;setTimeout(confetti,700);setTimeout(confetti,1400);setTimeout(balloons,500);setTimeout(()=>document.getElementById('afterW')?.classList.add('show'),1200);}
  });
}

/* ── GLITCH ── */
function initGlitch(){
  const name=document.getElementById('glitchName');if(!name)return;
  setInterval(()=>{
    if(Math.random()>0.92){
      name.style.textShadow=`${(Math.random()-.5)*6}px 0 var(--teal), ${(Math.random()-.5)*-6}px 0 var(--magenta)`;
      setTimeout(()=>name.style.textShadow='none',80);
    }
  },1200);
}

/* ── PROGRESS DOTS ── */
function setDots(){
  const pages=['index.html','memory.html','gallery1.html','gallery2.html','gallery3.html','gallery4.html','gallery5.html','gallery6.html','gallery7.html','gallery8.html','friendship.html','childhood.html','together.html','quotes.html','message.html','surprise.html'];
  const file=location.pathname.split('/').pop()||'index.html';
  const cur=pages.indexOf(file);
  document.querySelectorAll('.p-dot').forEach((d,i)=>{
    d.classList.remove('active','done');
    if(i===cur)d.classList.add('active');
    else if(i<cur)d.classList.add('done');
  });
}

/* ── MUSIC ── */
let audio=null,playing=false;
function toggleMusic(){
  const btn=document.getElementById('musicBtn');
  if(!audio){audio=new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');audio.loop=true;audio.volume=0.28;}
  if(!playing){audio.play().then(()=>{playing=true;if(btn)btn.innerHTML='⏸ &nbsp;Pause';}).catch(()=>{if(btn)btn.textContent='🎵 Place audio file';});}
  else{audio.pause();playing=false;if(btn)btn.innerHTML='🎵 &nbsp;Play Music';}
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',()=>{
  buildStars();
  initParticles();
  initGalleryTabs();
  observeItems();
  initLightbox();
  initFriendship();
  initChildhood();
  initTogether();
  initQuotes();
  buildOrbit();
  initMemory();
  initCelebrate();
  initGlitch();
  setDots();
});
