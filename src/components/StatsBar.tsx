// src/components/StatsBar.tsx
// Complete rewrite — "AI Optimization Command Center" telemetry panel.
// No Three.js. Pure React + framer-motion + bespoke SVG charts.
// Every number ticks live. Every chart breathes. Looks like a real engineering dashboard.

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Data & config
// ─────────────────────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  'PyTorch', 'TensorFlow', 'ONNX', 'TensorRT', 'JAX',
  'CoreML', 'CUDA', 'OpenVINO', 'TFLite', 'PaddlePaddle', 'MXNet', 'Triton',
];

// Pre-built realistic latency history — jagged baseline dropping to optimized
const SEED_BASELINE = [118, 124, 96, 131, 108, 142, 99, 121, 137, 104, 119, 128, 95, 133, 112, 120, 126, 101, 138, 116];
const SEED_OPT      = [11.4, 12.1, 10.8, 13.2, 11.9, 12.7, 10.6, 11.8, 13.0, 11.2, 12.4, 11.6, 10.9, 12.8, 11.3, 11.7, 12.2, 10.7, 13.1, 11.5];

// Throughput curve (req/s over 20 time steps)
const SEED_THROUGHPUT = [1200, 1340, 1180, 1500, 1420, 1680, 1560, 1890, 1740, 2100, 2230, 2080, 2460, 2380, 2600, 2710, 2580, 2900, 2820, 3100];

// GPU utilization % over 20 steps
const SEED_GPU = [41, 55, 48, 67, 72, 63, 78, 82, 75, 88, 91, 85, 93, 89, 94, 92, 96, 93, 95, 94];

