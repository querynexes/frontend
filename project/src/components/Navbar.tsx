import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { playTick } from '../utils/audio';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#features' },
    { label: 'Solutions', href: '#features' },
    { label: 'Simulation', href: '#simulation' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#faq' },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: '0 48px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(5,10,7,0.88)' : 'rgba(5,10,7,0)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); scrollTo('#hero'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          onMouseEnter={playTick}
        >
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 3 L24 8.5 L24 19.5 L14 25 L4 19.5 L4 8.5 Z" stroke="#00FF85" strokeWidth="1.5" fill="none" />
            <path d="M14 9 L19 12 L19 18 L14 21 L9 18 L9 12 Z" stroke="#00A854" strokeWidth="1" fill="none" />
          </svg>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
          }}>
            QUERYNEXES
          </span>
        </a>

        {/* Center links */}
        <ul style={{
          display: 'flex',
          gap: '36px',
          listStyle: 'none',
          alignItems: 'center',
        }} className="hidden md:flex">
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                onMouseEnter={playTick}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px',
                  transition: 'color 0.2s',
                  cursor: 'none',
                }}
                className="nav-link-hover"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} className="hidden md:flex">
          <button
            onMouseEnter={playTick}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '14px',
              color: 'var(--text-muted)',
              cursor: 'none',
              padding: '8px 16px',
              transition: 'color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            Sign In
          </button>
          <button
            className="btn-primary"
            onMouseEnter={playTick}
            style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '6px' }}
            onClick={() => scrollTo('#pricing')}
          >
            Get Early Access
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-primary)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={28} />
          </button>

          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={e => { e.preventDefault(); scrollTo(link.href); }}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '28px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                opacity: 0,
                animation: `fadeInUp 0.4s ${i * 0.07}s ease forwards`,
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </a>
          ))}

          <button
            className="btn-primary"
            onClick={() => scrollTo('#pricing')}
            style={{ padding: '14px 32px', fontSize: '16px', marginTop: '12px' }}
          >
            Get Early Access
          </button>
        </div>
      )}

      <style>{`
        .nav-link-hover {
          position: relative;
        }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--green-neon);
          transition: width 0.25s ease;
        }
        .nav-link-hover:hover {
          color: var(--green-neon) !important;
        }
        .nav-link-hover:hover::after {
          width: 100%;
        }
        @media (max-width: 768px) {
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </>
  );
}
