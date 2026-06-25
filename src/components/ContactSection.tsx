import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Globe, Loader2 } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdvddgq';
const TURNSTILE_SITE_KEY = '0x4AAAAAADqKXzpi_-8ifkGC';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, any>) => string;
      getResponse: (widgetId?: string) => string;
      reset: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [captchaReady, setCaptchaReady] = useState(false);

  useEffect(() => {
    const container = turnstileRef.current;

    function renderTurnstile() {
      if (!container || !window.turnstile) return;
      try {
        const id = window.turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: () => setCaptchaReady(true),
        });
        widgetIdRef.current = id;
        console.log('[ContactSection] Turnstile rendered');
      } catch (e) {
        console.warn('[ContactSection] Turnstile render failed:', e);
      }
    }

    // If Turnstile API is already loaded, render immediately (handles SPA re-mount)
    if (window.turnstile) {
      renderTurnstile();
      return () => { widgetIdRef.current = null; };
    }

    // Otherwise set up the callback and add the script (first load)
    window.onloadTurnstileCallback = renderTurnstile;
    if (!document.querySelector('script[src*="turnstile/v0/api.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      window.onloadTurnstileCallback = undefined;
      widgetIdRef.current = null;
    };
  }, []);

  // Turnstile timeout fallback — button becomes clickable even if Turnstile never loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!captchaReady) {
        console.log('[ContactSection] Turnstile timed out, allowing submission without CAPTCHA');
        setCaptchaReady(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [captchaReady]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ContactSection] SUBMIT CLICKED');
    if (sending) {
      console.log('[ContactSection] already sending, ignoring');
      return;
    }

    const token = window.turnstile?.getResponse(widgetIdRef.current || undefined);
    if (token) {
      console.log('[ContactSection] TURNSTILE TOKEN: PRESENT');
    } else {
      console.log('[ContactSection] TURNSTILE TOKEN: MISSING — submitting without it');
    }

    setSending(true);
    setErrorMsg('');

    try {
      const data = new FormData(formRef.current!);
      if (token) {
        data.set('cf-turnstile-response', token);
        data.set('turnstile-response', token);
      }
      console.log('[ContactSection] FORM DATA READY, keys:', Array.from(data.keys()));

      console.log('[ContactSection] REQUEST SENT to Formspree');
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      const text = await res.text();
      let body: any = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = { raw: text };
      }

      console.log('[ContactSection] RESPONSE RECEIVED:', { ok: res.ok, status: res.status, body });

      if (res.ok) {
        setSubmitted(true);
        formRef.current?.reset();
        window.turnstile?.reset(widgetIdRef.current || undefined);
      } else {
        setErrorMsg(body?.error || body?.errors?.[0]?.message || `Server error (${res.status})`);
      }
    } catch (err) {
      console.error('[ContactSection] submission error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <section id="contact" ref={sectionRef} style={sectionStyle}>
        <div style={innerStyle}>
          <span className="section-label reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease', textAlign: 'center', display: 'block' as const }}>
            / CONTACT
          </span>
          <h2 className="section-title reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease', textAlign: 'center' }}>
            Thank you!
          </h2>
          <p className="reveal-item" style={{
            opacity: 0, transition: 'opacity 0.6s ease',
            fontSize: '14px', color: 'var(--text-secondary)',
            textAlign: 'center', maxWidth: '400px', margin: '0 auto', lineHeight: 1.65,
          }}>
            Your message has been sent successfully. Our team will contact you soon.
          </p>

          <div style={gridStyle} className="contact-grid">
            <div className="card" style={cardStyle}>
              <span style={labelStyle}>/ MESSAGE SENT</span>
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '12px',
                padding: '24px 0',
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  border: '1px solid var(--green-neon)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--green-neon)', fontSize: '18px', fontWeight: 700,
                }}>✓</div>
                <h3 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                  fontSize: '16px', color: 'var(--text-primary)', margin: 0,
                }}>We received your message</h3>
                <p style={{
                  fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0,
                }}>
                  A member of our engineering team will review your deployment needs and get back to you within 4 hours.
                </p>
              </div>
            </div>

            <CompanyDetails />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" ref={sectionRef} style={sectionStyle}>
      <div style={innerStyle}>
        <span className="section-label reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          / CONTACT
        </span>
        <h2 className="section-title reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          Get in Touch
        </h2>
        <p className="section-sub reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          Have a deployment in mind? Reach out to our engineering team for a technical assessment and platform demo.
        </p>

        <div style={gridStyle} className="contact-grid">
          <div className="card reveal-item" style={cardStyle}>
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <span style={labelStyle}>/ SEND A MESSAGE</span>

              {errorMsg && (
                <div style={errorBoxStyle}>
                  {errorMsg}
                </div>
              )}

              <Field label="NAME">
                <input name="name" required placeholder="Enter your name" style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--green-deep)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </Field>

              <Field label="EMAIL">
                <input name="email" type="email" required placeholder="Enter your email" style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--green-deep)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </Field>

              <Field label="MESSAGE">
                <textarea name="message" required rows={5}
                  placeholder="Describe your deployment or ask a technical question..." style={{ ...inputStyle, resize: 'vertical' as const }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--green-deep)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
              </Field>

              <div ref={turnstileRef} style={{ minHeight: '65px' }} />

              <button type="submit" className="btn-primary"
                disabled={sending || !captchaReady}
                style={{
                  padding: '12px 24px', fontSize: '14px', alignSelf: 'flex-start',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  opacity: sending ? 0.7 : 1,
                  cursor: sending ? 'not-allowed' : ('pointer' as const),
                }}>
                {sending ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Message →'}
              </button>
            </form>
          </div>

          <CompanyDetails />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          #contact { padding: 64px 24px !important; }
        }
        @media (max-width: 425px) {
          #contact { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #contact { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
        color: 'var(--text-muted)', letterSpacing: '0.1em',
        display: 'block', marginBottom: '6px',
      }}>{label}</label>
      {children}
    </div>
  );
}

