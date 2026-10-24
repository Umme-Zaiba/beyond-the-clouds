/**
 * All sound is synthesised with the Web Audio API, so there are no audio files to load.
 * An ambient bed (drones and wind) plays while sound is on, with short chimes for interactions.
 * Browsers only allow audio after a user gesture, so a pending "on" waits for the first one.
 */

type Win = Window & { webkitAudioContext?: typeof AudioContext };

// D major pentatonic: calm, open, no tension.
const SCALE = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let ambient: { stop: () => void } | null = null;
let wanted = false;
let listening = false;

function ensure(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as Win).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // A synthetic room: decaying noise as an impulse response.
  const len = Math.floor(ctx.sampleRate * 2.6);
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = impulse.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  reverb = ctx.createConvolver();
  reverb.buffer = impulse;
  const wet = ctx.createGain();
  wet.gain.value = 0.55;
  reverb.connect(wet).connect(master);
  return ctx;
}

function noiseBuffer(c: AudioContext): AudioBuffer {
  const buf = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    // brown-ish noise: softer and warmer than white
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.2;
  }
  return buf;
}

function startAmbient(c: AudioContext) {
  if (ambient || !master) return;
  const bus = c.createGain();
  bus.gain.value = 0.9;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1100;
  bus.connect(lp);
  lp.connect(master);
  if (reverb) lp.connect(reverb);

  const stops: Array<() => void> = [];
  // Slowly breathing drone chord: D2, A2, D3, F#3, A3
  [73.42, 110, 146.83, 185, 220].forEach((f, i) => {
    for (const detune of [-5, 6]) {
      const osc = c.createOscillator();
      osc.type = i < 2 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      osc.detune.value = detune;
      const g = c.createGain();
      g.gain.value = 0;
      const lfo = c.createOscillator();
      lfo.frequency.value = 0.04 + i * 0.017 + (detune > 0 ? 0.01 : 0);
      const lfoGain = c.createGain();
      lfoGain.gain.value = 0.018;
      lfo.connect(lfoGain).connect(g.gain);
      g.gain.value = 0.024 + (i < 2 ? 0.014 : 0);
      osc.connect(g).connect(bus);
      osc.start();
      lfo.start();
      stops.push(() => {
        osc.stop();
        lfo.stop();
      });
    }
  });

  // Wind: filtered noise whose centre frequency wanders.
  const wind = c.createBufferSource();
  wind.buffer = noiseBuffer(c);
  wind.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 520;
  bp.Q.value = 0.7;
  const wg = c.createGain();
  wg.gain.value = 0.22;
  const wl = c.createOscillator();
  wl.frequency.value = 0.07;
  const wlg = c.createGain();
  wlg.gain.value = 260;
  wl.connect(wlg).connect(bp.frequency);
  wind.connect(bp).connect(wg).connect(bus);
  wind.start();
  wl.start();
  stops.push(() => {
    wind.stop();
    wl.stop();
  });

  // Occasional soft bell from the scale, so the bed is never the same twice.
  const timer = window.setInterval(() => {
    if (Math.random() < 0.55) bell(SCALE[Math.floor(Math.random() * SCALE.length)], 0.05 + Math.random() * 0.04, 3.4);
  }, 5200);
  stops.push(() => window.clearInterval(timer));

  ambient = { stop: () => stops.forEach((s) => s()) };
}

function bell(freq: number, level = 0.12, decay = 2.2, delay = 0) {
  const c = ctx;
  if (!c || !master || !wanted) return;
  const t = c.currentTime + delay;
  // Inharmonic partials give the glassy, struck-metal tone of a chime.
  [[1, 1], [2.756, 0.35], [5.404, 0.14]].forEach(([ratio, amp]) => {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq * ratio;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level * amp, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay / ratio);
    osc.connect(g);
    g.connect(master!);
    if (reverb) g.connect(reverb);
    osc.start(t);
    osc.stop(t + decay + 0.1);
  });
}

function thud(freq: number, level: number, delay = 0) {
  const c = ctx;
  if (!c || !master || !wanted) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.35);
  const g = c.createGain();
  g.gain.setValueAtTime(level, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.5);
}

function clang(delay = 0) {
  const c = ctx;
  if (!c || !master || !wanted) return;
  const t = c.currentTime + delay;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1800;
  const g = c.createGain();
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  src.connect(hp).connect(g).connect(master);
  if (reverb) g.connect(reverb);
  src.start(t);
  src.stop(t + 0.25);
  bell(1174.66, 0.1, 1.4, delay);
  bell(1567.98, 0.06, 1.1, delay);
  thud(110, 0.5, delay);
}

function unlock() {
  if (!wanted) return;
  const c = ensure();
  if (!c || !master) return;
  void c.resume().then(() => {
    if (!wanted || !master) return;
    startAmbient(c);
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.linearRampToValueAtTime(0.5, c.currentTime + 3);
  });
}

function waitForGesture() {
  if (listening) return;
  listening = true;
  const once = () => {
    listening = false;
    window.removeEventListener('pointerdown', once);
    window.removeEventListener('keydown', once);
    unlock();
  };
  window.addEventListener('pointerdown', once);
  window.addEventListener('keydown', once);
}

/** Turn the ambient bed on or off. Safe to call before any user gesture. */
export function setSoundEnabled(on: boolean) {
  wanted = on;
  if (on) {
    if (ctx && ctx.state === 'running') unlock();
    else {
      unlock();
      waitForGesture();
    }
    return;
  }
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    const a = ambient;
    ambient = null;
    window.setTimeout(() => a?.stop(), 700);
  }
}

export const sfx = {
  /** aliases used by the game screens */
  press: () => bell(SCALE[5], 0.1, 1.6),
  touch: () => bell(SCALE[2 + Math.floor(Math.random() * 4)], 0.07, 1.1),
  clear: () => [SCALE[3], SCALE[5], SCALE[7]].forEach((f, i) => bell(f, 0.11, 2.4, i * 0.13)),
  miss: () => thud(150, 0.28),
  seal: () => bell(SCALE[5], 0.1, 1.6),
  tap: () => bell(SCALE[3], 0.06, 0.9),
  gather: () => [SCALE[3], SCALE[5], SCALE[7]].forEach((f, i) => bell(f, 0.11, 2.4, i * 0.13)),
  fail: () => thud(150, 0.28),
  strike: () => clang(),
  reveal: () => [SCALE[0], SCALE[2], SCALE[4], SCALE[6], SCALE[8]].forEach((f, i) => bell(f, 0.12, 3.2, i * 0.11)),
};
