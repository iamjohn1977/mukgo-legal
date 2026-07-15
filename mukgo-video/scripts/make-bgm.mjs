// Offline synthwave BGM generator for the MukGo intro.
// Produces public/bgm.wav (stereo, 44.1kHz, 16-bit) with no external deps.
// Vibe: A-minor arpeggio + plucky bass + soft pad + subtle kick, neon mood.
import { writeFileSync } from "node:fs";

const SR = 44100;
const DUR = 38.0; // covers the ~37.9s promo (1136 frames @ 30fps)
const N = Math.floor(SR * DUR);
const L = new Float32Array(N);
const R = new Float32Array(N);

// Chord table (Hz). tri = triad voicing, root = bass note.
const CHORDS = [
  { root: 110.0, tri: [220.0, 261.63, 329.63] }, // Am
  { root: 87.31, tri: [220.0, 261.63, 349.23] }, // F
  { root: 130.81, tri: [261.63, 329.63, 392.0] }, // C
  { root: 98.0, tri: [196.0, 246.94, 293.66] }, // G
];
const BAR = 2.0; // seconds per chord
const N_BARS = Math.ceil(DUR / BAR);
// Loop the i–VI–III–VII progression across the whole track.
const SEQ = Array.from({ length: N_BARS }, (_, b) => b % 4);
const BEAT = 0.5; // 120 BPM
const ARP = 0.125; // 16th notes

const TAU = Math.PI * 2;
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function addSample(i, l, r) {
  if (i < 0 || i >= N) return;
  L[i] += l;
  R[i] += r;
}

// A single voice: sine (+harmonic) with an exponential-decay pluck envelope.
function pluck(t0, dur, freq, amp, decay, pan, harm = 0.0) {
  const start = Math.floor(t0 * SR);
  const end = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = Math.cos((pan * Math.PI) / 2 + Math.PI / 4); // equal-power pan
  const gr = Math.sin((pan * Math.PI) / 2 + Math.PI / 4);
  for (let i = start; i < end; i++) {
    const t = (i - start) / SR;
    const atk = clamp01(t / 0.006); // 6ms attack, avoids clicks
    const env = atk * Math.exp(-t * decay);
    const ph = TAU * freq * t;
    const s = (Math.sin(ph) + harm * Math.sin(ph * 2)) * amp * env;
    addSample(i, s * gl, s * gr);
  }
}

// Sustained pad voice with soft attack/release across a bar.
function pad(t0, dur, freq, amp, pan) {
  const start = Math.floor(t0 * SR);
  const end = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = Math.cos((pan * Math.PI) / 2 + Math.PI / 4);
  const gr = Math.sin((pan * Math.PI) / 2 + Math.PI / 4);
  for (let i = start; i < end; i++) {
    const t = (i - start) / SR;
    const atk = clamp01(t / 0.25);
    const rel = clamp01((dur - t) / 0.25);
    const vib = 1 + 0.004 * Math.sin(TAU * 5 * t); // gentle vibrato
    const env = atk * rel;
    const ph = TAU * freq * vib * t;
    // slightly warm: sine + soft 2nd harmonic
    const s = (Math.sin(ph) + 0.18 * Math.sin(ph * 2)) * amp * env;
    addSample(i, s * gl, s * gr);
  }
}

function kick(t0) {
  const dur = 0.16;
  const start = Math.floor(t0 * SR);
  const end = Math.min(N, Math.floor((t0 + dur) * SR));
  for (let i = start; i < end; i++) {
    const t = (i - start) / SR;
    const f = 120 * Math.exp(-t * 24) + 45; // pitch drop
    const env = Math.exp(-t * 22);
    const s = Math.sin(TAU * f * t) * 0.6 * env;
    addSample(i, s, s);
  }
}

const nBars = SEQ.length;
for (let b = 0; b < nBars; b++) {
  const chord = CHORDS[SEQ[b]];
  const barT = b * BAR;

  // Pad: hold the triad for the bar.
  for (const f of chord.tri) pad(barT, BAR, f, 0.075, 0);

  // Bass: root plucked on every beat, octave-reinforced.
  for (let beat = 0; beat < BAR / BEAT; beat++) {
    const t = barT + beat * BEAT;
    pluck(t, BEAT, chord.root, 0.32, 3.2, 0, 0.25);
    pluck(t, BEAT, chord.root * 2, 0.1, 4.0, 0);
  }

  // Kick on each beat.
  for (let beat = 0; beat < BAR / BEAT; beat++) kick(barT + beat * BEAT);

  // Arpeggio: 16th notes cycling triad tones, rising with octave lifts.
  const steps = Math.round(BAR / ARP);
  for (let s = 0; s < steps; s++) {
    const t = barT + s * ARP;
    const idx = s % 6;
    const tone = chord.tri[idx % 3] * (idx >= 3 ? 2 : 1);
    // main (panned right) + delayed echo (panned left) for stereo width
    pluck(t, ARP * 1.6, tone, 0.12, 7, 0.35, 0.12);
    pluck(t + 0.09, ARP * 1.4, tone, 0.05, 9, -0.4, 0.1);
  }
}

// Master: soft-clip, global fade in/out, normalize headroom.
const fadeIn = 0.4;
const fadeOut = 1.6;
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let g = 1;
  if (t < fadeIn) g = clamp01(t / fadeIn);
  if (t > DUR - fadeOut) g = Math.min(g, clamp01((DUR - t) / fadeOut));
  L[i] = Math.tanh(L[i] * g * 0.9);
  R[i] = Math.tanh(R[i] * g * 0.9);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = peak > 0 ? 0.92 / peak : 1;

// Write 16-bit PCM stereo WAV.
const bytesPerSample = 2;
const dataSize = N * 2 * bytesPerSample;
const buf = Buffer.alloc(44 + dataSize);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(2, 22); // stereo
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2 * bytesPerSample, 28);
buf.writeUInt16LE(2 * bytesPerSample, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataSize, 40);
let off = 44;
for (let i = 0; i < N; i++) {
  const l = Math.max(-1, Math.min(1, L[i] * norm));
  const r = Math.max(-1, Math.min(1, R[i] * norm));
  buf.writeInt16LE((l * 32767) | 0, off);
  buf.writeInt16LE((r * 32767) | 0, off + 2);
  off += 4;
}
writeFileSync("public/bgm.wav", buf);
console.log(
  `Wrote public/bgm.wav — ${DUR}s, ${N} frames, peak ${peak.toFixed(3)}`,
);
