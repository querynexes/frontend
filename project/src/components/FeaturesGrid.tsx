import { useEffect, useRef } from 'react';
import { Cpu, Layers, Zap, BarChart3, Package, Code2 } from 'lucide-react';
import { playTick } from '../utils/audio';

const FEATURES = [
  {
    icon: Cpu,
    title: 'Compilation Engine',
    desc: 'LLVM-based intermediate representation transforms any ML framework into hardware-optimized executables with full graph-level optimization and dead-code elimination.',
    stat: '↑ 12.4× AVERAGE INFERENCE SPEEDUP',
  },
  {
    icon: Layers,
    title: 'Optimization Layer',
    desc: 'Automated quantization, structured pruning, and operator fusion — applied intelligently with accuracy preservation guarantees and sensitivity analysis.',
    stat: '↓ 67% AVERAGE MEMORY REDUCTION',
  },
  {
    icon: Zap,
    title: 'Hardware Acceleration',
    desc: 'Native compilation for NVIDIA TensorRT, Apple ANE, ARM NN, and 150+ cloud GPU targets. One codebase, any hardware target, zero manual tuning.',
    stat: '150+ HARDWARE TARGETS SUPPORTED',
  },
  {
    icon: BarChart3,
    title: 'Performance Intelligence',
    desc: 'Real-time profiling, latency decomposition, and bottleneck identification. Know exactly where your model spends compute cycles and why.',
    stat: '3.2ms MEDIAN INFERENCE LATENCY',
  },
  {
    icon: Package,
    title: 'Deployment Toolkit',
    desc: 'Validated containers, HELM charts, and deployment manifests for AWS, GCP, Azure, and on-premise Kubernetes clusters. Ship in minutes.',
    stat: '✓ 99.8% PRODUCTION UPTIME SLA',
  },
  {
    icon: Code2,
    title: 'Enterprise API',
    desc: 'REST and gRPC APIs with webhooks, CI/CD integrations, audit logs, SSO, and dedicated enterprise SLA support channels for mission-critical workloads.',
    stat: '8,900+ REQ/S THROUGHPUT',
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
              onMouseEnter={playTick}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden',
                opacity: 0,
                transform: 'translateY(32px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s',
                cursor: 'default',
              }}
              onMouseOver={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--green-dark)';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,133,0.04)';
                const topBar = el.querySelector('.top-bar') as HTMLElement;
                if (topBar) topBar.style.background = 'linear-gradient(90deg, var(--green-neon), transparent)';
              }}
              onMouseOut={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border-default)';
                el.style.transform = 'none';
                el.style.boxShadow = 'none';
                const topBar = el.querySelector('.top-bar') as HTMLElement;
                if (topBar) topBar.style.background = 'transparent';
              }}
            >
              {/* Top accent bar */}
              <div className="top-bar" style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '2px',
                background: 'transparent',
                transition: 'background 0.3s',
              }} />

              {/* Inner grid accent */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(0,255,133,0.03) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />

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
