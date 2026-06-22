import { useEffect, useRef } from 'react';

const TESTIMONIALS = [
  {
    quote: '"QueryNexes reduced our LLM inference latency from 340ms to 28ms. It\'s the only optimization platform that actually understands our hardware constraints and delivers on its promises."',
    author: 'Priya Nair',
    role: 'VP of AI Engineering, Axion Technologies',
  },
  {
    quote: '"We deployed optimized models to 12 different edge targets in a single afternoon. The compilation engine is genuinely remarkable engineering — nothing else comes close."',
    author: 'Marcus Chen',
    role: 'Head of MLOps, DeepScale Systems',
  },
  {
    quote: '"Enterprise AI deployments went from taking weeks to hours. QueryNexes is now a mandatory step in every production pipeline we operate at NovaStar."',
    author: 'Elena Kovač',
    role: 'Chief AI Officer, NovaStar Corp',
  },
];

export default function Testimonials() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const i = parseInt(el.dataset.testIdx || '0');
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }, i * 120);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-secondary)',
      }}
    >
      <span className="section-label">// WHAT TEAMS ARE SAYING</span>
      <h2 className="section-title reveal">Trusted by AI Engineering<br />Teams at Scale</h2>
      <p className="section-sub reveal">
        Production teams across cloud, edge, and enterprise deployments rely on
        QueryNexes every day.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
      }} className="test-responsive">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            ref={el => (cardRefs.current[i] = el)}
            data-test-idx={i}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderLeft: '3px solid var(--green-neon)',
              borderRadius: '12px',
              padding: '28px',
              opacity: 0,
              transform: 'translateY(24px)',
              transition: 'all 0.5s ease',
              cursor: 'default',
            }}
            onMouseOver={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--bg-elevated)';
              el.style.borderColor = 'var(--green-stable)';
              el.style.borderLeftColor = 'var(--green-neon)';
              (el.querySelector('.quote-text') as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseOut={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--bg-surface)';
              el.style.borderColor = 'var(--border-default)';
              el.style.borderLeftColor = 'var(--green-neon)';
              (el.querySelector('.quote-text') as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            {/* Stars */}
            <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
              {Array.from({ length: 5 }).map((_, si) => (
                <div key={si} style={{
                  width: '10px', height: '10px',
                  background: 'var(--green-neon)',
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                }} />
              ))}
            </div>

            <p
              className="quote-text"
              style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                fontStyle: 'italic',
                marginBottom: '22px',
                letterSpacing: '0.01em',
                transition: 'color 0.3s',
              }}
            >
              {t.quote}
            </p>

            <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--text-primary)',
                marginBottom: '2px',
              }}>
                {t.author}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}>
                {t.role}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .test-responsive { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          #testimonials { padding: 64px 24px !important; }
        }
        @media (max-width: 425px) {
          #testimonials { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #testimonials { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}
