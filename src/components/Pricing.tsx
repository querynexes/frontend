import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { playTick } from '../utils/audio';

// Updated data structure to handle dual pricing
const PLANS = [
  {
    name: 'Starter',
    prices: { monthly: '299', annually: '239' }, // ~20% discount for annual
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
    prices: { monthly: '999', annually: '799' },
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
    prices: { monthly: 'Custom', annually: 'Custom' },
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-primary)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center content naturally
      }}
    >
      {/* Glow accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(0,255,133,0.08), transparent)',
          pointerEvents: 'none',
        }}
      />

      <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>
        // PLANS &amp; PRICING
      </span>
      <h2 className="section-title reveal" style={{ textAlign: 'center', marginBottom: '16px' }}>
        Start at Any Scale
      </h2>
      <p className="section-sub reveal" style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '48px' }}>
        From solo researchers to enterprise MLOps teams — QueryNexes adapts to your
        infrastructure and throughput requirements.
      </p>

      {/* Modern Billing Toggle */}
      <div
        className="reveal"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '64px',
          background: 'var(--bg-secondary)',
          padding: '8px',
          borderRadius: '100px',
          border: '1px solid var(--border-default)',
        }}
      >
        <button
          onClick={() => setBillingCycle('monthly')}
          style={{
            padding: '10px 24px',
            borderRadius: '100px',
            border: 'none',
            background: billingCycle === 'monthly' ? 'var(--green-neon)' : 'transparent',
            color: billingCycle === 'monthly' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('annually')}
          style={{
            padding: '10px 24px',
            borderRadius: '100px',
            border: 'none',
            background: billingCycle === 'annually' ? 'var(--green-neon)' : 'transparent',
            color: billingCycle === 'annually' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Annually
          {/* Savings Badge directly in the toggle */}
          <span
            style={{
              background: billingCycle === 'annually' ? 'var(--bg-primary)' : 'var(--green-dark)',
              color: billingCycle === 'annually' ? 'var(--green-neon)' : 'var(--text-primary)',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '100px',
              fontWeight: 700,
            }}
          >
            Save 20%
          </span>
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          width: '100%',
          maxWidth: '1200px',
        }}
        className="pricing-responsive"
      >
        {PLANS.map((plan, i) => {
          const price = plan.prices[billingCycle];
          const isCustom = price === 'Custom';

          return (
            <div
              key={plan.name}
              ref={(el) => (cardRefs.current[i] = el)}
              data-plan-idx={i}
              style={{
                background: 'var(--bg-surface)',
                border: plan.featured ? '2px solid var(--green-neon)' : '1px solid var(--border-default)',
                borderRadius: '16px',
                padding: '40px 32px', // Slightly adjusted padding for visual balance
                position: 'relative',
                opacity: 0,
                transform: 'translateY(32px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease',
                boxShadow: plan.featured ? '0 8px 32px rgba(0, 255, 133, 0.1)' : 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {plan.featured && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    background: 'var(--green-neon)',
                    color: 'var(--bg-primary)',
                    padding: '6px 16px',
                    borderRadius: '100px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                {plan.name}
              </div>

              <div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: isCustom ? '32px' : '44px',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                  height: '44px', // Fixed height prevents layout shift when toggling
                }}
              >
                {!isCustom && (
                  <span style={{ fontSize: '24px', color: 'var(--text-secondary)' }}>$</span>
                )}
                {price}
              </div>

              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  marginBottom: '32px',
                  minHeight: '20px', // Prevents jumping
                }}
              >
                {isCustom ? 'contact for pricing' : `per month, billed ${billingCycle}`}
              </div>

              <div style={{ height: '1px', background: 'var(--border-default)', marginBottom: '32px' }} />

              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginBottom: '40px',
                  flexGrow: 1, // Pushes the button to the bottom if content heights vary
                  padding: 0,
                }}
              >
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: '15px',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      lineHeight: 1.5,
                    }}
                  >
                    <Check size={18} color="var(--green-neon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={plan.ctaStyle === 'primary' ? 'btn-primary' : 'btn-outline'}
                onMouseEnter={playTick}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: plan.ctaStyle === 'outline' ? '1px solid var(--border-default)' : 'none',
                  background: plan.ctaStyle === 'primary' ? 'var(--green-neon)' : 'transparent',
                  color: plan.ctaStyle === 'primary' ? 'var(--bg-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: 'auto',
                }}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .pricing-responsive { 
            grid-template-columns: repeat(2, 1fr) !important; 
          }
        }
        @media (max-width: 768px) {
          #pricing { 
            padding: 64px 20px !important; 
          }
          .pricing-responsive { 
            grid-template-columns: 1fr !important; 
            max-width: 450px !important; 
          }
        }
        @media (max-width: 425px) {
          #pricing { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #pricing { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}