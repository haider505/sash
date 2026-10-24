import {
  EXERCISES, WARMUP, COOLDOWN, PHASES, DAY_IDS, TOTAL_SESSIONS, SANCTUARY, LIGHT_DAY,
  COMFORT, RED_FLAGS, CHECKINS, TESTS, HABITS, GUIDE,
} from './program.js';
import { mountFigure } from './figures.js';
import { VAULT } from './vault.js';

// ============================================================ helpers
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); } catch { return ''; } };
const dayIndex = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const HEART = 'M12 20.6s-6.9-4.3-9.4-8.5C.8 9 2.4 5.2 6 4.9c2.2-.2 4 1.1 6 3.3 2-2.2 3.8-3.5 6-3.3 3.6.3 5.2 4.1 3.4 7.2-2.5 4.2-9.4 8.5-9.4 8.5z';
const sv = (inner, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${inner}</svg>`;
const I = {
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART}" fill="#fff"/></svg>`,
  heart48: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART}"/></svg>`,
  today: sv('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>'),
  plan: sv('<circle cx="6" cy="6" r="1.4"/><circle cx="12" cy="6" r="1.4"/><circle cx="18" cy="6" r="1.4"/><circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/><circle cx="6" cy="18" r="1.4"/><circle cx="12" cy="18" r="1.4"/><circle cx="18" cy="18" r="1.4"/>'),
  moves: sv('<circle cx="12" cy="4.6" r="2.1"/><path d="M12 7.4v6.1M12 13.5l-3.6 7M12 13.5l3.6 7M6.6 10.4 12 9.2l5.4 1.2"/>'),
  letters: sv('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.6 7.2 8.4 6 8.4-6"/>'),
  progress: sv('<path d="M5 20v-7M10 20V8M15 20v-5M20 20V4"/>'),
  drop: sv('<path d="M12 3.4c3.6 4.5 6.2 7.7 6.2 10.9a6.2 6.2 0 0 1-12.4 0c0-3.2 2.6-6.4 6.2-10.9z"/>'),
  guide: sv('<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>'),
  close: sv('<path d="M6 6l12 12M18 6 6 18"/>'),
  back: sv('<path d="M15 5l-7 7 7 7"/>'),
  next: sv('<path d="M9 5l7 7-7 7"/>'),
  check: sv('<path d="M5 12.5l4.2 4.2L19 7"/>', ' stroke-width="2.6"'),
  lock: sv('<rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  plus: sv('<path d="M12 5v14M5 12h14"/>'),
  del: sv('<path d="M9 6h10a1.6 1.6 0 0 1 1.6 1.6v8.8A1.6 1.6 0 0 1 19 18H9l-5.5-6z"/><path d="m11.5 9.5 5 5M16.5 9.5l-5 5"/>'),
  play: sv('<path d="M7 5.5v13l11-6.5z" fill="currentColor"/>'),
  steps: sv('<path d="M8.4 3.2c1.8 0 2.6 1.8 2.6 3.8s-.8 4.1-2.6 4.1S5.8 9.4 5.8 7.2 6.6 3.2 8.4 3.2zM15.6 8.4c1.8 0 2.6 1.8 2.6 3.8s-.8 4.1-2.6 4.1-2.6-1.7-2.6-3.9.8-4 2.6-4zM6.5 13.7h3.8M13.7 18.9h3.8"/>'),
  protein: sv('<ellipse cx="12" cy="13" rx="6.6" ry="8"/><circle cx="12" cy="14.3" r="2.8"/>'),
  water: sv('<path d="M6.5 4h11l-1.4 15.2a1.9 1.9 0 0 1-1.9 1.8H9.8a1.9 1.9 0 0 1-1.9-1.8z"/><path d="M7.2 10.5c1.6-.9 3.2-.9 4.8 0s3.2.9 4.8 0"/>'),
  sleep: sv('<path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z"/>'),
  plusMinus: '',
};

// ============================================================ storage
const SKEY = 'sash.v1';
const KKEY = 'sash.key';
const fresh = () => ({
  done: {}, prog: {}, tests: {}, habits: {}, comfort: {}, care: {},
  period: { on: false, since: null, log: [] },
  opened: [], seen: {}, settings: { sound: true, vibrate: true }, welcomed: false,
});
function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch { s = null; }
  const base = fresh();
  if (!s || typeof s !== 'object') return base;
  const out = Object.assign(base, s);
  out.period = Object.assign(fresh().period, s.period || {});
  out.settings = Object.assign(fresh().settings, s.settings || {});
  return out;
}
let S = load();
function save() { try { localStorage.setItem(SKEY, JSON.stringify(S)); } catch { /* private mode: keep in memory */ } }

// ============================================================ program helpers
const DAY_NAMES = { A: 1, B: 2, C: 3, D: 4 };
const keyOf = (w, d) => `${w}-${d}`;
const phaseOf = (w) => PHASES[Math.floor((w - 1) / 4)];
const allSessions = () => { const out = []; for (let w = 1; w <= 12; w++) for (const d of DAY_IDS) out.push({ w, d, key: keyOf(w, d) }); return out; };
const doneCount = () => allSessions().filter((s) => S.done[s.key]).length;
const nextSession = () => allSessions().find((s) => !S.done[s.key]) || null;
const trainedToday = () => Object.values(S.done).some((v) => v && v.at && dayKey(new Date(v.at)) === dayKey());

function resolveItem(it, wi, type, i) {
  const ex = EXERCISES[it.ex];
  const pick = (v) => (Array.isArray(v) ? v[wi] : v);
  const prefix = { main: 'm', core: 'k', finisher: 'f' }[type];
  return { id: prefix + i, ex: it.ex, name: it.label || ex.name, sets: pick(it.sets), reps: pick(it.reps), secs: pick(it.secs), perSide: !!it.perSide, rest: it.rest || 0, note: it.note || '', type, def: ex };
}
function sessionPlan(w, d) {
  const ph = phaseOf(w);
  const wi = (w - 1) % 4;
  const day = ph.days[DAY_IDS.indexOf(d)];
  const blocks = day.blocks.map((b) => ({ type: b.type, items: b.items.map((it, i) => resolveItem(it, wi, b.type, i)) }));
  return { w, d, key: keyOf(w, d), ph, wi, title: day.title, blocks, num: DAY_NAMES[d] };
}
const repsText = (it) => (it.secs ? `${it.secs} s${it.perSide ? ' / side' : ''}` : it.reps);
const doseText = (it) => (it.sets > 1 ? `${it.sets} × ${repsText(it)}` : repsText(it));
const workItems = (plan) => plan.blocks.flatMap((b) => b.items);
function estimateMin(plan) {
  let s = 5 * 60 + 3.5 * 60;
  for (const it of workItems(plan)) {
    const sides = it.def.side || it.perSide ? 2 : 1;
    const n = parseInt(it.reps, 10) || 12;
    const work = it.secs ? it.secs * sides : n * 3.5 * sides;
    s += it.sets * work + Math.max(0, it.sets - 1) * it.rest + 20;
  }
  return Math.max(20, Math.round(s / 60 / 5) * 5);
}
const progOf = (key) => (S.prog[key] = S.prog[key] || { sets: {}, steps: {} });
const setsDone = (key, id) => (S.prog[key]?.sets?.[id] || 0);
function sessionProgress(plan) {
  const items = workItems(plan);
  const total = items.reduce((a, it) => a + it.sets, 0);
  const done = items.reduce((a, it) => a + Math.min(it.sets, setsDone(plan.key, it.id)), 0);
  return { total, done };
}

// ============================================================ letters
function letterState(L) {
  const opened = S.opened.includes(L.id);
  const u = L.unlock || { type: 'always' };
  if (u.type === 'always') return { open: true, opened };
  if (u.type === 'sessions') {
    const n = doneCount();
    return { open: n >= u.n || opened, opened, lock: `Unlocks after workout ${u.n}`, sub: `${Math.min(n, u.n)} of ${u.n} done` };
  }
  if (u.type === 'date') {
    const now = new Date();
    const y = now.getFullYear();
    const start = new Date(y, u.month - 1, u.day);
    const end = new Date(y, u.month - 1, 31, 23, 59);
    const isOpen = now >= start && now <= end;
    let nextDate = start;
    if (now > end) nextDate = new Date(y + 1, u.month - 1, u.day);
    const days = Math.ceil((nextDate - new Date(y, now.getMonth(), now.getDate())) / 86400000);
    return { open: isOpen || opened, opened, lock: `Opens on ${u.day} ${nextDate.toLocaleDateString('en-GB', { month: 'long' })}`, sub: days > 0 ? `${days} day${days === 1 ? '' : 's'} to go` : '' };
  }
  return { open: false, opened };
}
const unreadLetters = () => (V ? V.letters.filter((L) => { const s = letterState(L); return s.open && !s.opened && (L.unlock?.type !== 'always' || L.id === 'welcome'); }) : []);

// ============================================================ audio, vibration, wake lock
let ac = null;
function audio() {
  if (!S.settings.sound) return null;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  } catch { return null; }
}
function beep(freq = 880, dur = 0.12, vol = 0.16) {
  const a = audio();
  if (!a) return;
  try {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, a.currentTime);
    g.gain.exponentialRampToValueAtTime(vol, a.currentTime + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + dur + 0.03);
  } catch { /* ignore */ }
}
function buzz(p) { if (S.settings.vibrate && navigator.vibrate) { try { navigator.vibrate(p); } catch { /* ignore */ } } }
function chime() { beep(784, 0.16); setTimeout(() => beep(1046, 0.34), 150); buzz([70, 50, 70]); }
function tick() { beep(660, 0.07, 0.12); buzz(25); }
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && document.visibilityState === 'visible') wakeLock = await navigator.wakeLock.request('screen');
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* not allowed here */ }
}
document.addEventListener('visibilitychange', () => { if (PL && document.visibilityState === 'visible') keepAwake(true); });
document.addEventListener('pointerdown', () => { if (S.settings.sound && !ac) audio(); }, { once: true });

