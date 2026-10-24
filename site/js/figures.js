// Tiny pose engine for the exercise demos.
// World units are roughly centimetres, y points up, the floor is y = 0.
// Views: 'side' (sagittal), 'front' / 'back' (coronal), 'top' (looking down at someone lying).

const RAD = Math.PI / 180;
export const BODY = { thigh: 40, shin: 39, upper: 27, fore: 25, torso: 46, neck: 6, headR: 10.5, hipW: 8.5, shW: 15 };

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, s) => [a[0] * s, a[1] * s];
const len = (a) => Math.hypot(a[0], a[1]);
const dir = (deg) => [Math.cos(deg * RAD), Math.sin(deg * RAD)];
const ang = (a) => Math.atan2(a[1], a[0]) / RAD;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const lerp = (a, b, t) => a + (b - a) * t;
const lerp2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const mod = (n, m) => ((n % m) + m) % m;
const angDiff = (a, b) => mod(b - a + 180, 360) - 180;
const lerpAng = (a, b, t) => a + angDiff(a, b) * t;
const same = (a, b) => Math.abs(a[0] - b[0]) < 0.6 && Math.abs(a[1] - b[1]) < 0.6;
const rotm90 = (u) => [u[1], -u[0]]; // rotate -90 degrees

function ik(root, target, l1, l2, pref) {
  const d = sub(target, root);
  const base = ang(d);
  let dist = len(d);
  dist = Math.min(l1 + l2 - 0.05, Math.max(Math.abs(l1 - l2) + 0.5, dist));
  const cosA = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
  const A = Math.acos(Math.max(-1, Math.min(1, cosA))) / RAD;
  const c1 = base + A, c2 = base - A;
  const pick = Math.abs(angDiff(c1, pref)) <= Math.abs(angDiff(c2, pref)) ? c1 : c2;
  return [add(root, mul(dir(pick), l1)), add(root, mul(dir(base), dist))];
}

// ---------- pose building ----------
function frame(p) {
  const u = dir(p.torso);
  const S = add(p.pelvis, mul(u, p.tl));
  if (p.view === 'side') return { u, S, hips: [p.pelvis, p.pelvis], shs: [S, S] };
  const n = dir(p.torso - 90);
  return {
    u, S,
    hips: [add(p.pelvis, mul(n, BODY.hipW)), sub(p.pelvis, mul(n, BODY.hipW))],
    shs: [add(S, mul(n, BODY.shW)), sub(S, mul(n, BODY.shW))],
  };
}

// Arm presets, built in the torso frame so they follow the body.
const ARMS = {
  hips(p, F) {
    const u = F.u, f = rotm90(u), P = p.pelvis;
    if (p.view !== 'side') {
      const n = f;
      return [1, -1].map((s) => ({ end: add(add(P, mul(u, 7)), mul(n, 15.5 * s)), mid: add(add(F.S, mul(u, -21)), mul(n, 29 * s)) }));
    }
    const w = add(add(P, mul(u, 9)), mul(f, 3.5));
    const e = add(add(F.S, mul(u, -17)), mul(f, -13));
    return [{ end: w, mid: e }, { end: add(w, [-1.5, 0.8]), mid: add(e, [-1.5, 0.8]) }];
  },
  crossed(p, F) {
    const u = F.u, f = rotm90(u);
    const w = add(add(F.S, mul(u, -9)), mul(f, 11));
    const e = add(add(F.S, mul(u, -23)), mul(f, 7));
    return [{ end: w, mid: e }, { end: add(w, [-1, 1]), mid: add(e, [-1, 1]) }];
  },
  hipsUp(p, F) { // lying back: hands on the hip crease, elbows up
    const u = F.u, f = rotm90(u), P = p.pelvis;
    const w = add(add(P, mul(u, 9)), mul(f, 5.5));
    const e = add(add(F.S, mul(u, -19)), mul(f, 13));
    return [{ end: w, mid: e }, { end: add(w, [-1.5, 0.8]), mid: add(e, [-1.5, 0.8]) }];
  },
  forward(p, F) {
    const w = add(F.S, [49, -3]);
    return [{ end: w, pref: -90 }, { end: add(w, [-1.5, 1]), pref: -90 }];
  },
  down(p, F) {
    const w = add(F.S, [3, -50.5]);
    return [{ end: w, pref: 180 }, { end: add(w, [-1.5, 0.5]), pref: 180 }];
  },
  prayer(p, F) { // front view, hands together at the chest
    const u = F.u, n = rotm90(u);
    return [1, -1].map((s) => ({ end: add(add(F.S, mul(u, -15)), mul(n, 2.6 * s)), mid: add(add(F.S, mul(u, -23)), mul(n, 17 * s)) }));
  },
};

export function P(o) {
  const p = Object.assign({ view: 'side', torso: 90, tl: BODY.torso, curve: 0, breathe: 0, sq: 0 }, o);
  if (p.head == null) p.head = p.torso;
  const F = frame(p);
  if (typeof p.arms === 'string') p.arms = ARMS[p.arms](p, F);
  p.legs = p.legs.map((l) => Object.assign({ pref: 0, foot: 0 }, l));
  p.arms = p.arms.map((a) => Object.assign({ pref: 180, foot: 0 }, a));
  return p;
}

function withMid(limb, root, l1, l2) {
  if (limb.mid) return limb;
  const [mid, end] = ik(root, limb.end, l1, l2, limb.pref);
  return Object.assign({}, limb, { mid, end });
}

function polar(ra, pa, rb, pb, rt, t) {
  const A = sub(pa, ra), B = sub(pb, rb);
  return add(rt, mul(dir(lerpAng(ang(A), ang(B), t)), lerp(len(A), len(B), t)));
}

function mixLimb(a, b, ra, rb, rt, t, l1, l2) {
  const out = { pref: lerpAng(a.pref, b.pref, t), foot: lerpAng(a.foot, b.foot, t), flen: a.flen != null ? lerp(a.flen, b.flen ?? a.flen, t) : undefined };
  if (a.mid || b.mid) {
    const A = withMid(a, ra, l1, l2), B = withMid(b, rb, l1, l2);
    out.mid = same(A.mid, B.mid) ? A.mid.slice() : polar(ra, A.mid, rb, B.mid, rt, t);
    out.end = same(A.end, B.end) ? A.end.slice() : polar(A.mid, A.end, B.mid, B.end, out.mid, t);
  } else {
    out.end = same(a.end, b.end) ? a.end.slice() : polar(ra, a.end, rb, b.end, rt, t);
  }
  return out;
}

function interp(a, b, t) {
  const r = {
    view: a.view,
    pelvis: lerp2(a.pelvis, b.pelvis, t),
    torso: lerpAng(a.torso, b.torso, t),
    head: lerpAng(a.head, b.head, t),
    tl: lerp(a.tl, b.tl, t),
    curve: lerp(a.curve, b.curve, t),
    breathe: lerp(a.breathe, b.breathe, t),
    sq: lerp(a.sq, b.sq, t),
  };
  const fa = frame(a), fb = frame(b), fr = frame(r);
  r.legs = [0, 1].map((i) => mixLimb(a.legs[i], b.legs[i], fa.hips[i], fb.hips[i], fr.hips[i], t, BODY.thigh, BODY.shin));
  r.arms = [0, 1].map((i) => mixLimb(a.arms[i], b.arms[i], fa.shs[i], fb.shs[i], fr.shs[i], t, BODY.upper, BODY.fore));
  return r;
}

export function solve(p) {
  const F = frame(p);
  const legs = p.legs.map((L, i) => {
    const [knee, ankle] = L.mid ? [L.mid, L.end] : ik(F.hips[i], L.end, BODY.thigh, BODY.shin, L.pref);
    return { hip: F.hips[i], knee, ankle, foot: L.foot, flen: L.flen };
  });
  const arms = p.arms.map((A, i) => {
    const [elbow, wrist] = A.mid ? [A.mid, A.end] : ik(F.shs[i], A.end, BODY.upper, BODY.fore, A.pref);
    return { sh: F.shs[i], elbow, wrist };
  });
  const H = add(F.S, mul(dir(p.head), BODY.neck + BODY.headR));
  return { p, u: F.u, S: F.S, legs, arms, H };
}

// ---------- timeline ----------
const ease = (t) => 0.5 - 0.5 * Math.cos(Math.PI * t);

function timeline(def) {
  if (def._tl) return def._tl;
  const keys = def.keys;
  const segs = [];
  let T = 0;
  keys.forEach((k, i) => {
    const prev = keys[(i - 1 + keys.length) % keys.length];
    const tr = k.t ?? 1;
    if (keys.length > 1) { segs.push({ a: prev.p, b: k.p, t0: T, t1: T + tr }); T += tr; }
    const h = k.hold ?? 0;
    if (h > 0 || keys.length === 1) { segs.push({ a: k.p, b: k.p, t0: T, t1: T + Math.max(h, 0.5) }); T += Math.max(h, 0.5); }
  });
  def._tl = { segs, total: T };
  return def._tl;
}

export function poseAt(def, time) {
  const tl = timeline(def);
  const tt = mod(time, tl.total);
  const s = tl.segs.find((g) => tt >= g.t0 && tt < g.t1) || tl.segs[tl.segs.length - 1];
  if (s.a === s.b) return s.a;
  return interp(s.a, s.b, ease((tt - s.t0) / (s.t1 - s.t0)));
}
export const duration = (def) => timeline(def).total;

