import { useEffect, useRef } from 'react';
import { playTick } from '../utils/audio';
import iconCompilation from '../assets/icons/features/compilation-engine.webp';
import iconOptimization from '../assets/icons/features/optimization-layer.webp';
import iconAcceleration from '../assets/icons/features/hardware-acceleration.webp';
import iconPerformance from '../assets/icons/features/performance-intelligence.webp';
import iconDeployment from '../assets/icons/features/deployment-toolkit.webp';
import iconEnterprise from '../assets/icons/features/enterprise-api.webp';

const FEATURES = [
  {
    icon: iconCompilation,
    title: 'Compilation Engine',
    desc: 'LLVM-based intermediate representation transforms any ML framework into hardware-optimized executables with full graph-level optimization and dead-code elimination.',
    stat: '↑ 12.4× AVERAGE INFERENCE SPEEDUP',
    config: '{ "ir": "mlir", "passes": ["fuse", "dce"] }',
  },
  {
    icon: iconOptimization,
    title: 'Optimization Layer',
    desc: 'Automated quantization, structured pruning, and operator fusion — applied intelligently with accuracy preservation guarantees and sensitivity analysis.',
    stat: '↓ 67% AVERAGE MEMORY REDUCTION',
    config: '{ "quant": "int8", "prune": 0.3 }',
  },
  {
    icon: iconAcceleration,
    title: 'Hardware Acceleration',
    desc: 'Native compilation for TensorRT, Apple ANE, ARM NN, and 150+ cloud GPU targets. One codebase, any hardware target, zero manual tuning.',
    stat: '150+ HARDWARE TARGETS SUPPORTED',
    config: '{ "backend": "auto", "targets": 150 }',
  },
  {
    icon: iconPerformance,
    title: 'Performance Intelligence',
    desc: 'Real-time profiling, latency decomposition, and bottleneck identification. Know exactly where your model spends compute cycles and why.',
    stat: '3.2ms MEDIAN INFERENCE LATENCY',
    config: '{ "profile": true, "sample_hz": 1000 }',
  },
  {
    icon: iconDeployment,
    title: 'Deployment Toolkit',
    desc: 'Validated containers, HELM charts, and deployment manifests for cloud, GCP, Azure, and on-premise Kubernetes clusters. Ship in minutes.',
    stat: '✓ 99.8% PRODUCTION UPTIME SLA',
    config: '{ "format": "oci", "helm": true }',
  },
  {
    icon: iconEnterprise,
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
      <div style={{ textAlign: 'center' }}>
        <span className="section-label">// PLATFORM CAPABILITIES</span>
        <h2 className="section-title reveal">Engineering-Grade Model Optimization Infrastructure</h2>
        <p className="section-sub reveal" style={{ margin: '0 auto 64px' }}>
          Every component of QueryNexes is built for production workloads at enterprise scale.
          No compromises on accuracy, speed, or reliability.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
      }} className="features-responsive">
        {FEATURES.map((feat, i) => {
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
                cursor: 'pointer',
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

              <div className="feat-icon-wrap" style={{
                width: '80px',
                height: '80px',
                borderRadius: '14px',
                background: 'rgba(0,168,84,0.1)',
                border: '1px solid var(--green-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <img src={feat.icon} alt={feat.title} loading="lazy" decoding="async" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
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
        @media (max-width: 768px) {
          #features .card .feat-icon-wrap {
            width: 60px !important;
            height: 60px !important;
            border-radius: 12px !important;
          }
          #features .card .feat-icon-wrap img {
            width: 36px !important;
            height: 36px !important;
          }
        }
        @media (max-width: 640px) {
          .features-responsive { grid-template-columns: 1fr !important; }
          #features { padding: 64px 20px !important; }
        }
        @media (max-width: 425px) {
          #features { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #features { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}