// ============================================================ overlays
const stack = [];
let ignorePop = 0;
function pushLayer(close) { stack.push(close); try { history.pushState({ layer: stack.length }, ''); } catch { /* ignore */ } }
function popLayer() {
  const c = stack.pop();
  if (!c) return;
  c();
  ignorePop++;
  try { history.back(); } catch { ignorePop--; }
  setTimeout(() => { ignorePop = 0; }, 800);
}
window.addEventListener('popstate', () => {
  if (ignorePop) { ignorePop--; return; }
  if (stack.length) { stack.pop()(); return; }
  const r = parseRoute(location.hash);
  if (r.name !== route.name || r.arg !== route.arg) { route = r; render(); }
});

function sheet(inner, { center = false, onClose, label = '' } = {}) {
  const el = document.createElement('div');
  el.className = 'overlay';
  el.innerHTML = `<div class="overlay__scrim" data-close></div><div class="sheet${center ? ' sheet--center' : ''}" role="dialog" aria-modal="true" aria-label="${esc(label)}">${inner}</div>`;
  document.body.appendChild(el);
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  function close() { if (!el.isConnected) return; el.remove(); document.removeEventListener('keydown', onKey); if (onClose) onClose(); }
  document.addEventListener('keydown', onKey);
  el.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  setTimeout(() => { const f = el.querySelector('.sheet button, .sheet input, .sheet textarea'); if (f) f.focus({ preventScroll: true }); }, 40);
  return { el, close };
}
function toast(msg, ms = 2800) {
  $$('.toast').forEach((t) => t.remove());
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}
function stickerHTML(k, withCap = true) {
  const s = V && V.stickers[k];
  if (!s) return '';
  return `<div class="sticker"><img src="${s.src}" alt=""></div>${withCap ? `<p class="sticker-cap">${esc(s.caption)}</p>` : ''}`;
}
function confetti(gentle = false) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  document.body.appendChild(c);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = (c.width = innerWidth * dpr), H = (c.height = innerHeight * dpr);
  const ctx = c.getContext('2d');
  const style = getComputedStyle(document.documentElement);
  const cols = [style.getPropertyValue('--pink').trim() || '#ff4d94', '#ffffff', style.getPropertyValue('--blush').trim() || '#f7a8c9'];
  const n = gentle ? 18 : 70;
  const ps = Array.from({ length: n }, () => ({ x: Math.random() * W, y: gentle ? H + Math.random() * H * 0.3 : -Math.random() * H * 0.4, s: (8 + Math.random() * 12) * dpr, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.1, vy: (gentle ? -(0.8 + Math.random()) : 2 + Math.random() * 3) * dpr, vx: (Math.random() - 0.5) * 1.2 * dpr, c: cols[Math.floor(Math.random() * cols.length)] }));
  const p2 = new Path2D(HEART);
  const t0 = performance.now();
  const dur = gentle ? 3200 : 2600;
  (function frame(now) {
    const t = now - t0;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(p.s / 24, p.s / 24); ctx.translate(-12, -12);
      ctx.globalAlpha = Math.max(0, 1 - t / dur); ctx.fillStyle = p.c; ctx.fill(p2); ctx.restore();
    }
    if (t < dur) requestAnimationFrame(frame); else c.remove();
  })(t0);
}

// ============================================================ vault & lock
let V = null;
const app = document.getElementById('app');
const b64d = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64e = (buf) => { const u = new Uint8Array(buf); let s = ''; for (const b of u) s += String.fromCharCode(b); return btoa(s); };
async function deriveKey(code) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64d(VAULT.salt), iterations: VAULT.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
}
async function decryptWith(key) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(VAULT.iv) }, key, b64d(VAULT.ct));
  return JSON.parse(new TextDecoder().decode(pt));
}
async function rememberedVault() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KKEY) || 'null'); } catch { raw = null; }
  if (!raw || raw.iv !== VAULT.iv) return null;
  try {
    const key = await crypto.subtle.importKey('raw', b64d(raw.k), 'AES-GCM', false, ['decrypt']);
    return await decryptWith(key);
  } catch { return null; }
}
async function rememberKey(key) {
  try { localStorage.setItem(KKEY, JSON.stringify({ iv: VAULT.iv, k: b64e(await crypto.subtle.exportKey('raw', key)) })); } catch { /* ignore */ }
}

