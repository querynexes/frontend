import { useEffect, useRef } from 'react';
import { Cpu, Layers, Zap, BarChart3, Package, Code2 } from 'lucide-react';
import { playTick } from '../utils/audio';

const FEATURES = [
  {
    icon: Cpu,
    title: 'Compilation Engine',
    desc: 'LLVM-based intermediate representation transforms any ML framework into hardware-optimized executables with full graph-level optimization and dead-code elimination.',
    stat: '↑ 12.4× AVERAGE INFERENCE SPEEDUP',
    config: '{ "ir": "mlir", "passes": ["fuse", "dce"] }',
  },
  {
    icon: Layers,
    title: 'Optimization Layer',
    desc: 'Automated quantization, structured pruning, and operator fusion — applied intelligently with accuracy preservation guarantees and sensitivity analysis.',
    stat: '↓ 67% AVERAGE MEMORY REDUCTION',
    config: '{ "quant": "int8", "prune": 0.3 }',
  },
  {
    icon: Zap,
    title: 'Hardware Acceleration',
    desc: 'Native compilation for NVIDIA TensorRT, Apple ANE, ARM NN, and 150+ cloud GPU targets. One codebase, any hardware target, zero manual tuning.',
    stat: '150+ HARDWARE TARGETS SUPPORTED',
    config: '{ "backend": "auto", "targets": 150 }',
  },
  {
    icon: BarChart3,
    title: 'Performance Intelligence',
    desc: 'Real-time profiling, latency decomposition, and bottleneck identification. Know exactly where your model spends compute cycles and why.',
    stat: '3.2ms MEDIAN INFERENCE LATENCY',
    config: '{ "profile": true, "sample_hz": 1000 }',
  },
  {
    icon: Package,
    title: 'Deployment Toolkit',
    desc: 'Validated containers, HELM charts, and deployment manifests for AWS, GCP, Azure, and on-premise Kubernetes clusters. Ship in minutes.',
    stat: '✓ 99.8% PRODUCTION UPTIME SLA',
    config: '{ "format": "oci", "helm": true }',
  },
  {
    icon: Code2,
    title: 'Enterprise API',
    desc: 'REST and gRPC APIs with webhooks, CI/CD integrations, audit logs, SSO, and dedicated enterprise SLA support channels for mission-critical workloads.',
    stat: '8,900+ REQ/S THROUGHPUT',
    config: '{ "proto": "grpc", "sso": true }',
  },
];

export default function FeaturesGrid() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const i = parseInt(el.dataset.cardIdx || '0');
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }, i * 90);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-primary)',
        position: 'relative',
      }}
    >
      <span className="section-label">// PLATFORM CAPABILITIES</span>
      <h2 className="section-title reveal">Engineering-Grade AI<br />Infrastructure</h2>
      <p className="section-sub reveal">
        Every component of QueryNexes is built for production workloads at enterprise scale.
        No compromises on accuracy, speed, or reliability.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
      }} className="features-responsive">
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              ref={el => (cardRefs.current[i] = el)}
              data-card-idx={i}
              className="card"
              onMouseEnter={playTick}
              style={{
                padding: '28px',
                position: 'relative',
                overflow: 'hidden',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'opacity 0.45s ease, transform 0.45s ease, border-color 0.12s ease, background 0.12s ease',
                cursor: 'default',
              }}
              onMouseOver={e => {
                const el = e.currentTarget as HTMLElement;
                const snippet = el.querySelector('.config-snippet') as HTMLElement;
                if (snippet) { snippet.style.maxHeight = '24px'; snippet.style.opacity = '1'; }
              }}
              onMouseOut={e => {
                const el = e.currentTarget as HTMLElement;
                const snippet = el.querySelector('.config-snippet') as HTMLElement;
                if (snippet) { snippet.style.maxHeight = '0px'; snippet.style.opacity = '0'; }
              }}
            >
              {/* Hidden config snippet — revealed on hover */}
              <div className="config-snippet" style={{
                position: 'absolute', top: '12px', right: '14px',
                maxHeight: '0px', opacity: 0, overflow: 'hidden',
                transition: 'max-height 0.15s ease, opacity 0.15s ease',
              }}>
                <code style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9.5px',
                  color: 'var(--green-stable)', whiteSpace: 'nowrap',
                }}>
                  {feat.config}
                </code>
              </div>

              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(0,168,84,0.1)',
                border: '1px solid var(--green-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Icon size={20} color="var(--green-neon)" strokeWidth={1.5} />
              </div>

              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '17px',
                color: 'var(--text-primary)',
                marginBottom: '10px',
              }}>
                {feat.title}
              </div>

              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: '18px',
              }}>
                {feat.desc}
              </p>

              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: 'var(--green-stable)',
                letterSpacing: '0.05em',
                borderTop: '1px solid var(--border-default)',
                paddingTop: '14px',
              }}>
                {feat.stat}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .features-responsive { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .features-responsive { grid-template-columns: 1fr !important; }
          #features { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </section>
  );
}