const MEMORY_STEPS = [
  { label: 'FP32 Base',      gb: 14.2, color: 'var(--green-dark)' },
  { label: 'Quantize INT8',  gb: 7.8,  color: 'var(--green-deep)' },
  { label: 'Prune Sparse',   gb: 5.4,  color: 'var(--green-stable)' },
  { label: 'Kernel Fusion',  gb: 3.2,  color: 'var(--green-neon)' },
  { label: 'Final (QNX)',    gb: 1.82, color: 'var(--green-neon)' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function jitter(v: number, range: number, dp = 1) {
  return +(v + (Math.random() - 0.5) * range * 2).toFixed(dp);
}

function buildSVGLine(values: number[], W: number, H: number, minV: number, maxV: number, tension = 0.4): string {
  if (values.length < 2) return '';
  const xs = values.map((_, i) => (i / (values.length - 1)) * W);
  const ys = values.map(v => H - ((v - minV) / (maxV - minV || 1)) * H);

  // Smooth cubic bezier
  let d = `M ${xs[0].toFixed(1)},${ys[0].toFixed(1)}`;
  for (let i = 1; i < values.length; i++) {
    const cpx = xs[i - 1] + (xs[i] - xs[i - 1]) * tension;
    d += ` C ${cpx.toFixed(1)},${ys[i - 1].toFixed(1)} ${cpx.toFixed(1)},${ys[i].toFixed(1)} ${xs[i].toFixed(1)},${ys[i].toFixed(1)}`;
  }
  return d;
}

function buildAreaPath(values: number[], W: number, H: number, minV: number, maxV: number): string {
  const line = buildSVGLine(values, W, H, minV, maxV);
  if (!line) return '';
  return `${line} L ${W},${H} L 0,${H} Z`;
}

// ─────────────────────────────────────────────────────────────────────────────
// AnimatedNumber — framer-motion powered counter
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedNumber({ target, decimals = 0, suffix = '', duration = 2.0 }: {
  target: number; decimals?: number; suffix?: string; duration?: number;
}) {
  const mv      = useMotionValue(0);
  const display = useTransform(mv, v => v.toFixed(decimals) + suffix);
  const started = useRef(false);
  const ref      = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        animate(mv, target, { duration, ease: [0.16, 1, 0.3, 1] });
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [mv, target, duration]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART 1 — Dual-line inference latency (main hero chart)
// ─────────────────────────────────────────────────────────────────────────────

const CW = 560, CH = 150;

function LatencyDualChart() {
  const [baselineHist, setBaselineHist] = useState(SEED_BASELINE);
  const [optHist,      setOptHist]      = useState(SEED_OPT);
  const [drawn,        setDrawn]        = useState(false);
  const [hoverIdx,     setHoverIdx]     = useState<number | null>(null);

  // Start drawing on mount, tick every 1.2s
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 200);
    const iv = setInterval(() => {
      setBaselineHist(p => [...p.slice(1), jitter(115, 18)]);
      setOptHist(p      => [...p.slice(1), jitter(11.6, 1.1)]);
    }, 1200);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);

  const minV = 0, maxV = 160;

  const basePath = buildSVGLine(baselineHist, CW, CH, minV, maxV);
  const baseArea = buildAreaPath(baselineHist, CW, CH, minV, maxV);
  const optPath  = buildSVGLine(optHist,      CW, CH, minV, maxV);
  const optArea  = buildAreaPath(optHist,      CW, CH, minV, maxV);

  // Grid Y labels
  const gridLines = [0, 40, 80, 120, 160];

  // Last opt point for pulse dot
  const lastOptX = CW;
  const lastOptY = CH - ((optHist[optHist.length - 1] - minV) / (maxV - minV)) * CH;

  return (
    <div style={{ flex: '1 1 520px', minWidth: 0 }}>
      {/* Chart header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: 5 }}>
            INFERENCE LATENCY — P50 · 24H ROLLING WINDOW
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--green-neon)', lineHeight: 1, letterSpacing: '-0.02em', fontFamily: 'JetBrains Mono, monospace' }}>
              <AnimatedNumber target={11.6} decimals={1} suffix="ms" duration={2.0} />
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-disabled)', textDecoration: 'line-through', fontFamily: 'JetBrains Mono, monospace' }}>118.4ms</span>
            <span style={{
              fontSize: 9, color: 'var(--green-neon)', background: 'var(--glow-overlay)',
              border: '1px solid var(--glow-overlay)', borderRadius: 4, padding: '2px 8px', letterSpacing: '0.05em',
              fontFamily: 'JetBrains Mono, monospace',
            }}>10.2×</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <motion.div
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green-neon)' }}
          />
          <span style={{ fontSize: 9, color: 'var(--green-neon)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>LIVE</span>
        </div>
      </div>

      {/* SVG */}
      <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--glow-overlay)', background: 'var(--bg-primary)' }}>
        {/* Y-axis labels */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 28, width: 32,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '6px 0', zIndex: 2, pointerEvents: 'none',
        }}>
          {gridLines.slice().reverse().map(v => (
            <span key={v} style={{ fontSize: 7.5, color: 'var(--text-disabled)', paddingLeft: 4, fontFamily: 'JetBrains Mono, monospace' }}>
              {v}ms
            </span>
          ))}
        </div>

        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: CH, display: 'block' }}
          onMouseLeave={() => setHoverIdx(null)}
          onMouseMove={e => {
            const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * CW;
            const idx = Math.round((x / CW) * (baselineHist.length - 1));
            setHoverIdx(Math.min(Math.max(idx, 0), baselineHist.length - 1));
          }}
        >
          {/* Grid lines */}
          {gridLines.map(v => (
            <line key={v}
              x1={0} y1={CH - (v / maxV) * CH}
              x2={CW} y2={CH - (v / maxV) * CH}
              stroke="var(--glow-grid)" strokeWidth={1}
            />
          ))}

          {/* Baseline area */}
          <motion.path d={baseArea} fill="url(#baseGrad)"
            initial={{ opacity: 0 }} animate={{ opacity: drawn ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
          {/* Optimized area */}
          <motion.path d={optArea} fill="url(#optGrad)"
            initial={{ opacity: 0 }} animate={{ opacity: drawn ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          />

          {/* Baseline line */}
          <motion.path d={basePath} fill="none" stroke="var(--green-dark)" strokeWidth={1.5} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: drawn ? 1 : 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          />
          {/* Optimized line */}
          <motion.path d={optPath} fill="none" stroke="var(--green-neon)" strokeWidth={2} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: drawn ? 1 : 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          />

          {/* Live pulse at end of opt line */}
          <motion.circle cx={lastOptX - 2} cy={lastOptY} r={5}
            fill="var(--green-neon)" fillOpacity={0.12}
            animate={{ r: [5, 11, 5], fillOpacity: [0.12, 0, 0.12] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
          />
          <motion.circle cx={lastOptX - 2} cy={lastOptY} r={2.5} fill="var(--green-neon)"
            initial={{ opacity: 0 }} animate={{ opacity: drawn ? 1 : 0 }} transition={{ delay: 1.6 }}
          />

          {/* Hover crosshair */}
          {hoverIdx !== null && (() => {
            const hx = (hoverIdx / (baselineHist.length - 1)) * CW;
            const byRaw = CH - ((baselineHist[hoverIdx] - minV) / (maxV - minV)) * CH;
            const oyRaw = CH - ((optHist[hoverIdx] - minV) / (maxV - minV)) * CH;
            return (
              <>
                <line x1={hx} y1={0} x2={hx} y2={CH} stroke="var(--text-disabled)" strokeWidth={1} strokeDasharray="3 4" />
                <circle cx={hx} cy={byRaw} r={3.5} fill="var(--green-dark)" stroke="var(--border-strong)" strokeWidth={1} />
                <circle cx={hx} cy={oyRaw} r={3.5} fill="var(--green-neon)" stroke="var(--green-neon)" strokeWidth={1} />
              </>
            );
          })()}

          <defs>
            <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--green-dark)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--green-dark)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--green-neon)" stopOpacity={0.1} />
              <stop offset="100%" stopColor="var(--green-neon)" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover tooltip */}
        {hoverIdx !== null && (
          <div style={{
            position: 'absolute', top: 8,
            left: `${Math.min((hoverIdx / (baselineHist.length - 1)) * 100, 72)}%`,
            transform: 'translateX(-50%)',
            background: 'var(--bg-surface)', border: '1px solid var(--glow-overlay)',
            borderRadius: 6, padding: '6px 10px', pointerEvents: 'none',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9, zIndex: 10,
          }}>
            <div style={{ color: 'var(--green-dark)', marginBottom: 3 }}>
              BASELINE <span style={{ color: 'var(--text-muted)' }}>{baselineHist[hoverIdx].toFixed(0)}ms</span>
            </div>
            <div style={{ color: 'var(--green-neon)' }}>
              QNX <span style={{ color: 'var(--green-neon)', fontWeight: 700 }}>{optHist[hoverIdx].toFixed(1)}ms</span>
            </div>
          </div>
        )}

        {/* Ticker row */}
        <div style={{
          background: 'var(--bg-primary)', borderTop: '1px solid var(--glow-overlay)',
          padding: '7px 12px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ display: 'inline-block', width: 10, height: 2, background: 'var(--green-dark)', marginRight: 5, verticalAlign: 'middle' }} />
              PRE-OPT avg {(SEED_BASELINE.reduce((a, b) => a + b, 0) / SEED_BASELINE.length).toFixed(0)}ms
            </span>
            <span style={{ fontSize: 9, color: 'var(--green-neon)', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ display: 'inline-block', width: 10, height: 2, background: 'var(--green-neon)', marginRight: 5, verticalAlign: 'middle' }} />
              QNX avg {(SEED_OPT.reduce((a, b) => a + b, 0) / SEED_OPT.length).toFixed(1)}ms
            </span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-muted)' }}>
            <span>P95 <span style={{ color: 'var(--status-info)' }}>{jitter(14.2, 0).toFixed(1)}ms</span></span>
            <span>P99 <span style={{ color: 'var(--status-info)' }}>{jitter(21.7, 0).toFixed(1)}ms</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART 2 — Memory waterfall (stepped bar chart)
// ─────────────────────────────────────────────────────────────────────────────

function MemoryWaterfall() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const maxGB = MEMORY_STEPS[0].gb;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ flex: '1 1 240px', minWidth: 0 }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: 14 }}>
        MEMORY FOOTPRINT REDUCTION
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {MEMORY_STEPS.map((step, i) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 80, fontSize: 8.5, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em', textAlign: 'right', flexShrink: 0 }}>
              {step.label}
            </div>
            <div style={{ flex: 1, height: 20, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: visible ? `${(step.gb / maxGB) * 100}%` : 0 }}
                transition={{ duration: 0.9, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%', background: step.color,
                  borderRadius: 3,
                  boxShadow: i === MEMORY_STEPS.length - 1 ? `0 0 10px ${step.color}80` : 'none',
                }}
              />
              {i === MEMORY_STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: visible ? 1 : 0 }}
                  transition={{ delay: 1.2 }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, transparent 60%, var(--glow-overlay) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
            <div style={{ width: 36, fontSize: 9, color: i === MEMORY_STEPS.length - 1 ? 'var(--green-neon)' : 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: i === MEMORY_STEPS.length - 1 ? 700 : 400, flexShrink: 0 }}>
              {step.gb}GB
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 16, padding: '10px 14px', borderRadius: 7,
        background: 'var(--glow-overlay)', border: '1px solid var(--glow-overlay)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>
          TOTAL REDUCTION
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green-neon)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
          <AnimatedNumber target={87.2} decimals={1} suffix="%" duration={1.8} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART 3 — Throughput area chart (live ticking)
// ─────────────────────────────────────────────────────────────────────────────

const TW = 280, TH = 80;

function ThroughputChart() {
  const [hist, setHist] = useState(SEED_THROUGHPUT);
  useEffect(() => {
    const iv = setInterval(() => {
      setHist(p => [...p.slice(1), jitter(2900, 300, 0)]);
    }, 900);
    return () => clearInterval(iv);
  }, []);

  const minV = 0, maxV = 3500;
  const linePath = buildSVGLine(hist, TW, TH, minV, maxV);
  const areaPath = buildAreaPath(hist, TW, TH, minV, maxV);

  return (
    <div style={{ flex: '0 0 auto', minWidth: 0 }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>
        THROUGHPUT — REQ/S
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--status-info)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 10 }}>
        <AnimatedNumber target={hist[hist.length - 1]} decimals={0} suffix="" duration={0.4} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>req/s</span>
      </div>
      <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--glow-overlay)' }}>
        <svg viewBox={`0 0 ${TW} ${TH}`} width="100%" height={TH} style={{ background: 'var(--bg-primary)', display: 'block' }}>
          {[0.33, 0.66].map(f => (
            <line key={f} x1={0} y1={TH * f} x2={TW} y2={TH * f} stroke="var(--glow-grid)" strokeWidth={1} />
          ))}
          <motion.path d={areaPath} fill="url(#tpGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
          <motion.path d={linePath} fill="none" stroke="var(--status-info)" strokeWidth={1.5} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--status-info)" stopOpacity={0.12} />
              <stop offset="100%" stopColor="var(--status-info)" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART 4 — GPU utilization bar chart (live ticking)