function showLock() {
  const len = VAULT.len || 4;
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="key" data-k="${n}">${n}</button>`).join('');
  app.innerHTML = `<div class="lock"><div class="lock__in">
    <div class="seal">${I.heart}</div>
    <div class="stack" style="gap:6px"><h1 class="d-l">For Sash</h1><p class="lead">Type your code to open it.</p></div>
    <div class="dots" aria-hidden="true">${'<i></i>'.repeat(len)}</div>
    <p class="lock__msg" role="status" aria-live="polite"></p>
    <div class="keypad">${keys}<button class="key key--ghost" data-k="hint" aria-label="Show the hint">?</button><button class="key" data-k="0">0</button><button class="key key--ghost" data-k="del" aria-label="Delete">${I.del}</button></div>
  </div></div>`;
  let code = '';
  let busy = false;
  const dots = $('.dots', app), msg = $('.lock__msg', app);
  const paint = () => $$('i', dots).forEach((d, i) => d.classList.toggle('on', i < code.length));
  if (!(window.crypto && crypto.subtle)) { msg.textContent = 'This page needs a secure (https) link to open.'; return; }
  async function attempt() {
    busy = true; msg.textContent = 'Opening…';
    try {
      const key = await deriveKey(code);
      V = await decryptWith(key);
      rememberKey(key);
      $('.lock', app).classList.add('unsealed');
      buzz(30);
      await sleep(520);
      startApp(true);
    } catch {
      busy = false; code = ''; paint();
      dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
      buzz([40, 40, 40]);
      msg.textContent = 'That’s not it. Try again.';
    }
  }
  function press(k) {
    if (busy) return;
    if (k === 'hint') { msg.textContent = `Hint: ${VAULT.hint || 'you know this one.'}`; return; }
    if (k === 'del') { code = code.slice(0, -1); paint(); return; }
    if (code.length >= len) return;
    code += k; paint();
    if (code.length === len) attempt();
  }
  app.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
  const onKey = (e) => { if (!$('.lock', app)) { document.removeEventListener('keydown', onKey); return; } if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); };
  document.addEventListener('keydown', onKey);
}

// ============================================================ router & shell
let route = { name: 'today', arg: '' };
let live = [];
const TAB_OF = { today: 'today', plan: 'plan', session: 'plan', guide: 'plan', moves: 'moves', move: 'moves', letters: 'letters', letter: 'letters', progress: 'progress' };
function parseRoute(h) {
  h = String(h || '').replace(/^#/, '');
  if (!h) return { name: 'today', arg: '' };
  const i = h.indexOf('-');
  const r = i < 0 ? { name: h, arg: '' } : { name: h.slice(0, i), arg: h.slice(i + 1) };
  return VIEWS[r.name] ? r : { name: 'today', arg: '' };
}
let lastRoute = 'today';
function go(token) {
  lastRoute = route.arg ? `${route.name}-${route.arg}` : route.name;
  try { if (location.hash.slice(1) !== token) history.pushState(null, '', '#' + token); } catch { /* ignore */ }
  route = parseRoute(token);
  render();
  window.scrollTo(0, 0);
}

function shellHTML() {
  const tabs = [['today', 'Today'], ['plan', 'Plan'], ['moves', 'Moves'], ['letters', 'Letters'], ['progress', 'Progress']];
  return `<header class="topbar"><div class="shell topbar__in">
      <button class="brand" id="brand" aria-label="Sash, home"><span class="seal">${I.heart}</span><span class="brand__name">Sash</span></button>
      <div class="top-actions">
        <button class="icon-btn" id="periodBtn" aria-pressed="false">${I.drop}<span>Period</span></button>
        <button class="icon-btn" id="guideBtn" aria-label="How the program works">${I.guide}</button>
      </div></div></header>
    <main class="view shell" id="view"></main>
    <nav class="tabbar" aria-label="Main"><div class="tabbar__in">${tabs.map(([id, label]) => `<button class="tab" data-tab="${id}">${I[id]}<span>${label}</span></button>`).join('')}</div></nav>`;
}

let brandTaps = [];
function bindShell() {
  $('.tabbar').addEventListener('click', (e) => { const t = e.target.closest('[data-tab]'); if (t) go(t.dataset.tab); });
  $('#guideBtn').addEventListener('click', () => go('guide'));
  $('#periodBtn').addEventListener('click', togglePeriod);
  $('#brand').addEventListener('click', () => {
    const now = Date.now();
    brandTaps = brandTaps.filter((t) => now - t < 2500).concat(now);
    if (brandTaps.length >= 5) {
      brandTaps = [];
      const ks = Object.keys(V.stickers);
      const k = ks[Math.floor(Math.random() * ks.length)];
      const sh = sheet(`<div class="finish">${stickerHTML(k)}<button class="btn btn--block" data-close>Close</button></div>`, { center: true, label: 'Sticker' });
      void sh;
    } else if (route.name !== 'today') go('today');
  });
  document.body.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g && !e.defaultPrevented) { e.preventDefault(); go(g.dataset.go); }
  });
}

function updateChrome() {
  const tab = TAB_OF[route.name] || 'today';
  $$('.tab').forEach((t) => {
    if (t.dataset.tab === tab) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    const dot = $('.dot', t);
    if (t.dataset.tab === 'letters') {
      const n = unreadLetters().length;
      if (n && !dot) t.insertAdjacentHTML('beforeend', '<i class="dot" aria-label="New letters"></i>');
      if (!n && dot) dot.remove();
    }
  });
  const pb = $('#periodBtn');
  pb.setAttribute('aria-pressed', String(!!S.period.on));
  $('span', pb).textContent = S.period.on ? 'Period Mode' : 'Period';
  document.documentElement.dataset.mode = S.period.on ? 'period' : '';
}

function mountFigs(root, fps) {
  $$('[data-fig]', root).forEach((el) => {
    live.push(mountFigure(el, el.dataset.fig, { fps: el.dataset.fps ? +el.dataset.fps : fps, offset: Math.random() * 2 }));
  });
}

function render() {
  live.forEach((c) => c.destroy());
  live = [];
  const old = $('#view');
  if (!old) return;
  const v = old.cloneNode(false);
  old.replaceWith(v);
  const view = VIEWS[route.name] || VIEWS.today;
  v.innerHTML = view.html(route.arg);
  if (view.mount) view.mount(v, route.arg);
  mountFigs(v);
  updateChrome();
}

// ============================================================ period mode
function togglePeriod() {
  if (!S.period.on) {
    S.period.on = true; S.period.since = dayKey();
    save(); render();
    toast('Period Mode is on. Your workouts are paused.');
  } else {
    S.period.log.push({ start: S.period.since, end: dayKey() });
    S.period.on = false; S.period.since = null;
    save(); render();
    toast('Period Mode is off. Welcome back.');
  }
}
const periodDay = () => (S.period.since ? Math.floor((new Date(dayKey()) - new Date(S.period.since)) / 86400000) + 1 : 1);

// ============================================================ views
const blockName = { main: 'Main', core: 'Core', finisher: 'Finisher' };
const heartCell = (cls, label, token, style) => `<button class="h48 ${cls}" style="${style};background:none;border:0;padding:0" data-go="${token}" aria-label="${label}">${I.heart48}</button>`;

function the48() {
  const nx = nextSession();
  const n = doneCount();
  let cells = '';
  for (let w = 1; w <= 12; w++) {
    const col = w + Math.floor((w - 1) / 4);
    DAY_IDS.forEach((d, r) => {
      const key = keyOf(w, d);
      const cls = S.done[key] ? 'h48--done' : nx && nx.key === key ? 'h48--next' : '';
      cells += heartCell(cls, `Week ${w}, workout ${r + 1}${S.done[key] ? ', done' : ''}`, `session-${w}-${d}`, `grid-column:${col};grid-row:${r + 1}`);
    });
    cells += `<span class="wk${nx && nx.w === w ? ' wk--now' : ''}" style="grid-column:${col};grid-row:5">${w}</span>`;
  }
  return `<section class="card the48"><div class="section-head"><h2 class="d-s">The 48</h2><span class="small num">${n} of ${TOTAL_SESSIONS}</span></div>
    <div class="grid48">${cells}</div>
    <p class="tiny">Each column is a week and each heart is a workout. Tap any heart to open it.</p></section>`;
}

function noteCard() {
  const list = S.period.on && V.careNotes?.length ? V.careNotes : V.notes;
  const idx = (dayIndex() + (S.seen.noteShift || 0)) % list.length;
  return `<button class="note" id="noteCard" aria-label="Note from Haider, tap for another"><p class="note__text">${esc(list[idx])}</p><span class="note__from">— ${esc(V.from)}</span><span class="note__more">tap</span></button>`;
}

function careHero() {
  return `<section class="care-hero">
      <p class="kicker">Period Mode, day ${periodDay()}</p>
      <h2 class="d-l">Rest is the plan today.</h2>
      <p class="lead">Your workouts are paused. Nothing is lost and nothing is late.</p>
      <div class="actions">
        <button class="btn btn--pink btn--block" data-act="flow">Start the gentle flow, 12 min</button>
        <div class="actions actions--row"><button class="btn" data-act="breathe">Breathing</button><button class="btn" data-act="light">Light day</button></div>
      </div>
    </section>
    <section class="card stack"><h2 class="d-s">Comfort checklist</h2><div class="care-list">${COMFORT.map((c) => {
      const on = !!(S.comfort[dayKey()] || {})[c.id];
      return `<button class="tick" data-comfort="${c.id}" aria-pressed="${on}"><i>${I.check}</i><span>${esc(c.text)}</span></button>`;
    }).join('')}</div><p class="tiny">${esc(RED_FLAGS)}</p></section>
    <button class="banner" data-letter="period"><span class="banner__art" style="background:var(--paper)"><span class="seal" style="width:34px;height:34px">${I.heart}</span></span><span class="grow"><p class="d-s">Your letter for these days</p><p class="ar" style="color:var(--blush);text-align:left">أيام الدلال</p></span></button>`;
}

function checkinBanner() {
  const n = doneCount();
  let id = null;
  if (n === 0 && !S.tests.start && !S.seen.skipStart) id = 'start';
  else if (n >= 16 && !S.tests.w4 && !S.seen.skipw4) id = 'w4';
  else if (n >= 32 && !S.tests.w8 && !S.seen.skipw8) id = 'w8';
  else if (n >= 48 && !S.tests.w12 && !S.seen.skipw12) id = 'w12';
  if (!id) return '';
  const c = CHECKINS.find((x) => x.id === id);
  const title = id === 'start' ? 'Before your first workout: a 5-minute check-in' : `Your ${c.label.toLowerCase()} check-in is ready`;
  return `<section class="card stack"><p class="d-s" style="margin:0">${title}</p><p class="small" style="margin:0">Five quick tests so you can see how far you’ve come later.</p>
    <div class="row"><button class="btn btn--sm btn--pink" data-checkin="${id}">Do the check-in</button><button class="btn btn--sm btn--ghost" data-skipcheck="${id}">Not now</button></div></section>`;
}

function todayCard() {
  const nx = nextSession();
  if (!nx) {
    const f = V.letters.find((l) => l.id === 'finish');
    return `<section class="card stack"><h2 class="d-l">All 48 done.</h2><p class="lead">Twelve weeks, every single workout. You can repeat any session from the plan.</p>
      ${f && !S.opened.includes('finish') ? '<button class="btn btn--pink btn--block" data-letter="finish">Open your letter</button>' : ''}
      <button class="btn btn--block" data-go="plan">See the plan</button></section>`;
  }
  const plan = sessionPlan(nx.w, nx.d);
  const prog = sessionProgress(plan);
  const first = workItems(plan)[0];
  const moves = workItems(plan).length;
  if (trainedToday() && !S.period.on && prog.done === 0) {
    return `<section class="card stack">
      <div class="row"><div class="banner__art" style="width:72px;height:72px">${V.stickers.hide ? `<img src="${V.stickers.hide.src}" alt="">` : ''}</div>
      <div class="grow"><h2 class="d-m">Done for today.</h2><p class="ar" style="color:var(--blush);text-align:left;margin:0">${esc(V.stickers.hide?.caption || '')}</p></div></div>
      <p class="small" style="margin:0">Next up: week ${nx.w}, workout ${plan.num}, ${esc(plan.title)}. Rest is when the muscle gets built.</p>
      <button class="btn btn--ghost btn--block" data-start="${nx.key}">Start it anyway</button></section>`;
  }
  const started = prog.done > 0 || Object.keys(S.prog[nx.key]?.steps || {}).length > 0;
  return `<section class="session-card${S.period.on ? ' muted-card' : ''}">
      <div class="session-card__fig" data-fig="${first.def.fig}" aria-hidden="true"></div>
      <div class="session-card__body">
        <div class="row row--between"><span class="small">Week ${nx.w}, workout ${plan.num} of 4</span><span class="phase-pill"><i></i>${esc(plan.ph.name)}</span></div>
        <h2 class="d-l">${esc(plan.title)}</h2>
        <div class="meta"><span><b>${moves}</b> moves</span><span>about <b>${estimateMin(plan)}</b> min</span>${started ? `<span><b>${prog.done}</b> of ${prog.total} sets done</span>` : ''}</div>
        <div class="actions actions--row">
          <button class="btn btn--pink" data-start="${nx.key}">${S.period.on ? 'Train anyway' : started ? 'Continue' : 'Start workout'}</button>
          <button class="btn" data-go="session-${nx.w}-${nx.d}">See the moves</button>
        </div>
      </div></section>`;
}

function habitsSection() {
  const t = S.habits[dayKey()] || {};
  const count = HABITS.filter((h) => t[h.id]).length;
  return `<section class="stack"><div class="section-head"><h2 class="d-s">Today’s habits</h2><span class="small num">${count} of 4</span></div>
    <div class="habits">${HABITS.map((h) => `<button class="habit" data-habit="${h.id}" aria-pressed="${!!t[h.id]}">${I[h.icon]}<span>${h.label}</span></button>`).join('')}</div>
    <p class="tiny">7,000+ steps, protein at every meal, 8+ glasses of water, 7+ hours of sleep.</p></section>`;
}

function lettersTeaser() {
  const unread = unreadLetters().filter((L) => L.id !== 'welcome' || S.welcomed);
  const locked = V.letters.filter((L) => L.unlock?.type === 'sessions' && !letterState(L).open).sort((a, b) => a.unlock.n - b.unlock.n)[0];
  if (!unread.length && !locked) return '';
  const body = unread.length
    ? `<p class="d-s">${unread.length === 1 ? 'A letter you haven’t opened' : `${unread.length} letters you haven’t opened`}</p><p class="small">From Haider, in the Letters tab.</p>`
    : `<p class="d-s">Next letter: ${esc(locked.en.replace(/^Open /, '').replace(/^after /, 'after '))}</p><p class="small">${doneCount()} of ${locked.unlock.n} workouts done.</p>`;
  return `<button class="banner" data-go="letters"><span class="banner__art" style="background:var(--paper)"><span class="seal" style="width:34px;height:34px">${I.heart}</span></span><span class="grow">${body}</span></button>`;
}

const VIEWS = {
  today: {
    html() {
      const h = new Date().getHours();
      const hi = h < 5 ? 'Still up,' : h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : h < 22 ? 'Good evening,' : 'Good night,';
      const nick = V.her.en[dayIndex() % V.her.en.length];
      return `<section class="greet"><p class="greet__hi">${hi}</p><h1 class="d-xl">${esc(nick)}.</h1></section>
        ${noteCard()}
        ${S.period.on ? careHero() : ''}
        ${checkinBanner()}
        ${todayCard()}
        ${the48()}
        ${habitsSection()}
        ${lettersTeaser()}`;
    },
    mount(v) {
      $('#noteCard', v)?.addEventListener('click', () => { S.seen.noteShift = (S.seen.noteShift || 0) + 1; save(); const list = S.period.on && V.careNotes?.length ? V.careNotes : V.notes; $('.note__text', v).textContent = list[(dayIndex() + S.seen.noteShift) % list.length]; });
      v.addEventListener('click', (e) => {
        const t = e.target.closest('button');
        if (!t) return;
        if (t.dataset.start) { const [w, d] = t.dataset.start.split('-'); openPlayer({ kind: 'train', w: +w, d }); }
        else if (t.dataset.habit) { const k = dayKey(); S.habits[k] = S.habits[k] || {}; S.habits[k][t.dataset.habit] = !S.habits[k][t.dataset.habit]; save(); t.setAttribute('aria-pressed', String(!!S.habits[k][t.dataset.habit])); const c = HABITS.filter((h) => S.habits[k][h.id]).length; const n = t.closest('section').querySelector('.num'); if (n) n.textContent = `${c} of 4`; if (S.habits[k][t.dataset.habit]) buzz(15); }
        else if (t.dataset.comfort) { const k = dayKey(); S.comfort[k] = S.comfort[k] || {}; S.comfort[k][t.dataset.comfort] = !S.comfort[k][t.dataset.comfort]; save(); t.setAttribute('aria-pressed', String(!!S.comfort[k][t.dataset.comfort])); }
        else if (t.dataset.act === 'flow') openPlayer({ kind: 'care' });
        else if (t.dataset.act === 'light') openPlayer({ kind: 'light' });
        else if (t.dataset.act === 'breathe') openBreathing(120);
        else if (t.dataset.letter) openLetter(t.dataset.letter);
        else if (t.dataset.checkin) openCheckin(t.dataset.checkin);
        else if (t.dataset.skipcheck) { S.seen['skip' + (t.dataset.skipcheck === 'start' ? 'Start' : t.dataset.skipcheck)] = true; save(); render(); }
      });
    },
  },

  plan: {
    title: () => 'Plan',
    html(arg) {
      const nx = nextSession();
      const pi = clamp(parseInt(arg, 10) || (nx ? Math.floor((nx.w - 1) / 4) + 1 : 3), 1, 3);
      const ph = PHASES[pi - 1];
      const weeks = ph.weeks.map((w, wi) => {
        const plans = DAY_IDS.map((d) => sessionPlan(w, d));
        const dn = plans.filter((p) => S.done[p.key]).length;
        return `<section class="week"><div class="week__head"><h3>Week ${w}</h3><span class="status${dn === 4 ? ' status--done' : ''}">${dn === 4 ? I.check : ''}${dn} of 4</span></div>
          <p class="small" style="margin:0">${esc(ph.weekNotes[wi])}</p>
          <div class="list">${plans.map((p) => {
            const done = S.done[p.key];
            const isNext = nx && nx.key === p.key;
            return `<button class="li" data-go="session-${p.w}-${p.d}"><span class="li__n${done ? ' li__n--done' : ''}">${done ? I.check : p.num}</span>
              <span class="li__main"><span class="li__title">${esc(p.title)}</span><span class="li__sub">${workItems(p).length} moves, about ${estimateMin(p)} min</span></span>
              <span class="li__end">${done ? `Done ${fmtDate(done.at)}` : isNext ? '<span class="status status--next">Next</span>' : ''}</span></button>`;
          }).join('')}</div></section>`;
      }).join('');
      return `<section class="stack"><h1 class="d-l">The plan</h1><p class="lead">Twelve weeks, four workouts a week. It moves forward only when you do.</p><button class="link" data-go="guide" style="justify-self:start">How the program works</button></section>
        <div class="seg" role="tablist">${PHASES.map((p) => `<button role="tab" aria-selected="${p.n === pi}" data-phase="${p.n}">${esc(p.name)}</button>`).join('')}</div>
        <section class="card phase-intro"><p class="kicker">Weeks ${ph.weeks[0]}–${ph.weeks[3]}</p><h2 class="d-m">${esc(ph.line)}</h2><p style="margin:0">${esc(ph.about)}</p>
          <dl class="facts"><div><dt>Tempo</dt><dd>${esc(ph.tempo)}</dd></div><div><dt>Effort</dt><dd>${esc(ph.effort)}</dd></div></dl></section>
        ${weeks}
        <section class="card stack"><h2 class="d-s">Every workout starts and ends the same way</h2>
          <div><p class="kicker" style="margin-bottom:4px">Warm-up, about 5 minutes</p><div class="list">${WARMUP.map((x) => `<button class="li" data-go="move-${x.ex}"><span class="li__main"><span class="li__title">${esc(EXERCISES[x.ex].name)}</span><span class="li__sub">${esc(x.dose)}</span></span><span class="li__end">${I.next}</span></button>`).join('')}</div></div>
          <div><p class="kicker" style="margin-bottom:4px">Cool-down, about 3 minutes</p><div class="list">${COOLDOWN.map((x) => `<button class="li" data-go="move-${x.ex}"><span class="li__main"><span class="li__title">${esc(EXERCISES[x.ex].name)}</span><span class="li__sub">${esc(x.dose)}</span></span><span class="li__end">${I.next}</span></button>`).join('')}</div></div>
        </section>`;
    },
    mount(v) {
      $$('[data-phase]', v).forEach((b) => b.addEventListener('click', () => go('plan-' + b.dataset.phase)));
    },
  },

  session: {
    title: (arg) => { const [w, d] = arg.split('-'); return `Week ${w}, workout ${DAY_NAMES[d] || ''}`; },
    html(arg) {
      const [ws, d] = String(arg).split('-');
      const w = clamp(parseInt(ws, 10) || 1, 1, 12);
      const dd = DAY_IDS.includes(d) ? d : 'A';
      const plan = sessionPlan(w, dd);
      const done = S.done[plan.key];
      const prog = sessionProgress(plan);
      const started = prog.done > 0;
      const itemRow = (it, n) => {
        const c = setsDone(plan.key, it.id);
        const pills = Array.from({ length: it.sets }, (_, i) => `<button class="pill" data-set="${it.id}" data-i="${i}" aria-pressed="${i < c}" aria-label="Set ${i + 1}">${i < c ? I.check : i + 1}</button>`).join('');
        return `<div class="li" style="align-items:flex-start"><button class="thumb" data-open="${it.id}" aria-label="Open ${esc(it.name)}" style="border:0;padding:0"><span data-fig="${it.def.fig}" data-fps="20" style="display:block;width:100%;height:100%"></span></button>
          <div class="li__main"><button class="li__title" data-open="${it.id}" style="background:none;border:0;padding:0;color:inherit;text-align:left;font:inherit;font-weight:500">${n}. ${esc(it.name)}</button><span class="li__sub">${esc(doseText(it))}${it.rest ? `, rest ${it.rest} s` : ''}</span>${it.note ? `<span class="li__note">${esc(it.note)}</span>` : ''}<div class="pills" style="margin-top:8px">${pills}</div></div></div>`;
      };
      let n = 0;
      const blocks = plan.blocks.map((b) => `<section><div class="block-title"><h3>${blockName[b.type]}</h3>${b.type === 'core' ? '<span class="tiny">Short rests</span>' : ''}</div><div class="list">${b.items.map((it) => itemRow(it, ++n)).join('')}</div></section>`).join('');
      const ex = (x) => EXERCISES[x.ex];
      const simple = (arr, title, prefix) => `<section><div class="block-title"><h3>${title}</h3></div><div class="list">${arr.map((x, i) => {
        const on = !!S.prog[plan.key]?.steps?.[prefix + i];
        return `<button class="li" data-go="move-${x.ex}"><span class="li__n${on ? ' li__n--done' : ''}">${on ? I.check : i + 1}</span><span class="li__main"><span class="li__title">${esc(ex(x).name)}</span><span class="li__sub">${esc(x.dose)}</span></span></button>`;
      }).join('')}</div></section>`;
      return `<button class="link" data-go="plan-${plan.ph.n}" style="justify-self:start">Back to the plan</button>
        <section class="stack" style="gap:8px"><span class="small">Week ${w}, workout ${plan.num} of 4</span><h1 class="d-l">${esc(plan.title)}</h1>
          <div class="meta"><span class="phase-pill"><i></i>${esc(plan.ph.name)}</span><span>about <b>${estimateMin(plan)}</b> min</span><span><b>${prog.done}</b> of ${prog.total} sets</span></div>
          <p class="small" style="margin:0">${esc(plan.ph.tempo)} ${esc(plan.ph.effort)}</p></section>
        ${done ? `<section class="card row"><span class="li__n li__n--done">${I.check}</span><div class="grow"><p style="margin:0">Done on ${fmtDate(done.at)}${done.rpe ? `, felt ${RPE[done.rpe - 1].toLowerCase()}` : ''}.</p>${done.note ? `<p class="small" style="margin:0">${esc(done.note)}</p>` : ''}</div><button class="btn btn--sm btn--ghost" data-undone="1">Undo</button></section>` : ''}
        <button class="btn btn--pink btn--block" data-start="1">${done ? 'Do it again' : started ? 'Continue workout' : 'Start workout'}</button>
        ${simple(WARMUP, 'Warm-up', 'w')}
        ${blocks}
        ${simple(COOLDOWN, 'Cool-down', 'z')}
        ${done ? '' : `<button class="btn btn--block" data-finish="1">Finish workout</button>`}`;
    },
    mount(v, arg) {
      const [ws, d] = String(arg).split('-');
      const w = clamp(parseInt(ws, 10) || 1, 1, 12);
      const plan = sessionPlan(w, DAY_IDS.includes(d) ? d : 'A');
      v.addEventListener('click', (e) => {
        const t = e.target.closest('button');
        if (!t) return;
        if (t.dataset.set) {
          const p = progOf(plan.key);
          const i = +t.dataset.i;
          const c = p.sets[t.dataset.set] || 0;
          p.sets[t.dataset.set] = i < c ? i : i + 1;
          save();
          const pc = p.sets[t.dataset.set];
          $$(`[data-set="${t.dataset.set}"]`, v).forEach((b) => { const j = +b.dataset.i; b.setAttribute('aria-pressed', String(j < pc)); b.innerHTML = j < pc ? I.check : String(j + 1); });
          const pr = sessionProgress(plan);
          const m = $$('.meta b', v)[1]; if (m) m.textContent = pr.done;
          if (pc > c) buzz(15);
        } else if (t.dataset.open) {
          const steps = buildSteps({ kind: 'train', w: plan.w, d: plan.d });
          openPlayer({ kind: 'train', w: plan.w, d: plan.d }, steps.findIndex((s) => s.id === t.dataset.open));
        } else if (t.dataset.start) openPlayer({ kind: 'train', w: plan.w, d: plan.d });
        else if (t.dataset.finish) finishFlow({ kind: 'train', w: plan.w, d: plan.d }, true);
        else if (t.dataset.undone) { delete S.done[plan.key]; save(); render(); toast('Marked as not done.'); }
      });
    },
  },

  moves: {
    title: () => 'Moves',
    html(arg) {
      const f = ['glutes', 'hamstrings', 'quads', 'core', 'mobility', 'care'].includes(arg) ? arg : 'all';
      const names = { all: 'All', glutes: 'Glutes', hamstrings: 'Hamstrings', quads: 'Quads', core: 'Core', mobility: 'Stretch', care: 'Period care' };
      const list = Object.entries(EXERCISES).filter(([, e]) => f === 'all' || e.tag === f).filter(([id]) => id !== 'rkc-plank');
      return `<section class="stack"><h1 class="d-l">Moves</h1><p class="lead">Every exercise in your plan. Tap one to see how it’s done.</p></section>
        <div class="chips" role="tablist">${Object.entries(names).map(([k, n]) => `<button class="chip" role="tab" aria-selected="${k === f}" data-go="moves${k === 'all' ? '' : '-' + k}">${n}</button>`).join('')}</div>
        <div class="moves">${list.map(([id, e]) => `<button class="move" data-go="move-${id}"><span class="fig-box" data-fig="${e.fig}" data-fps="20"></span><span class="move__body"><span class="move__name">${esc(e.name)}</span><span class="move__mus">${esc(e.muscles)}</span></span></button>`).join('')}</div>`;
    },
  },

  move: {
    title: (id) => EXERCISES[id]?.name || 'Move',
    html(id) {
      const e = EXERCISES[id];
      if (!e) return '<p>That move doesn’t exist.</p>';
      const uses = [];
      for (const ph of PHASES) ph.days.forEach((d, di) => d.blocks.forEach((b) => b.items.forEach((it) => { if (it.ex === id) uses.push(`${ph.name}, workout ${di + 1}`); })));
      const uniq = [...new Set(uses)];
      if (WARMUP.some((x) => x.ex === id)) uniq.unshift('Every warm-up');
      if (COOLDOWN.some((x) => x.ex === id)) uniq.unshift('Every cool-down');
      if (SANCTUARY.some((x) => x.ex === id)) uniq.push('Period Mode flow');
      return `<button class="link" data-back="1" style="justify-self:start">Back</button>
        <section class="stack" style="gap:6px"><h1 class="d-l">${esc(e.name)}</h1><p class="lead">${esc(e.muscles)}${e.side ? `, one ${e.side} at a time` : ''}</p></section>
        <div class="detail-fig" data-fig="${e.fig}"></div>
        ${e.setup ? `<p class="small" style="margin:0"><span class="pink">Setup.</span> ${esc(e.setup)}</p>` : ''}
        <section class="stack"><h2 class="d-s">How to do it</h2><ol class="cues">${e.cues.map((c) => `<li><span>${esc(c)}</span></li>`).join('')}</ol></section>
        ${e.mistakes?.length ? `<section class="stack"><h2 class="d-s">Watch out for</h2><ul class="plain">${e.mistakes.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></section>` : ''}
        ${e.easier || e.harder ? `<div class="pair"><div><span class="tiny">Easier</span><span>${esc(e.easier || '—')}</span></div><div><span class="tiny">Harder</span><span>${esc(e.harder || '—')}</span></div></div>` : ''}
        ${e.yt ? `<a class="btn btn--block" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.yt)}" target="_blank" rel="noopener">Watch it on YouTube</a>` : ''}
        ${uniq.length ? `<p class="small" style="margin:0">In your plan: ${esc(uniq.join('; '))}.</p>` : ''}`;
    },
    mount(v) { $('[data-back]', v)?.addEventListener('click', () => go(lastRoute && !lastRoute.startsWith('move-') ? lastRoute : 'moves')); },
  },

  letters: {
    title: () => 'Letters',
    html() {
      const env = (L, feature = false) => {
        const st = letterState(L);
        const cls = !st.open ? 'env--locked' : st.opened ? 'env--opened' : '';
        return `<button class="env ${cls}${feature ? ' env--feature' : ''}" data-letter="${L.id}" ${st.open ? '' : 'aria-disabled="true"'}>
          <span class="env__paper"><span class="env__flap"></span><span class="env__seal">${st.open ? I.heart : I.lock.replace('stroke="currentColor"', 'stroke="#a8979f"')}</span>${st.open && !st.opened && L.unlock?.type !== 'always' ? '<span class="env__new">New</span>' : ''}</span>
          <span class="env__label"><span class="env__en">${esc(L.en)}</span><span class="env__ar">${esc(L.ar)}</span>${!st.open ? `<span class="env__lock">${esc(st.lock)}${st.sub ? `. ${esc(st.sub)}` : ''}</span>` : ''}</span></button>`;
      };
      const [welcome, ...rest] = V.letters;
      return `<section class="stack"><h1 class="d-l">Letters</h1><p class="lead">From Haider. Open each one when its moment comes.</p></section>
        <div class="letters">${env(welcome, true)}${rest.map((L) => env(L)).join('')}</div>`;
    },
    mount(v) {
      v.addEventListener('click', (e) => {
        const b = e.target.closest('[data-letter]');
        if (!b) return;
        const L = V.letters.find((x) => x.id === b.dataset.letter);
        const st = letterState(L);
        if (!st.open) { toast(`${st.lock}.${st.sub ? ' ' + st.sub + '.' : ''}`); return; }
        openLetter(L.id, b);
      });
    },
  },

  letter: {
    html() { return VIEWS.letters.html(); },
    mount(v, id) { VIEWS.letters.mount(v); setTimeout(() => openLetter(id), 60); },
  },

  progress: {
    title: () => 'Progress',
    html() {
      const n = doneCount();
      const bars = Array.from({ length: 12 }, (_, i) => {
        const w = i + 1;
        const c = DAY_IDS.filter((d) => S.done[keyOf(w, d)]).length;
        return `<div>${[3, 2, 1, 0].map((k) => `<i class="${k < c ? 'on' : ''}"></i>`).join('')}<span>${w}</span></div>`;
      }).join('');
      const head = CHECKINS.map((c) => `<th scope="col">${c.label}</th>`).join('');
      const rows = TESTS.map((t) => {
        const vals = CHECKINS.map((c) => S.tests[c.id]?.[t.id]);
        const first = vals.find((x) => x != null && x !== '');
        return `<tr><th scope="row" style="font-weight:400;color:var(--text)">${esc(t.name)}<span class="tiny" style="display:block">${t.unit}</span></th>${vals.map((x, i) => {
          if (x == null || x === '') return '<td>—</td>';
          const d = i > 0 && first != null && x !== first ? +x - +first : null;
          return `<td>${esc(x)}${d != null && !Number.isNaN(d) ? `<span class="delta">${d > 0 ? '+' : ''}${Math.round(d * 10) / 10}</span>` : ''}</td>`;
        }).join('')}</tr>`;
      }).join('');
      const days = [];
      const today = new Date(dayKey());
      const start = new Date(today); start.setDate(start.getDate() - (12 * 7 - 1) - ((today.getDay() + 1) % 7));
      for (let w = 0; w < 12; w++) {
        const col = [];
        for (let d = 0; d < 7; d++) {
          const day = new Date(start); day.setDate(start.getDate() + w * 7 + d);
          const k = dayKey(day);
          const c = Object.values(S.habits[k] || {}).filter(Boolean).length;
          col.push(day > today ? '<i style="opacity:.25"></i>' : `<i data-n="${c}" title="${k}"></i>`);
        }
        days.push(`<div>${col.join('')}</div>`);
      }
      const periodDays = S.period.log.reduce((a, r) => a + Math.max(1, Math.round((new Date(r.end) - new Date(r.start)) / 86400000) + 1), 0) + (S.period.on ? periodDay() : 0);
      const careCount = Object.keys(S.care).length;
      return `<section class="stack"><h1 class="d-l">Progress</h1></section>
        <section class="card stack"><div class="row" style="align-items:flex-end"><span class="big-num">${n}</span><span class="lead" style="padding-bottom:8px">of ${TOTAL_SESSIONS} workouts</span></div>
          <div class="bars12" aria-label="Workouts per week">${bars}</div><p class="tiny">Workouts per week. Four in a week fills the column.</p></section>
        <section class="card stack"><div class="section-head"><h2 class="d-s">Check-ins</h2><button class="btn btn--sm btn--pink" data-checkin="auto">Log a check-in</button></div>
          <div class="table-scroll"><table class="tests"><thead><tr><th>Test</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
          <p class="tiny">Pink numbers show the change since your first check-in.</p></section>
        <section class="card stack"><h2 class="d-s">Habits, last 12 weeks</h2><div class="heat" aria-label="Habits heat map">${days.join('')}</div><p class="tiny">Each square is a day. The pinker it is, the more of your four habits you ticked.</p></section>
        ${periodDays || careCount ? `<section class="card stack"><h2 class="d-s">Period Mode</h2><p class="small" style="margin:0">${periodDays} day${periodDays === 1 ? '' : 's'} in Period Mode, ${careCount} gentle flow${careCount === 1 ? '' : 's'} done. This stays on this phone only.</p></section>` : ''}
        <section class="card stack"><h2 class="d-s">Settings</h2>
          <div><div class="switch"><span>Sounds</span><button class="toggle" role="switch" aria-checked="${S.settings.sound}" data-set-toggle="sound" aria-label="Sounds"></button></div>
          <div class="switch"><span>Vibration</span><button class="toggle" role="switch" aria-checked="${S.settings.vibrate}" data-set-toggle="vibrate" aria-label="Vibration"></button></div></div>
          <p class="small" style="margin:0">Your progress is saved on this phone. Make a backup before changing phones or clearing your browser.</p>
          <div class="actions actions--row"><button class="btn btn--sm" data-backup="1">Back up</button><button class="btn btn--sm" data-restore="1">Restore</button></div>
          <div class="actions actions--row"><button class="btn btn--sm btn--ghost" data-lock="1">Lock this phone</button><button class="btn btn--sm btn--ghost" data-reset="1">Erase progress</button></div>
        </section>`;
    },
    mount(v) {
      v.addEventListener('click', (e) => {
        const t = e.target.closest('button');
        if (!t) return;
        if (t.dataset.checkin) openCheckin();
        else if (t.dataset.setToggle) { const k = t.dataset.setToggle; S.settings[k] = !S.settings[k]; save(); t.setAttribute('aria-checked', String(S.settings[k])); if (k === 'sound' && S.settings.sound) beep(880, 0.1); }
        else if (t.dataset.backup) openBackup();
        else if (t.dataset.restore) openRestore();
        else if (t.dataset.lock) { try { localStorage.removeItem(KKEY); } catch { /* ignore */ } location.reload(); }
        else if (t.dataset.reset) {
          const sh = sheet(`<h2 class="d-m">Erase all progress?</h2><p class="lead">Workouts, check-ins and habits on this phone will be cleared. Letters stay opened.</p><div class="actions actions--row"><button class="btn" data-close>Keep it</button><button class="btn btn--pink" id="doErase">Erase</button></div>`, { center: true, label: 'Erase progress' });
          $('#doErase', sh.el).addEventListener('click', () => { const keep = { opened: S.opened, settings: S.settings, welcomed: S.welcomed }; S = Object.assign(fresh(), keep); save(); sh.close(); render(); toast('Progress erased.'); });
        }
      });
    },
  },

  guide: {
    title: () => 'Guide',
    html() {
      return `<section class="stack"><h1 class="d-l">How it works</h1><p class="lead">Everything you need to know, in one place.</p></section>
        <section>${GUIDE.map((g, i) => `<details class="acc"${i === 0 ? ' open' : ''}><summary>${esc(g.title)}${I.plus}</summary><div class="acc__body">${g.body}</div></details>`).join('')}</section>`;
    },
  },
};
const RPE = ['Easy', 'Good', 'Hard', 'Very hard', 'Brutal'];

// ============================================================ player
let PL = null;
const LABEL = { warm: 'Warm-up', main: 'Main', core: 'Core', finisher: 'Finisher', cool: 'Cool-down', care: 'Gentle flow', light: 'Light day' };

function buildSteps(o) {
  if (o.kind === 'care') return SANCTUARY.map((x, i) => ({ id: 'g' + i, kind: 'care', ex: x.ex, name: EXERCISES[x.ex].name, dose: x.dose, secs: x.secs, sides: x.sides || 1, def: EXERCISES[x.ex] }));
  if (o.kind === 'light') return LIGHT_DAY.map((x, i) => ({ id: 'l' + i, kind: 'light', ex: x.ex, name: EXERCISES[x.ex].name, dose: x.dose, secs: x.ex === 'walk' ? null : x.secs, sides: x.sides || 1, def: EXERCISES[x.ex] }));
  const plan = sessionPlan(o.w, o.d);
  return [
    ...WARMUP.map((x, i) => ({ id: 'w' + i, kind: 'warm', ex: x.ex, name: EXERCISES[x.ex].name, dose: x.dose, secs: x.secs, sides: x.sides || 1, def: EXERCISES[x.ex] })),
    ...plan.blocks.flatMap((b) => b.items.map((it) => ({ ...it, kind: b.type }))),
    ...COOLDOWN.map((x, i) => ({ id: 'z' + i, kind: 'cool', ex: x.ex, name: EXERCISES[x.ex].name, dose: x.dose, secs: x.secs, sides: x.sides || 1, def: EXERCISES[x.ex] })),
  ];
}
const isSetStep = (st) => st.kind === 'main' || st.kind === 'core' || st.kind === 'finisher';
const pkey = (o) => (o.kind === 'train' ? keyOf(o.w, o.d) : `${o.kind}:${dayKey()}`);
function stepDone(o, st) {
  const p = S.prog[pkey(o)];
  if (!p) return false;
  return isSetStep(st) ? (p.sets[st.id] || 0) >= st.sets : !!p.steps[st.id];
}

function openPlayer(o, startAt) {
  closePlayer(true);
  const steps = buildSteps(o);
  let i = typeof startAt === 'number' && startAt >= 0 ? startAt : steps.findIndex((st) => !stepDone(o, st));
  if (i < 0) { finishFlow(o, false); return; }
  const el = document.createElement('div');
  el.className = 'player';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  document.body.appendChild(el);
  document.body.style.overflow = 'hidden';
  PL = { o, steps, i, el, fig: null, timer: null };
  pushLayer(() => closePlayer(true));
  keepAwake(true);
  audio();
  renderStep();
}
function closePlayer(silent) {
  if (!PL) return;
  if (PL.fig) PL.fig.destroy();
  stopTimer();
  PL.el.remove();
  PL = null;
  document.body.style.overflow = '';
  keepAwake(false);
  void silent;
  render();
}
function userClosePlayer() { if (stack.length) popLayer(); else closePlayer(); }

function renderStep() {
  const { o, steps, i, el } = PL;
  const st = steps[i];
  const e = st.def;
  const p = progOf(pkey(o));
  const count = isSetStep(st) ? p.sets[st.id] || 0 : 0;
  const total = steps.length;
  const bars = steps.map((s, j) => `<i class="${j === i ? 'now' : stepDone(o, s) ? 'on' : ''}"></i>`).join('');
  let dose, action;
  const last = i === total - 1;
  if (isSetStep(st)) {
    const all = count >= st.sets;
    dose = `<p class="dose"><b>${esc(repsText(st))}</b>${st.sets > 1 ? `, set ${Math.min(count + 1, st.sets)} of ${st.sets}` : ''}</p>`;
    action = all ? (last ? 'Finish workout' : 'Next move') : st.secs ? `Start ${st.secs} s${st.perSide ? ' each side' : ''}` : st.sets > 1 ? `Done with set ${count + 1}` : 'Done';
  } else {
    const on = !!p.steps[st.id];
    dose = `<p class="dose"><b>${esc(st.dose)}</b></p>`;
    action = on ? (last ? 'Finish' : 'Next') : st.secs ? `Start ${st.secs >= 120 ? Math.round(st.secs / 60) + ' min' : st.secs + ' s'}${st.sides > 1 ? ' each side' : ''}` : 'Done';
  }
  const pills = isSetStep(st) && st.sets > 1 ? `<div class="pills">${Array.from({ length: st.sets }, (_, j) => `<button class="pill" data-pset="${j}" aria-pressed="${j < count}" aria-label="Set ${j + 1}">${j < count ? I.check : j + 1}</button>`).join('')}</div>` : '';
  const kicker = isSetStep(st) ? `${LABEL[st.kind]}${st.rest ? `, rest ${st.rest} s between sets` : ''}` : LABEL[st.kind];
  el.innerHTML = `
    <div class="player__top"><button class="round" data-pa="close" aria-label="Close workout">${I.close}</button><div class="bars" aria-hidden="true">${bars}</div><span class="player__count">${i + 1} / ${total}</span></div>
    <div class="player__stage"><div class="fig-box" id="plFig"></div></div>
    <div class="player__info">
      <p class="kicker">${esc(kicker)}</p>
      <h2 class="d-l">${esc(st.name)}</h2>
      ${dose}
      ${st.note ? `<p class="li__note" style="margin:0;font-size:15px">${esc(st.note)}</p>` : ''}
      ${pills}
      <details class="how" open><summary>How to do it</summary><div class="how-grid">
        ${e.setup ? `<p style="margin:0"><span class="pink">Setup.</span> ${esc(e.setup)}</p>` : ''}
        <ol class="cues">${e.cues.map((c) => `<li><span>${esc(c)}</span></li>`).join('')}</ol>
        ${e.mistakes?.length ? `<div><span class="tiny">Watch out for</span><ul class="plain">${e.mistakes.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
        ${e.easier || e.harder ? `<div class="pair"><div><span class="tiny">Easier</span><span>${esc(e.easier || '—')}</span></div><div><span class="tiny">Harder</span><span>${esc(e.harder || '—')}</span></div></div>` : ''}
        ${e.yt ? `<a class="link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.yt)}" target="_blank" rel="noopener">Watch it on YouTube</a>` : ''}
      </div></details>
    </div>
    <div class="player__bottom"><button class="round" data-pa="prev" aria-label="Previous" ${i === 0 ? 'disabled' : ''}>${I.back}</button><button class="btn btn--pink" data-pa="act">${esc(action)}</button><button class="round" data-pa="next" aria-label="${last ? 'Finish' : 'Next'}">${I.next}</button></div>`;
  if (PL.fig) PL.fig.destroy();
  PL.fig = mountFigure($('#plFig', el), e.fig, {});
  el.onclick = onPlayerClick;
}

function onPlayerClick(e) {
  const b = e.target.closest('button');
  if (!b || !PL) return;
  const { o, steps } = PL;
  const st = steps[PL.i];
  const p = progOf(pkey(o));
  if (b.dataset.pset != null) {
    const j = +b.dataset.pset;
    const c = p.sets[st.id] || 0;
    p.sets[st.id] = j < c ? j : j + 1;
    save(); renderStep(); return;
  }
  const a = b.dataset.pa;
  if (a === 'close') userClosePlayer();
  else if (a === 'prev') { PL.i = Math.max(0, PL.i - 1); renderStep(); }
  else if (a === 'next') advance();
  else if (a === 'act') {
    if (isSetStep(st)) {
      const c = p.sets[st.id] || 0;
      if (c >= st.sets) { advance(); return; }
      if (st.secs) workTimer(st.secs, st.perSide ? 2 : 1, () => logSet(st));
      else logSet(st);
    } else {
      if (p.steps[st.id]) { advance(); return; }
      if (st.secs) workTimer(st.secs, st.sides || 1, () => { p.steps[st.id] = true; save(); advance(); });
      else { p.steps[st.id] = true; save(); buzz(15); advance(); }
    }
  }
}

function logSet(st) {
  const p = progOf(pkey(PL.o));
  const c = (p.sets[st.id] || 0) + 1;
  p.sets[st.id] = c;
  save();
  buzz(20);
  const last = PL.i === PL.steps.length - 1;
  if (c < st.sets && st.rest) restTimer(st.rest, `Set ${c + 1} of ${st.sets}`, () => renderStep());
  else if (c >= st.sets && st.rest && !last) {
    const nx = PL.steps[PL.i + 1];
    restTimer(st.rest, `Next: ${nx.name}`, () => advance());
  } else if (c >= st.sets) advance();
  else renderStep();
}

function advance() {
  if (!PL) return;
  if (PL.i >= PL.steps.length - 1) { const o = PL.o; finishFlow(o, false); return; }
  PL.i++;
  renderStep();
}

// ---------- timers ----------
function stopTimer() { if (PL && PL.timer) { PL.timer.stop(); PL.timer = null; } }
function ringSVG() { return '<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="track" cx="60" cy="60" r="54"/><circle class="prog" cx="60" cy="60" r="54" stroke-dasharray="339.3" stroke-dashoffset="0"/></svg>'; }

function countdown({ secs, label, sub, buttons = true, onDone, beepLast = true }) {
  const el = document.createElement('div');
  el.className = 'timer';
  el.innerHTML = `<div class="timer__in"><p class="timer__label">${esc(label)}</p><div class="ring">${ringSVG()}<div class="ring__num num">${secs}</div></div><p class="timer__next">${esc(sub || '')}</p>
    ${buttons ? '<div class="timer__btns"><button class="btn btn--sm" data-t="-15">−15 s</button><button class="btn btn--sm" data-t="+15">+15 s</button><button class="btn btn--sm btn--pink" data-t="skip">Skip</button></div>' : '<div class="timer__btns"><button class="btn btn--sm" data-t="skip">Stop</button></div>'}</div>`;
  document.body.appendChild(el);
  let total = secs;
  let end = Date.now() + secs * 1000;
  let lastShown = null;
  let done = false;
  const num = $('.ring__num', el), prog = $('.prog', el);
  const iv = setInterval(update, 200);
  function update() {
    const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    if (left !== lastShown) {
      lastShown = left;
      num.textContent = left >= 60 ? `${Math.floor(left / 60)}:${pad(left % 60)}` : left;
      prog.style.strokeDashoffset = String(339.3 * (1 - left / total));
      if (beepLast && left <= 3 && left > 0) tick();
    }
    if (left <= 0) finish(true);
  }
  function finish(natural) {
    if (done) return;
    done = true;
    clearInterval(iv);
    el.remove();
    if (natural) chime();
    onDone(natural);
  }
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    if (b.dataset.t === 'skip') finish(false);
    else { const d = b.dataset.t === '+15' ? 15 : -15; end += d * 1000; total = Math.max(1, total + d); lastShown = null; update(); }
  });
  update();
  return { stop() { if (!done) { done = true; clearInterval(iv); el.remove(); } } };
}

