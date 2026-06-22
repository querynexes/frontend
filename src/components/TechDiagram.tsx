// src/components/TechDiagram.tsx
// Rewrite — fixes:
//   1. Image strip replaced with inline SVG illustrations (zero network, instant)
//   2. Connectors measured from real DOM positions via ResizeObserver
//   3. offset-path removed — travelling dots use keyframes on measured paths
//   4. Parallax removed (performance) — replaced with CSS-only static grid
//   5. All data 100% grounded in the QNX project brief

import { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Architecture data
// ─────────────────────────────────────────────────────────────────────────────

interface Stage {
  id: string;
  layer: 0 | 1 | 2 | 3;
  col: 0 | 1 | 2;
  label: string;
  sublabel: string;
  color: 'green' | 'cyan' | 'amber' | 'dim';
  badge?: string;
}

const STAGES: Stage[] = [
  // Layer 0 — Inputs
  { id: 'pytorch',   layer: 0, col: 0, label: 'PyTorch / ONNX',     sublabel: 'Model Checkpoint',          color: 'dim' },
  { id: 'tf',        layer: 0, col: 1, label: 'TensorFlow / JAX',    sublabel: 'SavedModel · Flax',         color: 'dim' },
  { id: 'custom',    layer: 0, col: 2, label: 'TFLite · CoreML',     sublabel: 'MXNet · PaddlePaddle',      color: 'dim' },
  // Layer 1 — IR & Graph
  { id: 'ingestion', layer: 1, col: 0, label: 'Model Ingestion',     sublabel: 'Checkpoint Parser',          color: 'green' },
  { id: 'ir',        layer: 1, col: 1, label: 'IR Compiler',         sublabel: 'Graph Extraction',           color: 'green', badge: 'CORE' },
  { id: 'graphopt',  layer: 1, col: 2, label: 'Graph Optimizer',     sublabel: 'DCE · CSE · Folding',        color: 'green' },
  // Layer 2 — Optimization Engine
  { id: 'quant',     layer: 2, col: 0, label: 'INT8 Quantization',   sublabel: 'Calibration · PTQ / QAT',   color: 'cyan' },
  { id: 'fusion',    layer: 2, col: 1, label: 'Kernel Fusion',       sublabel: 'Conv+BN+ReLU · Flash Attn', color: 'cyan', badge: 'NVIDIA' },
  { id: 'sparsity',  layer: 2, col: 2, label: 'Sparsity Pruning',    sublabel: 'Structured · Unstructured',  color: 'cyan' },
  // Layer 3 — Runtime
  { id: 'tuned',     layer: 3, col: 0, label: 'Tuned Runtime',       sublabel: 'TensorRT · CUDA Graphs',    color: 'amber' },
  { id: 'bench',     layer: 3, col: 1, label: 'Perf Benchmark',      sublabel: 'Latency · Throughput',       color: 'amber', badge: 'AUTO' },
  { id: 'artifact',  layer: 3, col: 2, label: 'QNX Artifact',        sublabel: 'Signed · Versioned',         color: 'amber' },
];

const DEPLOY = [
  { id: 'cloud',      label: 'Cloud GPU',     sub: 'NVIDIA A100 · H100',   color: '#2ED3FF', stat: '12.4×'  },
  { id: 'edge',       label: 'Edge Device',   sub: 'Jetson · Mobile NPU',  color: '#00FF85', stat: '67% ↓'  },
  { id: 'enterprise', label: 'Enterprise AI', sub: 'On-Prem · Private DC', color: '#FFB020', stat: '99.8%'  },
  { id: 'api',        label: 'REST / gRPC',   sub: 'SDK · CLI · Webhooks', color: '#C084FC', stat: '8.9K/s' },
];

const LAYER_META = [
  { label: 'MODEL INPUTS',             color: 'rgba(255,255,255,0.35)', desc: '23 frameworks · PyTorch, TF, ONNX, JAX, TFLite, CoreML, MXNet…' },
  { label: 'INGESTION & IR COMPILER',  color: '#00A854',                desc: 'Graph extraction, IR lowering, dead-code elimination, constant folding' },
  { label: 'OPTIMIZATION ENGINE',      color: '#2ED3FF',                desc: 'INT8/FP16 quantization, kernel fusion, sparsity pruning via NVIDIA TensorRT' },
  { label: 'RUNTIME & PACKAGING',      color: '#FFB020',                desc: 'CUDA-graph capture, automated benchmarking, signed artifact packaging' },
];

const C = {
  green: { border: 'rgba(0,168,84,0.55)',  bg: 'rgba(0,168,84,0.07)',  text: '#00FF85',  hborder: '#00FF85', hbg: 'rgba(0,255,133,0.12)' },
  cyan:  { border: 'rgba(46,211,255,0.4)', bg: 'rgba(46,211,255,0.06)',text: '#2ED3FF',  hborder: '#2ED3FF', hbg: 'rgba(46,211,255,0.1)' },
  amber: { border: 'rgba(255,176,32,0.4)', bg: 'rgba(255,176,32,0.06)',text: '#FFB020',  hborder: '#FFB020', hbg: 'rgba(255,176,32,0.1)' },
  dim:   { border: 'rgba(40,65,50,0.65)',  bg: 'rgba(11,20,16,0.45)',  text: 'rgba(255,255,255,0.55)', hborder: '#00FF85', hbg: 'rgba(0,255,133,0.05)' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Inline SVG illustrations — zero network, instant, on-brand
// Each one represents a real engineering concept from the QNX project
// ─────────────────────────────────────────────────────────────────────────────

function IllustrationChipDie() {
  // Silicon die with compute blocks and power rails
  const cells = Array.from({ length: 64 }, (_, i) => ({
    x: (i % 8) * 18 + 4, y: Math.floor(i / 8) * 18 + 4,
    bright: [9, 10, 17, 18, 19, 27, 36, 37, 45, 46, 54].includes(i),
  }));
  return (
    <svg viewBox="0 0 152 152" width="160" height="96" style={{ display: 'block' }}>
      <rect width="152" height="152" fill="#060D09" />
      {/* Power grid */}
      {[0, 38, 76, 114, 152].map(v => (
        <g key={v}>
          <line x1={v} y1={0} x2={v} y2={152} stroke="#00FF8514" strokeWidth={1} />
          <line x1={0} y1={v} x2={152} y2={v} stroke="#00FF8514" strokeWidth={1} />
        </g>
      ))}
      {/* Die cells */}
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={14} height={14} rx={1}
          fill={c.bright ? '#00FF8520' : '#0B1A10'} stroke={c.bright ? '#00FF8540' : '#1A2E1E'} strokeWidth={0.5}
        />
      ))}
      {/* Core label */}
      <rect x={28} y={28} width={96} height={60} rx={3} fill="none" stroke="#00FF8530" strokeWidth={1} strokeDasharray="3 2" />
      <text x={76} y={61} textAnchor="middle" fill="#00FF8555" fontSize={7} fontFamily="JetBrains Mono, monospace">COMPUTE CORE</text>
      {/* Bond pads */}
      {[12, 40, 68, 96, 124].map(p => (
        <g key={p}>
          <rect x={p} y={1} width={6} height={4} rx={0.5} fill="#00A85440" />
          <rect x={p} y={147} width={6} height={4} rx={0.5} fill="#00A85440" />
          <rect x={1} y={p} width={4} height={6} rx={0.5} fill="#00A85440" />
          <rect x={147} y={p} width={4} height={6} rx={0.5} fill="#00A85440" />
        </g>
      ))}
      <text x={76} y={145} textAnchor="middle" fill="#00FF8540" fontSize={6} fontFamily="JetBrains Mono, monospace">SILICON WAFER</text>
    </svg>
  );
}

