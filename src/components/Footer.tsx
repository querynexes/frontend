import { Linkedin, Facebook, Twitter, Youtube } from 'lucide-react';
import { playTick } from '../utils/audio';
import logoLight from '../assets/logos/querynexes-logo.webp';

type Page = 'home' | 'product' | 'privacy' | 'terms';

const LINKS = {
  Platform: ['Features', 'Simulation'],
  Resources: ['FAQ', 'Testimonials'],
  Company: ['About', 'Contact', 'Privacy Policy', 'Terms & Conditions'],
};

const HREF_MAP: Record<string, string> = {
  Features: '#features',
  Simulation: '#simulation',
  FAQ: '#faq',
  Testimonials: '#testimonials',
  About: '#about',
  Contact: '#contact',
};

const PAGE_MAP: Record<string, Page> = {
  'Privacy Policy': 'privacy',
  'Terms & Conditions': 'terms',
};

const SOCIALS = [
  { Icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/query-nexes/' },
  { Icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/QueryNexes/' },
  { Icon: Twitter, label: 'X', href: 'https://x.com/QueryNexes' },
  { Icon: null, label: 'Pinterest', href: 'https://www.pinterest.com/QueryNexes/' },
  { Icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@QueryNexes' },
];

export default function Footer({ onNavigate }: {
  onNavigate?: (page: Page) => void;
} = {}) {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const target = document.querySelector(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
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
            <img src={logoLight} alt="QueryNexes" loading="lazy" decoding="async" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
          </div>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: '24px',
            maxWidth: '260px',
          }}>
            The Model Compilation and Optimization Platform. Powered by a high-performance acceleration engine.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {SOCIALS.map(({ Icon, label, href }) => {
              const linkProps = {
                key: label,
                href,
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': label,
                onMouseEnter: playTick,
                style: {
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
                  cursor: 'pointer' as const,
                },
                onMouseOver: (e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-deep)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--green-neon)';
                },
                onMouseOut: (e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                },
              };
              return Icon ? (
                <a {...linkProps}>
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ) : (
                <a {...linkProps}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.372 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.628 0 12-5.372 12-12S18.628 0 12 0z"/>
                  </svg>
                </a>
              );
            })}
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
                const pageTarget = PAGE_MAP[link];
                return (
                  <li key={link}>
                    <a
                      href={pageTarget ? `/${pageTarget}` : href || '#'}
                      onClick={e => {
                        if (pageTarget) {
                          e.preventDefault();
                          onNavigate?.(pageTarget);
                        } else if (href) {
                          e.preventDefault();
                          scrollTo(href);
                        }
                      }}
                      onMouseEnter={playTick}
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        cursor: 'pointer',
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
          POWERED BY ACCELERATION ENGINE
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
        @media (max-width: 320px) {
          footer { padding: 24px 8px 16px !important; }
        }
      `}</style>
    </footer>
  );
}
