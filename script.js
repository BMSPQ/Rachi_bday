/* ============================================================
   script.js — Rachita's Birthday Site — Final v5
   16 pages · 8 gallery chapters · Fireworks · Lightbox
   Dev password · Auto-unlock March 30 2026
   ============================================================ */

/* ── CUSTOM CURSOR ─────────────────────────────────────── */
(function(){
  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { mx = -200; my = -200; });
  (function loop(){
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.left  = mx + 'px';  dot.style.top  = my + 'px';
    ring.style.left = rx + 'px';  ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  function addHover(sel){
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('big'));
      el.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });
  }
  addHover('button,a,.g-item,.f-photo,.trio-item,.polaroid,.q-card,.cf-frame,.dp-lnk');
})();

/* ── PAGE NAVIGATION (with fade-out transition) ────────── */
function goTo(url){
  const w = document.querySelector('.page-wrap');
  if(w){ w.classList.add('fade-out'); setTimeout(() => location.href = url, 650); }
  else  { location.href = url; }
}
document.querySelectorAll('[data-nav]').forEach(el =>
  el.addEventListener('click', () => goTo(el.dataset.nav))
);

/* ── STAR FIELD ─────────────────────────────────────────── */
function buildStars(){
  const sf = document.querySelector('.star-field');
  if(!sf) return;
  for(let i = 0; i < 140; i++){
    const s  = document.createElement('div');
    s.className = 'star';
    const sz = 0.8 + Math.random() * 2;
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-duration:${2+Math.random()*5}s;animation-delay:${Math.random()*6}s`;
    sf.appendChild(s);
  }
}

/* ── PARTICLE CANVAS (floating dust) ───────────────────── */
function initParticles(){
  const canvas = document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  addEventListener('resize', resize);
  const cols = ['rgba(232,165,152,','rgba(212,184,150,','rgba(94,207,198,','rgba(191,95,160,','rgba(232,201,122,','rgba(184,168,232,'];
  for(let i = 0; i < 60; i++){
    pts.push({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.3, vy:-0.15-Math.random()*.25,
      r:0.8+Math.random()*1.8, op:0.08+Math.random()*0.25,
      color:cols[Math.floor(Math.random()*cols.length)]
    });
  }
  (function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.y < -10){ p.y = H+10; p.x = Math.random()*W; }
      if(p.x < -10) p.x = W+10;
      if(p.x > W+10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color + p.op + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ── GALLERY: INTERSECTION OBSERVER ────────────────────── */
function observeItems(root){
  const sel = '.g-item,.polaroid,.trio-item,.q-card,.tog-item,.film-card';
  const items = (root||document).querySelectorAll(sel);
  if(!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if(e.isIntersecting){
        setTimeout(() => e.target.classList.add('visible'), idx * 60);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });
  items.forEach(i => { if(!i.classList.contains('visible')) io.observe(i); });
}

/* ── LIGHTBOX (with prev / next / keyboard) ─────────────── */
let lbImages = [], lbIdx = 0;
function initLightbox(){
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  if(!lb || !img) return;

  function openLb(imgs, idx){
    lbImages = imgs; lbIdx = idx;
    img.src = lbImages[lbIdx];
    lb.classList.add('open');
  }

  document.querySelectorAll('.g-item').forEach(item => {
    item.addEventListener('click', () => {
      // Collect all images in the same grid container
      const parent = item.closest('.gl-a,.gl-b,.gl-c,.gl-d,.gl-e,.gl-f,.gl-g,.gl-h,.g-grid,.g-together-grid,.g-child-grid');
      const all = parent
        ? [...parent.querySelectorAll('.g-item img')].map(im => im.src)
        : [item.querySelector('img').src];
      const myIdx = all.indexOf(item.querySelector('img').src);
      openLb(all, myIdx >= 0 ? myIdx : 0);
    });
  });

  document.getElementById('lbClose')?.addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', e => { if(e.target === lb) lb.classList.remove('open'); });
  document.getElementById('lbPrev')?.addEventListener('click', e => {
    e.stopPropagation();
    lbIdx = (lbIdx - 1 + lbImages.length) % lbImages.length;
    img.src = lbImages[lbIdx];
  });
  document.getElementById('lbNext')?.addEventListener('click', e => {
    e.stopPropagation();
    lbIdx = (lbIdx + 1) % lbImages.length;
    img.src = lbImages[lbIdx];
  });
  document.addEventListener('keydown', e => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'ArrowLeft'  && lbImages.length > 1){ lbIdx = (lbIdx-1+lbImages.length)%lbImages.length; img.src = lbImages[lbIdx]; }
    if(e.key === 'ArrowRight' && lbImages.length > 1){ lbIdx = (lbIdx+1)%lbImages.length; img.src = lbImages[lbIdx]; }
    if(e.key === 'Escape') lb.classList.remove('open');
  });
}

/* ── FRIENDSHIP: slide-in photos ───────────────────────── */
function initFriendship(){
  const photos = document.querySelectorAll('.f-photo');
  if(!photos.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  photos.forEach(p => io.observe(p));
}

/* ── CHILDHOOD: reveal photo + text ────────────────────── */
function initChildhood(){
  const frame = document.querySelector('.cf-frame');
  const text  = document.querySelector('.cf-text');
  if(!frame && !text) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  if(frame) io.observe(frame);
  if(text)  io.observe(text);
}

/* ── TOGETHER: trio reveal ──────────────────────────────── */
function initTogether(){
  const items = document.querySelectorAll('.trio-item');
  if(!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } });
  }, { threshold: 0.18 });
  items.forEach(i => io.observe(i));
}

/* ── QUOTES: staggered reveal ───────────────────────────── */
function initQuotes(){
  const cards = document.querySelectorAll('.q-card');
  if(!cards.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if(e.isIntersecting){
        setTimeout(() => e.target.classList.add('visible'), idx * 100);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  cards.forEach(c => io.observe(c));
}

/* ── ORBIT DECORATION (surprise page) ───────────────────── */
function buildOrbit(){
  const wrap = document.getElementById('orbitWrap');
  if(!wrap) return;
  [
    {radius:180, dur:22, icons:['🌸','💕']},
    {radius:260, dur:30, icons:['✨','🎀','🌷']},
    {radius:340, dur:40, icons:['💫','🎊','🌺','💝']},
  ].forEach(ring => {
    const el = document.createElement('div');
    el.className = 'orb-ring';
    el.style.cssText = `width:${ring.radius*2}px;height:${ring.radius*2}px;animation-duration:${ring.dur}s`;
    ring.icons.forEach((icon, i) => {
      const span = document.createElement('span');
      span.className = 'orb-icon';
      span.textContent = icon;
      const angle = (i / ring.icons.length) * 360;
      span.style.cssText = `position:absolute;font-size:1.4rem;top:50%;left:50%;transform:rotate(${angle}deg) translateX(${ring.radius}px);animation-duration:${ring.dur}s;margin:-12px 0 0 -12px`;
      el.appendChild(span);
    });
    wrap.appendChild(el);
  });
}

/* ── CANVAS FIREWORKS (surprise page) ───────────────────── */
(function(){
  const canvas = document.getElementById('fireworksCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], rockets = [];
  const COLS = ['#f2ccc4','#e8a598','#eddcb8','#d4b896','#5ecfc6','#b8a8e8','#bf5fa0','#fff','#e8c97a','#c4736a'];

  function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor(x, y, color){
      this.x = x; this.y = y; this.color = color;
      const a = Math.random() * Math.PI * 2;
      const s = 1.5 + Math.random() * 5;
      this.vx = Math.cos(a)*s; this.vy = Math.sin(a)*s;
      this.life = 1; this.decay = 0.012 + Math.random()*0.018;
      this.size = 2 + Math.random()*3; this.gravity = 0.08;
    }
    update(){ this.vy += this.gravity; this.x += this.vx; this.y += this.vy; this.vx *= 0.98; this.vy *= 0.98; this.life -= this.decay; }
    draw(){
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * Math.max(0, this.life), 0, Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  class Rocket {
    constructor(){
      this.x  = W * (0.2 + Math.random()*0.6);
      this.y  = H;
      this.tx = W * (0.1 + Math.random()*0.8);
      this.ty = H * (0.1 + Math.random()*0.45);
      const dist = Math.hypot(this.tx-this.x, this.ty-this.y);
      this.vx = (this.tx-this.x)/(dist/18);
      this.vy = (this.ty-this.y)/(dist/18);
      this.color = COLS[Math.floor(Math.random()*COLS.length)];
    }
    update(){
      this.x += this.vx; this.y += this.vy;
      if(this.y <= this.ty || Math.abs(this.x-this.tx) < 8){ this.explode(); return false; }
      return true;
    }
    explode(){
      for(let i = 0; i < 80; i++) particles.push(new Particle(this.x, this.y, COLS[Math.floor(Math.random()*COLS.length)]));
      for(let i = 0; i < 30; i++){
        const p = new Particle(this.x, this.y, this.color);
        const a = (i/30)*Math.PI*2;
        p.vx = Math.cos(a)*6; p.vy = Math.sin(a)*6;
        particles.push(p);
      }
    }
    draw(){
      ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI*2);
      ctx.fillStyle = '#fff'; ctx.fill();
    }
  }

  let animating = false;
  let launchInterval = null;

  function animLoop(){
    if(!animating) return;
    ctx.fillStyle = 'rgba(5,5,8,0.18)';
    ctx.fillRect(0,0,W,H);
    for(let i = rockets.length-1; i >= 0; i--){
      rockets[i].draw();
      if(rockets[i].update() === false) rockets.splice(i,1);
    }
    for(let i = particles.length-1; i >= 0; i--){
      particles[i].draw();
      particles[i].update();
      if(particles[i].life <= 0) particles.splice(i,1);
    }
    requestAnimationFrame(animLoop);
  }

  window.startFireworks = function(){
    if(animating) return;
    animating = true;
    ctx.clearRect(0,0,W,H);
    animLoop();
    rockets.push(new Rocket()); rockets.push(new Rocket());
    launchInterval = setInterval(() => { rockets.push(new Rocket()); if(Math.random()>.5) rockets.push(new Rocket()); }, 600);
    setTimeout(() => { clearInterval(launchInterval); launchInterval = setInterval(() => rockets.push(new Rocket()), 1800); }, 8000);
  };
  window.stopFireworks = function(){
    animating = false;
    if(launchInterval) clearInterval(launchInterval);
    ctx.clearRect(0,0,W,H);
  };
})();

/* ── CONFETTI ───────────────────────────────────────────── */
function confetti(){
  const cols = ['#e8a598','#d4b896','#5ecfc6','#eddcb8','#f2ccc4','#bf5fa0','#fff','#e8c97a','#b8a8e8'];
  for(let i = 0; i < 220; i++){
    const c  = document.createElement('div');
    c.className = 'cf';
    const sz = 5 + Math.random()*10;
    c.style.cssText = `left:${Math.random()*100}vw;top:-20px;width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random()*cols.length)]};border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${2+Math.random()*3.5}s;animation-delay:${Math.random()*0.9}s`;
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

/* ── BALLOONS ───────────────────────────────────────────── */
function balloons(){
  ['🎈','🎀','🎊','🎉','💝','🌸','🎁','✨','💕','🌺','🎂','⭐'].forEach((b, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'bl'; el.textContent = b;
      el.style.cssText = `left:${5+Math.random()*90}vw;bottom:-80px;font-size:${2.5+Math.random()*2.5}rem;animation-duration:${4+Math.random()*5}s`;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 180);
  });
}

/* ── SURPRISE: celebrate button ─────────────────────────── */
function initCelebrate(){
  const btn = document.getElementById('celBtn');
  if(!btn) return;
  let fired = false;
  btn.addEventListener('click', () => {
    if(typeof startFireworks === 'function') startFireworks();
    confetti(); balloons();
    document.getElementById('photoStrip')?.classList.add('show');
    if(!fired){
      fired = true;
      setTimeout(confetti, 700);
      setTimeout(confetti, 1400);
      setTimeout(balloons, 500);
      setTimeout(() => document.getElementById('afterW')?.classList.add('show'), 1400);
      setTimeout(() => {
        const hp = document.getElementById('heroPhoto');
        if(hp) hp.style.filter = 'brightness(1) saturate(1.2)';
      }, 600);
    }
  });
}

/* ── MEMORY PAGE: typewriter ─────────────────────────────── */
function typewrite(el, text, speed, cb){
  if(!el) return;
  let i = 0;
  el.textContent = '';
  const cur = document.createElement('span');
  cur.className = 'tw-cursor';
  el.after(cur);
  function step(){
    if(i < text.length){ el.textContent += text[i++]; setTimeout(step, speed + Math.random()*22); }
    else { setTimeout(() => cur.remove(), 900); if(cb) cb(); }
  }
  step();
}

function initMemory(){
  const el = document.getElementById('twText');
  if(!el) return;
  setTimeout(() => {
    typewrite(el,
      "Happy Birthday to the most amazing girl I know, Rachita. You are not just my best friend — you are one of the most beautiful, extraordinary parts of my life.",
      40,
      () => { document.getElementById('mBtn')?.classList.add('show'); }
    );
  }, 1500);
}

/* ── GLITCH EFFECT on Rachita's name ────────────────────── */
function initGlitch(){
  const name = document.getElementById('glitchName');
  if(!name) return;
  setInterval(() => {
    if(Math.random() > 0.92){
      name.style.textShadow = `${(Math.random()-.5)*6}px 0 var(--teal), ${(Math.random()-.5)*-6}px 0 var(--magenta)`;
      setTimeout(() => name.style.textShadow = 'none', 80);
    }
  }, 1200);
}

/* ── PROGRESS DOTS (auto-set by URL) ────────────────────── */
function setDots(){
  const pages = [
    'index.html','memory.html','gallery.html',
    'together.html','childhood.html',
    'quotes.html','message.html','surprise.html'
  ];
  const file = location.pathname.split('/').pop() || 'index.html';
  const cur  = pages.indexOf(file);
  document.querySelectorAll('.p-dot').forEach((d, i) => {
    d.classList.remove('active','done');
    if(i === cur)     d.classList.add('active');
    else if(i < cur)  d.classList.add('done');
  });
}

/* ── MUSIC (surprise page) ───────────────────────────────── */
let audio = null, playing = false;
function toggleMusic(){
  const btn = document.getElementById('musicBtn');
  if(!audio){
    audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audio.loop = true; audio.volume = 0.28;
  }
  if(!playing){
    audio.play()
      .then(() => { playing = true; if(btn) btn.innerHTML = '⏸ &nbsp;Pause'; })
      .catch(() => { if(btn) btn.textContent = '🎵 Place audio file'; });
  } else {
    audio.pause(); playing = false;
    if(btn) btn.innerHTML = '🎵 &nbsp;Play Music';
  }
}

/* ── devGo: navigate while keeping session ──────────────── */
function devGo(page){ window.location.href = page; }

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildStars();
  initParticles();
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
