import SimulationScene from './SimScene';

type SimMode = 'overview' | 'input' | 'process' | 'output';

const MODE_LABELS: Record<string, string> = {
  overview: 'OVERVIEW MODE',
  input: 'INPUT NODE — DETAIL',
  process: 'PROCESS NODE — DETAIL',
  output: 'OUTPUT NODE — DETAIL',
};

export default function SimulationPlatform() {
  const { canvasRef, mode, paused, switchMode, togglePause, detailInfo } = SimulationScene();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section
      id="simulation"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,133,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <span className="section-label">// LIVE SIMULATION</span>
      <h2 className="section-title reveal">See The Optimization Engine<br />in Action</h2>
      <p className="section-sub reveal">
        An interactive real-time Three.js simulation of QueryNexes' model compilation
        and inference acceleration pipeline. Click any island to zoom in.
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {([
          { id: 'overview' as SimMode, label: '▶ OVERVIEW' },
          { id: 'input' as SimMode, label: '⇥ INPUT NODE' },
          { id: 'process' as SimMode, label: '⚙ PROCESS NODE' },
          { id: 'output' as SimMode, label: '✓ OUTPUT NODE' },
        ] as { id: SimMode; label: string }[]).map(btn => (
          <button
            key={btn.id}
            onClick={() => switchMode(btn.id)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.05em',
              padding: '10px 18px',
              borderRadius: '6px',
              border: mode === btn.id ? '1px solid var(--green-deep)' : '1px solid var(--border-default)',
              background: mode === btn.id ? 'rgba(0,255,133,0.07)' : 'var(--bg-surface)',
              color: mode === btn.id ? 'var(--green-neon)' : 'var(--text-secondary)',
              cursor: 'none',
              transition: 'all 0.2s',
            }}
          >
            {btn.label}
          </button>
        ))}
        <button
          onClick={togglePause}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            letterSpacing: '0.05em',
            padding: '10px 18px',
            borderRadius: '6px',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            cursor: 'none',
            transition: 'all 0.2s',
          }}
        >
          {paused ? '▶ PLAY' : '⏸ PAUSE'}
        </button>
        {mode !== 'overview' && (
          <button
            onClick={() => switchMode('overview')}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.05em',
              padding: '10px 18px',
              borderRadius: '6px',
              border: '1px solid var(--green-dark)',
              background: 'rgba(0,168,84,0.05)',
              color: 'var(--green-neon)',
              cursor: 'none',
              transition: 'all 0.2s',
            }}
          >
            ← BACK TO OVERVIEW
          </button>
        )}
      </div>

      {/* Mobile notice */}
      {isMobile ? (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px solid var(--border-default)',
          borderRadius: '12px',
          background: 'var(--bg-surface)',
        }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '16px', color: 'var(--green-neon)', marginBottom: '10px' }}>
            3D Simulation Available on Desktop
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Resize your browser to 768px+ to experience the interactive Three.js simulation
            of QueryNexes' optimization pipeline.
          </p>
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '560px',
          borderRadius: '16px',
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--bg-primary)',
        }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

          {/* Mode label */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'var(--text-muted)',
            background: 'rgba(5,10,7,0.85)',
            border: '1px solid var(--border-default)',
            padding: '6px 12px',
            borderRadius: '4px',
            letterSpacing: '0.1em',
            backdropFilter: 'blur(8px)',
          }}>
            {MODE_LABELS[mode]}
          </div>

          {/* Hint on overview */}
          {mode === 'overview' && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'var(--text-disabled)',
              letterSpacing: '0.1em',
              background: 'rgba(5,10,7,0.7)',
              padding: '6px 14px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
            }}>
              CLICK AN ISLAND TO INSPECT · USE CONTROLS ABOVE TO NAVIGATE
            </div>
          )}

          {/* Detail panel */}
          {mode !== 'overview' && detailInfo.lines.length > 0 && (
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '230px',
              background: 'rgba(11,20,16,0.92)',
              border: '1px solid var(--border-default)',
              borderRadius: '10px',
              padding: '18px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              backdropFilter: 'blur(16px)',
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{
                color: 'var(--green-neon)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '14px',
                fontSize: '10px',
                fontWeight: 700,
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: '10px',
              }}>
                {detailInfo.title}
              </div>

              {detailInfo.lines.map(([k, v]) => (
                <div key={k} style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '7px',
                  lineHeight: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}>
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{k}</span>
                  <span style={{ color: 'var(--green-stable)', textAlign: 'right' }}>{v}</span>
                </div>
              ))}

              {/* Progress bars (process mode) */}
              {detailInfo.progress && (
                <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-default)', paddingTop: '12px' }}>
                  {detailInfo.progress.map(p => (
                    <div key={p.label} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{p.label}</span>
                        <span style={{ fontSize: '10px', color: 'var(--green-neon)' }}>{p.pct}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${p.pct}%`,
                          background: 'linear-gradient(90deg, var(--green-neon), var(--green-stable))',
                          borderRadius: '2px',
                          boxShadow: '0 0 6px var(--green-neon)',
                          transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pulsing status dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', borderTop: '1px solid var(--border-default)', paddingTop: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-neon)', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
                <span style={{ fontSize: '9px', color: 'var(--green-stable)', letterSpacing: '0.1em' }}>SYSTEM ACTIVE</span>
              </div>
            </div>
          )}

          {/* Corner accents */}
          {['tl', 'tr', 'bl', 'br'].map(c => (
            <div key={c} style={{
              position: 'absolute',
              width: '18px', height: '18px',
              ...(c[0] === 't' ? { top: 0 } : { bottom: 0 }),
              ...(c[1] === 'l' ? { left: 0 } : { right: 0 }),
              borderTop: c[0] === 't' ? '2px solid var(--green-deep)' : 'none',
              borderBottom: c[0] === 'b' ? '2px solid var(--green-deep)' : 'none',
              borderLeft: c[1] === 'l' ? '2px solid var(--green-deep)' : 'none',
              borderRight: c[1] === 'r' ? '2px solid var(--green-deep)' : 'none',
            }} />
          ))}
        </div>
      )}

      {/* Island legend */}
      {!isMobile && (
        <div style={{
          display: 'flex',
          gap: '24px',
          marginTop: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'INPUT NODE', desc: 'Model Repository / Training Environment', color: 'var(--green-deep)' },
            { label: 'PROCESS NODE', desc: 'Compilation · Optimization · Acceleration', color: 'var(--green-neon)' },
            { label: 'OUTPUT NODE', desc: 'Cloud · Edge · Enterprise Deployment', color: 'var(--glow-cyan)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: item.color, letterSpacing: '0.1em' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          #simulation { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </section>
  );
}
