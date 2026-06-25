import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { playTick } from '../utils/audio';
import img1 from '../assets/backgrounds/hero-1.png';
import img2 from '../assets/backgrounds/hero-2.png';
import img3 from '../assets/backgrounds/hero-3.png';
import img4 from '../assets/backgrounds/hero-4.png';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const IMAGES = [img1, img2, img3, img4];

const LOG_LINES = [
  { text: '$ querynexes compile --model resnet-x.pt', cls: 'cmd' },
  { text: 'Ingesting 7.3B parameter PyTorch model...', cls: 'out' },
  { text: 'Hardware mapping: NVIDIA H100... [SUCCESS]', cls: 'ok' },
  { text: 'Latency 118.4ms -> 11.6ms (10.2x)', cls: 'ok' },
];

type Page = 'home' | 'product' | 'privacy' | 'terms';

export default function CinematicHero({ onNavigate }: { onNavigate?: (page: Page) => void } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const metric1Ref = useRef<HTMLSpanElement>(null);
  const metric2Ref = useRef<HTMLSpanElement>(null);
  const metric3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const pinWrap = pinWrapRef.current;
      if (!section || !pinWrap) return;

      const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
      if (images.length === 0) return;

      gsap.set(images[0], { opacity: 1 });
      images.slice(1).forEach(img => gsap.set(img, { opacity: 0 }));

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${images.length * 100}%`,
        pin: pinWrap,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const segmentCount = images.length - 1;
          const raw = progress * segmentCount;
          const activeIdx = Math.min(Math.floor(raw), segmentCount - 1);
          const localT = raw - activeIdx;

          images.forEach((img, i) => {
            if (i === activeIdx) {
              gsap.set(img, { opacity: 1 - localT, scale: 1 + localT * 0.15, zIndex: 2 });
            } else if (i === activeIdx + 1) {
              gsap.set(img, { opacity: localT, scale: 1.05 - localT * 0.05, zIndex: 1 });
            } else {
              gsap.set(img, { opacity: 0 });
            }
          });
        },
      });

      return () => st.kill();
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = logRef.current;
      if (!container) return;
      const lineEls = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-log-line]'));
      const tl = gsap.timeline({ delay: 0.4, repeat: -1, repeatDelay: 1.6 });

      lineEls.forEach((el, i) => {
        const full = LOG_LINES[i].text;
        el.textContent = '';
        tl.to(el, {
          duration: Math.max(0.4, full.length * 0.018),
          text: full,
          ease: 'none',
        }, i === 0 ? 0 : '+=0.05');
      });
      tl.to({}, { duration: 1.4 });
      tl.call(() => lineEls.forEach(el => { el.textContent = ''; }));
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    function animateCounter(el: HTMLSpanElement | null, target: number, suffix: string, isFloat: boolean, duration = 1800) {
      if (!el) return;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val).toString()) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    const t = setTimeout(() => {
      animateCounter(metric1Ref.current, 94.2, '%', true);
      animateCounter(metric2Ref.current, 67, '%', false);
      animateCounter(metric3Ref.current, 99.8, '%', true);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const scrollToSim = () => {
    document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={sectionRef} style={{ position: 'relative' }}>
      <div
        ref={pinWrapRef}
        id="hero"
        style={{
          height: '100dvh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-primary)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {IMAGES.map((src, i) => (
            <div
              key={i}
              ref={el => (imageRefs.current[i] = el)}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>

        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(5,10,7,0.75) 38%, rgba(5,10,7,0.35) 60%, transparent 85%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, rgba(5,10,7,0.55) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        <div
          className="hero-fg"
          style={{
            position: 'relative',
            zIndex: 10,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '72px',
            paddingLeft: '48px',
            paddingRight: '48px',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="hero-glass"
            style={{
              maxWidth: '580px',
              width: '100%',
              maxHeight: 'calc(100dvh - 72px - 32px)',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              background: 'rgba(5,10,7,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '28px 32px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--border-default)',
              borderRadius: '4px',
              padding: '5px 12px',
              marginBottom: '14px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'var(--green-neon)',
              letterSpacing: '0.1em',
              background: 'rgba(0,255,133,0.04)',
            }}>
              <span style={{ width: '6px', height: '6px', background: 'var(--green-neon)', borderRadius: '1px', flexShrink: 0 }} />
              LIVE SYSTEM &nbsp;—&nbsp; COMPILER v2.4.1
            </div>

            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(28px, 3.6vw, 52px)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              marginBottom: '12px',
              color: 'var(--text-primary)',
            }}>
              The Model Compilation and{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span className="gradient-text">Optimization</span>
                <span style={{
                  position: 'absolute', bottom: '-3px', left: 0, right: 0, height: '1px',
                  background: 'linear-gradient(90deg, var(--green-neon), transparent)',
                }} />
              </span>{' '}
              Platform.
            </h1>

            <p style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '18px',
              letterSpacing: '0.01em',
            }}>
              Transform experimental ML models into production-ready,
              hardware-optimized assets for cloud, edge, and enterprise deployment.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onMouseEnter={playTick}
                onClick={() => onNavigate?.('product')}
                style={{ padding: '11px 22px', fontSize: '13px' }}
              >
                Explore QueryNex One
              </button>
              <a
                href="#simulation"
                onClick={e => { e.preventDefault(); scrollToSim(); }}
                className="btn-outline"
                onMouseEnter={playTick}
                style={{ padding: '10px 20px', fontSize: '13px', textDecoration: 'none' }}
              >
                View Simulation →
              </a>
            </div>

            <div style={{
              border: '1px solid var(--border-default)',
              borderRadius: '6px',
              background: 'rgba(11,20,16,0.7)',
              marginBottom: '18px',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 10px',
                borderBottom: '1px solid var(--border-default)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-error)' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-warn)' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-neon)' }} />
                <span style={{ marginLeft: '4px' }}>compile.log</span>
              </div>

              <div
                ref={logRef}
                className="hero-terminal"
                style={{
                  padding: '10px 14px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  lineHeight: 1.7,
                  height: '110px',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                {LOG_LINES.map((l, i) => (
                  <div
                    key={i}
                    data-log-line
                    style={{
                      height: '20px',
                      overflow: 'hidden',
                      color: l.cls === 'cmd'
                        ? 'var(--text-primary)'
                        : l.cls === 'ok'
                          ? 'var(--green-neon)'
                          : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  />
                ))}
                <span style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '10px',
                  background: 'var(--green-neon)',
                  animation: 'blink 1s step-end infinite',
                  verticalAlign: 'middle',
                  marginTop: '2px',
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              {[
                { ref: metric1Ref, suffix: '%', label: 'FASTER INFERENCE' },
                { ref: metric2Ref, suffix: '%', label: 'MEMORY REDUCTION' },
                { ref: metric3Ref, suffix: '%', label: 'UPTIME' },
              ].map((m, i) => (
                <div key={i} style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}>
                  <span ref={m.ref} style={{ color: 'var(--green-neon)', fontWeight: 600, fontSize: '14px' }}>0{m.suffix}</span>
                  <br />
                  <span style={{ fontSize: '9px', letterSpacing: '0.1em' }}>↑ {m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10,
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          color: 'var(--text-disabled)', letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
        }}>
          SCROLL — SEQUENCE {IMAGES.length} FRAMES
        </div>
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }

        .hero-glass::-webkit-scrollbar { display: none; }

        @media (max-width: 1024px) {
          .hero-glass {
            max-width: 440px !important;
            padding: 22px 24px !important;
          }
        }

        @media (max-width: 768px) {
          .hero-fg {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 64px !important;
            align-items: flex-start !important;
          }
          .hero-glass {
            max-width: 100% !important;
            padding: 20px !important;
            max-height: calc(100dvh - 64px - 16px) !important;
          }
          .hero-terminal {
            height: 96px !important;
          }
          .hero-terminal [data-log-line] {
            height: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
