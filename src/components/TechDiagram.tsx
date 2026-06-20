import { useEffect, useRef, useState } from 'react';

interface DiagBox {
  id: string;
  label: string;
  accent?: boolean;
  delay: number;
}

const ROWS: DiagBox[][] = [
  [
    { id: 'ml-input', label: 'ML Model Input', accent: true, delay: 0 },
    { id: 'ir-compiler', label: 'IR Compiler', accent: true, delay: 100 },
    { id: 'graph-opt', label: 'Graph Optimizer', accent: true, delay: 200 },
  ],
  [
    { id: 'onnx-trt', label: 'ONNX / TRT', delay: 300 },
    { id: 'quantization', label: 'Quantization', delay: 400 },
    { id: 'kernel-fusion', label: 'Kernel Fusion', delay: 500 },
  ],
  [
    { id: 'hw-profile', label: 'Hardware Profile', delay: 600 },
    { id: 'tuned-runtime', label: 'Tuned Runtime', accent: true, delay: 700 },
    { id: 'placeholder', label: '', delay: 700 },
  ],
];

const DEPLOY_TARGETS: DiagBox[] = [
  { id: 'cloud', label: 'Cloud GPU', delay: 900 },
  { id: 'edge', label: 'Edge Device', delay: 1000 },
  { id: 'enterprise', label: 'Enterprise', delay: 1100 },
  { id: 'api', label: 'REST / gRPC API', accent: true, delay: 1200 },
];

function DiagBoxEl({ box }: { box: DiagBox }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), box.delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [box.delay]);

  if (!box.label) return <div style={{ flex: 1 }} />;

  return (
    <div
      ref={ref}
      style={{
        border: box.accent ? '1px solid var(--green-dark)' : '1px solid var(--border-default)',
        borderRadius: '8px',
        padding: '13px 18px',
        background: 'var(--bg-surface)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
        color: box.accent ? 'var(--green-stable)' : 'var(--text-secondary)',
        textAlign: 'center',
        transition: 'opacity 0.35s ease, transform 0.35s ease, border-color 0.12s ease, color 0.12s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(12px)',
        cursor: 'default',
        whiteSpace: 'nowrap',
        letterSpacing: '0.04em',
      }}
      onMouseOver={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-neon)';
        (e.currentTarget as HTMLElement).style.color = 'var(--green-neon)';
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLElement).style.borderColor = box.accent ? 'var(--green-dark)' : 'var(--border-default)';
        (e.currentTarget as HTMLElement).style.color = box.accent ? 'var(--green-stable)' : 'var(--text-secondary)';
      }}
    >
      {box.label}
    </div>
  );
}

export default function TechDiagram() {
  return (
    <section
      id="tech-diagram"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-secondary)',
        position: 'relative',
      }}
    >
      <span className="section-label">// ARCHITECTURE</span>
      <h2 className="section-title reveal">QueryNexes Engine</h2>
      <p className="section-sub reveal">
        A layered compilation and optimization stack built on NVIDIA SDK primitives,
        delivering consistent performance across every hardware target.
      </p>

      <div style={{
        border: '1px solid var(--border-default)',
        borderRadius: '16px',
        padding: '48px',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--glow-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--glow-grid) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          textAlign: 'center',
          marginBottom: '40px',
          textTransform: 'uppercase',
          position: 'relative',
        }}>
          QUERYNEXES ENGINE — POWERED BY NVIDIA SDK
        </div>

        {/* Row 1 */}
        {ROWS.map((row, ri) => (
          <div key={ri}>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              {row.map((box, bi) => (
                <div key={box.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: box.id === 'placeholder' ? 0 : 1 }}>
                  <DiagBoxEl box={box} />
                  {bi < row.length - 1 && box.id !== 'placeholder' && row[bi + 1].id !== 'placeholder' && (
                    <span style={{ color: 'var(--green-dark)', fontSize: '16px', flexShrink: 0 }}>→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Vertical connectors */}
            {ri < ROWS.length - 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: ri === 0 ? '130px' : '130px',
                padding: '4px 0',
                paddingLeft: ri === 1 ? '0' : '0',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 'calc(33.3% - 8px)',
                  }}>
                    <div style={{
                      width: '1px',
                      height: '24px',
                      background: 'var(--border-strong)',
                      position: 'relative',
                    }}>
                      <div style={{
                        content: '',
                        position: 'absolute',
                        bottom: '-5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '5px solid var(--green-dark)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Deploy section */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-default)', paddingTop: '24px' }}>
          <div style={{
            textAlign: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: 'var(--text-disabled)',
            letterSpacing: '0.15em',
            marginBottom: '16px',
          }}>
            DEPLOYMENT TARGETS
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {DEPLOY_TARGETS.map(box => (
              <DiagBoxEl key={box.id} box={box} />
            ))}
          </div>
        </div>

        {/* Heartbeat animation overlay */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-neon)', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-disabled)', letterSpacing: '0.1em' }}>SYSTEM NOMINAL</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #tech-diagram { padding-left: 20px !important; padding-right: 20px !important; }
          #tech-diagram .diag-inner { padding: 24px !important; }
        }
      `}</style>
    </section>
  );
}
