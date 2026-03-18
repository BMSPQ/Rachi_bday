/**
 * script.js — Rachita Birthday Website
 * Shared utilities used by index.html (and referenced globally).
 * All pages load base.css; index.html loads this file via <script src="script.js">.
 *
 * Provides:
 *  - Stars & particle canvas setup (shared helper)
 *  - Custom cursor (hover devices only)
 *  - Page navigation with fade transition (goTo)
 *  - Confetti burst (confetti)
 *  - Balloon rise (balloons)
 *  - Floating hearts helper (used by index.html heartsWrap)
 *  - Ring / pulse animations initialisation
 *  - Glitch name effect
 *  - Background image lazy-load
 *  - Journey button click handler
 *  - Scan line injection
 *  - Scroll-based scroll-progress bar (used in gallery)
 */

/* ─────────────────────────────────────────────
   UTILITY: page navigation with fade-out
───────────────────────────────────────────── */
function goTo(url) {
  var wrap = document.getElementById('pageWrap');
  if (wrap) {
    wrap.classList.add('fade-out');
    setTimeout(function () { location.href = url; }, 650);
  } else {
    location.href = url;
  }
}

/* ─────────────────────────────────────────────
   UTILITY: dev page jump (used in dev panel)
───────────────────────────────────────────── */
function devGo(page) {
  window.location.href = page;
}

/* ─────────────────────────────────────────────
   STARS
───────────────────────────────────────────── */
function initStars(count) {
  var sf = document.querySelector('.star-field');
  if (!sf) return;
  count = count || 130;
  for (var i = 0; i < count; i++) {
    var s = document.createElement('div');
    s.className = 'star';
    var z = 0.8 + Math.random() * 1.8;
    s.style.cssText =
      'width:' + z + 'px;height:' + z + 'px;' +
      'top:' + Math.random() * 100 + '%;' +
      'left:' + Math.random() * 100 + '%;' +
      'animation-duration:' + (2 + Math.random() * 5) + 's;' +
      'animation-delay:' + Math.random() * 6 + 's';
    sf.appendChild(s);
  }
}

