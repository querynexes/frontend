import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';

// ── Data ──────────────────────────────────────────────
const POINTS = 24;
const W = 720;
const H = 200;
const PAD = { top: 12, bottom: 22, left: 42, right: 16 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;
const MAX_VAL = 150;
const Y_TICKS = [0, 50, 100, 150];
const X_LABELS = [
  { label: '00:00', idx: 0 },
  { label: '08:00', idx: 8 },
  { label: '16:00', idx: 16 },
  { label: '24:00', idx: 23 },
];

const PRE_DATA = [
  128, 135, 118, 142, 126, 119, 138, 131,
  124, 140, 115, 129, 133, 121, 136, 127,
  120, 132, 125, 139, 117, 130, 134, 122,
];

const OPT_DATA = [
  130, 98, 72, 48, 32, 22, 16, 13,
  12, 11, 12.5, 11.8, 12.2, 11.5, 12.8, 11.3,
  12.1, 11.7, 12.4, 11.9, 12.6, 11.6, 12.3, 11.8,
];

// ── Helpers ──────────────────────────────────────────
function toChartX(i: number) {
  return PAD.left + (i / (POINTS - 1)) * CHART_W;
}

function toChartY(v: number) {
  return PAD.top + CHART_H - (v / MAX_VAL) * CHART_H;
}

function buildLinePath(data: number[]) {
  return data
    .map((v, i) => {
      const x = toChartX(i);
      const y = toChartY(v);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function buildAreaPath(data: number[]) {
  const bottom = PAD.top + CHART_H;
  const pts = data
    .map((v, i) => `${toChartX(i).toFixed(1)} ${toChartY(v).toFixed(1)}`)
    .join(' L ');
  return `M ${toChartX(0)} ${bottom} L ${pts} L ${toChartX(POINTS - 1)} ${bottom} Z`;
}

function getValueAtX(data: number[], x: number) {
  const step = CHART_W / (POINTS - 1);
  const idx = (x - PAD.left) / step;
  const left = Math.max(0, Math.min(Math.floor(idx), POINTS - 2));
  const right = left + 1;
  const frac = idx - left;
  return data[left] * (1 - frac) + data[right] * frac;
}

// ── Animated Metric Card ─────────────────────────────
function AnimatedMetric({
  value,
  suffix,
  label,
  sublabel,
  decimals = 0,
  color,
}: {
  value: number;
  suffix: string;
  label: string;
  sublabel?: string;
  decimals?: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 50, damping: 25 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      mv.set(value);
      setHasAnimated(true);
    }
  }, [inView, mv, value, hasAnimated]);

  return (
    <div
      ref={ref}
      className="card"
      style={{
        flex: 1,
        padding: '18px 22px',
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
          display: 'block',
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <motion.span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '28px',
            fontWeight: 700,
            color: color || 'var(--green-neon)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {display}
        </motion.span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '15px',
            fontWeight: 500,
            color: color || 'var(--green-neon)',
            opacity: 0.65,
          }}
        >
          {suffix}
        </span>
      </div>
      {sublabel && (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: 'var(--text-disabled)',
            letterSpacing: '0.05em',
            marginTop: 5,
            display: 'block',
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────
export default function TelemetryDashboard() {
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-120px' });
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [gradientReady, setGradientReady] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setGradientReady(true), 1700);
      return () => clearTimeout(t);
    }
  }, [inView]);

  const prePath = buildLinePath(PRE_DATA);
  const optPath = buildLinePath(OPT_DATA);
  const areaPath = buildAreaPath(OPT_DATA);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    setMouseX(Math.max(PAD.left, Math.min(W - PAD.right, x)));
  }, []);

  const handleMouseLeave = useCallback(() => setMouseX(null), []);

  const crosshairData =
    mouseX !== null
      ? {
          pre: getValueAtX(PRE_DATA, mouseX),
          opt: getValueAtX(OPT_DATA, mouseX),
          delta: getValueAtX(PRE_DATA, mouseX) - getValueAtX(OPT_DATA, mouseX),
          x: mouseX,
        }
      : null;

  return (
    <section
      ref={sectionRef}
      id="telemetry-dashboard"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
        padding: '56px 48px',
      }}
    >
      <span className="section-label">Infrastructure Health</span>
      <h2 className="section-title" style={{ marginBottom: 36 }}>
        Inference Latency
      </h2>

      {/* Metric Cards */}
      <div
        style={{ display: 'flex', gap: 14, marginBottom: 24 }}
        className="td-metrics"
      >
        <AnimatedMetric
          value={12}
          suffix="ms"
          label="Avg Latency"
          sublabel="p50 · last 24h"
        />
        <AnimatedMetric
          value={84}
          suffix="%"
          label="Memory Reduction"
          sublabel="FP32 → INT8 quant"
        />
        <AnimatedMetric
          value={9.4}
          suffix="k req/s"
          label="Throughput"
          sublabel="~118× improvement"
          decimals={1}
        />
      </div>

      {/* Chart Panel */}
      <div
        className="card"
        style={{
          padding: '22px 24px 18px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            Response Time (ms)
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              color: 'var(--text-disabled)',
              letterSpacing: '0.12em',
            }}
          >
            REAL-TIME · 24H WINDOW
          </span>
        </div>

        {/* SVG */}
        <div style={{ position: 'relative' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            shapeRendering="geometricPrecision"
          >
            {/* Defs */}
            <defs>
              <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF85" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#00FF85" stopOpacity={0} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Y-axis labels */}
            {Y_TICKS.map((tick) => (
              <text
                key={`y-${tick}`}
                x={PAD.left - 8}
                y={toChartY(tick) + 3}
                textAnchor="end"
                fill="#3E4D45"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                style={{ letterSpacing: '0.05em' }}
              >
                {tick}
              </text>
            ))}

            {/* X-axis labels */}
            {X_LABELS.map((xl) => (
              <text
                key={`x-${xl.idx}`}
                x={toChartX(xl.idx)}
                y={H - 2}
                textAnchor="middle"
                fill="#3E4D45"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                style={{ letterSpacing: '0.05em' }}
              >
                {xl.label}
              </text>
            ))}

            {/* Horizontal gridlines */}
            {Y_TICKS.map((tick) => (
              <line
                key={`g-${tick}`}
                x1={PAD.left}
                x2={W - PAD.right}
                y1={toChartY(tick)}
                y2={toChartY(tick)}
                stroke="#1E2E26"
                strokeWidth={1}
              />
            ))}

            {/* Gradient area under optimized line */}
            <motion.path
              d={areaPath}
              fill="url(#optGrad)"
              initial={{ opacity: 0 }}
              animate={gradientReady ? { opacity: 1 } : {}}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />

            {/* Pre-optimization dashed line */}
            <motion.path
              d={prePath}
              fill="none"
              stroke="#6C7C73"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            />

            {/* Optimized solid green line */}
            <motion.path
              d={optPath}
              fill="none"
              stroke="#00FF85"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'circOut', delay: 0.2 }}
            />

            {/* Pulse dot reveal */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.8, duration: 0.35, ease: 'backOut' }}
            >
              <motion.circle
                cx={toChartX(POINTS - 1)}
                cy={toChartY(OPT_DATA[POINTS - 1])}
                r={4}
                fill="#00FF85"
                filter="url(#glow)"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.25, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.g>

            {/* Crosshair vertical line */}
            {crosshairData && (
              <line
                x1={crosshairData.x}
                x2={crosshairData.x}
                y1={PAD.top}
                y2={PAD.top + CHART_H}
                stroke="#2A3F34"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}

            {/* Crosshair hit markers */}
            {crosshairData && (
              <>
                <circle
                  cx={crosshairData.x}
                  cy={toChartY(crosshairData.pre)}
                  r={3}
                  fill="#6C7C73"
                  stroke="#0B1410"
                  strokeWidth={1}
                />
                <circle
                  cx={crosshairData.x}
                  cy={toChartY(crosshairData.opt)}
                  r={3}
                  fill="#00FF85"
                  stroke="#0B1410"
                  strokeWidth={1}
                />
              </>
            )}
          </svg>

          {/* Floating tooltip */}
          {crosshairData && (
            <div
              style={{
                position: 'absolute',
                left: `calc(${((crosshairData.x - PAD.left) / CHART_W) * 100}% + 14px)`,
                top: '40%',
                transform: 'translateY(-50%)',
                background: 'rgba(11, 20, 16, 0.92)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid var(--border-strong)',
                borderRadius: 6,
                padding: '10px 14px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                lineHeight: 1.7,
                pointerEvents: 'none',
                zIndex: 10,
                whiteSpace: 'nowrap',
                minWidth: 150,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <div
                style={{
                  color: 'var(--text-disabled)',
                  marginBottom: 3,
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                }}
              >
                AT CURSOR
              </div>
              <div style={{ color: '#6C7C73' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 1.5,
                    background: '#6C7C73',
                    marginRight: 6,
                    verticalAlign: 'middle',
                  }}
                />
                PRE-OPT: {crosshairData.pre.toFixed(1)}ms
              </div>
              <div style={{ color: '#00FF85' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 2.5,
                    background: '#00FF85',
                    marginRight: 6,
                    verticalAlign: 'middle',
                  }}
                />
                QUERYNEXES: {crosshairData.opt.toFixed(1)}ms
              </div>
              <div
                style={{
                  color: 'var(--green-neon)',
                  borderTop: '1px solid var(--border-default)',
                  marginTop: 5,
                  paddingTop: 5,
                  fontWeight: 600,
                }}
              >
                Δ SAVINGS: {crosshairData.delta.toFixed(1)}ms
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 14,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 1.5,
                background: '#6C7C73',
                marginRight: 6,
                verticalAlign: 'middle',
              }}
            />
            PRE-OPTIMIZATION — avg {(PRE_DATA.reduce((a, b) => a + b, 0) / PRE_DATA.length).toFixed(1)}ms
          </span>
          <span style={{ color: 'var(--green-neon)' }}>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 2.5,
                background: 'var(--green-neon)',
                marginRight: 6,
                verticalAlign: 'middle',
              }}
            />
            QUERYNEXES — avg {(OPT_DATA.reduce((a, b) => a + b, 0) / OPT_DATA.length).toFixed(1)}ms
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .td-metrics { flex-direction: column !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .td-metrics { flex-wrap: wrap !important; }
          .td-metrics > div { min-width: 200px !important; }
        }
      `}</style>
    </section>
  );
}