function IllustrationGpuRack() {
  // Server rack front panel with GPU sleds
  const sleds = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg viewBox="0 0 160 96" width="160" height="96" style={{ display: 'block' }}>
      <rect width="160" height="96" fill="#060D09" />
      <rect x={14} y={4} width={132} height={88} rx={3} fill="#0B1410" stroke="#1E3025" strokeWidth={1} />
      {/* GPU sleds */}
      {sleds.map(i => {
        const y = 8 + i * 10;
        const active = i < 6;
        return (
          <g key={i}>
            <rect x={18} y={y} width={124} height={8} rx={1.5} fill={active ? '#0D1F15' : '#0B1410'} stroke={active ? '#1E3A22' : '#162018'} strokeWidth={0.5} />
            {/* Ports */}
            {[0, 1, 2].map(p => (
              <rect key={p} x={22 + p * 8} y={y + 2} width={5} height={4} rx={0.5} fill="#0A1812" stroke="#243A2A" strokeWidth={0.5} />
            ))}
            {/* Status LED */}
            <circle cx={120} cy={y + 4} r={1.8} fill={active ? '#00FF85' : '#1E3025'} opacity={active ? 0.8 : 1} />
            {active && <circle cx={120} cy={y + 4} r={3} fill="#00FF85" opacity={0.15} />}
            {/* Label */}
            <text x={50} y={y + 5.5} fill={active ? '#00FF8555' : '#1E3025'} fontSize={5} fontFamily="JetBrains Mono, monospace">
              {active ? `H100 · SLOT ${i + 1}` : 'EMPTY'}
            </text>
          </g>
        );
      })}
      <text x={80} y={92} textAnchor="middle" fill="#00FF8540" fontSize={6} fontFamily="JetBrains Mono, monospace">H100 CLUSTER</text>
    </svg>
  );
}