// ---------- drawing ----------
const n1 = (x) => (Math.round(x * 10) / 10).toString();
const pt = (p) => `${n1(p[0])},${n1(p[1])}`;
const line = (a, b, w, c, extra = '') => `<line x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;

function catmull(pts) {
  const n = pts.length;
  let d = `M${pt(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d + 'Z';
}

function torsoPath(J) {
  const p = J.p, P = p.pelvis, S = J.S;
  const L = len(sub(S, P)) || 1, u = mul(sub(S, P), 1 / L), f = rotm90(u);
  const at = (s, k) => add(add(P, mul(u, s * L)), mul(f, k));
  if (p.view === 'side') {
    const c = p.curve, b = p.breathe;
    return catmull([
      add(S, add(mul(f, 5.6), mul(u, 1.5))),
      at(0.8, 9.0),
      at(0.52, 7.0 - 4 * c + 3.8 * b),
      at(0.2, 7.8 + 1.5 * b),
      at(-0.1, 5.4),
      at(-0.24, -2.4),
      at(-0.06, -11.6),
      at(0.28, -8.2 - 4.5 * c),
      at(0.62, -9.2 - 7 * c),
      add(S, add(mul(f, -7.4), mul(u, -0.5))),
      add(S, mul(u, 3.8)),
    ]);
  }
  const b = p.breathe;
  const side = [[1.0, 16.2], [0.7, 13.2], [0.44, 11.7 + b], [0.1, 14.2], [-0.15, 11.6]];
  const right = side.map(([s, k]) => at(s, k));
  const left = side.slice().reverse().map(([s, k]) => at(s, -k));
  return catmull([at(1.07, 0), ...right, at(-0.21, 0), ...left]);
}

function footPts(leg, view) {
  const flen = leg.flen ?? (view === 'side' ? 14 : 5.5);
  const fd = dir(leg.foot);
  const shin = sub(leg.knee, leg.ankle);
  let sole = rotm90(fd);
  if (dot(sole, shin) > 0) sole = mul(sole, -1);
  const heel = add(add(leg.ankle, mul(fd, view === 'side' ? -3 : -0.5)), mul(sole, 1.4));
  const toe = add(add(leg.ankle, mul(fd, flen)), mul(sole, 1.4));
  return [heel, toe];
}

function thighSides(leg, J) {
  const t = unit(sub(leg.knee, leg.hip));
  let m = rotm90(t);
  const toAnkle = sub(leg.ankle, leg.hip);
  const proj = dot(toAnkle, m);
  if (Math.abs(proj) < 2) {
    const f = rotm90(J.u);
    if (dot(m, f) > 0) m = mul(m, -1);
  } else if (proj < 0) m = mul(m, -1);
  return { mid: lerp2(leg.hip, leg.knee, 0.48), post: m, ant: mul(m, -1), t };
}

function focusShapes(J, specs) {
  const p = J.p, P = p.pelvis, S = J.S;
  const L = len(sub(S, P)) || 1, u = mul(sub(S, P), 1 / L), f = rotm90(u);
  const tAng = ang(u);
  const out = [];
  for (const spec of specs || []) {
    const [name, sd] = spec.split(':');
    const i = sd === 'b' ? 1 : 0, sg = i === 0 ? 1 : -1;
    const leg = J.legs[i];
    switch (name) {
      case 'glute':
        if (p.view === 'side') out.push([add(add(P, mul(f, -7.2)), mul(u, -2.5)), 11.5, 9.5, tAng]);
        else if (p.view === 'back') { out.push([add(add(P, mul(f, 6)), mul(u, -2)), 9, 8, tAng]); out.push([add(add(P, mul(f, -6)), mul(u, -2)), 9, 8, tAng]); }
        else out.push([add(J.legs[i].hip, mul(f, 5 * sg)), 9, 8, tAng]);
        break;
      case 'gmed':
        if (p.view === 'side') out.push([add(add(P, mul(f, -4)), mul(u, 5)), 9, 8, tAng]);
        else out.push([add(add(leg.hip, mul(f, 6.5 * sg)), mul(u, 3)), 8.5, 9.5, tAng]);
        break;
      case 'ham': case 'quad': case 'hipflexor': {
        const s = thighSides(leg, J);
        if (name === 'hipflexor') out.push([add(add(leg.hip, mul(s.t, 10)), mul(s.ant, 4)), 8, 6.5, ang(s.t)]);
        else out.push([add(s.mid, mul(name === 'ham' ? s.post : s.ant, 3.6)), 12, 6.6, ang(s.t)]);
        break;
      }
      case 'adductor': {
        const s = thighSides(leg, J);
        const toMid = unit(sub(P, s.mid));
        out.push([add(s.mid, mul(toMid, 3.5)), 10.5, 6, ang(s.t)]);
        break;
      }
      case 'core':
        out.push([add(add(P, mul(u, 0.46 * L)), mul(f, p.view === 'side' ? 3 : 0)), 8.5, Math.max(7, 0.26 * L), tAng]);
        break;
      case 'oblique':
        out.push([add(add(P, mul(u, 0.5 * L)), mul(f, 9.5 * sg)), 7, 11, tAng]);
        break;
      case 'back':
        out.push([add(add(P, mul(u, 0.32 * L)), mul(f, -5)), 9, 11, tAng]);
        break;
      case 'belly':
        out.push([add(add(P, mul(u, 0.36 * L)), mul(f, p.view === 'side' ? 4 : 0)), 9.5, 8.5, tAng]);
        break;
      default: break;
    }
  }
  return out;
}

const C = {
  near: 'var(--fig-near, #f7eef3)',
  far: 'var(--fig-far, #7b6070)',
  cut: 'var(--fig-cut, #120c10)',
  hair: 'var(--fig-hair, #ff4d94)',
  tie: 'var(--fig-tie, #c2185b)',
  prop: 'var(--fig-prop, #1d151a)',
  edge: 'var(--fig-edge, #3a2a33)',
  floor: 'var(--fig-floor, #3a2a33)',
  mat: 'var(--fig-mat, #2a1520)',
};
const W = { thigh: 13, shin: 10.2, foot: 6.4, upper: 8.6, fore: 7.4, neck: 8, hand: 3.7 };

function drawLimbLeg(leg, color, outline, view) {
  const [heel, toe] = footPts(leg, view);
  let s = '';
  if (outline) {
    s += line(lerp2(leg.hip, leg.knee, 0.38), leg.knee, W.thigh + 3.4, C.cut) + line(leg.knee, leg.ankle, W.shin + 3.4, C.cut) + line(heel, toe, W.foot + 3, C.cut);
  }
  s += line(leg.hip, leg.knee, W.thigh, color) + line(leg.knee, leg.ankle, W.shin, color) + line(heel, toe, W.foot, color);
  return s;
}
function drawLimbArm(arm, color, outline) {
  let s = '';
  if (outline) s += line(lerp2(arm.sh, arm.elbow, 0.38), arm.elbow, W.upper + 3.2, C.cut) + line(arm.elbow, arm.wrist, W.fore + 3.2, C.cut) + `<circle cx="${n1(arm.wrist[0])}" cy="${n1(arm.wrist[1])}" r="${W.hand + 1.6}" fill="${C.cut}"/>`;
  s += line(arm.sh, arm.elbow, W.upper, color) + line(arm.elbow, arm.wrist, W.fore, color) + `<circle cx="${n1(arm.wrist[0])}" cy="${n1(arm.wrist[1])}" r="${W.hand}" fill="${color}"/>`;
  return s;
}

function drawHead(J, hairY = 2.5) {
  const p = J.p, H = J.H, R = BODY.headR;
  const hu = dir(p.head), hf = rotm90(hu);
  const neckA = add(J.S, mul(J.u, 2));
  let s = line(neckA, add(H, mul(hu, -R * 0.4)), W.neck + 3, C.cut) + line(neckA, add(H, mul(hu, -R * 0.4)), W.neck, C.near);
  let hair = '';
  if (p.view === 'side') {
    const root = add(H, add(mul(hf, -R * 0.74), mul(hu, R * 0.4)));
    const c = add(root, add(mul(hf, -9), [0, -1.5]));
    const end = add(root, add(mul(hf, -7), [0, -14.5]));
    if (end[1] < hairY) end[1] = hairY;
    if (c[1] < hairY) c[1] = hairY;
    hair = `<path d="M${pt(root)}Q${pt(c)} ${pt(end)}" fill="none" stroke="${C.hair}" stroke-width="6.4" stroke-linecap="round"/>` +
      `<circle cx="${n1(root[0])}" cy="${n1(root[1])}" r="2.7" fill="${C.tie}"/>`;
  } else {
    const bun = add(H, mul(hu, R + 2.2));
    hair = `<circle cx="${n1(bun[0])}" cy="${n1(bun[1])}" r="4.7" fill="${C.hair}"/>`;
  }
  const headC = `<circle cx="${n1(H[0])}" cy="${n1(H[1])}" r="${R + 1.6}" fill="${C.cut}"/><circle cx="${n1(H[0])}" cy="${n1(H[1])}" r="${R}" fill="${C.near}"/>`;
  // ponytail sits behind the head in side view, in front for the back view
  return s + hair + headC;
}

function drawProps(def, J, box) {
  let s = '';
  for (const pr of def.props || []) {
    switch (pr.type) {
      case 'mat': s += `<rect x="${pr.x0}" y="-2.6" width="${pr.x1 - pr.x0}" height="2.6" rx="1.3" fill="${C.mat}"/>`; break;
      case 'couch': {
        const h = pr.h ?? 38;
        s += `<rect x="${pr.x0}" y="0" width="${pr.x1 - pr.x0}" height="${h}" rx="5" fill="${C.prop}" stroke="${C.edge}" stroke-width="1.2"/>`;
        s += `<line x1="${pr.x0 + 4}" y1="${h - 9}" x2="${pr.x1 - 4}" y2="${h - 9}" stroke="${C.edge}" stroke-width="1"/>`;
        break;
      }
      case 'chair': {
        const x = pr.x, d = pr.depth ?? 38, h = pr.h ?? 45, back = pr.back ?? 1;
        const xb = back > 0 ? x - d : x + d; // backrest side away from the person
        s += `<rect x="${Math.min(x, xb)}" y="${h - 4}" width="${d}" height="4" rx="1.5" fill="${C.prop}" stroke="${C.edge}" stroke-width="1.2"/>`;
        s += line([x - 3 * Math.sign(x - xb), 0], [x - 3 * Math.sign(x - xb), h - 4], 2.6, C.edge) + line([xb + 3 * Math.sign(x - xb), 0], [xb + 3 * Math.sign(x - xb), h + 44], 2.6, C.edge);
        s += line([xb + 3 * Math.sign(x - xb), h + 18], [xb + 3 * Math.sign(x - xb), h + 44], 4, C.edge);
        break;
      }
      case 'wall': {
        const x = pr.x, w = 9, side = pr.side ?? -1;
        const left = side < 0 ? x - w : x;
        s += `<rect x="${left}" y="0" width="${w}" height="${box.top - 0}" fill="${C.prop}"/>` + line([x, 0], [x, box.top], 1.2, C.edge);
        break;
      }
      case 'step': case 'book':
        s += `<rect x="${pr.x0}" y="0" width="${pr.x1 - pr.x0}" height="${pr.h}" rx="${pr.type === 'book' ? 1 : 2}" fill="${pr.type === 'book' ? C.mat : C.prop}" stroke="${C.edge}" stroke-width="1.1"/>`;
        break;
      case 'pillow':
        s += `<ellipse cx="${pr.cx}" cy="${pr.cy}" rx="${pr.rx}" ry="${pr.ry}" fill="${C.mat}" stroke="${C.edge}" stroke-width="1"/>`;
        break;
      case 'towel': {
        const a = J.legs[0].ankle;
        s += `<rect x="${n1(a[0] - 9)}" y="0" width="22" height="2.6" rx="1" fill="${C.hair}" opacity="0.75"/>`;
        break;
      }
      case 'topmat':
        s += `<rect x="${pr.x0}" y="${pr.y0}" width="${pr.x1 - pr.x0}" height="${pr.y1 - pr.y0}" rx="8" fill="${C.mat}"/>`;
        break;
      default: break;
    }
  }
  return s;
}

function drawGlow(J, def, gid) {
  const shapes = focusShapes(J, def.focus);
  const o = 0.16 + 0.84 * J.p.sq;
  return shapes.map(([c, rx, ry, a]) => `<ellipse cx="${n1(c[0])}" cy="${n1(c[1])}" rx="${rx}" ry="${ry}" transform="rotate(${n1(a)} ${n1(c[0])} ${n1(c[1])})" fill="url(#${gid})" opacity="${o.toFixed(2)}"/>`).join('');
}

export function drawFigure(J, def, gid, opts = {}) {
  const v = J.p.view;
  let s = '';
  if (v === 'side') {
    s += drawLimbArm(J.arms[1], C.far, false);
    s += drawLimbLeg(J.legs[1], C.far, false, v);
    s += `<path d="${torsoPath(J)}" fill="${C.near}" stroke="${C.cut}" stroke-width="2.6"/>`;
    if (!def.headLast) s += drawHead(J, def.hairY);
    s += drawLimbLeg(J.legs[0], C.near, true, v);
    s += drawLimbArm(J.arms[0], C.near, true);
    if (def.headLast) s += drawHead(J, def.hairY);
  } else if (v === 'back') {
    s += drawLimbArm(J.arms[1], C.near, true) + drawLimbArm(J.arms[0], C.near, true);
    s += drawHead(J, def.hairY);
    s += `<path d="${torsoPath(J)}" fill="${C.near}"/>`;
    s += drawLimbLeg(J.legs[1], C.near, true, v) + drawLimbLeg(J.legs[0], C.near, true, v);
  } else {
    s += drawLimbLeg(J.legs[1], C.near, true, v) + drawLimbLeg(J.legs[0], C.near, true, v);
    s += `<path d="${torsoPath(J)}" fill="${C.near}" stroke="${C.cut}" stroke-width="2.6"/>`;
    s += drawLimbArm(J.arms[1], C.near, true) + drawLimbArm(J.arms[0], C.near, true);
    s += drawHead(J, def.hairY);
  }
  if (!opts.noGlow) s += drawGlow(J, def, gid);
  return s;
}

// ---------- camera ----------
function collectBounds(def) {
  const xs = [], ys = [];
  const tl = timeline(def);
  const N = 24;
  for (let i = 0; i < N; i++) {
    const J = solve(poseAt(def, (tl.total * i) / N));
    const pts = [J.S, J.H, ...J.legs.flatMap((l) => [l.hip, l.knee, l.ankle, ...footPts(l, J.p.view)]), ...J.arms.flatMap((a) => [a.sh, a.elbow, a.wrist])];
    for (const q of pts) { xs.push(q[0]); ys.push(q[1]); }
    xs.push(J.H[0] - 16, J.H[0] + 16); ys.push(J.H[1] - 16, J.H[1] + 14);
    xs.push(J.p.pelvis[0] - 12, J.p.pelvis[0] + 12);
  }
  for (const pr of def.props || []) {
    if (pr.type === 'couch' || pr.type === 'step' || pr.type === 'book' || pr.type === 'mat') { xs.push(pr.x0, pr.x1); ys.push(pr.h ?? 0); }
    if (pr.type === 'chair') { xs.push(pr.x, pr.x - (pr.depth ?? 38) * (pr.back ?? 1)); ys.push((pr.h ?? 45) + 44); }
    if (pr.type === 'wall') xs.push(pr.x + (pr.side ?? -1) * 10);
    if (pr.type === 'pillow') { xs.push(pr.cx - pr.rx, pr.cx + pr.rx); }
    if (pr.type === 'topmat') { xs.push(pr.x0, pr.x1); ys.push(pr.y0, pr.y1); }
  }
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

export function camera(def, aspect = 4 / 3) {
  const key = 'cam' + aspect.toFixed(3);
  if (def[key]) return def[key];
  const b = collectBounds(def);
  const pad = 9;
  const top = def.view === 'top';
  let x0 = b.minX - pad, x1 = b.maxX + pad;
  let y0 = top ? b.minY - pad : -9, y1 = b.maxY + pad;
  let w = x1 - x0, h = y1 - y0;
  if (w < 150) { const c = (x0 + x1) / 2; x0 = c - 75; x1 = c + 75; w = 150; }
  if (w / h < aspect) { const nw = h * aspect; const c = (x0 + x1) / 2; x0 = c - nw / 2; x1 = c + nw / 2; w = nw; }
  else { const nh = w / aspect; if (top) { const c = (y0 + y1) / 2; y0 = c - nh / 2; y1 = c + nh / 2; } else { y1 = y0 + nh; } h = nh; }
  def[key] = { x0, x1, y0, y1, w, h };
  return def[key];
}

let uidN = 0;
function shell(def, cam, inner, gid, label) {
  const vb = `${n1(cam.x0)} ${n1(-cam.y1)} ${n1(cam.w)} ${n1(cam.h)}`;
  const floor = def.view === 'top' ? '' : line([cam.x0, 0], [cam.x1, 0], 1.3, C.floor);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" class="fig-svg" role="img" aria-label="${label || ''}">` +
    `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="var(--fig-glow, #ff2e83)" stop-opacity="0.95"/><stop offset="0.55" stop-color="var(--fig-glow, #ff2e83)" stop-opacity="0.42"/><stop offset="1" stop-color="var(--fig-glow, #ff2e83)" stop-opacity="0"/></radialGradient></defs>` +
    `<g transform="scale(1,-1)">${floor}${inner}</g></svg>`;
}

export function figureSVG(id, opts = {}) {
  const def = FIGS[id];
  if (!def) return '';
  const cam = camera(def, opts.aspect || 4 / 3);
  const gid = 'fg' + (++uidN) + (opts.gidSuffix || '');
  const box = { top: cam.y1 };
  const keys = def.keys;
  const peakIdx = def.peak ?? (keys.length > 1 ? 1 : 0);
  let inner = '';
  const ghostP = opts.ghost === false ? null : keys[0].p;
  const mainP = keys[Math.min(peakIdx, keys.length - 1)].p;
  const Jm = solve(mainP);
  inner += drawProps(def, Jm, box);
  if (ghostP && keys.length > 1) inner += `<g opacity="0.26">${drawFigure(solve(ghostP), def, gid, { noGlow: true })}</g>`;
  inner += drawFigure(Jm, def, gid, { noGlow: opts.glow === false });
  return shell(def, cam, inner, gid, def.name);
}

export function frameSVG(id, time, opts = {}) {
  const def = FIGS[id];
  if (!def) return '';
  const cam = camera(def, opts.aspect || 4 / 3);
  const gid = 'ff' + (++uidN);
  const J = solve(poseAt(def, time));
  return shell(def, cam, drawProps(def, J, { top: cam.y1 }) + drawFigure(J, def, gid), gid, def.name);
}

export function keyTimes(id) {
  const def = FIGS[id];
  const tl = timeline(def);
  const out = [];
  for (const s of tl.segs) {
    if (s.a === s.b) continue;
    out.push((s.t0 + s.t1) / 2, s.t1 - 0.001);
  }
  if (!out.length) out.push(0);
  return out;
}

export function mountFigure(el, id, opts = {}) {
  const def = FIGS[id];
  if (!def) { el.innerHTML = ''; return { play() {}, pause() {}, destroy() {} }; }
  const cam = camera(def, opts.aspect || 4 / 3);
  const gid = 'fa' + (++uidN);
  el.innerHTML = shell(def, cam, '<g class="fig-live"></g>', gid, def.name);
  const g = el.querySelector('.fig-live');
  const box = { top: cam.y1 };
  const total = duration(def);
  const speed = opts.speed || 1;
  const fpsGap = opts.fps ? 1000 / opts.fps : 0;
  let raf = 0, running = false, t0 = performance.now() - (opts.offset || 0) * 1000, last = 0, visible = true;
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render = (time) => {
    const J = solve(poseAt(def, time));
    g.innerHTML = drawProps(def, J, box) + drawFigure(J, def, gid);
  };
  const tick = (now) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    if (fpsGap && now - last < fpsGap) return;
    last = now;
    render(((now - t0) / 1000) * speed);
  };
  let io = null;
  if (typeof IntersectionObserver === 'function') {
    io = new IntersectionObserver((ents) => { visible = ents.some((e) => e.isIntersecting); }, { rootMargin: '80px' });
    io.observe(el);
  }
  const api = {
    play() { if (running || reduce) return; running = true; raf = requestAnimationFrame(tick); },
    pause() { running = false; cancelAnimationFrame(raf); },
    destroy() { api.pause(); if (io) io.disconnect(); },
    total,
  };
  render(reduce ? total * (timeline(def).segs[1]?.t0 ?? 0) / total : 0);
  if (opts.autoplay !== false) api.play();
  return api;
}

// ============================================================
//                       FIGURE LIBRARY
// ============================================================
const L = (end, pref = 0, foot = 0, extra = {}) => Object.assign({ end, pref, foot }, extra);
const Lm = (mid, end, foot = 0, extra = {}) => Object.assign({ mid, end, foot }, extra);
const A = (end, pref = 180, extra = {}) => Object.assign({ end, pref }, extra);
const Am = (mid, end) => ({ mid, end });
const k = (p, t = 1, hold = 0) => ({ p, t, hold });

// shared lying geometry
const SH_FLOOR = [-42, 9.5];
const onFloorArms = [A([9, 4.5], 90), A([7.5, 5.2], 90)];
function bridgePelvis(lift, S = SH_FLOOR) {
  const pel = add(S, mul(dir(lift), BODY.torso));
  return { pelvis: [pel[0], Math.max(pel[1], 11.5)], torso: 180 + lift };
}

// quadruped (facing right)
const QUAD = { pelvis: [0, 45], torso: 12.6, head: 8 };
const QS = add(QUAD.pelvis, mul(dir(QUAD.torso), BODY.torso));
const quadArms = [A([QS[0], 3.5], 180), A([QS[0] - 1.5, 4], 180)];
const quadLegs = [L([-38, 6], -90, 180), L([-39.5, 6.5], -90, 180)];

// high plank (facing right)
const HP = { pelvis: [-2.8, 38.1], torso: 21.6, head: 16 };
const HPS = add(HP.pelvis, mul(dir(HP.torso), BODY.torso));
const hpArms = [A([HPS[0], 3.5], 180), A([HPS[0] - 1.5, 4], 180)];
const hpLegs = [L([-76.3, 9.5], 180, -35), L([-77.5, 10], 180, -35)];

export const FIGS = {};
function fig(id, def) { def.id = id; FIGS[id] = def; }

// ---------- GLUTES ----------
{
  const down = P({ ...bridgePelvis(0), head: 176, legs: [L([37, 5], 90), L([35.5, 5.5], 90)], arms: onFloorArms });
  const up = P({ ...bridgePelvis(22), head: 176, sq: 1, legs: [L([37, 5], 90), L([35.5, 5.5], 90)], arms: onFloorArms });
  fig('glute-bridge', { name: 'Glute bridge', view: 'side', focus: ['glute'], props: [{ type: 'mat', x0: -78, x1: 52 }], keys: [k(down, 1.2, 0.35), k(up, 0.9, 1.1)] });

  const fdown = P({ ...bridgePelvis(0), head: 176, legs: [Lm([19, 21], [26, 6], 10), Lm([18, 19], [25, 6.5], 10)], arms: onFloorArms });
  const fup = P({ ...bridgePelvis(15), head: 176, sq: 1, legs: [Lm([22, 31], [26, 6], 10), Lm([21, 29], [25, 6.5], 10)], arms: onFloorArms });
  fig('frog-pump', { name: 'Frog pumps', view: 'side', focus: ['glute'], props: [{ type: 'mat', x0: -78, x1: 44 }], keys: [k(fdown, 0.45, 0.1), k(fup, 0.35, 0.25)] });

  const sb = P({ ...bridgePelvis(0), head: 176, legs: [L([37, 5], 90), L(add(bridgePelvis(0).pelvis, mul(dir(36), 78.5)), 90, 96)], arms: onFloorArms });
  const ubp = bridgePelvis(22);
  const su = P({ ...ubp, head: 176, sq: 1, legs: [L([37, 5], 90), L(add(ubp.pelvis, mul(dir(30), 78.5)), 90, 92)], arms: onFloorArms });
  fig('sl-glute-bridge', { name: 'Single-leg glute bridge', view: 'side', focus: ['glute'], props: [{ type: 'mat', x0: -78, x1: 52 }], keys: [k(sb, 1.2, 0.3), k(su, 0.9, 1)] });

  const top = P({ ...bridgePelvis(22), head: 176, sq: 0.8, legs: [L([37, 5], 90), L([35.5, 5.5], 90)], arms: onFloorArms });
  const tp = top.pelvis;
  const lift = (i) => { const lg = [L([37, 5], 90), L([35.5, 5.5], 90)]; lg[i] = L(add(add(tp, mul(dir(84), 40)), [39, 0]), 84, 0); return lg; };
  const mA = P({ ...bridgePelvis(22), head: 176, sq: 0.9, legs: lift(0), arms: onFloorArms });
  const mB = P({ ...bridgePelvis(22), head: 176, sq: 0.9, legs: lift(1), arms: onFloorArms });
  fig('bridge-march', { name: 'Glute bridge march', view: 'side', focus: ['core', 'glute'], props: [{ type: 'mat', x0: -78, x1: 52 }], keys: [k(top, 0.9, 0.3), k(mA, 0.9, 0.6), k(top, 0.9, 0.3), k(mB, 0.9, 0.6)] });

  const w0 = P({ ...bridgePelvis(22), head: 176, sq: 0.6, legs: [L([37, 5], 90), L([35.5, 5.5], 90)], arms: onFloorArms });
  const w1 = P({ ...bridgePelvis(19), head: 176, sq: 0.8, legs: [L([51, 5], 90, 10), L([49.5, 5.5], 90, 10)], arms: onFloorArms });
  const w2 = P({ ...bridgePelvis(15), head: 176, sq: 1, legs: [L([65, 5.5], 90, 30), L([63.5, 6], 90, 30)], arms: onFloorArms });
  fig('hamstring-walkout', { name: 'Bridge walkouts', view: 'side', focus: ['ham:a', 'glute'], props: [{ type: 'mat', x0: -78, x1: 76 }], keys: [k(w0, 0.8, 0.3), k(w1, 0.55, 0.1), k(w2, 0.55, 0.5), k(w1, 0.55, 0.1)] });

  const c0 = P({ ...bridgePelvis(22), head: 176, sq: 0.6, legs: [L([37, 5], 90, 14), L([35.5, 5.5], 90, 14)], arms: onFloorArms });
  const c1 = P({ ...bridgePelvis(14), head: 176, sq: 1, legs: [L([70, 5], 90, 36), L([68.5, 5.5], 90, 36)], arms: onFloorArms });
  fig('sliding-leg-curl', { name: 'Sliding leg curl', view: 'side', focus: ['ham:a', 'glute'], props: [{ type: 'mat', x0: -78, x1: 84 }, { type: 'towel' }], keys: [k(c0, 1.0, 0.3), k(c1, 1.6, 0.25)] });

  // couch hip thrust family: upper back on the couch edge
  const HS = [-34, 46];
  const ht = (lift) => { const pel = add(HS, mul(dir(lift), BODY.torso)); return { pelvis: pel, torso: 180 + lift }; };
  const couch = { type: 'couch', x0: -104, x1: -31, h: 38 };
  const hArms = 'hipsUp';
  const hb = P({ ...ht(-38), head: 140, legs: [L([50, 5], 90), L([48.5, 5.5], 90)], arms: hArms });
  const hu = P({ ...ht(0), head: 168, sq: 1, legs: [L([50, 5], 90), L([48.5, 5.5], 90)], arms: hArms });
  fig('hip-thrust', { name: 'Couch hip thrust', view: 'side', focus: ['glute'], hairY: 40, props: [couch], keys: [k(hb, 1.3, 0.3), k(hu, 1.0, 1.0)] });

  const bb = P({ ...ht(-38), head: 140, legs: [L([50, 5], 90), L([72, 6], 90, 40)], arms: hArms });
  const bu = P({ ...ht(0), head: 168, sq: 1, legs: [L([50, 5], 90), L([72, 6], 90, 40)], arms: hArms });
  fig('bstance-hip-thrust', { name: 'B-stance hip thrust', view: 'side', focus: ['glute'], hairY: 40, props: [couch], keys: [k(bb, 1.3, 0.3), k(bu, 1.0, 1.0)] });

  const slTop = ht(0);
  const relTop = [32, 39];
  const slBot = ht(-38);
  const relBot = mul(dir(ang(relTop) - 38), len(relTop));
  const sb2 = P({ ...slBot, head: 140, legs: [L([50, 5], 90), L(add(slBot.pelvis, relBot), 62, -38)], arms: hArms });
  const su2 = P({ ...slTop, head: 168, sq: 1, legs: [L([50, 5], 90), L(add(slTop.pelvis, relTop), 100, 0)], arms: hArms });
  fig('sl-hip-thrust', { name: 'Single-leg hip thrust', view: 'side', focus: ['glute'], hairY: 40, props: [couch], keys: [k(sb2, 1.3, 0.3), k(su2, 1.0, 1.0)] });

  // single-leg bridge, heel on the couch
  const SC = [-46, 9.5];
  const cb = (lift) => { const pel = add(SC, mul(dir(lift), BODY.torso)); return { pelvis: [pel[0], Math.max(11.5, pel[1])], torso: 180 + lift }; };
  const e0 = cb(0), e1 = cb(24);
  const fc0 = P({ ...e0, head: 176, legs: [L([54, 42], 90, 80), L(add(e0.pelvis, mul(dir(82), 78)), 90, 170)], arms: [A([4, 4.5], 90), A([2.5, 5.2], 90)] });
  const fc1 = P({ ...e1, head: 176, sq: 1, legs: [L([54, 42], 90, 80), L(add(e1.pelvis, mul(dir(82), 78)), 90, 170)], arms: [A([4, 4.5], 90), A([2.5, 5.2], 90)] });
  fig('sl-bridge-couch', { name: 'Single-leg bridge, foot on couch', view: 'side', focus: ['glute', 'ham:a'], props: [{ type: 'couch', x0: 50, x1: 120, h: 38 }, { type: 'mat', x0: -82, x1: 48 }], keys: [k(fc0, 1.2, 0.3), k(fc1, 0.9, 0.9)] });

  // quadruped kicks
  const q0 = P({ ...QUAD, legs: quadLegs, arms: quadArms });
  const kn = add(QUAD.pelvis, mul(dir(193), 40));
  const kick = P({ ...QUAD, sq: 1, legs: [L(add(kn, mul(dir(103), 39)), 200, 172), quadLegs[1]], arms: quadArms });
  fig('donkey-kick', { name: 'Donkey kick', view: 'side', focus: ['glute'], props: [{ type: 'mat', x0: -60, x1: 62 }], keys: [k(q0, 1.1, 0.3), k(kick, 0.8, 0.9)] });

  // fire hydrant from behind
  const fhLegs = (lift) => {
    const hipA = [BODY.hipW, 45];
    const kA = lift ? add(hipA, mul(dir(-22), 39)) : [10, 6];
    return [Lm(kA, add(kA, [2.5, -3]), -60, { flen: 3 }), Lm([-10, 6], [-12.5, 3], -120, { flen: 3 })];
  };
  const fhArms = [A([22, 3.5], 0), A([-22, 3.5], 180)];
  const fh0 = P({ view: 'back', pelvis: [0, 45], torso: 90, tl: 21, legs: fhLegs(false), arms: fhArms });
  const fh1 = P({ view: 'back', pelvis: [-1.5, 45.5], torso: 92, tl: 21, sq: 1, legs: fhLegs(true), arms: fhArms });
  fig('fire-hydrant', { name: 'Fire hydrant', view: 'back', focus: ['gmed:a'], keys: [k(fh0, 1.0, 0.3), k(fh1, 0.8, 0.8)] });

  // side-lying (front view, head left)
  const SL = { view: 'front', pelvis: [0, 17], torso: 180, head: 180 };
  const slArms = [Am([-24, 43], [-3, 30.5]), A([-95, 4], 90)];
  const ab0 = P({ ...SL, legs: [L([78, 21.5], -90, -40, { flen: 6 }), L([78, 6], -90, -40, { flen: 6 })], arms: slArms });
  const ab1 = P({ ...SL, sq: 1, legs: [L(add([0, 25.5], mul(dir(32), 78)), -90, 0, { flen: 6 }), L([78, 6], -90, -40, { flen: 6 })], arms: slArms });
  fig('side-lying-abduction', { name: 'Side-lying hip abduction', view: 'front', focus: ['gmed:a'], props: [{ type: 'mat', x0: -110, x1: 92 }], keys: [k(ab0, 1.2, 0.3), k(ab1, 0.9, 0.5)] });

  const cl0 = P({ ...SL, legs: [Lm([29, 22.5], [55, 21], -30, { flen: 5 }), Lm([29, 7], [55, 7.5], -30, { flen: 5 })], arms: slArms });
  const cl1 = P({ ...SL, sq: 1, legs: [Lm([25, 46], [55, 21], -30, { flen: 5 }), Lm([29, 7], [55, 7.5], -30, { flen: 5 })], arms: slArms });
  fig('clamshell', { name: 'Clamshell', view: 'front', focus: ['gmed:a'], props: [{ type: 'mat', x0: -110, x1: 70 }], keys: [k(cl0, 1.0, 0.3), k(cl1, 0.8, 0.7)] });
}

// ---------- HINGES ----------
{
  const st = P({ pelvis: [0, 84], torso: 90, legs: [L([0, 5]), L([-1.5, 5.5])], arms: 'crossed' });
  const hn = P({ pelvis: [-14, 81], torso: 42, head: 38, sq: 1, legs: [L([0, 5]), L([-1.5, 5.5])], arms: 'crossed' });
  fig('good-morning', { name: 'Good morning', view: 'side', focus: ['ham:a', 'glute'], keys: [k(st, 1.0, 0.4), k(hn, 1.5, 0.3)] });

  const ks0 = P({ pelvis: [0, 84], torso: 90, legs: [L([0, 5]), L([-20, 9], 0, -48)], arms: 'down' });
  const ks1 = P({ pelvis: [-16, 80], torso: 28, head: 24, sq: 1, legs: [L([0, 5]), L([-20, 9], 0, -48)], arms: 'down' });
  fig('kickstand-rdl', { name: 'Kickstand RDL', view: 'side', focus: ['glute', 'ham:a'], keys: [k(ks0, 1.0, 0.4), k(ks1, 1.4, 0.3)] });

  const s0 = P({ pelvis: [0, 83], torso: 88, legs: [L([0, 5]), L([-9, 15], 0, -30)], arms: 'down' });
  const pel = [-8, 82];
  const s1 = P({ pelvis: pel, torso: 14, head: 10, sq: 1, legs: [L([0, 5]), L(add(pel, mul(dir(194), 78)), 180, -76)], arms: 'down' });
  fig('sl-rdl', { name: 'Single-leg RDL', view: 'side', focus: ['glute', 'ham:a'], keys: [k(s0, 1.1, 0.4), k(s1, 1.6, 0.3)] });
}

// ---------- SQUATS & LUNGES ----------
{
  const stand = (o = {}) => P(Object.assign({ pelvis: [0, 84], torso: 90, legs: [L([0, 5]), L([-1.5, 5.5])], arms: 'forward' }, o));
  const b1 = P({ pelvis: [-26, 55], torso: 60, head: 70, sq: 1, legs: [L([0, 5]), L([-1.5, 5.5])], arms: 'forward' });
  fig('box-squat', { name: 'Box squat', view: 'side', focus: ['quad:a', 'glute'], props: [{ type: 'chair', x: -30, depth: 38, h: 45, back: 1 }], keys: [k(stand(), 0.9, 0.35), k(b1, 1.3, 0.25)] });

  const b2 = P({ pelvis: [-22, 50], torso: 58, head: 66, sq: 1, legs: [L([0, 5]), L([-1.5, 5.5])], arms: 'forward' });
  fig('squat', { name: 'Squat', view: 'side', focus: ['quad:a', 'glute'], keys: [k(stand(), 0.9, 0.35), k(b2, 1.6, 0.45)] });

  const he0 = P({ pelvis: [0, 88], torso: 90, legs: [L([0, 9.5], 0, -18), L([-1.5, 10], 0, -18)], arms: 'forward' });
  const he1 = P({ pelvis: [-12, 47], torso: 72, head: 80, sq: 1, legs: [L([0, 9.5], 0, -18), L([-1.5, 10], 0, -18)], arms: 'forward' });
  fig('heel-elevated-squat', { name: 'Heel-elevated squat', view: 'side', focus: ['quad:a'], props: [{ type: 'book', x0: -8, x1: 6, h: 5 }], keys: [k(he0, 0.9, 0.35), k(he1, 1.6, 0.4)] });

  const ws0 = P({ pelvis: [-20, 46], torso: 90, legs: [L([20, 5]), L([18.5, 5.5])], arms: 'crossed', sq: 0.55 });
  const ws1 = P({ pelvis: [-20, 46], torso: 90, legs: [L([20, 5]), L([18.5, 5.5])], arms: 'crossed', sq: 1, breathe: 1 });
  fig('wall-sit', { name: 'Wall sit', view: 'side', focus: ['quad:a'], props: [{ type: 'wall', x: -29.5, side: -1 }], keys: [k(ws0, 1.6, 0.2), k(ws1, 1.6, 0.4)] });

  const su0 = P({ pelvis: [0, 82], torso: 84, legs: [L([26, 25.5]), L([0, 5])], arms: 'down' });
  const su1 = P({ pelvis: [26, 104], torso: 88, sq: 1, legs: [L([26, 25.5]), L([33, 58], 0, -20)], arms: 'down' });
  fig('step-up', { name: 'Step-up', view: 'side', focus: ['glute', 'quad:a'], props: [{ type: 'step', x0: 12, x1: 66, h: 20 }], keys: [k(su0, 1.6, 0.3), k(su1, 1.0, 0.45)] });

  const rl0 = P({ pelvis: [0, 84], torso: 90, legs: [L([0, 5]), L([-1.5, 5.5])], arms: 'hips' });
  const rl1 = P({ pelvis: [-30, 44], torso: 82, head: 86, sq: 1, legs: [L([0, 5]), L([-72, 14], -90, -50)], arms: 'hips' });
  fig('reverse-lunge', { name: 'Reverse lunge', view: 'side', focus: ['glute', 'quad:a'], keys: [k(rl0, 1.0, 0.3), k(rl1, 1.2, 0.3)] });

  const dl0 = P({ pelvis: [0, 91], torso: 90, legs: [L([0, 12]), L([-1.5, 12.5])], arms: 'hips' });
  const dl1 = P({ pelvis: [-31, 46], torso: 78, head: 84, sq: 1, legs: [L([0, 12]), L([-74, 14], -90, -50)], arms: 'hips' });
  fig('deficit-reverse-lunge', { name: 'Deficit reverse lunge', view: 'side', focus: ['glute', 'quad:a'], props: [{ type: 'step', x0: -10, x1: 17, h: 7 }], keys: [k(dl0, 1.0, 0.3), k(dl1, 1.3, 0.3)] });

  const ss0 = P({ pelvis: [-34, 76], torso: 88, legs: [L([0, 5]), L([-72, 14], -90, -50)], arms: 'hips' });
  const ss1 = P({ pelvis: [-30, 44], torso: 84, sq: 1, legs: [L([0, 5]), L([-72, 14], -90, -50)], arms: 'hips' });
  fig('split-squat', { name: 'Split squat', view: 'side', focus: ['quad:a', 'glute'], keys: [k(ss0, 0.9, 0.3), k(ss1, 1.3, 0.3)] });

  const bs0 = P({ pelvis: [-30, 76], torso: 82, legs: [L([0, 5]), L([-70, 43], -90, 180)], arms: 'hips' });
  const bs1 = P({ pelvis: [-28, 42], torso: 68, head: 76, sq: 1, legs: [L([0, 5]), L([-70, 43], -90, 180)], arms: 'hips' });
  fig('bulgarian-split-squat', { name: 'Bulgarian split squat', view: 'side', focus: ['glute', 'quad:a'], props: [{ type: 'couch', x0: -140, x1: -62, h: 38 }], keys: [k(bs0, 0.9, 0.3), k(bs1, 1.4, 0.3)] });

  const sk0 = P({ pelvis: [0, 83], torso: 86, legs: [L([0, 5]), L([-30, 40], -90, -60)], arms: 'down' });
  const sk1 = P({ pelvis: [-18, 50], torso: 55, head: 62, sq: 1, legs: [L([0, 5]), L([-52, 26], -90, -40)], arms: 'forward' });
  fig('skater-squat', { name: 'Skater squat', view: 'side', focus: ['quad:a', 'glute'], props: [{ type: 'pillow', cx: -17, cy: 3.5, rx: 13, ry: 4 }], keys: [k(sk0, 1.0, 0.3), k(sk1, 1.4, 0.3)] });

  // front-view squats & lunges (explicit knees, foreshortened thighs)
  const FV = { view: 'front', torso: 90 };
  const straightKnee = (hip, ankle, out) => add(lerp2(hip, ankle, 0.506), [out, 0]);
  {
    const st = P({ ...FV, pelvis: [0, 80], legs: [Lm(straightKnee([8.5, 80], [32, 5], 1), [32, 5], -40), Lm(straightKnee([-8.5, 80], [-32, 5], -1), [-32, 5], -140)], arms: 'prayer' });
    const bt = P({ ...FV, pelvis: [0, 44], tl: 42, sq: 1, legs: [Lm([38, 38], [32, 5], -40), Lm([-38, 38], [-32, 5], -140)], arms: 'prayer' });
    fig('sumo-squat', { name: 'Sumo squat', view: 'front', focus: ['adductor:a', 'adductor:b', 'quad:a', 'quad:b'], keys: [k(st, 0.9, 0.3), k(bt, 1.3, 0.4)] });
  }
  {
    const st = P({ ...FV, pelvis: [0, 84], legs: [Lm([9.5, 45], [10, 5], -60), Lm([-9.5, 45], [-10, 5], -120)], arms: 'hips' });
    const bt = P({ ...FV, pelvis: [6, 46], tl: 44, sq: 1, legs: [Lm([16, 37], [10, 5], -60), Lm([22, 14], [34, 10], -20, { flen: 4 })], arms: 'hips' });
    fig('curtsy-lunge', { name: 'Curtsy lunge', view: 'front', focus: ['gmed:a', 'quad:a'], keys: [k(st, 1.0, 0.3), k(bt, 1.2, 0.3)] });
  }
  {
    const st = P({ ...FV, pelvis: [0, 77], legs: [Lm(straightKnee([8.5, 77], [45, 5], 0), [45, 5], -30), Lm(straightKnee([-8.5, 77], [-45, 5], 0), [-45, 5], -150)], arms: 'prayer' });
    const bt = P({ ...FV, pelvis: [24, 44], torso: 97, tl: 40, sq: 1, legs: [Lm([48, 28], [45, 5], -30), Lm(straightKnee([15.5, 44], [-45, 5], 0), [-45, 5], -150)], arms: 'prayer' });
    fig('lateral-lunge', { name: 'Lateral lunge', view: 'front', focus: ['quad:a', 'adductor:b'], keys: [k(st, 1.0, 0.3), k(bt, 1.2, 0.4)] });
    const ct = P({ ...FV, pelvis: [28, 30], torso: 93, tl: 41, sq: 1, legs: [Lm([52, 26], [45, 5], -30), Lm(straightKnee([19.5, 30], [-46, 5], 0), [-46, 5], 95)], arms: 'prayer' });
    fig('cossack-squat', { name: 'Cossack squat', view: 'front', focus: ['adductor:b', 'quad:a'], keys: [k(st, 1.0, 0.3), k(ct, 1.4, 0.4)] });
  }
  // leg swings
  {
    const hip = [0, 84];
    const f = P({ pelvis: hip, torso: 90, legs: [L(add(hip, mul(dir(-55), 78)), 0, 30), L([0, 5])], arms: 'hips' });
    const b = P({ pelvis: hip, torso: 90, legs: [L(add(hip, mul(dir(-118), 78)), 0, -20), L([0, 5])], arms: 'hips' });
    fig('leg-swing', { name: 'Leg swings', view: 'side', focus: ['ham:a'], keys: [k(f, 0.75, 0.05), k(b, 0.75, 0.05)] });
  }
  // walking (in place, treadmill style)
  {
    const arm = (s) => [A(add([0, 130], [14 * s, -48]), 180), A(add([0, 130], [-14 * s, -48]), 180)];
    const w0 = P({ pelvis: [0, 82.5], torso: 88, legs: [L([22, 5], 0, 14), L([-22, 7.5], 0, -30)], arms: arm(-1) });
    const w1 = P({ pelvis: [0, 84.5], torso: 88, legs: [L([0, 5], 0, 0), L([-2, 17], 0, -25)], arms: arm(0) });
    const w2 = P({ pelvis: [0, 82.5], torso: 88, legs: [L([-22, 7.5], 0, -30), L([22, 5], 0, 14)], arms: arm(1) });
    const w3 = P({ pelvis: [0, 84.5], torso: 88, legs: [L([-2, 17], 0, -25), L([0, 5], 0, 0)], arms: arm(0) });
    fig('walk', { name: 'Easy walk', view: 'side', focus: [], keys: [k(w0, 0.38), k(w1, 0.38), k(w2, 0.38), k(w3, 0.38)] });
  }
}

// ---------- CORE ----------
{
  const SUP = { pelvis: [0, 11.5], torso: 180, head: 177 };
  const S0 = add(SUP.pelvis, mul(dir(180), 46));
  const table = [L([39, 50], 90, 60), L([37.5, 50.5], 90, 60)];
  const armsUp = [A([S0[0], 61], 180), A([S0[0] - 1.5, 61], 180)];
  const db0 = P({ ...SUP, legs: table, arms: armsUp });
  const reachArm = A(add(S0, mul(dir(172), 51)), 90);
  const reachLeg = L(add(SUP.pelvis, mul(dir(7), 78)), 90, 40);
  const db1 = P({ ...SUP, sq: 1, legs: [table[0], reachLeg], arms: [reachArm, armsUp[1]] });
  const db2 = P({ ...SUP, sq: 1, legs: [reachLeg, table[1]], arms: [armsUp[0], reachArm] });
  const mat = { type: 'mat', x0: -110, x1: 92 };
  fig('dead-bug', { name: 'Dead bug', view: 'side', focus: ['core'], props: [mat], keys: [k(db0, 1.0, 0.3), k(db1, 1.3, 0.4), k(db0, 1.0, 0.3), k(db2, 1.3, 0.4)] });

  const ht0 = P({ ...SUP, legs: table, arms: onFloorArms.map((a) => ({ ...a, end: add(a.end, [4, 0]) })) });
  const tap = L([55.7, 6], 90, 20);
  const ht1 = P({ ...SUP, sq: 1, legs: [tap, table[1]], arms: ht0.arms });
  const ht2 = P({ ...SUP, sq: 1, legs: [table[0], tap], arms: ht0.arms });
  fig('heel-taps', { name: 'Heel taps', view: 'side', focus: ['core'], props: [mat], keys: [k(ht0, 0.8, 0.2), k(ht1, 0.9, 0.2), k(ht0, 0.8, 0.2), k(ht2, 0.9, 0.2)] });

  const rc0 = P({ ...SUP, legs: table, arms: ht0.arms });
  const rcP = [-4, 16];
  const kn = add(rcP, mul(dir(125), 40));
  const rc1 = P({ pelvis: rcP, torso: 187, head: 177, sq: 1, legs: [L(add(kn, mul(dir(40), 39)), 125, 70), L(add(add(kn, mul(dir(40), 39)), [-1.5, 0.5]), 125, 70)], arms: ht0.arms });
  fig('reverse-crunch', { name: 'Reverse crunch', view: 'side', focus: ['core'], props: [mat], keys: [k(rc0, 1.4, 0.3), k(rc1, 1.0, 0.4)] });

  const hhS = add(SUP.pelvis, mul(dir(165), 46));
  const tuckKnee = add(SUP.pelvis, mul(dir(100), 40));
  const hh0 = P({ pelvis: SUP.pelvis, torso: 165, head: 150, sq: 0.6, legs: [L(add(tuckKnee, mul(dir(5), 39)), 100, 55), L(add(add(tuckKnee, mul(dir(5), 39)), [-1.5, 0.5]), 100, 55)], arms: [A(add(hhS, mul(dir(14), 50)), 90), A(add(hhS, mul(dir(15), 49.5)), 90)] });
  const hh1 = P({ ...hh0, sq: 1, breathe: 0.6, arms: hh0.arms, legs: hh0.legs });
  fig('hollow-hold', { name: 'Hollow hold', view: 'side', focus: ['core'], props: [mat], keys: [k(hh0, 1.4, 0.3), k(hh1, 1.4, 0.3)] });

  const ll0 = P({ ...SUP, legs: [L(add(SUP.pelvis, mul(dir(88), 78)), 180, 80), L(add(SUP.pelvis, mul(dir(87), 78)), 180, 80)], arms: ht0.arms });
  const ll1 = P({ ...SUP, sq: 1, legs: [L(add(SUP.pelvis, mul(dir(18), 78)), 90, 40), L(add(SUP.pelvis, mul(dir(17), 78)), 90, 40)], arms: ht0.arms });
  fig('leg-lowers', { name: 'Leg lowers', view: 'side', focus: ['core'], props: [mat], keys: [k(ll0, 1.2, 0.3), k(ll1, 2.0, 0.3)] });

  // planks
  const FP = { pelvis: [-5.2, 23.5], torso: 10.6, head: 10 };
  const fpS = add(FP.pelvis, mul(dir(FP.torso), 46));
  const fpArms = [Am([fpS[0], 5], [fpS[0] + 22, 4]), Am([fpS[0] - 1.5, 5.5], [fpS[0] + 20.5, 4.5])];
  const fpLegs = [L(add(FP.pelvis, mul(dir(190.6), 78.5)), 180, -36), L(add(add(FP.pelvis, mul(dir(190.6), 78.5)), [-1.5, 0.5]), 180, -36)];
  const fp0 = P({ ...FP, legs: fpLegs, arms: fpArms, sq: 0.55 });
  const fp1 = P({ ...FP, legs: fpLegs, arms: fpArms, sq: 1, breathe: 0.8 });
  fig('forearm-plank', { name: 'Forearm plank', view: 'side', focus: ['core', 'glute'], props: [{ type: 'mat', x0: -96, x1: 74 }], keys: [k(fp0, 1.6, 0.6), k(fp1, 1.6, 0.6)] });

  const hp0 = P({ ...HP, legs: hpLegs, arms: hpArms });
  const tapA = P({ ...HP, sq: 1, legs: hpLegs, arms: [A(add(HPS, [5, -7]), -90), hpArms[1]] });
  const tapB = P({ ...HP, sq: 1, legs: hpLegs, arms: [hpArms[0], A(add(HPS, [3.5, -6.5]), -90)] });
  const hpMat = { type: 'mat', x0: -92, x1: 60 };
  fig('plank-shoulder-tap', { name: 'Plank shoulder taps', view: 'side', focus: ['core'], props: [hpMat], keys: [k(hp0, 0.7, 0.25), k(tapA, 0.7, 0.3), k(hp0, 0.7, 0.25), k(tapB, 0.7, 0.3)] });

  const mcDrive = L([-12, 15], 0, -60);
  const mc1 = P({ ...HP, sq: 1, legs: [mcDrive, hpLegs[1]], arms: hpArms });
  const mc2 = P({ ...HP, sq: 1, legs: [hpLegs[0], L([-13.5, 15.5], 0, -60)], arms: hpArms });
  fig('mountain-climber', { name: 'Mountain climbers', view: 'side', focus: ['core'], props: [hpMat], keys: [k(hp0, 0.6, 0.15), k(mc1, 0.6, 0.2), k(hp0, 0.6, 0.15), k(mc2, 0.6, 0.2)] });

  // quadruped core
  const q0 = P({ ...QUAD, legs: quadLegs, arms: quadArms });
  const reachA = A(add(QS, mul(dir(14), 51)), 90);
  const backL = L(add(QUAD.pelvis, mul(dir(192), 78)), 180, -78);
  const bd1 = P({ ...QUAD, sq: 1, legs: [quadLegs[0], backL], arms: [reachA, quadArms[1]] });
  const bd2 = P({ ...QUAD, sq: 1, legs: [backL, quadLegs[1]], arms: [quadArms[0], reachA] });
  const qMat = { type: 'mat', x0: -66, x1: 70 };
  fig('bird-dog', { name: 'Bird dog', view: 'side', focus: ['core', 'glute'], props: [qMat], keys: [k(q0, 0.9, 0.3), k(bd1, 1.0, 1.0), k(q0, 0.9, 0.3), k(bd2, 1.0, 1.0)] });

  const crunch = P({ ...QUAD, curve: 0.85, head: -10, sq: 1, legs: [quadLegs[0], L([-8, 22], -30, -60)], arms: [A([30, 30], -90), quadArms[1]] });
  fig('bird-dog-crunch', { name: 'Bird dog crunch', view: 'side', focus: ['core'], props: [qMat], keys: [k(q0, 0.9, 0.3), k(bd1, 0.9, 0.4), k(crunch, 0.8, 0.3), k(bd1, 0.8, 0.4)] });

  const cow = P({ ...QUAD, curve: -1, head: 42, breathe: 0.6, legs: quadLegs, arms: quadArms });
  const cat = P({ ...QUAD, curve: 1, head: -42, legs: quadLegs, arms: quadArms });
  fig('cat-cow', { name: 'Cat–cow', view: 'side', focus: ['back'], props: [qMat], keys: [k(q0, 1.4, 0.2), k(cow, 1.6, 0.4), k(cat, 2.0, 0.4)] });

  const BEAR = { pelvis: [0, 49], torso: 7.5, head: 4 };
  const BS = add(BEAR.pelvis, mul(dir(BEAR.torso), 46));
  const bearArms = [A([BS[0], 3.5], 180), A([BS[0] - 1.5, 4], 180)];
  const bearLegs = [L([-34, 10], -90, -35), L([-35.5, 10.5], -90, -35)];
  const be0 = P({ ...BEAR, legs: bearLegs, arms: bearArms, sq: 0.55 });
  const be1 = P({ ...BEAR, legs: bearLegs, arms: bearArms, sq: 1, breathe: 0.7 });
  fig('bear-hold', { name: 'Bear hold', view: 'side', focus: ['core'], props: [qMat], keys: [k(be0, 1.5, 0.5), k(be1, 1.5, 0.5)] });
  const bt1 = P({ ...BEAR, sq: 1, legs: bearLegs, arms: [A(add(BS, [5, -7]), -90), bearArms[1]] });
  const bt2 = P({ ...BEAR, sq: 1, legs: bearLegs, arms: [bearArms[0], A(add(BS, [3.5, -6.5]), -90)] });
  fig('bear-tap', { name: 'Bear shoulder taps', view: 'side', focus: ['core'], props: [qMat], keys: [k(be0, 0.7, 0.25), k(bt1, 0.7, 0.3), k(be0, 0.7, 0.25), k(bt2, 0.7, 0.3)] });
  const cr1 = P({ ...BEAR, pelvis: [3, 49], sq: 1, legs: [bearLegs[0], L([-24, 10], -90, -35)], arms: [A([BS[0] + 12, 3.5], 180), bearArms[1]] });
  const cr2 = P({ ...BEAR, pelvis: [6, 49], sq: 1, legs: [L([-22.5, 10.5], -90, -35), L([-24, 10], -90, -35)], arms: [A([BS[0] + 12, 3.5], 180), A([BS[0] + 10.5, 4], 180)] });
  fig('bear-crawl', { name: 'Bear crawl', view: 'side', focus: ['core'], props: [qMat], keys: [k(be0, 0.6, 0.15), k(cr1, 0.6, 0.15), k(cr2, 0.6, 0.3), k(cr1, 0.6, 0.15)] });

  // side planks (front view, lying on the right side, head left)
  const SP = (pelvis, torso, o = {}) => P(Object.assign({ view: 'front', pelvis, torso, head: torso }, o));
  {
    const n = dir(162 - 90);
    const pel = [-13.6, 31.1];
    const S = add(pel, mul(dir(162), 46));
    const bsh = sub(S, mul(n, 15));
    const elbow = [bsh[0], 4];
    const topHip = add(pel, mul(n, 8.5));
    const arms = [Am([topHip[0] - 19, topHip[1] + 21], add(topHip, [1.5, 2])), Am(elbow, [elbow[0] + 12, 3.5])];
    const up = SP(pel, 162, { sq: 1, legs: [Lm([22, 21], [26, 24], 20, { flen: 4 }), Lm([20, 5.5], [24, 8], 20, { flen: 4 })], arms });
    const dn = SP([-12.5, 19], 170, { legs: [Lm([22, 18], [26, 21], 20, { flen: 4 }), Lm([20, 5.5], [24, 8], 20, { flen: 4 })], arms });
    fig('side-plank-knees', { name: 'Side plank from knees', view: 'front', focus: ['oblique:b', 'gmed:a'], props: [{ type: 'mat', x0: -96, x1: 44 }], keys: [k(dn, 1.0, 0.4), k(up, 1.0, 2.0)] });
  }
  {
    const n = dir(165 - 90);
    const pel = [-11.7, 33.6];
    const S = add(pel, mul(dir(165), 46));
    const bsh = sub(S, mul(n, 15));
    const elbow = [bsh[0], 4];
    const topHip = add(pel, mul(n, 8.5));
    const botHip = sub(pel, mul(n, 8.5));
    const bAnk = add(botHip, mul(dir(-15), 78.5));
    const tAnk = add(topHip, mul(dir(-15), 78.5));
    const arms = [Am([topHip[0] - 19, topHip[1] + 21], add(topHip, [1.5, 2])), Am(elbow, [elbow[0] + 12, 3.5])];
    const legs = [L(tAnk, 90, -30, { flen: 6 }), L(bAnk, 90, -30, { flen: 6 })];
    const up = SP(pel, 165, { sq: 1, legs, arms });
    const dn = SP([-11, 22], 172, { legs, arms });
    const mid = SP([-11.2, 26.5], 169, { sq: 0.8, legs, arms });
    const props = [{ type: 'mat', x0: -96, x1: 82 }];
    fig('side-plank', { name: 'Side plank', view: 'front', focus: ['oblique:b', 'gmed:a'], props, keys: [k(dn, 1.0, 0.4), k(up, 1.0, 2.0)] });
    fig('side-plank-dip', { name: 'Side plank hip dips', view: 'front', focus: ['oblique:b'], props, keys: [k(up, 0.9, 0.25), k(mid, 0.9, 0.2)] });
  }
  {
    const pel = [-14, 39];
    const n = dir(175 - 90);
    const S = add(pel, mul(dir(175), 46));
    const bsh = sub(S, mul(n, 15));
    const elbow = [bsh[0], 4];
    const topHip = add(pel, mul(n, 8.5));
    const arms = [Am([topHip[0] - 18, topHip[1] + 20], add(topHip, [1.5, 2])), Am(elbow, [elbow[0] + 12, 3.5])];
    const up = SP(pel, 175, { sq: 1, legs: [Lm([25, 45], [63, 45], 0, { flen: 6 }), L([54, 5], -90, -20, { flen: 6 })], arms });
    const dnP = [-13, 18];
    const dn = SP(dnP, 178, { legs: [Lm([25, 45], [63, 45], 0, { flen: 6 }), L([54, 5], -90, -20, { flen: 6 })], arms });
    fig('copenhagen', { name: 'Copenhagen plank', view: 'front', focus: ['adductor:a', 'oblique:b'], props: [{ type: 'couch', x0: 21, x1: 100, h: 38 }], keys: [k(dn, 1.0, 0.4), k(up, 1.0, 2.0)] });
  }
}

// ---------- WARM-UP, STRETCHES & PERIOD CARE ----------
{
  const SUP = { pelvis: [4, 11.5], torso: 180, head: 176 };
  const bellyHand = (b) => Am([-25, 4.5], [-14, 18 + 3 * b]);
  const br0 = P({ ...SUP, legs: [L([37, 5], 90), L([35.5, 5.5], 90)], arms: [bellyHand(0), A([9, 4.5], 90)] });
  const br1 = P({ ...SUP, breathe: 1, sq: 1, legs: [L([37, 5], 90), L([35.5, 5.5], 90)], arms: [bellyHand(1), A([9, 4.5], 90)] });
  fig('breathing', { name: 'Belly breathing', view: 'side', focus: ['belly'], props: [{ type: 'mat', x0: -78, x1: 50 }], keys: [k(br0, 6.0, 0.3), k(br1, 4.0, 0.3)] });

  // half-kneeling hip flexor stretch
  const hf0 = P({ pelvis: [0, 44], torso: 90, legs: [L([38, 5]), L([-42, 7], -90, 180)], arms: [Am(...(() => { const pp = P({ pelvis: [0, 44], torso: 90, legs: [L([38, 5]), L([-42, 7], -90, 180)], arms: 'hips' }); return [pp.arms[0].mid, pp.arms[0].end]; })()), A([-5, 141], 90)] });
  const hf1p = { pelvis: [7, 42], torso: 93 };
  const hf1 = P({ ...hf1p, breathe: 0.5, sq: 1, legs: [L([38, 5]), L([-42, 7], -90, 180)], arms: [Am(...(() => { const pp = P({ ...hf1p, legs: [L([38, 5]), L([-42, 7], -90, 180)], arms: 'hips' }); return [pp.arms[0].mid, pp.arms[0].end]; })()), A(add(add(hf1p.pelvis, mul(dir(93), 46)), [-6, 51]), 90)] });
  fig('hip-flexor-stretch', { name: 'Half-kneeling hip flexor stretch', view: 'side', focus: ['hipflexor:b'], props: [{ type: 'pillow', cx: -2, cy: 2.5, rx: 11, ry: 3 }], keys: [k(hf0, 2.0, 0.6), k(hf1, 2.0, 1.4)] });

  // figure-4 stretch (lying)
  const F4 = { pelvis: [0, 11.5], torso: 180, head: 177 };
  const f4k = add(F4.pelvis, mul(dir(95), 40));
  const f4 = (pull) => P({ ...F4, sq: pull, legs: [Lm([24, 30], [-2 - pull, 52 + pull]), L(add(add(f4k, mul(dir(-5), 39)), [-2 * pull, 2 * pull]), 95, 0)], arms: [Am([-30, 21], [-8, 34]), Am([-31.5, 21.5], [-9.5, 34.5])] });
  fig('figure-4', { name: 'Figure-4 stretch', view: 'side', focus: ['glute'], props: [{ type: 'mat', x0: -82, x1: 54 }], keys: [k(f4(0), 2.0, 0.6), k(f4(1), 2.0, 1.2)] });

  // seated hamstring stretch
  const hs = (lean) => P({ pelvis: [0, 12], torso: 55 - 13 * lean, head: 45 - 15 * lean, sq: lean, legs: [L([78, 7], 90, 82), Lm([30, 17], [13, 7], 20, { flen: 8 })], arms: [A(add(add([0, 12], mul(dir(55 - 13 * lean), 46)), mul(dir(-38 - 6 * lean), 46)), 90), A(add(add([0, 12], mul(dir(55 - 13 * lean), 46)), add(mul(dir(-38 - 6 * lean), 46), [-1.5, 0.5])), 90)] });
  fig('hamstring-stretch', { name: 'Seated hamstring stretch', view: 'side', focus: ['ham:a'], props: [{ type: 'mat', x0: -24, x1: 98 }], keys: [k(hs(0), 2.0, 0.8), k(hs(1), 2.5, 1.5)] });

  // child's pose
  const CP = { pelvis: [-4, 24], torso: -6, head: -35 };
  const cpS = add(CP.pelvis, mul(dir(CP.torso), 46));
  const cp = (b) => P({ ...CP, curve: 0.3 * b, breathe: 0.3 * b, sq: b, legs: [L([-7.3, 5.5], 0, 180), L([-8.8, 6], 0, 180)], arms: [A([cpS[0] + 47, 4.5], 90), A([cpS[0] + 45.5, 5], 90)] });
  fig('childs-pose', { name: "Child's pose", view: 'side', focus: ['back'], headLast: true, props: [{ type: 'mat', x0: -26, x1: 104 }], keys: [k(cp(0), 4.0, 0.4), k(cp(1), 3.5, 0.4)] });

  // knees to chest
  const KC = { pelvis: [0, 10], torso: 180, head: 177 };
  const kc = (r) => {
    const pel = [-3 * r, 11.5 + 3 * r];
    const knee = add(pel, mul(dir(128 + 6 * r), 40));
    return P({ pelvis: pel, torso: 180 + 4 * r, head: 177, sq: r, legs: [L(add(knee, mul(dir(30 + 6 * r), 39)), 128, 40), L(add(add(knee, mul(dir(30 + 6 * r), 39)), [-1.5, 0.5]), 128, 40)], arms: [A([-14 - 3 * r, 46 + 3 * r], 90), A([-15.5 - 3 * r, 46.5 + 3 * r], 90)] });
  };
  void KC;
  fig('knees-to-chest', { name: 'Knees-to-chest rock', view: 'side', focus: ['back'], props: [{ type: 'mat', x0: -82, x1: 34 }], keys: [k(kc(0), 1.8, 0.3), k(kc(1), 1.8, 0.3)] });

  // legs up the wall
  const lw = (b) => P({ pelvis: [0, 11.5], torso: 180, head: 177, breathe: b, sq: b, legs: [L([8, 88], 180, 70), L([6.5, 88.5], 180, 70)], arms: [A([2, 4.5], 90), A([0.5, 5], 90)] });
  fig('legs-up-wall', { name: 'Legs up the wall', view: 'side', focus: ['belly'], props: [{ type: 'wall', x: 15, side: 1 }, { type: 'mat', x0: -82, x1: 15 }], keys: [k(lw(0), 5.0, 0.4), k(lw(1), 4.0, 0.4)] });

  // supine twist & reclined butterfly (top view, head left)
  const TOP = { view: 'top', pelvis: [0, 0], torso: 180, head: 180 };
  const tArms = [A([-46, 66], 90), A([-46, -66], -90)];
  const center = P({ ...TOP, legs: [Lm([20, 9.5], [27, 7], 0, { flen: 4 }), Lm([20, -9.5], [27, -7], 0, { flen: 4 })], arms: tArms });
  const twistB = P({ ...TOP, sq: 1, legs: [Lm([29, -16], [5, -31], -150, { flen: 4 }), Lm([22, -40], [-3, -50], -160, { flen: 4 })], arms: tArms });
  const twistA = P({ ...TOP, sq: 1, legs: [Lm([22, 40], [-3, 50], 160, { flen: 4 }), Lm([29, 16], [5, 31], 150, { flen: 4 })], arms: tArms });
  fig('supine-twist', { name: 'Supine twist', view: 'top', focus: ['oblique:a'], props: [{ type: 'topmat', x0: -98, x1: 62, y0: -74, y1: 74 }], keys: [k(center, 1.6, 0.4), k(twistB, 2.0, 1.6), k(center, 2.0, 0.4), k(twistA, 2.0, 1.6)] });

  const handsBelly = [Am([-33, 20], [-18, 6]), Am([-33, -20], [-18, -6])];
  const bf = (b) => P({ ...TOP, breathe: b * 2, sq: b, legs: [Lm([26, 34 + b], [44, 3], 0, { flen: 4 }), Lm([26, -34 - b], [44, -3], 0, { flen: 4 })], arms: handsBelly });
  fig('reclined-butterfly', { name: 'Reclined butterfly', view: 'top', focus: ['belly'], props: [{ type: 'topmat', x0: -98, x1: 62, y0: -58, y1: 58 }], keys: [k(bf(0), 5.0, 0.4), k(bf(1), 4.0, 0.4)] });
}

export const FIG_IDS = Object.keys(FIGS);
