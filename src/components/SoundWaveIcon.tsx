const bars = [
  { delay: 0, duration: 0.6, maxH: 14, minH: 3, muteH: 8 },
  { delay: 0.18, duration: 0.48, maxH: 11, minH: 2, muteH: 5 },
  { delay: 0.36, duration: 0.72, maxH: 16, minH: 4, muteH: 10 },
  { delay: 0.12, duration: 0.54, maxH: 10, minH: 2, muteH: 4 },
];

export default function SoundWaveIcon({ muted }: { muted: boolean }) {
  return (
    <div
      className="sound-wave-root"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2.5px',
        height: '16px',
        padding: '2px 0',
      }}
    >
      {bars.map((b, i) => (
        <div
          key={i}
          className={muted ? 'sound-bar-muted' : 'sound-bar-active'}
          style={{
            width: '3px',
            borderRadius: '2px',
            height: muted ? `${b.muteH}px` : undefined,
            animationDelay: muted ? '0s' : `${b.delay}s`,
            animationDuration: muted ? '0s' : `${b.duration}s`,
          }}
        />
      ))}

      {/* Mute slash overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: muted ? 1 : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none',
        }}
      >
        <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
          <line
            x1="1.5" y1="15" x2="16.5" y2="2"
            stroke="var(--text-disabled)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