function IllustrationLatencyWave() {
  // Before/after latency waveforms
  const W = 160, H = 96;
  const pts1 = [0, 118, 12, 124, 24, 96, 36, 131, 48, 108, 60, 142, 72, 99, 84, 121, 96, 137, 108, 104, 120, 119, 132, 128, 144, 95, 156, 133];
  const pts2 = [0, 12, 12, 11.4, 24, 12.8, 36, 11.2, 48, 13.1, 60, 10.9, 72, 12.4, 84, 11.7, 96, 12.1, 108, 11.5, 120, 12.7, 132, 11.8, 144, 12.3, 156, 11.6];

  const toSVG = (pts: number[], maxV: number) => {
    const coords: string[] = [];
    for (let i = 0; i < pts.length; i += 2) {
      const x = (pts[i] / 156) * (W - 8) + 4;
      const y = H - 16 - (pts[i + 1] / maxV) * (H - 28);
      coords.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return coords.join(' ');
  };

  const line1 = toSVG(pts1, 150);
  const line2 = toSVG(pts2, 150);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="160" height="96" style={{ display: 'block' }}>
      <rect width={W} height={H} fill="#060D09" />
      {[0.33, 0.66].map(f => (
        <line key={f} x1={4} y1={H - 16 - f * (H - 28)} x2={W - 4} y2={H - 16 - f * (H - 28)} stroke="#FFFFFF06" strokeWidth={1} />
      ))}
      <path d={line1} fill="none" stroke="#2A4030" strokeWidth={1.2} />
      <path d={line2} fill="none" stroke="#00FF85" strokeWidth={1.5} />
      <text x={8} y={14} fill="#2A4030" fontSize={6} fontFamily="JetBrains Mono, monospace">BEFORE 118ms</text>
      <text x={8} y={22} fill="#00FF85" fontSize={6} fontFamily="JetBrains Mono, monospace">AFTER  11.6ms</text>
      <text x={80} y={92} textAnchor="middle" fill="#00FF8540" fontSize={6} fontFamily="JetBrains Mono, monospace">LATENCY TELEMETRY</text>
    </svg>
  );
}

