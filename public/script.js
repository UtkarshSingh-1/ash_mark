// PRELOADER — fast counter, hides on load
let prog = 0;
const preCount = document.getElementById('preCount');

let lastTime = 0;
function animateCounter(timestamp) {
  if (timestamp - lastTime > 40) {
    prog += Math.random() * 9 + 2;
    if (prog >= 100) prog = 100;
    if (preCount) preCount.textContent = String(Math.floor(prog)).padStart(3, '0');
    lastTime = timestamp;
  }
  if (prog < 100) requestAnimationFrame(animateCounter);
}
requestAnimationFrame(animateCounter);

function hideLoader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);
}

if (document.readyState === 'complete') {
  hideLoader();
} else {
  window.addEventListener('load', hideLoader, { once: true });
}

// CURSOR — throttled with rAF
const ring = document.getElementById('cursorRing');
const dot = document.getElementById('cursorDot');
let mx = 0, my = 0, rx = 0, ry = 0;
let cursorRAF = false;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (dot) dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  if (!cursorRAF) {
    cursorRAF = true;
    requestAnimationFrame(moveCursorRing);
  }
}, { passive: true });

function moveCursorRing() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  cursorRAF = false;
  if (Math.abs(mx - rx) > 0.5 || Math.abs(my - ry) > 0.5) {
    cursorRAF = true;
    requestAnimationFrame(moveCursorRing);
  }
}

document.addEventListener('mouseover', e => {
  if (!ring) return;
  const el = e.target.closest('a, button');
  if (el) ring.classList.add('hover');
}, { passive: true });
document.addEventListener('mouseout', e => {
  if (!ring) return;
  const el = e.target.closest('a, button');
  if (el && !el.contains(e.relatedTarget)) ring.classList.remove('hover');
}, { passive: true });

document.addEventListener('mouseover', e => {
  const el = e.target.closest('[data-cursor]');
  if (!ring || !el) return;
  ring.classList.remove('hover');
  ring.classList.add('text-mode');
  ring.setAttribute('data-text', el.dataset.cursor);
}, { passive: true });
document.addEventListener('mouseout', e => {
  const el = e.target.closest('[data-cursor]');
  if (!ring || !el) return;
  ring.classList.remove('text-mode');
}, { passive: true });

// THEME
const themeToggle = document.getElementById('themeToggle');
const ripple = document.getElementById('themeRipple');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const rect = themeToggle.getBoundingClientRect();
    ripple.style.cssText = `left:${rect.left + rect.width / 2 - 10}px;top:${rect.top + rect.height / 2 - 10}px;width:20px;height:20px`;
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    ripple.style.background = next === 'dark' ? '#0A0908' : '#EFEAE0';
    ripple.classList.add('active');
    setTimeout(() => { document.documentElement.setAttribute('data-theme', next); localStorage.setItem('theme', next); }, 450);
    setTimeout(() => ripple.classList.remove('active'), 1300);
  });
}
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.setAttribute('data-theme', 'dark');

// ═══════════════════════════════════════════════════
// NAV SCROLL — fixed position is handled in CSS.
// This only handles the .scrolled class for the
// background blur effect. Nav NEVER moves.
// ═══════════════════════════════════════════════════
const nav = document.getElementById('nav');
const sp = document.getElementById('scrollProgress');
let scrollTicking = false;

function onScrollUpdate() {
  const scrollY = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;

  // Toggle scrolled class for backdrop effect only
  if (nav) nav.classList.toggle('scrolled', scrollY > 60);

  // Update scroll progress bar
  if (sp) sp.style.width = (docH > 0 ? scrollY / docH : 0) * 100 + '%';

  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(onScrollUpdate);
    scrollTicking = true;
  }
}, { passive: true });

// ═══════════════════════════════════════════════════
// MOBILE MENU — REMOVED from script.js
// The hamburger menu is now fully controlled by React
// state in page.tsx (toggleMenu / closeMenu).
// script.js must NOT attach its own click listeners
// to #menuToggle or #mobileMenu — doing so creates
// duplicate handlers that break on mobile because
// React's synthetic events and native DOM events
// fire in an unpredictable order on touch devices.
// ═══════════════════════════════════════════════════

// REVEAL — IntersectionObserver
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      const num = e.target.querySelector('[data-count]');
      if (num && !num.dataset.done) {
        num.dataset.done = '1';
        const tgt = parseInt(num.dataset.count);
        let c = 0;
        const t = setInterval(() => {
          c += Math.max(1, Math.floor(tgt / 22));
          if (c >= tgt) { c = tgt; clearInterval(t); }
          num.textContent = String(c).padStart(2, '0');
        }, 50);
      }
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-line').forEach(el => obs.observe(el));

// INTRO WORD REVEAL
const introWords = document.querySelectorAll('.reveal-word');
const wordIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.parentElement.querySelectorAll('.reveal-word').forEach((w, i) => {
        setTimeout(() => w.classList.add('in'), i * 50);
      });
      wordIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
if (introWords.length) wordIO.observe(introWords[0]);

