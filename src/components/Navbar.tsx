import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { playTick } from '../utils/audio';
import SoundWaveIcon from './SoundWaveIcon';
import logoLight from '../assets/logos/querynexes-logo.webp';

const SECTION_IDS = ['hero', 'features', 'simulation', 'pricing', 'faq', 'about', 'contact'];

type NavPage = 'home' | 'product' | 'privacy' | 'terms';

export default function Navbar({ currentPage, onNavigate, muted, onMuteToggle }: {
  currentPage?: NavPage;
  onNavigate?: (page: NavPage) => void;
  muted?: boolean;
  onMuteToggle?: () => void;
} = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ── Scroll / section tracking ────────────────────────────── */
  useEffect(() => {
    setActive(currentPage === 'home' ? 'hero' : '');
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      if (currentPage !== 'home') return;
      let current = 'hero';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPage]);

  /* ── Body scroll lock when mobile menu is open ────────────── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* ── Escape key closes the mobile menu ────────────────────── */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  /* ── Close menu when overlay backdrop is clicked ──────────── */
  const onOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setMobileOpen(false);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#features' },
    { label: 'Simulation', href: '#simulation' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (currentPage !== 'home') {
      onNavigate?.('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
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
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); scrollTo('#hero'); }}
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
          onMouseEnter={playTick}
        >
          <img
            src={logoLight}
            alt="QueryNexes"
            className="nav-logo-img"
            style={{ width: '120px', height: '120px', objectFit: 'contain' }}
          />
        </a>

        {/* Center links — hidden on mobile */}
        <ul style={{
          display: 'flex',
          gap: '36px',
          listStyle: 'none',
          alignItems: 'center',
        }} className="nav-desktop-links">
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                onMouseEnter={playTick}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '14px',
                  color: active === link.href.slice(1) ? 'var(--green-neon)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px',
                  transition: 'color 0.2s',
                }}
                className="nav-link-hover"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions — hidden on mobile */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} className="nav-desktop-actions">
          <button
            className="mute-btn"
            onClick={onMuteToggle}
            title={muted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            <SoundWaveIcon muted={!!muted} />
          </button>
          <button
            className="btn-primary"
            onMouseEnter={playTick}
            style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '6px' }}
            onClick={() => onNavigate?.('product')}
          >
            QueryNex One
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="nav-hamburger"
          aria-label="Open navigation menu"
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
        <div
          ref={overlayRef}
          onClick={onOverlayClick}
          className="nav-mobile-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="nav-overlay-close"
            aria-label="Close navigation menu"
          >
            <X size={28} />
          </button>

          <div className="nav-overlay-links">
            {navLinks.map((link, i) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                  className="nav-overlay-link"
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    color: isActive ? 'var(--green-neon)' : undefined,
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="nav-overlay-actions">
            <button
              className="mute-btn"
              onClick={onMuteToggle}
              title={muted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              <SoundWaveIcon muted={!!muted} />
            </button>
            <button
              className="btn-primary"
              onClick={() => onNavigate?.('product')}
            >
              QueryNex One
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* ── Desktop vs mobile nav visibility ───────────────── */
        .nav-desktop-links { display: flex; }
        .nav-desktop-actions { display: flex; }
        .nav-hamburger { display: none; }

        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-actions { display: none !important; }
          .nav-hamburger { display: inline-flex; }
          nav { padding: 0 20px !important; }
        }
        @media (max-width: 425px) {
          nav { padding: 0 12px !important; }
        }
        @media (max-width: 375px) {
          nav { padding: 0 8px !important; }
        }

        /* ── Responsive logo ────────────────────────────────── */
        .nav-logo-img {
          width: 120px !important;
          height: 120px !important;
        }
        @media (max-width: 425px) {
          .nav-logo-img {
            width: 96px !important;
            height: 96px !important;
          }
        }
        @media (max-width: 375px) {
          .nav-logo-img {
            width: 80px !important;
            height: 80px !important;
          }
        }

        /* ── Desktop link underline hover ───────────────────── */
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

        /* ── Mobile overlay — slide-in from right ───────────── */
        .nav-mobile-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg-primary);
          z-index: 9998;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          animation: navSlideIn 0.3s ease;
        }

        @keyframes navSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        .nav-overlay-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 12px; /* larger touch target */
          transition: color 0.2s;
        }
        .nav-overlay-close:hover {
          color: var(--text-primary);
        }

        .nav-overlay-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          padding: 80px 24px 40px;
          width: 100%;
        }

        .nav-overlay-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
          transition: color 0.2s;
          opacity: 0;
          animation: fadeInUp 0.4s ease forwards;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-overlay-link:hover {
          color: var(--green-neon);
        }

        .nav-overlay-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 12px;
          padding-bottom: 40px;
        }
        .nav-overlay-actions .mute-btn {
          width: 44px;
          height: 44px;
        }
        .nav-overlay-actions .btn-primary {
          padding: 14px 32px;
          font-size: 16px;
        }

        /* ── Overlay responsive tweaks ──────────────────────── */
        @media (max-width: 425px) {
          .nav-overlay-links { gap: 32px; }
          .nav-overlay-link  { font-size: 24px; }
        }
        @media (max-width: 375px) {
          .nav-overlay-links { gap: 24px; padding-top: 64px; }
          .nav-overlay-link  { font-size: 20px; }
          .nav-overlay-actions .btn-primary {
            padding: 12px 24px;
            font-size: 14px;
          }
          .nav-overlay-actions .mute-btn {
            width: 38px;
            height: 38px;
          }
        }
        @media (max-width: 320px) {
          nav { padding: 0 6px !important; }
          .nav-logo-img { width: 72px !important; height: 72px !important; }
          .nav-overlay-link { font-size: 18px; }
          .nav-overlay-links { gap: 20px; }
        }

        /* ── Sound wave bars (unchanged) ────────────────────── */
        @keyframes sound-wave-bar {
          0%, 100% { height: 3px; }
          25% { height: 14px; }
          50% { height: 6px; }
          75% { height: 11px; }
        }

        .sound-wave-container {
          opacity: 0.6;
          transition: opacity 0.25s ease;
        }
        .mute-btn:hover .sound-wave-container {
          opacity: 1;
        }

        .sound-bar-active {
          background: var(--green-neon);
          box-shadow: 0 0 5px color-mix(in srgb, var(--green-neon) 50%, transparent);
          animation: sound-wave-bar 0.6s ease-in-out infinite;
          transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      background 0.35s ease,
                      box-shadow 0.35s ease;
        }

        .sound-bar-muted {
          background: var(--text-disabled);
          box-shadow: none;
          animation: none !important;
          transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      background 0.35s ease,
                      box-shadow 0.35s ease;
        }

        /* ── Keyframes used by overlay ──────────────────────── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
