import { useEffect, useState } from 'react';
import favicon from '../assets/favicons/favicon.webp';

interface LoaderProps {
  onComplete: () => void;
}

const LINES = [
  'INITIALIZING OPTIMIZATION ENGINE...',
  'LOADING ACCELERATION ENGINE INTERFACES...',
  'CALIBRATING HARDWARE PROFILES...',
];

export default function Loader({ onComplete }: LoaderProps) {
  const [exiting, setExiting] = useState(false);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');

  useEffect(() => {
    // Typewriter using requestAnimationFrame for smoothness
    let disposed = false;
    const totalChars = LINES.reduce((s, l) => s + l.length, 0);
    let typed = 0;
    const TYPING_SPEED = 18;

    const tick = () => {
      if (disposed) return;
      let remaining = typed;
      for (let i = 0; i < LINES.length; i++) {
        const len = LINES[i].length;
        if (remaining <= len) {
          if (i === 0) setLine1(LINES[0].slice(0, remaining));
          else if (i === 1) setLine2(LINES[1].slice(0, remaining));
          else if (i === 2) setLine3(LINES[2].slice(0, remaining));
          break;
        }
        remaining -= len;
      }
      typed++;
      if (typed <= totalChars + 6) {
        setTimeout(tick, TYPING_SPEED);
      }
    };
    tick();

    // Exit after all lines typed + brief pause
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 650);
    }, totalChars * TYPING_SPEED + 600);

    return () => { disposed = true; clearTimeout(exitTimer); };
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
      {/* Animated logo container */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '220px', height: '220px' }}>
        {/* Outer rotating ring */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'var(--green-neon)',
          borderRightColor: 'var(--green-deep)',
          animation: 'ringRotate 1.4s linear infinite',
        }} />
        {/* Inner counter-rotating ring */}
        <div style={{
          position: 'absolute', inset: '20px',
          borderRadius: '50%',
          border: '1.5px solid transparent',
          borderBottomColor: 'var(--glow-cyan)',
          borderLeftColor: 'var(--green-stable)',
          animation: 'ringRotateReverse 2s linear infinite',
        }} />
        {/* Pulsing glow */}
        <div style={{
          position: 'absolute', inset: '10px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,133,0.12) 0%, transparent 70%)',
          animation: 'pulseGlow 2s ease-in-out infinite',
        }} />
        {/* Favicon */}
        <img
          src={favicon}
          alt="QueryNexes"
          style={{
            width: '170px',
            height: '170px',
            objectFit: 'contain',
            opacity: 0,
            animation: 'fadeIn 0.6s 0.15s ease forwards',
            position: 'relative',
            zIndex: 1,
          }}
        />
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
        POWERED BY ACCELERATION ENGINE · v3.1.0
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
