import { useEffect, useState } from 'react';
import SimulationScene from './SimScene';

type SimMode = 'overview' | 'input' | 'process' | 'output';

const MODE_LABELS: Record<string, string> = {
  overview: 'OVERVIEW MODE',
  input: 'INPUT NODE — DETAIL',
  process: 'PROCESS NODE — DETAIL',
  output: 'OUTPUT NODE — DETAIL',
};

const MOBILE_BREAKPOINT = 768;

/** Tracks the mobile/desktop breakpoint reactively — fixes the original
 *  bug where `isMobile` was only read once at mount via window.innerWidth
 *  and never updated on resize/orientation change. */
function useIsMobile(breakpoint: number) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}

export default function SimulationPlatform() {
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);

  // SimulationScene mounts a real WebGL context + loads 3 glb models, so it
  // should only ever run on desktop. Keying on isMobile forces React to
  // unmount/remount cleanly if the viewport crosses the breakpoint instead
  // of leaving a stale renderer running.
  return isMobile
    ? <MobileNotice />
    : <DesktopSimulation key="desktop-sim" />;
}

function MobileNotice() {
  return (
    <section
      id="simulation"
      style={{ padding: '64px 20px', background: 'var(--bg-secondary)' }}
    >
      <span className="section-label">// LIVE SIMULATION</span>
      <h2 className="section-title reveal">See The Optimization Engine<br />in Action</h2>
      <p className="section-sub reveal">
        An interactive real-time 3D simulation of QueryNexes' model compilation
        and inference acceleration pipeline.
      </p>
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '16px', color: 'var(--green-neon)', marginBottom: '10px' }}>
          3D Simulation Available on Desktop
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Resize your browser to 768px+ to experience the interactive simulation
          of QueryNexes' optimization pipeline.
        </p>
      </div>
    </section>
  );
}

function DesktopSimulation() {
  const { canvasRef, mode, paused, switchMode, togglePause, detailInfo, loading, loadError } = SimulationScene();

  return (
    <section
      id="simulation"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="sim-section"
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

      <div style={{ textAlign: 'center' }}>
        <span className="section-label">// LIVE SIMULATION</span>
        <h2 className="section-title reveal">See The Optimization Engine<br />in Action</h2>
        <p className="section-sub reveal" style={{ margin: '0 auto 48px' }}>
          An interactive real-time 3D simulation of QueryNexes' model compilation
          and inference acceleration pipeline. Click any island to zoom in.
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px',
        justifyContent: 'center',
      }} className="sim-controls">
        {([
          { id: 'overview' as SimMode, label: '▶ OVERVIEW' },
          { id: 'input' as SimMode, label: '⇥ INPUT' },
          { id: 'process' as SimMode, label: '⚙ PROCESS' },
          { id: 'output' as SimMode, label: '✓ OUTPUT' },
        ] as { id: SimMode; label: string }[]).map(btn => {
          const isActive = mode === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => switchMode(btn.id)}
              disabled={loading}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '10px 16px',
                borderRadius: '6px',
                border: isActive ? '1px solid var(--green-neon)' : '1px solid var(--border-default)',
                background: isActive ? 'rgba(0,255,133,0.1)' : 'var(--bg-surface)',
                color: isActive ? 'var(--green-neon)' : 'var(--text-secondary)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.4 : 1,
                transition: 'all 0.15s ease',
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseOver={e => { if (!loading && !isActive) { e.currentTarget.style.borderColor = 'var(--green-deep)'; e.currentTarget.style.background = 'rgba(0,168,84,0.06)'; }}}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}}
            >
              {btn.label}
            </button>
          );
        })}
        <button
          onClick={togglePause}
          disabled={loading}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.4 : 1,
            transition: 'all 0.15s ease',
          }}
          onMouseOver={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--green-deep)'; e.currentTarget.style.background = 'rgba(0,168,84,0.06)'; }}}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
        >
          {paused ? '▶ PLAY' : '⏸ PAUSE'}
        </button>
        {mode !== 'overview' && (
          <button
            onClick={() => switchMode('overview')}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.08em',
              padding: '10px 16px',
              borderRadius: '6px',
              border: '1px solid var(--green-dark)',
              background: 'rgba(0,168,84,0.08)',
              color: 'var(--green-stable)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontWeight: 600,
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--green-neon)'; e.currentTarget.style.background = 'rgba(0,255,133,0.12)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--green-dark)'; e.currentTarget.style.background = 'rgba(0,168,84,0.08)'; }}
          >
            ← BACK
          </button>
        )}
      </div>

      <div className="sim-canvas-wrap" style={{
        width: '100%',
        height: '560px',
        borderRadius: '16px',
        border: '1px solid var(--border-default)',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg-primary)',
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Loading / error overlay */}
        {(loading || loadError) && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(5,10,7,0.9)',
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: loadError ? '#FF6B6B' : 'var(--green-neon)',
              textAlign: 'center',
              maxWidth: '320px',
              padding: '0 20px',
            }}>
              {loadError ?? 'LOADING ISLAND MODELS…'}
            </div>
          </div>
        )}

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

        {/* Rotation hint on overview */}
        {mode === 'overview' && !loading && !loadError && (
          <div style={{
            position: 'absolute',
            bottom: '66px',
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
            CLICK AN ISLAND TO INSPECT
          </div>
        )}

        {/* Rotation hint on detail mode */}
        {mode !== 'overview' && !loading && !loadError && (
          <div style={{
            position: 'absolute',
            bottom: '66px',
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
            animation: 'fadeIn 0.5s ease',
          }}>
            DRAG TO ROTATE · SCROLL TO ZOOM
          </div>
        )}

        {/* Detail panel */}
        {mode !== 'overview' && detailInfo.lines.length > 0 && (
          <div className="sim-detail-panel" style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(0deg, rgba(11,20,16,0.92) 0%, rgba(11,20,16,0.4) 100%)',
            borderTop: '1px solid var(--border-default)',
            padding: '12px 16px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.3s ease',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              color: 'var(--green-neon)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: '10px',
              fontWeight: 700,
              flexShrink: 0,
              paddingTop: '2px',
            }}>
              {detailInfo.title}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
              {detailInfo.lines.map(([k, v]) => (
                <div key={k} style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  display: 'flex',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ color: 'var(--green-stable)' }}>{v}</span>
                </div>
              ))}
            </div>

            {detailInfo.progress && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                {detailInfo.progress.map(p => (
                  <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{p.label}</span>
                    <div style={{ width: '50px', height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${p.pct}%`,
                        background: 'linear-gradient(90deg, var(--green-neon), var(--green-stable))',
                        borderRadius: '2px',
                        transition: 'width 1s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '9px', color: 'var(--green-neon)' }}>{p.pct}%</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto', flexShrink: 0 }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green-neon)', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: '8px', color: 'var(--green-stable)', letterSpacing: '0.1em' }}>ACTIVE</span>
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

      {/* Island legend */}
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

      <style>{`
        @media (max-width: 1024px) {
          .sim-section { padding-left: 32px !important; padding-right: 32px !important; }
        }
        @media (max-width: 768px) {
          .sim-section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 64px !important; }
          .sim-controls button { flex: 1 1 auto; font-size: 11px !important; padding: 9px 12px !important; }
          .sim-canvas-wrap { height: 420px !important; }
          .sim-detail-panel { width: 180px !important; right: 10px !important; padding: 14px !important; }
        }
      `}</style>
    </section>
  );
}