function restTimer(secs, sub, then) {
  if (!PL) return;
  stopTimer();
  PL.timer = countdown({ secs, label: 'Rest', sub, onDone: () => { if (PL) PL.timer = null; then(); } });
}
function workTimer(secs, sides, then) {
  if (!PL) return;
  stopTimer();
  const name = PL.steps[PL.i].name;
  const run = (side) => {
    PL.timer = countdown({ secs: 3, label: side === 1 ? 'Get ready' : 'Switch sides', sub: name, buttons: false, onDone: (nat) => {
      if (!PL) return;
      if (!nat) { PL.timer = null; renderStep(); return; }
      PL.timer = countdown({ secs, label: sides > 1 ? (side === 1 ? 'First side' : 'Second side') : 'Hold', sub: name, buttons: false, onDone: (nat2) => {
        if (!PL) return;
        PL.timer = null;
        if (!nat2) { renderStep(); return; }
        if (side < sides) run(side + 1); else then();
      } });
    } });
  };
  run(1);
}

function openBreathing(total = 120) {
  const el = document.createElement('div');
  el.className = 'timer';
  el.innerHTML = `<div class="timer__in"><p class="timer__label">Belly breathing</p><div class="breath"><span>Breathe in</span></div><p class="timer__next num" id="brLeft"></p><p class="small" style="margin:0">In through your nose for 4, out slowly for 6.</p><div class="timer__btns"><button class="btn btn--sm btn--pink" data-t="done">Done</button></div></div>`;
  document.body.appendChild(el);
  const circle = $('.breath', el), word = $('.breath span', el), left = $('#brLeft', el);
  const end = Date.now() + total * 1000;
  let phase = 0;
  let to = 0;
  const step = () => {
    if (!el.isConnected) return;
    const inhale = phase % 2 === 0;
    circle.style.setProperty('--d', inhale ? '4s' : '6s');
    circle.style.setProperty('--s', inhale ? '1' : '0.55');
    word.textContent = inhale ? 'Breathe in' : 'Breathe out';
    if (inhale) beep(523, 0.12, 0.08); else beep(392, 0.14, 0.08);
    phase++;
    to = setTimeout(step, inhale ? 4000 : 6000);
  };
  const iv = setInterval(() => {
    const s = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    left.textContent = `${Math.floor(s / 60)}:${pad(s % 60)} left`;
    if (s <= 0) close(true);
  }, 250);
  function close(natural) {
    clearInterval(iv); clearTimeout(to); el.remove();
    if (natural) { chime(); S.care[dayKey()] = true; save(); toast('That’s two calm minutes. Well done.'); }
  }
  el.addEventListener('click', (e) => { if (e.target.closest('[data-t="done"]')) close(false); });
  requestAnimationFrame(() => requestAnimationFrame(step));
}

