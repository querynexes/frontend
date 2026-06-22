import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { playTick } from '../utils/audio';

type Page = 'home' | 'product' | 'privacy' | 'terms';

export default function ProductPage({ onNavigate }: {
  onNavigate: (page: Page) => void;
}) {
  return (
    <>
      <Navbar currentPage="product" onNavigate={onNavigate} />
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 48px 80px',
          background: 'var(--bg-primary)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            border: '1.5px solid var(--green-neon)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 28 28">
            <path d="M14 3 L24 8.5 L24 19.5 L14 25 L4 19.5 L4 8.5 Z" stroke="var(--green-neon)" strokeWidth="1.5" fill="none" />
            <path d="M14 9 L19 12 L19 18 L14 21 L9 18 L9 12 Z" stroke="var(--green-deep)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            marginBottom: '16px',
          }}
        >
          QN_Core Platform
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-muted)',
            maxWidth: '500px',
            lineHeight: 1.7,
            marginBottom: '40px',
          }}
        >
          This page is under development. Our engineering team is building
          something powerful — check back soon for the full QN_Core experience.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="btn-primary"
            onMouseEnter={playTick}
            onClick={() => onNavigate('home')}
            style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '8px' }}
          >
            Go to Dashboard
          </button>

          <a
            href="#"
            onClick={e => { e.preventDefault(); onNavigate('home'); }}
            onMouseEnter={playTick}
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              border: '1px solid var(--border-default)',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-deep)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            Return Home
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
