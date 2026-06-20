import { useEffect, useRef } from 'react';

const STATS = [
  { count: 847, suffix: 'K+', label: 'Models Optimized', desc: 'Compilation jobs processed' },
  { count: 12.4, suffix: '×', label: 'Avg. Speedup', desc: 'Inference acceleration', float: true },
  { count: 23, suffix: '', label: 'Frameworks', desc: 'Supported ML runtimes' },
  { count: 150, suffix: '+', label: 'Deploy Targets', desc: 'Hardware & cloud platforms' },
];

const FRAMEWORKS = ['PyTorch', 'TensorFlow', 'ONNX', 'TensorRT', 'JAX', 'CoreML', 'CUDA', 'OpenVINO', 'TFLite', 'PaddlePaddle', 'MXNet', 'Triton'];

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
        gap: '44px',
      }}
    >
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
                textShadow: '0 0 30px rgba(0,255,133,0.3)',
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
              transition: 'all 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--green-neon)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-dark)';
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
        }
      `}</style>
    </section>
  );
}