function CompanyDetails() {
  const items = [
    { icon: MapPin, label: 'Office', value: '44 Montgomery St, San Francisco, CA 94104, USA' },
    { icon: Phone, label: 'Phone', value: '+1 (415) 521-9083' },
    { icon: Globe, label: 'Web', value: 'https://querynexes.com' },
  ];

  return (
    <div className="card reveal-item" style={{
      opacity: 0, transition: 'opacity 0.6s ease, border-color 0.12s ease, background 0.12s ease',
      padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px',
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
        color: 'var(--green-deep)', letterSpacing: '0.15em', display: 'block',
      }}>/ COMPANY DETAILS</span>

      <div>
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
          fontSize: '18px', color: 'var(--text-primary)', marginBottom: '6px',
        }}>QueryNexes Data Systems Inc.</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          Model Compilation and Optimization Platform
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{
              width: '36px', height: '36px', border: '1px solid var(--border-default)',
              borderRadius: '6px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--green-neon)', flexShrink: 0,
            }}>
              <item.icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                color: 'var(--text-muted)', letterSpacing: '0.1em',
                display: 'block', marginBottom: '2px',
              }}>{item.label}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '20px', marginTop: 'auto' }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          color: 'var(--text-disabled)', letterSpacing: '0.05em',
          display: 'block', marginBottom: '12px',
        }}>/ AVAILABILITY</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            width: '8px', height: '8px', background: 'var(--green-neon)',
            borderRadius: '1px', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--green-neon)' }}>
            ENGINEERING TEAM ONLINE — RESPONSE WITHIN 4H
          </span>
        </div>
      </div>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  padding: '96px 48px', background: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-default)',
};

const innerStyle: React.CSSProperties = {
  maxWidth: '1200px', margin: '0 auto',
};

const gridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px',
};

const cardStyle: React.CSSProperties = {
  opacity: 0, transition: 'opacity 0.6s ease, border-color 0.12s ease, background 0.12s ease',
  padding: '36px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
  color: 'var(--green-deep)', letterSpacing: '0.15em', display: 'block', marginBottom: '4px',
};

const errorBoxStyle: React.CSSProperties = {
  padding: '12px 14px', background: 'rgba(255, 70, 70, 0.1)',
  border: '1px solid rgba(255, 70, 70, 0.3)', borderRadius: '6px',
  fontSize: '13px', color: '#ff6b6b', lineHeight: 1.5,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: 'var(--bg-primary)',
  border: '1px solid var(--border-default)', borderRadius: '6px',
  fontFamily: 'Inter, sans-serif', fontSize: '14px',
  color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
};
