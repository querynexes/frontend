import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Globe, Loader2 } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdarakoa';

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const form = formRef.current;
      if (!form) throw new Error('Form not found');

      const data = new FormData(form);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Server error');
      }
    } catch {
      setErrorMessage('Something went wrong while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        padding: '96px 48px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-default)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <span className="section-label reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          / CONTACT
        </span>
        <h2 className="section-title reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          Get in Touch
        </h2>
        <p className="section-sub reveal-item" style={{ opacity: 0, transition: 'opacity 0.6s ease' }}>
          Have a deployment in mind? Reach out to our engineering team for a technical assessment and platform demo.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
        }} className="contact-grid">
          {/* Form */}
          <div
            className="card reveal-item"
            style={{
              opacity: 0,
              transition: 'opacity 0.6s ease, border-color 0.12s ease, background 0.12s ease',
              padding: '36px',
            }}
          >
            {submitted ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                textAlign: 'center',
                gap: '16px',
              }}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="var(--green-neon)" strokeWidth="2" fill="none" />
                  <path d="M16 24 L22 30 L33 18" stroke="var(--green-neon)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '20px',
                  color: 'var(--text-primary)',
                }}>
                  Thank you!
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  maxWidth: '320px',
                  lineHeight: 1.65,
                }}>
                  Your message has been sent successfully. Our team will contact you soon.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--green-deep)',
                  letterSpacing: '0.15em',
                  display: 'block',
                  marginBottom: '4px',
                }}>
                  / SEND A MESSAGE
                </span>
                {errorMessage && (
                  <div style={{
                    padding: '12px 14px',
                    background: 'rgba(255, 70, 70, 0.1)',
                    border: '1px solid rgba(255, 70, 70, 0.3)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#ff6b6b',
                    lineHeight: 1.5,
                  }}>
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    NAME
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--green-deep)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                  />
                </div>
                <div>
                  <label style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    EMAIL
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--green-deep)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                  />
                </div>
                <div>
                  <label style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    MESSAGE
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your deployment or ask a technical question..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--green-deep)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                  ) : (
                    'Send Message →'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Company Details */}
          <div
            className="card reveal-item"
            style={{
              opacity: 0,
              transition: 'opacity 0.6s ease, border-color 0.12s ease, background 0.12s ease',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'var(--green-deep)',
              letterSpacing: '0.15em',
              display: 'block',
            }}>
              / COMPANY DETAILS
            </span>

            <div>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}>
                QueryNexes Data Systems Inc.
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
              }}>
                AI Model Compilation &amp; Optimization Platform
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: MapPin, label: 'Office', value: '44 Montgomery St, San Francisco, CA 94104, USA' },
                { icon: Phone, label: 'Phone', value: '+1 (415) 521-9083' },
                { icon: Globe, label: 'Web', value: 'https://querynexes.com' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid var(--border-default)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--green-neon)',
                    flexShrink: 0,
                  }}>
                    <item.icon size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '9px',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.1em',
                      display: 'block',
                      marginBottom: '2px',
                    }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.5,
                    }}>
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid var(--border-default)',
              paddingTop: '20px',
              marginTop: 'auto',
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: 'var(--text-disabled)',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '12px',
              }}>
                / AVAILABILITY
              </span>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: 'var(--green-neon)',
                  borderRadius: '1px',
                  animation: 'pulse 2s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: 'var(--green-neon)',
                }}>
                  ENGINEERING TEAM ONLINE — RESPONSE WITHIN 4H
                </span>
              </div>
            </div>
          </div>
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