// ---------- finishing ----------
function finishFlow(o, fromSession) {
  if (o.kind !== 'train') {
    closePlayer(true);
    if (stack.length) popLayer();
    S.care[dayKey()] = true;
    delete S.prog[pkey(o)];
    save(); render();
    confetti(true);
    toast(o.kind === 'care' ? 'Gentle flow done. Rest well.' : 'Light day done. Lovely.');
    return;
  }
  const plan = sessionPlan(o.w, o.d);
  const pr = sessionProgress(plan);
  if (pr.done < pr.total) {
    const leftN = pr.total - pr.done;
    const sh = sheet(`<div class="finish">${stickerHTML('kitten')}<h2 class="d-m">Finish early?</h2><p class="lead">You still have ${leftN} set${leftN === 1 ? '' : 's'} left. The kitten is watching.</p>
      <div class="actions" style="width:100%"><button class="btn btn--pink btn--block" data-close>Keep going</button><button class="btn btn--block btn--ghost" id="finishAnyway">Finish anyway</button></div></div>`, { center: true, label: 'Finish early' });
    $('#finishAnyway', sh.el).addEventListener('click', () => { sh.close(); showFinish(o, plan); });
    void fromSession;
    return;
  }
  showFinish(o, plan);
}

function showFinish(o, plan) {
  const before = new Set(unreadLetters().map((l) => l.id));
  const el = document.createElement('div');
  el.className = 'timer';
  el.style.overflow = 'auto';
  el.style.background = 'var(--ink)';
  el.style.alignItems = 'start';
  const n = doneCount() + (S.done[plan.key] ? 0 : 1);
  el.innerHTML = `<div class="timer__in finish" style="padding-block:max(24px, env(safe-area-inset-top, 0px)) 24px">${stickerHTML('pinch')}<h2 class="d-l">Workout done.</h2><p class="lead">Week ${plan.w}, workout ${plan.num}. That’s ${n} of ${TOTAL_SESSIONS}.</p>
    <p class="small" style="margin:0">How did it feel?</p>
    <div class="rpe">${RPE.map((r, i) => `<button data-rpe="${i + 1}" aria-pressed="false"><b>${i + 1}</b>${r}</button>`).join('')}</div>
    <label class="field" style="width:100%;text-align:left" for="finNote">Notes, if you like<textarea id="finNote" placeholder="Wall sit 52 s. Left leg felt wobbly."></textarea></label>
    <button class="btn btn--pink btn--block" id="finSave">Save workout</button></div>`;
  document.body.appendChild(el);
  confetti();
  let rpe = 0;
  el.addEventListener('click', (e) => {
    const r = e.target.closest('[data-rpe]');
    if (r) { rpe = +r.dataset.rpe; $$('[data-rpe]', el).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.rpe === rpe))); }
  });
  $('#finSave', el).addEventListener('click', () => {
    S.done[plan.key] = { at: new Date().toISOString(), rpe: rpe || null, note: $('#finNote', el).value.trim().slice(0, 500) };
    delete S.prog[plan.key];
    save();
    el.remove();
    if (PL) { closePlayer(true); if (stack.length) popLayer(); }
    const fresh = unreadLetters().filter((l) => !before.has(l.id));
    if (route.name !== 'today') go('today'); else render();
    if (fresh.length) {
      const L = fresh[0];
      const sh = sheet(`<div class="finish"><div class="env" style="width:200px"><span class="env__paper"><span class="env__flap"></span><span class="env__seal">${I.heart}</span></span></div><h2 class="d-m">A new letter is waiting.</h2><p class="lead">${esc(L.en)}</p><div class="actions" style="width:100%"><button class="btn btn--pink btn--block" id="openNew">Open it</button><button class="btn btn--block btn--ghost" data-close>Later</button></div></div>`, { center: true, label: 'New letter' });
      $('#openNew', sh.el).addEventListener('click', () => { sh.close(); openLetter(L.id); });
    }
  });
}

