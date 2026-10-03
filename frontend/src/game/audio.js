// Procedural Web Audio engine — no external files. Music + SFX gated by settings.

let ctx = null, sfxBus = null, musicBus = null;
let enabled = { sound: true, music: true };
let currentTrack = null, pendingTrack = null;
let barTimer = null, nextBar = 0, barIndex = 0;

function ensureCtx() {
  if (ctx) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.35; sfxBus.connect(ctx.destination);
  musicBus = ctx.createGain(); musicBus.gain.value = 0.11; musicBus.connect(ctx.destination);
  return true;
}

export function unlockAudio() {
  if (!ensureCtx()) return;
  const kick = () => { if (pendingTrack && enabled.music) { const t = pendingTrack; pendingTrack = null; startMusic(t); } };
  if (ctx.state === "suspended") ctx.resume().then(kick); else kick();
}

export function setAudioEnabled(patch) {
  enabled = { ...enabled, ...patch };
  if (!enabled.music) { stopMusic(true); }
  else if (!currentTrack && pendingTrack && ctx) { const t = pendingTrack; pendingTrack = null; startMusic(t); }
}

// ---------- SFX ----------
function tone({ type = "sine", freq = 440, to = null, dur = 0.2, vol = 0.5, at = 0, attack = 0.005 }) {
  const t0 = ctx.currentTime + at;
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t0 + dur);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + attack); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  o.connect(g); g.connect(sfxBus); o.start(t0); o.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.15, vol = 0.4, at = 0, hp = 800, lp = 6000 }) {
  const t0 = ctx.currentTime + at;
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f1 = ctx.createBiquadFilter(); f1.type = "highpass"; f1.frequency.value = hp;
  const f2 = ctx.createBiquadFilter(); f2.type = "lowpass"; f2.frequency.value = lp;
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(f1); f1.connect(f2); f2.connect(g); g.connect(sfxBus); src.start(t0);
}

const SFX = {
  click: () => tone({ freq: 880, to: 660, dur: 0.06, vol: 0.25 }),
  attack: () => { noise({ dur: 0.12, vol: 0.5, hp: 1200 }); tone({ type: "sawtooth", freq: 320, to: 70, dur: 0.18, vol: 0.4 }); },
  skill: () => { [440, 660, 880, 1320].forEach((f, i) => tone({ type: "triangle", freq: f, dur: 0.25, vol: 0.35, at: i * 0.06 })); noise({ dur: 0.3, vol: 0.2, hp: 2000, at: 0.1 }); },
  hit: () => { tone({ type: "square", freq: 140, to: 60, dur: 0.14, vol: 0.5 }); noise({ dur: 0.08, vol: 0.35, hp: 400, lp: 3000 }); },
  crit: () => { tone({ type: "square", freq: 160, to: 50, dur: 0.22, vol: 0.6 }); tone({ freq: 1800, to: 900, dur: 0.18, vol: 0.3, at: 0.02 }); noise({ dur: 0.18, vol: 0.5, hp: 300 }); },
  heal: () => [523, 659, 784, 1047].forEach((f, i) => tone({ type: "triangle", freq: f, dur: 0.3, vol: 0.3, at: i * 0.08 })),
  potion: () => { tone({ freq: 400, to: 900, dur: 0.18, vol: 0.3 }); tone({ freq: 600, to: 1200, dur: 0.15, vol: 0.2, at: 0.1 }); },
  defend: () => { tone({ type: "square", freq: 220, to: 180, dur: 0.12, vol: 0.3 }); tone({ type: "triangle", freq: 1400, to: 900, dur: 0.1, vol: 0.2 }); },
  escape: () => noise({ dur: 0.4, vol: 0.4, hp: 600, lp: 4000 }),
  poison: () => [300, 260, 300, 240].forEach((f, i) => tone({ type: "triangle", freq: f, dur: 0.12, vol: 0.25, at: i * 0.07 })),
  burn: () => { noise({ dur: 0.3, vol: 0.3, hp: 1500 }); tone({ type: "sawtooth", freq: 200, to: 120, dur: 0.3, vol: 0.2 }); },
  stun: () => { tone({ freq: 1500, dur: 0.1, vol: 0.3 }); tone({ freq: 1100, dur: 0.12, vol: 0.3, at: 0.1 }); tone({ freq: 1500, dur: 0.1, vol: 0.25, at: 0.22 }); },
  weaken: () => tone({ type: "sawtooth", freq: 400, to: 120, dur: 0.4, vol: 0.25 }),
  rage: () => { tone({ type: "sawtooth", freq: 70, to: 40, dur: 0.9, vol: 0.6 }); noise({ dur: 0.8, vol: 0.5, hp: 100, lp: 1500 }); tone({ type: "square", freq: 110, to: 55, dur: 0.7, vol: 0.3, at: 0.1 }); },
  revive: () => [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone({ type: "triangle", freq: f, dur: 0.4, vol: 0.3, at: i * 0.07 })),
  victory: () => [523, 523, 523, 659, 784, 1047].forEach((f, i) => tone({ type: "square", freq: f, dur: i === 5 ? 0.6 : 0.16, vol: 0.22, at: [0, 0.15, 0.3, 0.45, 0.6, 0.8][i] })),
  defeat: () => [392, 349, 311, 261].forEach((f, i) => tone({ type: "sawtooth", freq: f, dur: 0.45, vol: 0.2, at: i * 0.3 })),
  levelup: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone({ type: "triangle", freq: f, dur: 0.35, vol: 0.3, at: i * 0.09 })),
  buy: () => { tone({ freq: 1200, dur: 0.08, vol: 0.3 }); tone({ freq: 1600, dur: 0.18, vol: 0.3, at: 0.08 }); },
  gem: () => [1047, 1319, 1568, 2093].forEach((f, i) => tone({ freq: f, dur: 0.2, vol: 0.25, at: i * 0.05 })),
  error: () => tone({ type: "square", freq: 200, to: 150, dur: 0.18, vol: 0.25 }),
};