// ─────────────────────────────────────────────────────────────────────────────

const GW = 280, GH = 80;
const GPU_BARS = 20;

function GpuUtilChart() {
  const [bars, setBars] = useState(SEED_GPU);
  useEffect(() => {
    const iv = setInterval(() => {
      setBars(p => [...p.slice(1), jitter(93, 4, 0)]);
    }, 700);
    return () => clearInterval(iv);
  }, []);

  const barW = GW / GPU_BARS - 2;
  const maxV = 100;

  return (
    <div style={{ flex: '0 0 auto', minWidth: 0 }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>
        GPU UTILIZATION
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--status-warn)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 10 }}>
        <AnimatedNumber target={bars[bars.length - 1]} decimals={0} suffix="%" duration={0.3} />
      </div>
      <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--glow-overlay)' }}>
        <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height={GH} style={{ background: 'var(--bg-primary)', display: 'block' }}>
          {bars.map((v, i) => {
            const bh = (v / maxV) * GH;
            const x  = i * (GW / GPU_BARS) + 1;
            const isLast = i === bars.length - 1;
            return (
              <motion.rect
                key={i}
                x={x} y={GH - bh} width={barW} height={bh}
                rx={1.5}
                fill={isLast ? 'var(--status-warn)' : `rgba(255,176,32,${0.15 + (v / maxV) * 0.5})`}
                animate={{ height: bh, y: GH - bh }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            );
          })}
          <line x1={0} y1={GH * 0.2} x2={GW} y2={GH * 0.2} stroke="rgba(255,176,32,0.2)" strokeWidth={1} strokeDasharray="3 4" />
          <text x={4} y={GH * 0.2 - 3} fill="rgba(255,176,32,0.3)" fontSize={7} fontFamily="JetBrains Mono, monospace">80%</text>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI stat counter
// ─────────────────────────────────────────────────────────────────────────────

interface StatDef { count: number; suffix: string; label: string; desc: string; float?: boolean; color?: string; }

const STATS: StatDef[] = [
  { count: 847,  suffix: 'K+', label: 'Models Optimized',  desc: 'Compilation jobs processed',    color: 'var(--green-neon)' },
  { count: 12.4, suffix: '×',  label: 'Avg. Speedup',      desc: 'Inference acceleration',          color: 'var(--green-neon)', float: true },
  { count: 23,   suffix: '',   label: 'Frameworks',         desc: 'Supported ML runtimes',           color: 'var(--status-info)' },
  { count: 150,  suffix: '+',  label: 'Deploy Targets',     desc: 'Hardware & cloud platforms',      color: 'var(--status-warn)' },
];

function StatCounter({ stat, index }: { stat: StatDef; index: number }) {
  const [live, setLive] = useState<number | null>(null);
  const ref   = useRef<HTMLDivElement>(null);
  const color = stat.color ?? 'var(--green-neon)';
  useEffect(() => {
    if (live === null) return;
    if (!stat.float) return; // only tick speedup
    const iv = setInterval(() => {
      setLive(jitter(stat.count, 0.3, 1));
    }, 2000);
    return () => clearInterval(iv);
  }, [live, stat]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '22px 24px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 50,
        background: `radial-gradient(ellipse at 50% 0%, ${color}08 0%, transparent 80%)`,
        pointerEvents: 'none',
      }} />

      {/* Top bar accent */}
      <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 1, background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />

      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 'clamp(30px, 3.5vw, 42px)',
        fontWeight: 700,
        color,
        lineHeight: 1,
        letterSpacing: '-0.03em',
        marginBottom: 8,
      }}>
        <AnimatedNumber
          target={stat.count}
          decimals={stat.float ? 1 : 0}
          suffix={stat.suffix}
          duration={1.8}
        />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: 5 }}>
        {stat.label.toUpperCase()}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
        {stat.desc}
      </div>

      {/* Corner accent */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
        borderBottom: `1.5px solid ${color}35`, borderRight: `1.5px solid ${color}35`,
        borderBottomRightRadius: 10,
      }} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Framework badge strip (horizontal marquee)