// MAGNETIC — passive + rAF throttled
document.querySelectorAll('.magnetic').forEach(el => {
  let magRAF = false;
  el.addEventListener('mousemove', e => {
    if (magRAF) return;
    magRAF = true;
    requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px,${y * 0.25}px)`;
      magRAF = false;
    });
  }, { passive: true });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; }, { passive: true });
});

// PRODUCT CAROUSEL
const products = document.getElementById('products');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pProgress = document.getElementById('pProgress');
const pCur = document.getElementById('pCur');
let carouselRAF = false;

function updateP() {
  if (!products) return;
  const max = products.scrollWidth - products.clientWidth;
  const pct = max > 0 ? (products.scrollLeft / max) * 100 : 20;
  if (pProgress) pProgress.style.width = Math.max(20, pct) + '%';
  const els = products.querySelectorAll('.product');
  let cur = 1;
  els.forEach((p, i) => { if (p.getBoundingClientRect().left < window.innerWidth / 2) cur = i + 1; });
  if (pCur) pCur.textContent = String(cur).padStart(2, '0');
  if (prevBtn) prevBtn.classList.toggle('disabled', products.scrollLeft <= 5);
  if (nextBtn) nextBtn.classList.toggle('disabled', products.scrollLeft >= max - 5);
}

if (products) {
  products.addEventListener('scroll', () => {
    if (!carouselRAF) { carouselRAF = true; requestAnimationFrame(() => { updateP(); carouselRAF = false; }); }
  }, { passive: true });

  if (prevBtn) prevBtn.addEventListener('click', () => products.scrollBy({ left: -500, behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => products.scrollBy({ left: 500, behavior: 'smooth' }));

  // Drag scroll
  let dn = false, sx = 0, sl = 0;
  products.addEventListener('mousedown', e => { dn = true; sx = e.pageX - products.offsetLeft; sl = products.scrollLeft; });
  products.addEventListener('mouseleave', () => dn = false, { passive: true });
  products.addEventListener('mouseup', () => dn = false, { passive: true });
  products.addEventListener('mousemove', e => {
    if (!dn) return;
    e.preventDefault();
    products.scrollLeft = sl - (e.pageX - products.offsetLeft - sx) * 1.8;
  });

  setTimeout(updateP, 100);
}

// 3D TILT — passive + rAF
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.product').forEach(card => {
    const img = card.querySelector('.product-img-inner');
    let tiltRAF = false;
    card.addEventListener('mousemove', e => {
      if (tiltRAF) return;
      tiltRAF = true;
      requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        if (img) img.style.transform = `translate(${x * 12}px,${y * 12}px) scale(1.04)`;
        tiltRAF = false;
      });
    }, { passive: true });
    card.addEventListener('mouseleave', () => { if (img) img.style.transform = ''; }, { passive: true });
  });
}

// ═══════════════════════════════════════════════════
// HERO PARALLAX — smooth, GPU-only, no layout thrash
// ═══════════════════════════════════════════════════
const heroBg = document.getElementById('heroBg');
const heroEl = document.getElementById('hero');
let heroMouseX = 0, heroMouseY = 0;
let lastScrollY = 0;
let heroRAF = false;

function applyHeroTransform() {
  if (!heroBg) return;
  const parallaxY = lastScrollY * 0.25;
  heroBg.style.transform = `translate3d(${heroMouseX}px, ${parallaxY + heroMouseY}px, 0) scale(1.08)`;
  heroRAF = false;
}

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!heroRAF && lastScrollY < window.innerHeight * 1.5) {
    heroRAF = true;
    requestAnimationFrame(applyHeroTransform);
  }
}, { passive: true });

if (heroEl && heroBg) {
  heroEl.addEventListener('mousemove', e => {
    heroMouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    heroMouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    if (!heroRAF) {
      heroRAF = true;
      requestAnimationFrame(applyHeroTransform);
    }
  }, { passive: true });

  heroEl.addEventListener('mouseleave', () => {
    heroMouseX = 0;
    heroMouseY = 0;
    if (!heroRAF) {
      heroRAF = true;
      requestAnimationFrame(applyHeroTransform);
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════
// CART DRAWER — REMOVED from script.js
// The cart drawer (open/close) is now fully controlled
// by React state (openCart / closeCart) in page.tsx.
// script.js must NOT attach its own click listeners to
// #cartBtn, #drawerClose, or #drawerOverlay.
//
// WHY: On mobile, attaching both React onClick and a
// native addEventListener to the same element causes
// the event to fire twice — once opening, once closing
// immediately — making the drawer appear broken.
// React's synthetic event system handles touch/click
// correctly on all platforms when used exclusively.
// ═══════════════════════════════════════════════════

// CLOCK
function updTime() {
  const t = new Date(), el = document.getElementById('time');
  if (el) el.textContent = `IST ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
}
updTime();
setInterval(updTime, 60000);

// ESC key — handled by React useEffect in page.tsx
// (removed from script.js to avoid double-handling)