/* ─────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────── */
function initParticles(colors, count) {
  var c = document.getElementById('particleCanvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, pts = [];
  colors = colors || ['rgba(232,165,152,', 'rgba(212,184,150,', 'rgba(94,207,198,'];
  count  = count  || 50;

  function resize() { W = c.width = innerWidth; H = c.height = innerHeight; }
  resize();
  addEventListener('resize', resize);

  for (var i = 0; i < count; i++) {
    pts.push({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.2,
      r: 0.8 + Math.random() * 1.5,
      op: 0.08 + Math.random() * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(function (p) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10)  { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10)  p.x = W + 10;
      if (p.x > W+10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.op + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ─────────────────────────────────────────────
   CUSTOM CURSOR (hover/fine-pointer devices)
───────────────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  var ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  var mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  document.querySelectorAll('button, a, [data-nav]').forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('big'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('big'); });
  });
  (function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ─────────────────────────────────────────────
   CONFETTI BURST
   Called as confetti() from index.html inline script
   when birthday countdown reaches zero.
───────────────────────────────────────────── */
function confetti() {
  var colors = ['#e8a598','#f2ccc4','#d4b896','#eddcb8','#5ecfc6','#bf5fa0','#e8c97a','#b8a8e8'];
  var count  = window.innerWidth < 600 ? 60 : 110;
  for (var i = 0; i < count; i++) {
    (function () {
      var el   = document.createElement('div');
      el.className = 'cf';
      var size = 5 + Math.random() * 8;
      var isRect = Math.random() > 0.5;
      el.style.cssText =
        'left:' + (10 + Math.random() * 80) + 'vw;' +
        'top:-12px;' +
        'width:'  + (isRect ? size * 2 : size) + 'px;' +
        'height:' + size + 'px;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
        'animation-duration:' + (2.2 + Math.random() * 2.8) + 's;' +
        'animation-delay:'    + Math.random() * 1.6 + 's;' +
        'opacity:0.9;' +
        'border-radius:' + (isRect ? '1px' : '50%') + ';' +
        'transform-origin:center center';
      document.body.appendChild(el);
      setTimeout(function () { el.remove(); }, 5500);
    })();
  }
}

/* ─────────────────────────────────────────────
   BALLOONS RISE
   Called as balloons() from index.html inline script.
───────────────────────────────────────────── */
function balloons() {
  var sym = ['🎈','🎉','🎊','🎁','🥳','✨','💖','🌸','🌺'];
  var count = window.innerWidth < 600 ? 8 : 14;
  for (var i = 0; i < count; i++) {
    (function (idx) {
      setTimeout(function () {
        var el = document.createElement('div');
        el.className = 'bl';
        el.textContent = sym[Math.floor(Math.random() * sym.length)];
        el.style.cssText =
          'left:' + (5 + Math.random() * 90) + 'vw;' +
          'bottom:-60px;' +
          'font-size:' + (2.2 + Math.random() * 2) + 'rem;' +
          'animation-duration:' + (3.5 + Math.random() * 2.5) + 's;' +
          'animation-delay:0s';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 6500);
      }, idx * 180);
    })(i);
  }
}

/* ─────────────────────────────────────────────
   FLOATING HEARTS (index.html heartsWrap)
───────────────────────────────────────────── */
function initHearts() {
  var wrap = document.getElementById('heartsWrap');
  if (!wrap) return;
  var sym = ['❤️','🌸','💕','✨','💖','🌷','💗','🫧','🌺','💫'];
  for (var i = 0; i < 18; i++) {
    var h = document.createElement('div');
    h.className = 'float-heart';
    h.textContent = sym[Math.floor(Math.random() * sym.length)];
    h.style.cssText =
      'left:'  + Math.random() * 100 + 'vw;' +
      'font-size:' + (0.9 + Math.random() * 1.3) + 'rem;' +
      'animation-duration:' + (9  + Math.random() * 13) + 's;' +
      'animation-delay:'    + Math.random() * 12 + 's';
    wrap.appendChild(h);
  }
}

/* ─────────────────────────────────────────────
   SCAN LINE (index page decorative element)
───────────────────────────────────────────── */
function initScanLine() {
  if (document.querySelector('.scan-line')) return; // already in HTML
  var sl = document.createElement('div');
  sl.className = 'scan-line';
  document.body.appendChild(sl);
}

/* ─────────────────────────────────────────────
   GLITCH NAME EFFECT (index.html #glitchName)
───────────────────────────────────────────── */
function initGlitchName() {
  var el = document.getElementById('glitchName');
  if (!el) return;
  var original = el.textContent;
  var chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#!';
  var running  = false;

  function glitch() {
    if (running) return;
    running = true;
    var iterations = 0;
    var interval = setInterval(function () {
      el.textContent = original.split('').map(function (ch, idx) {
        if (idx < iterations) return original[idx];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iterations >= original.length) {
        clearInterval(interval);
        el.textContent = original;
        running = false;
      }
      iterations += 0.4;
    }, 38);
  }

  // Trigger on hover (desktop) and on a slow timer (mobile)
  el.addEventListener('mouseenter', glitch);
  setInterval(function () {
    if (!running && Math.random() > 0.55) glitch();
  }, 7000);
}

/* ─────────────────────────────────────────────
   JOURNEY BUTTON — data-nav handler
───────────────────────────────────────────── */
function initJourneyBtn() {
  document.querySelectorAll('[data-nav]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      goTo(btn.getAttribute('data-nav'));
    });
  });
}

/* ─────────────────────────────────────────────
   BACKGROUND IMAGE PRELOAD (index.html #bgImg)
   Fades in smoothly after load to avoid flash.
───────────────────────────────────────────── */
function initBgImage() {
  var img = document.getElementById('bgImg');
  if (!img) return;
  img.style.opacity = '0';
  img.style.transition = 'opacity 1.4s ease';
  if (img.complete) {
    img.style.opacity = '1';
  } else {
    img.addEventListener('load', function () { img.style.opacity = '1'; });
    img.addEventListener('error', function () { img.style.opacity = '0'; });
  }
}

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR (gallery.html #scrollProg)
───────────────────────────────────────────── */
function initScrollProgress() {
  var bar = document.getElementById('scrollProg');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    var scrolled  = document.documentElement.scrollTop  || document.body.scrollTop;
    var total     = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER — generic reveal helper
   Adds class "show" or "visible" to .rev elements.
   Individual pages may call their own IO setup;
   this is the shared fallback for any page that
   doesn't set one up inline.
───────────────────────────────────────────── */
function initReveal() {
  var els = document.querySelectorAll('.rev:not([data-io-skip])');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  els.forEach(function (el) { io.observe(el); });
}

/* ─────────────────────────────────────────────
   RING PULSES initialisation (index.html .ring)
───────────────────────────────────────────── */
function initRings() {
  var wrap = document.querySelector('.ring-wrap');
  if (!wrap) return;
  // Rings are already in HTML with CSS animations; nothing extra needed.
  // But ensure they are visible only after page loads.
  wrap.style.opacity = '1';
}

/* ─────────────────────────────────────────────
   TOUCH RIPPLE on buttons (nice mobile feel)
───────────────────────────────────────────── */
function initButtonRipple() {
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('pointerdown', function (e) {
      var rect = btn.getBoundingClientRect();
      var rip  = document.createElement('span');
      var size = Math.max(rect.width, rect.height) * 2;
      rip.style.cssText =
        'position:absolute;border-radius:50%;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:'  + (e.clientX - rect.left - size / 2) + 'px;' +
        'top:'   + (e.clientY - rect.top  - size / 2) + 'px;' +
        'background:rgba(255,255,255,0.06);' +
        'transform:scale(0);pointer-events:none;' +
        'animation:rippleAnim 0.6s var(--ease-expo,cubic-bezier(0.16,1,0.3,1)) forwards';
      btn.appendChild(rip);
      setTimeout(function () { rip.remove(); }, 700);
    });
  });

  // Inject ripple keyframes once
  if (!document.getElementById('rippleStyle')) {
    var style = document.createElement('style');
    style.id  = 'rippleStyle';
    style.textContent = '@keyframes rippleAnim{to{transform:scale(1);opacity:0}}';
    document.head.appendChild(style);
  }
}

/* ─────────────────────────────────────────────
   PETAL FALL helper (memory.html uses inline,
   but exposed globally for reuse)
───────────────────────────────────────────── */
function initPetals(containerId, count) {
  var wrap = document.getElementById(containerId || 'petalsWrap');
  if (!wrap) return;
  var petals = ['🌸','🌺','🌷','🪷','✿'];
  count = count || 16;
  for (var i = 0; i < count; i++) {
    var el = document.createElement('div');
    el.className = 'petal';
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.cssText =
      'left:' + Math.random() * 100 + 'vw;' +
      'font-size:' + (0.9 + Math.random() * 1) + 'rem;' +
      'animation-duration:' + (11 + Math.random() * 14) + 's;' +
      'animation-delay:'    + Math.random() * 14 + 's';
    wrap.appendChild(el);
  }
}

/* ─────────────────────────────────────────────
   TYPEWRITER helper (exposed globally for reuse)
   memory.html calls this inline; exported here
   so other pages can use it too.
───────────────────────────────────────────── */
function typewrite(el, text, speed, cb) {
  if (!el) return;
  var i = 0;
  el.textContent = '';
  var cur = document.createElement('span');
  cur.className = 'tw-cursor';
  if (el.parentNode) el.parentNode.insertBefore(cur, el.nextSibling);

  function step() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(step, speed + Math.random() * 22);
    } else {
      setTimeout(function () { cur.remove(); }, 900);
      if (typeof cb === 'function') cb();
    }
  }
  step();
}

/* ─────────────────────────────────────────────
   AUTO-INIT on DOMContentLoaded
   Only initialises helpers relevant to the
   current page; each function is safe to call
   when its target elements don't exist.
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initStars();
  initParticles();
  initCursor();
  initBgImage();
  initJourneyBtn();
  initHearts();
  initGlitchName();
  initRings();
  initReveal();
  initScrollProgress();
  initButtonRipple();
  // initScanLine();  // scan line is already in index.html markup, skip auto-inject
});
