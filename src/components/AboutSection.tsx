import { useEffect, useRef } from 'react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-item').forEach((el, i) => {
              setTimeout(() => (el as HTMLElement).style.opacity = '1', i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: '96px 48px',
        background: 'var(--bg-primary)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <span className="section-label reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          / ABOUT
        </span>
        <h2 className="section-title reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          The AI Compilation Engine
        </h2>
        <p className="section-sub reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          From research prototype to production deployment — QueryNexes bridges the gap with a hardware-aware compilation pipeline designed for the modern AI stack.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px',
          marginBottom: '48px',
        }} className="about-grid">
          {[
            {
              label: 'VISION',
              title: 'Universal AI Optimization',
              desc: 'Make every AI model run at peak efficiency on any hardware, from cloud GPUs to edge NPUs, without manual tuning or framework lock-in.',
            },
            {
              label: '01. PIPELINE',
              title: 'Compile → Optimize → Deploy',
              desc: 'Models enter as PyTorch, TensorFlow, or ONNX. The engine applies MLIR-based graph transformations, operator fusion, and precision calibration — producing a hardware-native executable.',
            },
            {
              label: '02. IMPACT',
              title: 'Solving the Latency Wall',
              desc: 'Modern AI models waste 40-60% of compute cycles on redundant operations. QueryNexes eliminates that overhead through intelligent graph rewriting and memory planning.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="card reveal-item"
              style={{
                opacity: 0,
                transition: 'opacity 0.6s ease, border-color 0.12s ease, background 0.12s ease',
                padding: '32px',
              }}
            >
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: 'var(--green-deep)',
                letterSpacing: '0.15em',
                display: 'block',
                marginBottom: '12px',
              }}>
                {item.label}
              </span>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }} className="about-bottom-grid">
          <div
            className="card reveal-item"
            style={{
              opacity: 0,
              transition: 'opacity 0.6s ease, border-color 0.12s ease, background 0.12s ease',
              padding: '32px',
            }}
          >
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'var(--green-deep)',
              letterSpacing: '0.15em',
              display: 'block',
              marginBottom: '16px',
            }}>
              / DEPLOYMENT TARGETS
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[
                'NVIDIA H100 / A100',
                'AMD MI300',
                'Apple M3 / ANE',
                'ARM Cortex / Ethos',
                'Intel Gaudi 3',
                'Google TPU v5',
                'Qualcomm Hexagon',
                'AWS Inferentia',
              ].map(target => (
                <span key={target} style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-deep)'; (e.currentTarget as HTMLElement).style.color = 'var(--green-neon)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  {target}
                </span>
              ))}
            </div>
          </div>

          <div
            className="card reveal-item"
            style={{
              opacity: 0,
              transition: 'opacity 0.6s ease, border-color 0.12s ease, background 0.12s ease',
              padding: '0',
              overflow: 'hidden',
            }}
          >
            <iframe
              title="QueryNexes Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019640085158!2d-122.4015!3d37.7898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807f4f4f4f4f%3A0x4f4f4f4f4f4f4f4f!2s44%20Montgomery%20St%2C%20San%20Francisco%2C%20CA%2094104!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ minHeight: '200px', border: 'none', display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .about-grid { grid-template-columns: 1fr 1fr !important; }
          .about-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </section>
  );
}
