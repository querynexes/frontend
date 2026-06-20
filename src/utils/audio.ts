let audioCtx: AudioContext | null = null;
let ambientGain: GainNode | null = null;
let isMuted = false;
let initialized = false;

export function initAudio() {
  if (initialized) return;
  initialized = true;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    isMuted = localStorage.getItem('qn_muted') === 'true';
    startAmbient();
    playLoadComplete();
  } catch {}
}

function startAmbient() {
  if (!audioCtx) return;
  ambientGain = audioCtx.createGain();
  ambientGain.gain.value = isMuted ? 0 : 0.025;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 280;
  filter.Q.value = 1;

  const reverb = audioCtx.createDelay(2.0);
  reverb.delayTime.value = 0.4;

  const reverbGain = audioCtx.createGain();
  reverbGain.gain.value = 0.3;

  [[55, 57.5], [110, 111]].forEach(([f1, f2]) => {
    [f1, f2].forEach(f => {
      const o = audioCtx!.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.connect(filter);
      o.start();
    });
  });

  filter.connect(ambientGain!);
  filter.connect(reverb);
  reverb.connect(reverbGain);
  reverbGain.connect(ambientGain!);
  ambientGain!.connect(audioCtx.destination);

  // LFO modulation
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 0.008;
  lfo.connect(lfoGain);
  lfoGain.connect(ambientGain!.gain);
  lfo.start();
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
      if (!audioCtx) return;
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
  if (ambientGain) ambientGain.gain.value = isMuted ? 0 : 0.025;
  localStorage.setItem('qn_muted', String(isMuted));
  return isMuted;
}

export function getMuted(): boolean {
  return isMuted;
}

export function isInitialized(): boolean {
  return initialized;
}
