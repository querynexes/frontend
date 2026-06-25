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
        <div style={{ textAlign: 'center' }}>
          <span className="section-label reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
            // ABOUT
          </span>
          <h2 className="section-title reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease', marginBottom: '16px' }}>
            The Model Compilation Engine
          </h2>
          <p className="section-sub reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease', marginBottom: '48px', maxWidth: '800px', margin: '0 auto 48px' }}>
            From research prototype to production deployment — QueryNexes bridges the gap with a hardware-aware compilation pipeline designed for the modern model optimization stack.
          </p>
        </div>

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
              title: 'Universal Model Optimization',
              desc: 'Make every model run at peak efficiency on any hardware, from cloud GPUs to edge NPUs, without manual tuning or framework lock-in.',
            },
            {
              label: '01. PIPELINE',
              title: 'Compile → Optimize → Deploy',
              desc: 'Models enter as PyTorch, TensorFlow, or ONNX. The engine applies MLIR-based graph transformations, operator fusion, and precision calibration — producing a hardware-native executable.',
            },
            {
              label: '02. IMPACT',
              title: 'Solving the Latency Wall',
              desc: 'Modern models waste 40 to 60% of compute cycles on redundant operations. QueryNexes eliminates that overhead through intelligent graph rewriting and memory planning.',
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0131710065175!2d-122.401906!3d37.7897311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858089d1655555%3A0xb38deb60ccb216f3!2s44%20Montgomery%20St%203rd%20floor%2C%20San%20Francisco%2C%20CA%2094104%2C%20USA!5e0!3m2!1sen!2slk!4v1782379853855!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ minHeight: '200px', border: 'none', display: 'block' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
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
          #about { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 425px) {
          #about { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #about { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}