function IllustrationKernelFusion() {
  // Before/after computation graph: 3 separate ops → 1 fused
  return (
    <svg viewBox="0 0 160 96" width="160" height="96" style={{ display: 'block' }}>
      <rect width="160" height="96" fill="#060D09" />
      {/* BEFORE: 3 nodes */}
      {[['CONV', 18], ['BN', 42], ['RELU', 66]] .map(([lbl, y], i) => (
        <g key={i}>
          <rect x={8} y={+y} width={44} height={16} rx={2} fill="#0D1F15" stroke="#1E3A22" strokeWidth={0.8} />
          <text x={30} y={+y + 10} textAnchor="middle" fill="#00A85480" fontSize={6.5} fontFamily="JetBrains Mono, monospace">{lbl}</text>
          {i < 2 && <line x1={30} y1={+y + 16} x2={30} y2={+y + 24} stroke="#1E3A22" strokeWidth={0.8} />}
        </g>
      ))}
      {/* Arrow */}
      <text x={72} y={52} fill="#00FF8540" fontSize={12}>→</text>
      {/* AFTER: 1 fused node */}
      <rect x={96} y={30} width={56} height={36} rx={3} fill="#0D2018" stroke="#00FF8535" strokeWidth={1} />
      <text x={124} y={48} textAnchor="middle" fill="#00FF85" fontSize={6.5} fontFamily="JetBrains Mono, monospace">CONV+BN</text>
      <text x={124} y={57} textAnchor="middle" fill="#00FF8570" fontSize={6.5} fontFamily="JetBrains Mono, monospace">+RELU</text>
      <text x={8} y={92} fill="#00A85450" fontSize={6} fontFamily="JetBrains Mono, monospace">3 KERNELS</text>
      <text x={96} y={92} fill="#00FF8550" fontSize={6} fontFamily="JetBrains Mono, monospace">1 FUSED OP</text>
      <text x={80} y={14} textAnchor="middle" fill="#00FF8530" fontSize={6} fontFamily="JetBrains Mono, monospace">KERNEL FUSION</text>
    </svg>
  );
}

function IllustrationMemory() {
  // Memory reduction waterfall bars
  const steps = [
    { label: 'FP32', pct: 100, color: '#1E3A22' },
    { label: 'FP16', pct: 56,  color: '#005028' },
    { label: 'INT8', pct: 31,  color: '#007A38' },
    { label: 'QNX',  pct: 13,  color: '#00FF85' },
  ];
  return (
    <svg viewBox="0 0 160 96" width="160" height="96" style={{ display: 'block' }}>
      <rect width="160" height="96" fill="#060D09" />
      {steps.map((s, i) => {
        const bh = (s.pct / 100) * 62;
        const x = 14 + i * 34;
        return (
          <g key={i}>
            <rect x={x} y={72 - bh} width={24} height={bh} rx={2} fill={s.color} opacity={0.85} />
            <text x={x + 12} y={82} textAnchor="middle" fill="#FFFFFF50" fontSize={6} fontFamily="JetBrains Mono, monospace">{s.label}</text>
            <text x={x + 12} y={72 - bh - 3} textAnchor="middle" fill={s.color} fontSize={6} fontFamily="JetBrains Mono, monospace">{s.pct}%</text>
          </g>
        );
      })}
      <text x={80} y={93} textAnchor="middle" fill="#00FF8540" fontSize={6} fontFamily="JetBrains Mono, monospace">MEMORY REDUCTION</text>
    </svg>
  );
}

function IllustrationPipeline() {
  // Horizontal pipeline flow
  const nodes = ['INPUT', 'IR', 'OPT', 'RT', 'DEPLOY'];
  const colors = ['#334E3E', '#00A854', '#2ED3FF', '#FFB020', '#00FF85'];
  return (
    <svg viewBox="0 0 160 96" width="160" height="96" style={{ display: 'block' }}>
      <rect width="160" height="96" fill="#060D09" />
      {nodes.map((n, i) => {
        const x = 10 + i * 29;
        return (
          <g key={i}>
            <rect x={x} y={34} width={22} height={28} rx={2.5} fill="#0D1F15" stroke={colors[i]} strokeWidth={0.8} opacity={0.9} />
            <text x={x + 11} y={51} textAnchor="middle" fill={colors[i]} fontSize={5.5} fontFamily="JetBrains Mono, monospace">{n}</text>
            {i < nodes.length - 1 && (
              <line x1={x + 22} y1={48} x2={x + 29} y2={48} stroke={colors[i]} strokeWidth={0.8} opacity={0.6} />
            )}
            <circle cx={x + 11} cy={34} r={2} fill={colors[i]} opacity={0.6} />
          </g>
        );
      })}
      <text x={80} y={93} textAnchor="middle" fill="#00FF8540" fontSize={6} fontFamily="JetBrains Mono, monospace">QNX PIPELINE</text>
    </svg>
  );
}