// ============================================================ letters reader
function letterHTML(L) {
  const body = L.body.map((p) => (typeof p === 'string' ? `<p>${esc(p)}</p>` : p.sticker && V.stickers[p.sticker] ? `<figure class="letter__sticker" style="margin:0"><img src="${V.stickers[p.sticker].src}" alt=""></figure>` : '')).join('');
  const po = L.poem;
  let poem = '';
  if (po) {
    const head = po.title ? `<p class="poem__title">${esc(po.title)}</p>` : '';
    const lines = po.verses
      ? po.verses.map((v) => `<p class="verse"><span>${esc(v[0])}</span><span>${esc(v[1])}</span></p>`).join('')
      : `<p class="poem__lines">${po.free.map((l) => `<span>${esc(l)}</span>`).join('')}</p>`;
    poem = `<section class="poem">${head}<div>${lines}</div>${po.by ? `<p class="poem__by">— ${esc(po.by)}</p>` : ''}${po.note ? `<p class="poem__note">${esc(po.note)}</p>` : ''}</section>`;
  }
  return `<div class="reader" role="dialog" aria-modal="true" aria-label="${esc(L.en)}">
    <div class="reader__bar"><div class="in"><button class="reader__close" data-rclose>Close</button><span class="reader__title">${esc(L.en)}</span></div></div>
    <div class="reader__body"><article class="letter" lang="ar">${body}<p class="sign">${esc(V.from)}</p></article>${poem}</div></div>`;
}
function openLetter(id, fromEl) {
  const L = V.letters.find((x) => x.id === id);
  if (!L) return;
  const ls = letterState(L);
  if (!ls.open) { toast(`${ls.lock}.`); return; }
  const firstTime = !S.opened.includes(id);
  const show = () => {
    const wrap = document.createElement('div');
    wrap.innerHTML = letterHTML(L);
    const el = wrap.firstElementChild;
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    if (!S.opened.includes(id)) { S.opened.push(id); save(); }
    if (id === 'welcome') { S.welcomed = true; save(); }
    const close = () => { el.remove(); document.body.style.overflow = PL ? 'hidden' : ''; if (route.name === 'letter') { route = { name: 'letters', arg: '' }; try { history.replaceState(null, '', '#letters'); } catch { /* ignore */ } } render(); };
    pushLayer(close);
    $('[data-rclose]', el).addEventListener('click', () => popLayer());
    $('[data-rclose]', el).focus({ preventScroll: true });
  };
  if (firstTime && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const op = document.createElement('div');
    op.className = 'opening';
    op.innerHTML = `<span class="env__paper"><span class="env__flap"></span><span class="env__seal">${I.heart}</span></span>`;
    document.body.appendChild(op);
    buzz([20, 60, 30]);
    setTimeout(() => { op.remove(); show(); }, 1050);
  } else show();
  void fromEl;
}

