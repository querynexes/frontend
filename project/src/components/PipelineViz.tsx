import { useEffect, useRef, useState } from 'react';
import { playTick } from '../utils/audio';

const STEPS = [
  {
    num: '01',
    icon: '⇥',
    name: 'Model Intake',
    desc: 'Connect your ML repository. Supports PyTorch, TF, ONNX, JAX, CoreML and 18 more frameworks.',
    detail: 'Git integration, S3, GCS, local upload. Automatic format detection and validation.',
  },
  {
    num: '02',
    icon: '⚙',
    name: 'Compilation Engine',
    desc: 'LLVM-based IR transform. Graph partitioning, operator fusion, and dead-code elimination.',
    detail: 'Full MLIR pipeline. Supports dynamic shapes, mixed precision, and custom ops.',
  },
  {
    num: '03',
    icon: '◈',
    name: 'Optimization Layer',
    desc: 'Quantization, pruning, kernel fusion. 99.97% accuracy preserved across all benchmark models.',
    detail: 'INT8/FP16 calibration with sensitivity analysis. Accuracy-loss budget enforcement.',
  },
  {
    num: '04',
    icon: '⬡',
    name: 'Hardware Tuner',
    desc: 'GPU / CPU / Edge targeting. NVIDIA TensorRT, Apple ANE, ARM NN, Intel Gaudi auto-selected.',
    detail: 'Auto-selects optimal backend per operator. Layer-wise hardware assignment.',
  },
  {
    num: '05',
    icon: '✓',
    name: 'Deploy Ready',
    desc: 'Validated, benchmarked artifact. Ships to cloud, edge, or enterprise targets as signed container.',
    detail: 'Benchmark report attached. Signed OCI image. HELM chart and deployment manifest included.',
  },
];

export default function PipelineViz() {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(Array(STEPS.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.stepIdx || '0');
            setTimeout(() => {
              setVisibleSteps(prev => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 120);
          }
        });
      },
      { threshold: 0.2 }
    );

    stepsRef.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pipeline"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* BG grid accent */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,255,133,0.025) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <span className="section-label">// HOW IT WORKS</span>
      <h2 className="section-title reveal">From Raw Model to<br />Production-Ready Asset</h2>
      <p className="section-sub reveal">
        Five deterministic stages transform your experimental checkpoint into a deployment-validated,
        hardware-tuned inference engine.
      </p>

      {/* Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0',
        position: 'relative',
        overflowX: 'auto',
        paddingBottom: '16px',
      }} className="pipeline-scroll">
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
            {/* Step box */}
            <div
              ref={el => (stepsRef.current[i] = el)}
              data-step-idx={i}
              style={{
                flex: 1,
                opacity: visibleSteps[i] ? 1 : 0,
                transform: visibleSteps[i] ? 'none' : 'translateY(24px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease',
                minWidth: 0,
              }}
            >
              <div
                onClick={() => { setActiveStep(activeStep === i ? null : i); playTick(); }}
                style={{
                  border: activeStep === i ? '1px solid var(--green-neon)' : '1px solid var(--border-default)',
                  borderRadius: '12px',
                  padding: '22px 18px',
                  background: activeStep === i ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  cursor: 'none',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: activeStep === i ? '0 0 24px rgba(0,255,133,0.12)' : 'none',
                }}
                onMouseEnter={e => {
                  if (activeStep !== i) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-dark)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
                  }
                  playTick();
                }}
                onMouseLeave={e => {
                  if (activeStep !== i) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }
                }}
              >
                {/* Glow overlay on active */}
                {activeStep === i && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(0,255,133,0.05), transparent)',
                    pointerEvents: 'none',
                  }} />
                )}

                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--text-disabled)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}>
                  STEP {step.num}
                </div>

                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(0,168,84,0.12)',
                  border: '1px solid var(--green-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  fontSize: '18px',
                  color: 'var(--green-neon)',
                  transition: 'all 0.3s',
                  boxShadow: activeStep === i ? '0 0 12px rgba(0,255,133,0.3)' : 'none',
                }}>
                  {step.icon}
                </div>

                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}>
                  {step.name}
                </div>

                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: activeStep === i ? '12px' : '0',
                }}>
                  {step.desc}
                </div>

                {/* Detail expansion */}
                <div style={{
                  maxHeight: activeStep === i ? '80px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease',
                  borderTop: activeStep === i ? '1px solid var(--border-default)' : 'none',
                  paddingTop: activeStep === i ? '10px' : '0',
                  marginTop: activeStep === i ? '10px' : '0',
                }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    color: 'var(--green-stable)',
                    letterSpacing: '0.04em',
                    lineHeight: 1.7,
                  }}>
                    {step.detail}
                  </div>
                </div>
              </div>
            </div>

            {/* Connector arrow */}
            {i < STEPS.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 4px',
                marginTop: '52px',
                flexShrink: 0,
                opacity: visibleSteps[i] && visibleSteps[i + 1] ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}>
                <svg width="44" height="2" viewBox="0 0 44 2" overflow="visible">
                  <line
                    x1="0" y1="1" x2="44" y2="1"
                    stroke="var(--green-dark)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="6 3"
                    style={{ animation: 'data-flow 2s linear infinite' }}
                  />
                  <polygon points="44,1 38,-2 38,4" fill="var(--green-dark)" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data packet traveling line */}
      <div style={{
        marginTop: '32px',
        padding: '16px 20px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'var(--green-deep)',
          letterSpacing: '0.1em',
        }}>
          PIPELINE STATUS
        </div>
        <div style={{ flex: 1, height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', position: 'relative', overflow: 'hidden', minWidth: '120px' }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: '100%',
            background: 'linear-gradient(90deg, var(--green-neon), var(--green-stable))',
            borderRadius: '2px',
            boxShadow: '0 0 8px var(--green-neon)',
          }} />
          <div style={{
            position: 'absolute',
            top: '-1px', bottom: '-1px',
            width: '20px',
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '2px',
            filter: 'blur(4px)',
            animation: 'scanline 1.8s linear infinite',
          }} />
        </div>
        {['INTAKE', 'COMPILE', 'OPTIMIZE', 'TUNE', 'DEPLOY'].map((s, i) => (
          <span key={s} style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: i < 3 ? 'var(--green-neon)' : 'var(--text-disabled)',
            letterSpacing: '0.08em',
          }}>
            {i > 0 ? '→ ' : ''}{s}
          </span>
        ))}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'var(--green-stable)',
          background: 'rgba(0,255,133,0.1)',
          border: '1px solid var(--green-dark)',
          padding: '3px 8px',
          borderRadius: '3px',
        }}>
          ✓ 99.97% ACCURACY
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pipeline-scroll {
            flex-direction: column !important;
            overflow-x: visible !important;
          }
          .pipeline-scroll > div {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