// ─────────────────────────────────────────────────────────────────────────────

function FrameworkStrip() {
  const doubled = [...FRAMEWORKS, ...FRAMEWORKS];
  return (
    <div style={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
      {/* Fade edges */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(90deg, var(--bg-secondary) 0%, transparent 80px, transparent calc(100% - 80px), var(--bg-secondary) 100%)',
      }} />
      <motion.div
        initial={false}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        style={{ display: 'flex', gap: 10, width: 'max-content' }}
      >
        {doubled.map((fw, i) => (
          <div key={i} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
            color: 'var(--text-muted)', letterSpacing: '0.1em',
            border: '1px solid var(--border-default)',
            padding: '6px 14px', borderRadius: 5, whiteSpace: 'nowrap',
            background: 'var(--bg-primary)',
            transition: 'all 0.15s',
          }}>
            {fw.toUpperCase()}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section divider / header
// ─────────────────────────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
      <div style={{ width: 16, height: 1, background: 'var(--green-neon)' }} />
      <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--glow-grid)' }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function StatsBar() {
  return (
    <section
      id="stats-bar"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
        padding: '64px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,255,133,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,133,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />
      {/* Ambient radial */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,255,133,0.025) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* ── BLOCK 1: Main telemetry charts ── */}
        <div>
          <SectionDivider label="// LIVE TELEMETRY — OPTIMIZATION ENGINE" />
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <LatencyDualChart />
            <MemoryWaterfall />
          </div>
        </div>

        {/* ── BLOCK 2: Mini live charts row ── */}
        <div>
          <SectionDivider label="// RUNTIME METRICS — H100 CLUSTER" />
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {/* Throughput card */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
              borderRadius: 10, padding: '18px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 1, background: 'linear-gradient(90deg, transparent, rgba(46,211,255,0.3), transparent)' }} />
              <ThroughputChart />
            </div>

            {/* GPU card */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
              borderRadius: 10, padding: '18px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,176,32,0.3), transparent)' }} />
              <GpuUtilChart />
            </div>

            {/* Live mini readout card */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
              borderRadius: 10, padding: '18px 20px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>
                SYSTEM STATUS
              </div>
              {[
                { label: 'CACHE HIT RATE',    value: '74.2%',   color: 'var(--green-neon)' },
                { label: 'ERROR RATE',         value: '0.03%',   color: 'var(--green-neon)' },
                { label: 'ACTIVE JOBS',        value: '1,847',   color: 'var(--status-info)' },
                { label: 'MEM BANDWIDTH',      value: '3.2 TB/s',color: 'var(--status-warn)' },
                { label: 'KERNEL VERSION',     value: '2.4.1',   color: 'var(--text-muted)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--glow-grid)' }}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>{label}</span>
                  <span style={{ fontSize: 10, color, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green-neon)' }} />
                <span style={{ fontSize: 8.5, color: 'var(--green-neon)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BLOCK 3: KPI counters ── */}
        <div>
          <SectionDivider label="// PLATFORM STATISTICS" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
          }} className="stats-grid">
            {STATS.map((stat, i) => (
              <StatCounter key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>

        {/* ── BLOCK 4: Framework strip ── */}
        <div>
          <SectionDivider label="// SUPPORTED FRAMEWORKS & RUNTIMES" />
          <FrameworkStrip />
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          #stats-bar { padding: 40px 20px !important; gap: 32px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 425px) {
          #stats-bar { padding: 32px 16px !important; gap: 28px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
        }
        @media (max-width: 375px) {
          #stats-bar { padding: 24px 12px !important; gap: 24px !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}