function IllustrationThroughput() {
  // Bar chart of throughput growth
  const bars = [1200, 1800, 2400, 3100, 4200, 5800, 7200, 8900];
  const maxV = 9000;
  return (
    <svg viewBox="0 0 160 96" width="160" height="96" style={{ display: 'block' }}>
      <rect width="160" height="96" fill="#060D09" />
      {bars.map((v, i) => {
        const bh = (v / maxV) * 65;
        const x = 10 + i * 18;
        const isLast = i === bars.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={72 - bh} width={12} height={bh} rx={1.5}
              fill={isLast ? '#00FF85' : `rgba(0,255,133,${0.15 + (v / maxV) * 0.5})`}
            />
            {isLast && (
              <text x={x + 6} y={72 - bh - 4} textAnchor="middle" fill="#00FF85" fontSize={5.5} fontFamily="JetBrains Mono, monospace">
                8.9K
              </text>
            )}
          </g>
        );
      })}
      <text x={80} y={93} textAnchor="middle" fill="#00FF8540" fontSize={6} fontFamily="JetBrains Mono, monospace">THROUGHPUT REQ/S</text>
    </svg>
  );
}

const STRIP_ITEMS = [
  { Illustration: IllustrationChipDie,     label: 'SILICON WAFER'     },
  { Illustration: IllustrationGpuRack,     label: 'H100 CLUSTER'      },
  { Illustration: IllustrationLatencyWave, label: 'LATENCY TELEMETRY' },
  { Illustration: IllustrationKernelFusion,label: 'KERNEL FUSION'     },
  { Illustration: IllustrationMemory,      label: 'MEMORY REDUCTION'  },
  { Illustration: IllustrationPipeline,    label: 'QNX PIPELINE'      },
  { Illustration: IllustrationThroughput,  label: 'THROUGHPUT'        },
];

// ─────────────────────────────────────────────────────────────────────────────
// Image scroll strip — uses inline SVG, no external requests
// ─────────────────────────────────────────────────────────────────────────────

function IllustrationStrip() {
  const doubled = [...STRIP_ITEMS, ...STRIP_ITEMS];
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 108, marginBottom: 36 }}>
      {/* Fade edges */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(90deg, var(--bg-secondary) 0%, transparent 100px, transparent calc(100% - 100px), var(--bg-secondary) 100%)',
      }} />
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: 10, width: 'max-content', alignItems: 'flex-start' }}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{
            width: 160, flexShrink: 0,
            borderRadius: 8, overflow: 'hidden',
            border: '1px solid rgba(0,255,133,0.1)',
            background: '#060D09',
          }}>
            <item.Illustration />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage card
// ─────────────────────────────────────────────────────────────────────────────

function StageCard({ stage, visible, delay }: { stage: Stage; visible: boolean; delay: number }) {
  const [hov, setHov] = useState(false);
  const c = C[stage.color];

  return (
    <motion.div
      data-stage-id={stage.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.38, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, minWidth: 0, position: 'relative',
        border: `1px solid ${hov ? c.hborder : c.border}`,
        borderRadius: 8, padding: '12px 15px 11px',
        background: hov ? c.hbg : c.bg,
        backdropFilter: 'blur(4px)',
        transition: 'border-color 0.18s, background 0.18s',
        cursor: 'default',
      }}
    >
      {stage.badge && (
        <div style={{
          position: 'absolute', top: -9, left: 11,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 7.5,
          color: c.text, background: '#0B1410',
          border: `1px solid ${c.border}`, borderRadius: 3,
          padding: '1px 7px', letterSpacing: '0.12em',
        }}>
          {stage.badge}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: c.text, flexShrink: 0,
          boxShadow: hov ? `0 0 7px ${c.text}` : 'none',
          transition: 'box-shadow 0.18s',
        }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: c.text, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {stage.label}
        </span>
      </div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.5 }}>
        {stage.sublabel}
      </div>
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 7, height: 7, borderTop: `1px solid ${c.text}`, borderLeft: `1px solid ${c.text}`, borderTopLeftRadius: 8, opacity: 0.35 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 7, height: 7, borderBottom: `1px solid ${c.text}`, borderRight: `1px solid ${c.text}`, borderBottomRightRadius: 8, opacity: 0.35 }} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Connectors — measure real DOM positions, draw accurate SVG paths
// ─────────────────────────────────────────────────────────────────────────────

