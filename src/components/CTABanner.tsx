import { useEffect, useRef } from 'react';
import { playTick } from '../utils/audio';

export default function CTABanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    
    let running = false;
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    const circles = Array.from({ length: 12 }).map((_, i) => ({
      x: (i / 12) * canvas.width,
      vy: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      r: 30 + Math.random() * 60,
    }));

    const draw = () => {
      if (!running) return;
      frameRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach((c, i) => {
        const x = c.x + Math.sin(t * 0.4 + c.phase) * 40;
        const y = canvas.height / 2 + Math.cos(t * 0.3 + i) * 50;
        ctx.beginPath();
        ctx.arc(x, y, c.r + Math.sin(t + i) * 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,80,40,0.25)';
        ctx.fill();
      });
      t += 0.008;
    };

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        running = true;
        resizeCanvas();
        draw();
      } else {
        running = false;
        cancelAnimationFrame(frameRef.current);
      }
    }, { threshold: 0 });
    obs.observe(section);
    
    running = true;
    draw();

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      obs.disconnect();
    };
  }, []);

  return (
    <section
      id="cta-banner"
      ref={sectionRef}
      style={{
        minHeight: '60vh',
        background: 'var(--green-neon)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,80,40,0.12) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,80,40,0.12) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Label */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'var(--green-dark)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <div style={{ width: '40px', height: '1px', background: 'var(--green-dark)' }} />
          QUERYNEXES PLATFORM
          <div style={{ width: '40px', height: '1px', background: 'var(--green-dark)' }} />
        </div>

        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(36px, 5vw, 60px)',
          color: 'var(--bg-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          lineHeight: 1.1,
        }}>
          Start Compiling.<br />Start Winning.
        </h2>

        <p style={{
          fontSize: '18px',
          color: 'var(--green-dark)',
          marginBottom: '44px',
          maxWidth: '480px',
          margin: '0 auto 44px',
          lineHeight: 1.6,
        }}>
          Deploy optimized models in minutes, not weeks.
          Zero configuration required.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#pricing"
            onClick={e => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
            onMouseEnter={playTick}
            style={{
              background: 'var(--bg-primary)',
              color: 'var(--green-neon)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              padding: '14px 28px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'none',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(5,10,7,0.3)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.transform = 'none';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            Start Free Trial
          </a>
          <a
            href="#faq"
            onClick={e => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }}
            onMouseEnter={playTick}
            style={{
              background: 'none',
              color: 'var(--bg-primary)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: '15px',
              padding: '13px 26px',
              borderRadius: '6px',
              border: '2px solid var(--bg-primary)',
              cursor: 'none',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => (e.currentTarget as HTMLElement).style.background = 'rgba(5,10,7,0.1)'}
            onMouseOut={e => (e.currentTarget as HTMLElement).style.background = 'none'}
          >
            View Documentation
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          gap: '48px',
          justifyContent: 'center',
          marginTop: '56px',
          flexWrap: 'wrap',
        }}>
          {[
            { val: '12.4×', label: 'FASTER INFERENCE' },
            { val: '847K+', label: 'MODELS OPTIMIZED' },
            { val: '99.8%', label: 'UPTIME SLA' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '32px',
                color: 'var(--bg-primary)',
                lineHeight: 1,
              }}>{s.val}</div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: 'var(--green-dark)',
                letterSpacing: '0.12em',
                marginTop: '4px',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #cta-banner { padding: 64px 24px !important; }
        }
        @media (max-width: 425px) {
          #cta-banner { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #cta-banner { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}
