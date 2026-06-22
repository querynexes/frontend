import { useEffect, useRef } from 'react';
import AccordionGallery from './AccordionGallery'; // Adjust path based on your folder structure

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
        <h2 className="section-title reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease', marginBottom: '16px' }}>
          The AI Compilation Engine
        </h2>
        <p className="section-sub reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease', marginBottom: '48px', maxWidth: '800px' }}>
          From research prototype to production deployment — QueryNexes bridges the gap with a hardware-aware compilation pipeline designed for the modern AI stack.
        </p>

        {/* The New Interactive Gallery Component */}
        <div className="reveal-item" style={{ opacity: 0, transition: 'opacity 0.8s ease' }}>
          <AccordionGallery />
        </div>

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
              src="https://maps.google.com/maps?q=Colombo&t=&z=13&ie=UTF8&iwloc=&output=embed"
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