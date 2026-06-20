import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { playTick } from '../utils/audio';

const PLANS = [
  {
    name: 'Starter',
    price: '299',
    period: 'per month',
    featured: false,
    features: [
      '500 model compilations/month',
      'GPU Cloud targets',
      'PyTorch, TensorFlow, ONNX',
      'Community support',
      'REST API access',
      'Standard SLA (99.5%)',
    ],
    cta: 'Get Started',
    ctaStyle: 'outline',
  },
  {
    name: 'Professional',
    price: '999',
    period: 'per month',
    featured: true,
    features: [
      '5,000 model compilations/month',
      'GPU Cloud + Edge targets',
      'All 23 supported frameworks',
      'Priority support (4hr response)',
      'REST + gRPC API + webhooks',
      'Performance SLA (99.8%)',
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'primary',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact for pricing',
    featured: false,
    features: [
      'Unlimited compilations',
      'Cloud + Edge + On-Prem',
      'Custom framework integrations',
      'Dedicated success engineer',
      'Full API + CI/CD + SSO',
      'Enterprise SLA (99.99%)',
    ],
    cta: 'Talk to Sales',
    ctaStyle: 'outline',
  },
];

export default function Pricing() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const i = parseInt(el.dataset.planIdx || '0');
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }, i * 100);
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
      id="pricing"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-primary)',
        position: 'relative',
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(0,255,133,0.08), transparent)',
        pointerEvents: 'none',
      }} />

      <span className="section-label">// PLANS &amp; PRICING</span>
      <h2 className="section-title reveal">Start at Any Scale</h2>
      <p className="section-sub reveal">
        From solo researchers to enterprise MLOps teams — QueryNexes adapts to your
        infrastructure and throughput requirements.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
      }} className="pricing-responsive">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            ref={el => (cardRefs.current[i] = el)}
            data-plan-idx={i}
            style={{
              background: 'var(--bg-surface)',
              border: plan.featured ? '1px solid var(--green-neon)' : '1px solid var(--border-default)',
              borderRadius: '16px',
              padding: '36px',
              position: 'relative',
              opacity: 0,
              transform: 'translateY(32px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              boxShadow: 'none',
            }}
          >
            {/* Most popular badge */}
            {plan.featured && (
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                background: 'var(--green-neon)',
                color: 'var(--bg-primary)',
                padding: '4px 12px',
                borderRadius: '100px',
                display: 'inline-block',
                marginBottom: '20px',
                textTransform: 'uppercase',
              }}>
                MOST POPULAR
              </div>
            )}

            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '22px',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              {plan.name}
            </div>

            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: plan.price === 'Custom' ? '32px' : '44px',
              color: 'var(--green-neon)',
              lineHeight: 1,
              marginBottom: '6px',
              marginTop: plan.price === 'Custom' ? '12px' : '0',
            }}>
              {plan.price !== 'Custom' && <sup style={{ fontSize: '24px', verticalAlign: 'top', marginTop: '8px' }}>$</sup>}
              {plan.price}
            </div>

            <div style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: '24px',
            }}>
              {plan.period}
            </div>

            <div style={{ height: '1px', background: 'var(--border-default)', marginBottom: '24px' }} />

            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '32px',
            }}>
              {plan.features.map(f => (
                <li key={f} style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  lineHeight: 1.5,
                }}>
                  <Check size={14} color="var(--green-stable)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={plan.ctaStyle === 'primary' ? 'btn-primary' : 'btn-outline'}
              onMouseEnter={playTick}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                justifyContent: 'center',
                borderRadius: '8px',
                border: plan.ctaStyle === 'outline' ? '1px solid var(--green-dark)' : 'none',
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .pricing-responsive { grid-template-columns: 1fr !important; max-width: 500px; margin: 0 auto; }
        }
        @media (max-width: 768px) {
          #pricing { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </section>
  );
}
