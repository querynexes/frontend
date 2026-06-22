import { Github, Linkedin, Twitter } from 'lucide-react';
import { playTick } from '../utils/audio';

const LINKS = {
  Platform: ['Features', 'Simulation', 'Performance', 'API'],
  Solutions: ['Cloud AI', 'Edge AI', 'Enterprise', 'Research'],
  Resources: ['Documentation', 'SDK Reference', 'Blog', 'Status'],
  Company: ['About', 'Careers', 'Contact', 'Privacy'],
};

const HREF_MAP: Record<string, string> = {
  Features: '#features',
  Simulation: '#simulation',
  Performance: '#features',
  API: '#faq',
  Documentation: '#faq',
};

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-default)',
      padding: '72px 48px 32px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
        gap: '48px',
        marginBottom: '56px',
      }} className="footer-responsive">

        {/* Brand column */}
        <div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: '18px',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <svg width="22" height="22" viewBox="0 0 28 28">
              <path d="M14 3 L24 8.5 L24 19.5 L14 25 L4 19.5 L4 8.5 Z" stroke="var(--green-neon)" strokeWidth="1.5" fill="none" />
              <path d="M14 9 L19 12 L19 18 L14 21 L9 18 L9 12 Z" stroke="var(--green-deep)" strokeWidth="1" fill="none" />
            </svg>
            QUERYNEXES
          </div>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: '24px',
            maxWidth: '260px',
          }}>
            The AI Model Compilation &amp; Optimization Platform. Powered by NVIDIA SDK.
            Transform experimental models into production assets.
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { Icon: Github, label: 'GitHub' },
              { Icon: Linkedin, label: 'LinkedIn' },
              { Icon: Twitter, label: 'Twitter' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                onMouseEnter={playTick}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'none',
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-deep)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--green-neon)';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                }}
              >
                <Icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([col, links]) => (
          <div key={col}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {col}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.map(link => {
                const href = HREF_MAP[link];
                return (
                  <li key={link}>
                    <a
                      href={href || '#'}
                      onClick={e => { if (href) { e.preventDefault(); scrollTo(href); } }}
                      onMouseEnter={playTick}
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        cursor: 'none',
                        position: 'relative',
                        display: 'inline-block',
                        paddingBottom: '1px',
                      }}
                      onMouseOver={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                      onMouseOut={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                    >
                      {link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--border-default)',
        paddingTop: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'var(--text-disabled)',
          letterSpacing: '0.05em',
        }}>
          © 2025 QUERYNEXES, INC. ALL RIGHTS RESERVED.
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'var(--text-disabled)',
          letterSpacing: '0.05em',
        }}>
          POWERED BY NVIDIA SDK
        </span>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-responsive {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 768px) {
          .footer-responsive {
            grid-template-columns: 1fr !important;
          }
          footer { padding: 48px 24px 28px !important; }
        }
        @media (max-width: 425px) {
          footer { padding: 40px 16px 24px !important; }
        }
        @media (max-width: 375px) {
          footer { padding: 32px 12px 20px !important; }
        }
      `}</style>
    </footer>
  );
}
