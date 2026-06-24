let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientConnected = false;
let isMuted = true; // always start muted on every page load
let initialized = false;

export function initAudio() {
  if (initialized) return;
  initialized = true;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    startAmbient();
    playLoadComplete();
    console.log('[Audio] initialized, muted by default');
  } catch (e) {
    console.warn('[Audio] init failed:', e);
  }
}

function connectAmbient() {
  if (!audioCtx || !masterGain || ambientConnected) return;
  masterGain.connect(audioCtx.destination);
  ambientConnected = true;
}

function disconnectAmbient() {
  if (!masterGain || !ambientConnected) return;
  masterGain.disconnect();
  ambientConnected = false;
}

function startAmbient() {
  if (!audioCtx) return;

  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.035;

  // Gentle lowpass — keeps the sound warm
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 700;
  filter.Q.value = 0.3;

  // Slow filter sweep for subtle evolution
  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.05;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 60;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  // Detuned pairs create a natural beating/chorusing — feels alive without being intrusive
  // 110 + 112 Hz: ~2Hz beat (calm pulse), 165 Hz: warm fifth, 55 Hz: sub foundation
  // 880 + 884 Hz: subtle shimmer for presence
  const voices: [number, number][] = [
    [110, 0.7],
    [112, 0.7],
    [165, 0.5],
    [55, 0.35],
    [880, 0.08],
    [884, 0.08],
  ];

  voices.forEach(([freq, amp]) => {
    const o = audioCtx!.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const g = audioCtx!.createGain();
    g.gain.value = amp;
    o.connect(g);
    g.connect(filter);
    o.start();
  });

  filter.connect(masterGain);

  // Always start muted — user must explicitly unmute
  console.log('[Audio] ambient ready (muted)');
}

export function playTick() {
  if (!audioCtx || isMuted) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.055, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
  const o = audioCtx.createOscillator();
  o.type = 'sine';
  o.frequency.value = 780 + Math.random() * 240;
  const pan = audioCtx.createStereoPanner();
  pan.pan.value = (Math.random() - 0.5) * 0.6;
  o.connect(g);
  g.connect(pan);
  pan.connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + 0.035);
}

export function playSimClick() {
  if (!audioCtx || isMuted) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.13, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.09);

  const noise = audioCtx.createOscillator();
  noise.type = 'sawtooth';
  noise.frequency.value = 160;

  const o = audioCtx.createOscillator();
  o.type = 'sine';
  o.frequency.value = 1100 + (Math.random() - 0.5) * 120;

  const noiseG = audioCtx.createGain();
  noiseG.gain.setValueAtTime(0.04, audioCtx.currentTime);
  noiseG.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);

  noise.connect(noiseG);
  noiseG.connect(audioCtx.destination);
  o.connect(g);
  g.connect(audioCtx.destination);
  noise.start(); noise.stop(audioCtx.currentTime + 0.015);
  o.start(); o.stop(audioCtx.currentTime + 0.09);
}

export function playIslandHover() {
  if (!audioCtx || isMuted) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.035, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);
  const o = audioCtx.createOscillator();
  o.type = 'sine';
  o.frequency.value = 2200;
  o.connect(g);
  g.connect(audioCtx.destination);
  o.start(); o.stop(audioCtx.currentTime + 0.02);
}

export function playLoadComplete() {
  if (!audioCtx || isMuted) return;
  [261.63, 329.63, 392, 523.25].forEach((f, i) => {
    setTimeout(() => {
      if (!audioCtx || isMuted) return;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.09, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      const o = audioCtx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.22);
    }, i * 115);
  });
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  if (isMuted) {
    disconnectAmbient();
  } else {
    connectAmbient();
  }
  console.log('[Audio] toggled:', isMuted ? 'muted' : 'unmuted');
  return isMuted;
}

export function getMuted(): boolean {
  return isMuted;
}

export function isInitialized(): boolean {
  return initialized;
}