interface ConnectorLine {
  key: string;
  d: string;
  color: string;
  delay: number;
}

// Map from stageId to the id that it connects DOWN to
const CONNECT_DOWN: [string, string][] = [
  ['pytorch',   'ingestion'],
  ['tf',        'ir'],
  ['custom',    'graphopt'],
  ['ingestion', 'quant'],
  ['ir',        'fusion'],
  ['graphopt',  'sparsity'],
  ['quant',     'tuned'],
  ['fusion',    'bench'],
  ['sparsity',  'artifact'],
];

// Colour by target layer
const CONN_COLOR: Record<number, string> = {
  1: '#00A854',
  2: '#2ED3FF',
  3: '#FFB020',
};

function ConnectorOverlay({ containerRef, visible }: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
}) {
  const [lines, setLines] = useState<ConnectorLine[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const cRect = container.getBoundingClientRect();
    const sRect = svg.getBoundingClientRect();
    setSvgSize({ w: sRect.width, h: sRect.height });

    const newLines: ConnectorLine[] = [];

    CONNECT_DOWN.forEach(([fromId, toId], i) => {
      const fromEl = container.querySelector(`[data-stage-id="${fromId}"]`);
      const toEl   = container.querySelector(`[data-stage-id="${toId}"]`);
      if (!fromEl || !toEl) return;

      const fR = fromEl.getBoundingClientRect();
      const tR = toEl.getBoundingClientRect();

      // Points relative to container top-left
      const x1 = fR.left + fR.width / 2  - cRect.left;
      const y1 = fR.bottom                - cRect.top;
      const x2 = tR.left + tR.width / 2  - cRect.left;
      const y2 = tR.top                   - cRect.top;

      const midY = (y1 + y2) / 2;

      // Elbow path: down → horizontal → down
      const d = Math.abs(x1 - x2) < 2
        ? `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`
        : `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x1.toFixed(1)} ${midY.toFixed(1)} L ${x2.toFixed(1)} ${midY.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;

      // Determine colour by destination layer
      const toStage = STAGES.find(s => s.id === toId);
      const color = toStage ? (CONN_COLOR[toStage.layer] ?? '#00A854') : '#00A854';

      newLines.push({ key: `${fromId}-${toId}`, d, color, delay: i * 0.08 });
    });

    setLines(newLines);
  }, [containerRef]);

  // Measure after paint and on resize
  useLayoutEffect(() => {
    // Small timeout to ensure cards have rendered
    const t = setTimeout(measure, 120);
    return () => clearTimeout(t);
  }, [measure, visible]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    const el = containerRef.current;
    if (el) ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [measure, containerRef]);

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'visible', zIndex: 0,
      }}
    >
      {lines.map(({ key, d, color, delay }) => (
        <g key={key}>
          {/* Dim static track */}
          <path d={d} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />

          {/* Animated glowing trace */}
          <motion.path
            d={d} fill="none" stroke={color} strokeWidth={1.2} strokeOpacity={0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: visible ? 1 : 0 }}
            transition={{ duration: 0.55, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Travelling dot — uses stroke-dashoffset trick, no offset-path */}
          {visible && (
            <motion.circle
              r={2.2}
              fill={color}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 1.6,
                delay: delay + 0.9,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: 'linear',
                times: [0, 0.05, 0.92, 1],
              }}
            >
              <animateMotion
                dur="1.6s"
                repeatCount="indefinite"
                begin={`${(delay + 0.9).toFixed(2)}s`}
                calcMode="linear"
              >
                <mpath href={`#path-${key}`} />
              </animateMotion>
            </motion.circle>
          )}

          {/* Named path for animateMotion */}
          {visible && (
            <path id={`path-${key}`} d={d} fill="none" stroke="none" />
          )}

          {/* Arrowhead at destination */}
          {lines.length > 0 && (() => {
            // Parse last point from d
            const parts = d.trim().split(' ');
            const lastY = parseFloat(parts[parts.length - 1]);
            const lastX = parseFloat(parts[parts.length - 2]);
            if (isNaN(lastX) || isNaN(lastY)) return null;
            return (
              <motion.polygon
                points={`${lastX - 3.5},${lastY - 6} ${lastX + 3.5},${lastY - 6} ${lastX},${lastY - 1}`}
                fill={color} fillOpacity={0.7}
                initial={{ opacity: 0 }}
                animate={{ opacity: visible ? 1 : 0 }}
                transition={{ delay: delay + 0.85, duration: 0.25 }}
              />
            );
          })()}
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Deploy card
// ─────────────────────────────────────────────────────────────────────────────

function DeployCard({ item, visible, delay }: { item: typeof DEPLOY[0]; visible: boolean; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, minWidth: 130,
        border: `1px solid ${hov ? item.color : item.color + '28'}`,
        borderRadius: 8, padding: '13px 15px',
        background: hov ? item.color + '0E' : 'rgba(11,20,16,0.5)',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s', cursor: 'default',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {hov && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${item.color}10, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>
          {item.label}
        </span>
        <span style={{
          fontSize: 9, color: item.color, background: item.color + '18',
          border: `1px solid ${item.color}35`, borderRadius: 3,
          padding: '1px 6px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
        }}>
          {item.stat}
        </span>
      </div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', fontFamily: 'JetBrains Mono, monospace' }}>
        {item.sub}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Live ticker
// ─────────────────────────────────────────────────────────────────────────────

const TICKS = [
  '● PASS 3/7: kernel fusion — 38/94 candidates fused',
  '● INT8 calibration: 2048 samples — accuracy 99.97%',
  '● CUDA graph capture: 1,847 nodes serialized',
  '● Latency benchmark: 11.6ms ↓ from 118.4ms (10.2×)',
  '● Artifact signed: sha256:3f9a8b2c → registry push',
  '● Cloud GPU H100: endpoint live — 8,900 req/s',
  '● Edge bundle: Jetson Orin · 67% memory reduction',
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx(p => (p + 1) % TICKS.length), 2600);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, overflow: 'hidden', minWidth: 0 }}>
      <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
        style={{ width: 5, height: 5, borderRadius: '50%', background: '#00FF85', flexShrink: 0 }}
      />
      <AnimatePresence mode="wait">
        <motion.span key={idx}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: 9.5, color: '#00FF85', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
        >
          {TICKS[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// useInView
// ─────────────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      e => { if (e[0].isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export default function TechDiagram() {
  const { ref: secRef, vis } = useInView(0.05);
  const stagesContainerRef   = useRef<HTMLDivElement>(null);

  const layers = ([0, 1, 2, 3] as const).map(li =>
    STAGES.filter(s => s.layer === li).sort((a, b) => a.col - b.col)
  );

  return (
    <section
      id="tech-diagram"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Static CSS grid background — zero JS, no performance hit */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,133,0.016) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,133,0.016) 1px, transparent 1px)
        `,
        backgroundSize: '36px 36px',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,133,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,133,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '180px 180px',
      }} />
      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 40%, transparent 35%, var(--bg-secondary) 88%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }} ref={secRef}>
        {/* Header */}
        <span className="section-label">// ARCHITECTURE</span>
        <h2 className="section-title reveal">QueryNexes Engine</h2>
        <p className="section-sub reveal" style={{ marginBottom: 36 }}>
          A four-layer compilation and optimization stack — raw model checkpoint to
          signed, hardware-tuned inference artifact — powered by NVIDIA TensorRT.
        </p>

        {/* Illustration strip */}
        <IllustrationStrip />

        {/* Main diagram */}
        <div style={{
          border: '1px solid rgba(30,46,38,0.9)',
          borderRadius: 14,
          padding: '28px 28px 24px',
          background: 'rgba(5,10,7,0.88)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Inner grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `linear-gradient(rgba(0,255,133,0.011) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,133,0.011) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }} />

          {/* Diagram header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 24, paddingBottom: 14, borderBottom: '1px solid rgba(0,255,133,0.07)',
          }}>
            <div>
              <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.22)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.16em', marginBottom: 4 }}>
                QUERYNEXES ENGINE — COMPILATION PIPELINE
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
                POWERED BY NVIDIA TENSORRT SDK · H100 / A100 BACKEND
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[['#00A854', 'IR Layer'], ['#2ED3FF', 'Optimize'], ['#FFB020', 'Runtime']].map(([col, lbl]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: col }} />
                  <span style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stages grid + connector overlay */}
          <div ref={stagesContainerRef} style={{ position: 'relative' }}>
            {/* Connector SVG — measured from real DOM positions */}
            <ConnectorOverlay containerRef={stagesContainerRef} visible={vis} />

            {/* Layer rows */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {layers.map((stagesInLayer, li) => {
                const meta = LAYER_META[li];
                return (
                  <div key={li}>
                    {/* Layer label */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: vis ? 1 : 0, x: vis ? 0 : -10 }}
                      transition={{ duration: 0.35, delay: li * 0.12 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}
                    >
                      <div style={{ width: 14, height: 1, background: meta.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 8, color: meta.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em', fontWeight: 700, flexShrink: 0 }}>
                        {meta.label}
                      </span>
                      <div style={{ flex: 1, height: 1, background: `${meta.color}18` }} />
                      <span style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.16)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'right', flexShrink: 0, maxWidth: 300, lineHeight: 1.4 }}>
                        {meta.desc}
                      </span>
                    </motion.div>
                    {/* Cards */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      {stagesInLayer.map((s, i) => (
                        <StageCard key={s.id} stage={s} visible={vis} delay={li * 0.15 + i * 0.08} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deploy targets */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,255,133,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 12, height: 1, background: 'rgba(255,255,255,0.18)' }} />
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em' }}>
                DEPLOYMENT TARGETS
              </span>
              <motion.span
                animate={{ x: [0, 5, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: 11, color: '#00FF85' }}
              >›</motion.span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {DEPLOY.map((item, i) => (
                <DeployCard key={item.id} item={item} visible={vis} delay={1.2 + i * 0.1} />
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            marginTop: 18, paddingTop: 14,
            borderTop: '1px solid rgba(0,255,133,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <LiveTicker />
            <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
              {[['COMPILER', 'v2.4.1'], ['BACKEND', 'TRT 9.2'], ['STATUS', 'NOMINAL']].map(([k, v], i) => (
                <div key={k} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>{k} </span>
                  <span style={{ color: i === 2 ? '#00FF85' : 'rgba(255,255,255,0.45)', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Corner brackets */}
          {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
            <div key={`${v}${h}`} style={{
              position: 'absolute', width: 14, height: 14,
              [v]: 0, [h]: 0,
              [`border${v[0].toUpperCase() + v.slice(1)}`]: '1.5px solid rgba(0,255,133,0.22)',
              [`border${h[0].toUpperCase() + h.slice(1)}`]: '1.5px solid rgba(0,255,133,0.22)',
              [`border${v[0].toUpperCase() + v.slice(1)}${h[0].toUpperCase() + h.slice(1)}Radius`]: 14,
            }} />
          ))}
        </div>

        {/* Summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, delay: 0.15 }}
          style={{
            marginTop: 16, display: 'flex', gap: 1,
            borderRadius: 10, overflow: 'hidden',
            border: '1px solid rgba(30,46,38,0.8)',
          }}
        >
          {[
            { label: 'INPUT',    sub: 'Any ML framework',      value: '23',    unit: 'formats',  color: '#334E3E' },
            { label: 'COMPILE',  sub: 'IR + graph passes',     value: '7',     unit: 'passes',   color: '#00FF85' },
            { label: 'OPTIMIZE', sub: 'Quantize · fuse · prune',value: '10.2', unit: '× faster', color: '#2ED3FF' },
            { label: 'DEPLOY',   sub: 'Signed artifact',       value: '150+',  unit: 'targets',  color: '#FFB020' },
          ].map(({ label, sub, value, unit, color }, i) => (
            <div key={label} style={{
              flex: 1, padding: '15px 18px',
              background: i % 2 === 0 ? 'rgba(5,10,7,0.85)' : 'rgba(8,14,10,0.85)',
              borderRight: '1px solid rgba(255,255,255,0.04)', position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg, transparent, ${color}45, transparent)` }} />
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, letterSpacing: '-0.01em' }}>{value}</div>
              <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{unit}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.26)', marginTop: 5 }}>{sub}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #tech-diagram { padding-left: 20px !important; padding-right: 20px !important; padding-top: 60px !important; }
        }
      `}</style>
    </section>
  );
}