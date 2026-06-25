import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'querynexes_cookie_consent';

type ConsentChoice = 'accepted' | 'declined' | null;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice | null;
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    setChoice(stored);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setChoice('accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setChoice('declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        maxWidth: '720px',
        width: 'calc(100% - 48px)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: 'fadeInUp 0.4s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(0,255,133,0.1)',
            border: '1px solid var(--green-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '14px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-neon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}
          >
            Cookie Preferences
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            We use essential cookies to ensure our platform functions properly and analytics cookies to improve your experience.{' '}
            <a
              href="/privacy"
              onClick={e => { e.preventDefault(); window.location.href = '/privacy'; }}
              style={{
                color: 'var(--green-neon)',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={handleDecline}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: '1px solid var(--border-default)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 500,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-deep)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
          onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="btn-primary"
          style={{
            padding: '10px 24px',
            fontSize: '13px',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