export function playSfx(name) {
  if (!enabled.sound || !SFX[name]) return;
  if (!ensureCtx() || ctx.state !== "running") return;
  try { SFX[name](); } catch (e) {}
}

// ---------- MUSIC ----------
const TRACKS = {
  menu: { bpm: 70, chords: [[220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7], [164.8, 196, 246.9]], scale: [440, 493.9, 523.3, 587.3, 659.3, 783.9, 880], pad: "sine", pluck: "triangle", drums: false, bass: false, melodyDensity: 0.35 },
  battle: { bpm: 126, chords: [[146.8, 174.6, 220], [116.5, 146.8, 174.6], [196, 233.1, 293.7], [110, 138.6, 164.8]], scale: [293.7, 349.2, 392, 440, 466.2, 523.3, 587.3], pad: "sawtooth", pluck: "square", drums: true, bass: true, melodyDensity: 0.55 },
  boss: { bpm: 150, chords: [[164.8, 196, 246.9], [130.8, 164.8, 196], [110, 130.8, 164.8], [123.5, 155.6, 185]], scale: [329.6, 369.9, 392, 440, 493.9, 523.3, 587.3], pad: "sawtooth", pluck: "square", drums: true, bass: true, melodyDensity: 0.7 },
};

function mNote({ type, freq, at, dur, vol, filter = 1800 }) {
  const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter();
  f.type = "lowpass"; f.frequency.value = filter;
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + Math.min(0.05, dur * 0.3)); g.gain.exponentialRampToValueAtTime(0.001, at + dur);
  o.connect(f); f.connect(g); g.connect(musicBus); o.start(at); o.stop(at + dur + 0.05);
}

function mKick(at) {
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(40, at + 0.12);
  g.gain.setValueAtTime(0.9, at); g.gain.exponentialRampToValueAtTime(0.001, at + 0.25);
  o.connect(g); g.connect(musicBus); o.start(at); o.stop(at + 0.3);
}

function mHat(at, vol = 0.12) {
  const len = Math.floor(ctx.sampleRate * 0.04);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate); const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = ctx.createBufferSource(); s.buffer = buf; const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 6000;
  const g = ctx.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(musicBus); s.start(at);
}

function scheduleBar(track) {
  const beat = 60 / track.bpm; const bar = beat * 4; const t = nextBar;
  const chord = track.chords[barIndex % track.chords.length];
  chord.forEach((f) => mNote({ type: track.pad, freq: f, at: t, dur: bar * 0.98, vol: track.pad === "sine" ? 0.5 : 0.14, filter: track.pad === "sine" ? 1200 : 700 }));
  if (track.bass) for (let b = 0; b < 8; b++) if (b % 2 === 0 || Math.random() < 0.4) mNote({ type: "sawtooth", freq: chord[0] / 2, at: t + b * beat / 2, dur: beat * 0.45, vol: 0.35, filter: 400 });
  if (track.drums) for (let b = 0; b < 4; b++) { mKick(t + b * beat); mHat(t + b * beat + beat / 2); if (track.bpm > 140) mHat(t + b * beat, 0.08); }
  for (let s = 0; s < 8; s++) {
    if (Math.random() > track.melodyDensity) continue;
    const f = track.scale[Math.floor(Math.random() * track.scale.length)];
    mNote({ type: track.pluck, freq: f, at: t + s * beat / 2, dur: beat * (track.drums ? 0.4 : 0.9), vol: track.pluck === "square" ? 0.12 : 0.3, filter: 2500 });
  }
  nextBar += bar; barIndex += 1;
}

function loop(track) {
  while (nextBar < ctx.currentTime + 0.6) scheduleBar(track);
  barTimer = setTimeout(() => loop(track), 250);
}

export function startMusic(name) {
  if (!TRACKS[name]) return;
  if (!enabled.music) { pendingTrack = name; return; }
  if (!ctx || ctx.state !== "running") { pendingTrack = name; return; }
  if (currentTrack === name) return;
  stopMusic(false);
  currentTrack = name; barIndex = 0; nextBar = ctx.currentTime + 0.05;
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.setValueAtTime(0.0001, ctx.currentTime);
  musicBus.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 1.2);
  loop(TRACKS[name]);
}

export function stopMusic(remember = true) {
  if (barTimer) { clearTimeout(barTimer); barTimer = null; }
  if (remember && currentTrack) pendingTrack = currentTrack;
  if (ctx && musicBus && currentTrack) {
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
    musicBus.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  }
  currentTrack = null;
}
