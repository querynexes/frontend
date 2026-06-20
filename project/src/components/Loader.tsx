import { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const LINES = [
  'INITIALIZING OPTIMIZATION ENGINE...',
  'LOADING NVIDIA SDK INTERFACES...',
  'CALIBRATING HARDWARE PROFILES...',
];

export default function Loader({ onComplete }: LoaderProps) {
  const [exiting, setExiting] = useState(false);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    // Title
    setTimeout(() => setShowTitle(true), 400);

    // Typewriter lines
    let idx1 = 0;
    const t1 = setInterval(() => {
      setLine1(LINES[0].slice(0, ++idx1));
      if (idx1 >= LINES[0].length) clearInterval(t1);
    }, 22);

    setTimeout(() => {
      let idx2 = 0;
      const t2 = setInterval(() => {
        setLine2(LINES[1].slice(0, ++idx2));
        if (idx2 >= LINES[1].length) clearInterval(t2);
      }, 22);
    }, LINES[0].length * 22 + 200);

    setTimeout(() => {
      let idx3 = 0;
      const t3 = setInterval(() => {
        setLine3(LINES[2].slice(0, ++idx3));
        if (idx3 >= LINES[2].length) clearInterval(t3);
      }, 22);
    }, (LINES[0].length + LINES[1].length) * 22 + 400);

    // Exit
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 850);
    }, 2800);

    return () => clearTimeout(exitTimer);
  }, [onComplete]);

  return (
    <div
      className="loader-overlay"
      style={{
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: exiting ? 'none' : 'all',
      }}
    >
      {/* Hex Logo */}
      <svg
        width="88" height="88"
        viewBox="0 0 88 88"
        style={{ animation: 'fadeIn 0.4s ease forwards' }}
      >
        <path
          d="M44 8 L76 26 L76 62 L44 80 L12 62 L12 26 Z"
          stroke="#00FF85" strokeWidth="2" fill="none"
          strokeDasharray="280" strokeDashoffset="280"
          style={{ animation: 'drawPath 1.3s 0.1s ease forwards' }}
        />
        <path
          d="M44 22 L62 32 L62 52 L44 62 L26 52 L26 32 Z"
          stroke="#00A854" strokeWidth="1.2" fill="none"
          strokeDasharray="200" strokeDashoffset="200"
          style={{ animation: 'drawPath 1.1s 0.4s ease forwards' }}
        />
        <circle cx="44" cy="44" r="6" fill="#00FF85" opacity="0"
          style={{ animation: 'fadeIn 0.5s 1.2s ease forwards' }}
        />
        <line x1="44" y1="38" x2="44" y2="8" stroke="#00FF85" strokeWidth="0.5" opacity="0.3"
          style={{ animation: 'fadeIn 0.5s 1.2s ease forwards' }}
        />
        <line x1="50" y1="41" x2="76" y2="26" stroke="#00FF85" strokeWidth="0.5" opacity="0.3"
          style={{ animation: 'fadeIn 0.5s 1.2s ease forwards' }}
        />
        <line x1="50" y1="47" x2="76" y2="62" stroke="#00FF85" strokeWidth="0.5" opacity="0.3"
          style={{ animation: 'fadeIn 0.5s 1.2s ease forwards' }}
        />
      </svg>

      {/* Title */}
      <div
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: '22px',
          letterSpacing: '0.32em',
          color: 'var(--text-primary)',
          opacity: showTitle ? 1 : 0,
          transform: showTitle ? 'none' : 'translateY(10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        QUERYNEXES
      </div>

      {/* Terminal lines */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        color: 'var(--green-deep)',
        textAlign: 'center',
        lineHeight: 2,
        minHeight: '60px',
        letterSpacing: '0.05em',
      }}>
        <div>{line1}{line1.length > 0 && line1.length < LINES[0].length && <span style={{ animation: 'blink 0.7s infinite' }}>_</span>}</div>
        <div style={{ color: 'var(--text-muted)' }}>{line2}{line2.length > 0 && line2.length < LINES[1].length && <span style={{ animation: 'blink 0.7s infinite' }}>_</span>}</div>
        <div style={{ color: '#3E4D45' }}>{line3}{line3.length > 0 && line3.length < LINES[2].length && <span style={{ animation: 'blink 0.7s infinite' }}>_</span>}</div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '300px',
        height: '2px',
        background: 'var(--bg-surface)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: '0%',
          background: 'var(--green-neon)',
          boxShadow: '0 0 10px var(--green-neon)',
          borderRadius: '2px',
          animation: 'fillBar 2.4s 0.3s ease forwards',
        }} />
      </div>

      {/* Version badge */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '10px',
        color: 'var(--text-disabled)',
        letterSpacing: '0.15em',
        position: 'absolute',
        bottom: '32px',
      }}>
        POWERED BY NVIDIA SDK · v3.1.0
      </div>

      {/* Scanline effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,133,0.012) 2px, rgba(0,255,133,0.012) 4px)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