// ============================================================ check-ins & backup
function openCheckin(which) {
  const n = doneCount();
  const auto = n >= 48 ? 'w12' : n >= 32 ? 'w8' : n >= 16 ? 'w4' : 'start';
  let sel = which && which !== 'auto' ? which : auto;
  const fields = () => TESTS.map((t) => `<label class="field" for="t-${t.id}"><span style="color:var(--text)">${esc(t.name)} <span class="tiny">(${t.unit})</span></span><span class="tiny">${esc(t.how)}</span><input id="t-${t.id}" inputmode="decimal" value="${esc(S.tests[sel]?.[t.id] ?? '')}" placeholder="${t.optional ? 'Optional' : ''}"></label>`).join('');
  const sh = sheet(`<h2 class="d-m">Check-in</h2><p class="lead">Do these fresh, on a day you’re not sore. Write what you get, no judging.</p>
    <div class="seg" role="tablist">${CHECKINS.map((c) => `<button role="tab" data-ck="${c.id}" aria-selected="${c.id === sel}">${c.label}</button>`).join('')}</div>
    <div class="stack" id="ckFields">${fields()}</div>
    <button class="btn btn--pink btn--block" id="ckSave">Save check-in</button>`, { label: 'Check-in' });
  sh.el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ck]');
    if (!b) return;
    sel = b.dataset.ck;
    $$('[data-ck]', sh.el).forEach((x) => x.setAttribute('aria-selected', String(x.dataset.ck === sel)));
    $('#ckFields', sh.el).innerHTML = fields();
  });
  $('#ckSave', sh.el).addEventListener('click', () => {
    const rec = {};
    for (const t of TESTS) { const v = $(`#t-${t.id}`, sh.el).value.trim().replace(',', '.'); if (v !== '' && !Number.isNaN(+v)) rec[t.id] = +v; }
    if (!Object.keys(rec).length) { toast('Add at least one result first.'); return; }
    S.tests[sel] = Object.assign({ at: new Date().toISOString() }, rec);
    save(); sh.close(); render(); toast('Check-in saved.');
  });
}
function openBackup() {
  let code = '';
  try { code = btoa(unescape(encodeURIComponent(JSON.stringify(S)))); } catch { code = ''; }
  const sh = sheet(`<h2 class="d-m">Back up your progress</h2><p class="lead">Copy this code and keep it somewhere safe, like a note or a message to yourself. Paste it into Restore on any phone.</p>
    <textarea id="bkCode" readonly style="min-height:120px;font-size:12px">${esc(code)}</textarea>
    <button class="btn btn--pink btn--block" id="bkCopy">Copy code</button>`, { label: 'Backup' });
  $('#bkCopy', sh.el).addEventListener('click', () => {
    const ta = $('#bkCode', sh.el);
    const fallback = () => { ta.focus(); ta.select(); toast('Selected. Copy it from the menu.'); };
    try { navigator.clipboard.writeText(code).then(() => toast('Backup code copied.'), fallback); } catch { fallback(); }
  });
}
function openRestore() {
  const sh = sheet(`<h2 class="d-m">Restore progress</h2><p class="lead">Paste a backup code. This replaces the progress on this phone.</p>
    <label class="field" for="rsCode">Backup code<textarea id="rsCode" style="min-height:120px;font-size:12px"></textarea></label>
    <button class="btn btn--pink btn--block" id="rsGo">Restore</button>`, { label: 'Restore' });
  $('#rsGo', sh.el).addEventListener('click', () => {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob($('#rsCode', sh.el).value.trim()))));
      if (!data || typeof data !== 'object' || !data.done) throw new Error('bad');
      S = Object.assign(fresh(), data);
      save(); sh.close(); render(); toast('Progress restored.');
    } catch { toast('That code didn’t work. Check you copied all of it.'); }
  });
}

// ============================================================ boot
function startApp(fromLock) {
  app.innerHTML = shellHTML();
  bindShell();
  route = parseRoute(location.hash);
  render();
  if (!S.welcomed && V.letters.some((l) => l.id === 'welcome')) setTimeout(() => openLetter('welcome'), fromLock ? 250 : 500);
}

async function boot() {
  if (!window.__NO_SW__ && 'serviceWorker' in navigator && /^https:|^http:\/\/localhost/.test(location.href) && window.top === window.self) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  if (window.crypto && crypto.subtle) {
    const v = await rememberedVault();
    if (v) { V = v; startApp(false); return; }
  }
  showLock();
}
boot();
