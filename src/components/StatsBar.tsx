import { useEffect, useRef } from 'react';

const STATS = [
  { count: 847, suffix: 'K+', label: 'Models Optimized', desc: 'Compilation jobs processed' },
  { count: 12.4, suffix: '×', label: 'Avg. Speedup', desc: 'Inference acceleration', float: true },
  { count: 23, suffix: '', label: 'Frameworks', desc: 'Supported ML runtimes' },
  { count: 150, suffix: '+', label: 'Deploy Targets', desc: 'Hardware & cloud platforms' },
];

const FRAMEWORKS = ['PyTorch', 'TensorFlow', 'ONNX', 'TensorRT', 'JAX', 'CoreML', 'CUDA', 'OpenVINO', 'TFLite', 'PaddlePaddle', 'MXNet', 'Triton'];

// Deterministic jagged baseline latency samples (ms), and flat optimized line.
const BASELINE_LATENCY = [118, 124, 96, 131, 108, 142, 99, 121, 137, 104, 119, 128, 95, 133, 112, 120];
const OPTIMIZED_LATENCY = BASELINE_LATENCY.map(() => 12 + (Math.random() * 1.4 - 0.7));

function buildPath(values: number[], w: number, h: number, max: number) {
  const step = w / (values.length - 1);
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)} ${(h - (v / max) * h).toFixed(1)}`)
    .join(' ');
}

function TelemetryChart() {
  const w = 560, h = 160, max = 150;
  const basePath = buildPath(BASELINE_LATENCY, w, h, max);
  const optPath = buildPath(OPTIMIZED_LATENCY, w, h, max);

  return (
    <div className="card" style={{ padding: '20px 24px', flex: '1 1 560px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '15px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}>
          Inference Latency
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'var(--text-disabled)',
          letterSpacing: '0.1em',
        }}>
          p50 / 24H WINDOW
        </span>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ overflow: 'visible' }}>
        {/* gridlines */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1={0} x2={w} y1={(h / 3) * i} y2={(h / 3) * i} stroke="#1E2E26" strokeWidth={1} />
        ))}
        {/* baseline — jagged, muted */}
        <path d={basePath} fill="none" stroke="#6C7C73" strokeWidth={1.5} />
        {/* optimized — flat, brand green */}
        <path d={optPath} fill="none" stroke="#00FF85" strokeWidth={1.5} />
      </svg>

      <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '1.5px', background: '#6C7C73', marginRight: '6px', verticalAlign: 'middle' }} />
          PRE-OPTIMIZATION — avg 118.4ms
        </span>
        <span style={{ color: 'var(--green-neon)' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '1.5px', background: 'var(--green-neon)', marginRight: '6px', verticalAlign: 'middle' }} />
          QUERYNEXES — avg 11.9ms
        </span>
      </div>
    </div>
  );
}

function TelemetryReadouts() {
  const rows = [
    { label: 'PEAK MEM (FP32)', value: '14.2 GB' },
    { label: 'PEAK MEM (INT8)', value: '4.6 GB' },
    { label: 'REDUCTION', value: '67.6%', accent: true },
    { label: 'THROUGHPUT', value: '2,140 req/s' },
  ];
  return (
    <div className="card" style={{ padding: '20px 24px', flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <span style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 600,
        fontSize: '15px',
        color: 'var(--text-primary)',
      }}>
        Memory Footprint
      </span>
      {rows.map(r => (
        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{r.label}</span>
          <span style={{ color: r.accent ? 'var(--green-neon)' : 'var(--text-secondary)' }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatsBar() {
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          const idx = parseInt(el.dataset.idx || '0');
          const stat = STATS[idx];
          if (!stat) return;

          const start = performance.now();
          const duration = 1800;
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val = stat.count * ease;
            el.textContent = (stat.float ? val.toFixed(1) : Math.round(val).toString()) + stat.suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );

    numRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats-bar"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
        padding: '56px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
      }}
    >
      {/* Live telemetry */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="telemetry-responsive">
        <TelemetryChart />
        <TelemetryReadouts />
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px',
        textAlign: 'center',
      }} className="stats-responsive">
        {STATS.map((stat, i) => (
          <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
            <span
              ref={el => (numRefs.current[i] = el)}
              data-idx={i}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(36px, 4vw, 48px)',
                color: 'var(--green-neon)',
                display: 'block',
                lineHeight: 1,
              }}
            >
              0{stat.suffix}
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: '6px',
              display: 'block',
            }}>
              {stat.label}
            </span>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginTop: '5px',
            }}>
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Framework badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'var(--text-disabled)',
          letterSpacing: '0.12em',
          marginRight: '8px',
        }}>SUPPORTED:</span>
        {FRAMEWORKS.map(fw => (
          <div
            key={fw}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-default)',
              padding: '5px 13px',
              borderRadius: '4px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.12s ease, color 0.12s ease, background 0.12s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--green-neon)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-deep)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(0,255,133,0.04)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {fw}
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-responsive { grid-template-columns: repeat(2, 1fr) !important; }
          .telemetry-responsive { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}
