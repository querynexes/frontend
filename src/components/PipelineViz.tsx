import { useEffect, useRef, useState } from 'react';
import { playTick } from '../utils/audio';
import intakeIcon from '../assets/icons/pipeline/model-intake.png';
import compileIcon from '../assets/icons/pipeline/compilation-engine.png';
import optimizeIcon from '../assets/icons/pipeline/optimization-layer.png';
import tunerIcon from '../assets/icons/pipeline/hardware-tuner.png';
import deployIcon from '../assets/icons/pipeline/deploy-ready.png';

const STEPS = [
  {
    num: '01',
    icon: intakeIcon,
    name: 'Model Intake',
    desc: 'Connect your ML repository. Supports PyTorch, TF, ONNX, JAX, CoreML and 18 more frameworks.',
    detail: 'Git integration, S3, GCS, local upload. Automatic format detection and validation.',
    config: '{ "source": "s3://models/", "format": "auto" }',
  },
  {
    num: '02',
    icon: compileIcon,
    name: 'Compilation Engine',
    desc: 'LLVM-based IR transform. Graph partitioning, operator fusion, and dead-code elimination.',
    detail: 'Full MLIR pipeline. Supports dynamic shapes, mixed precision, and custom ops.',
    config: '{ "pass": "mlir-opt", "fuse_ops": true }',
  },
  {
    num: '03',
    icon: optimizeIcon,
    name: 'Optimization Layer',
    desc: 'Quantization, pruning, kernel fusion. 99.97% accuracy preserved across all benchmark models.',
    detail: 'INT8/FP16 calibration with sensitivity analysis. Accuracy-loss budget enforcement.',
    config: '{ "precision": "int8", "max_drop": 0.05 }',
  },
  {
    num: '04',
    icon: tunerIcon,
    name: 'Hardware Tuner',
    desc: 'GPU / CPU / Edge targeting. NVIDIA TensorRT, Apple ANE, ARM NN, Intel Gaudi auto-selected.',
    detail: 'Auto-selects optimal backend per operator. Layer-wise hardware assignment.',
    config: '{ "target": "auto", "backend": "tensorrt" }',
  },
  {
    num: '05',
    icon: deployIcon,
    name: 'Deploy Ready',
    desc: 'Validated, benchmarked artifact. Ships to cloud, edge, or enterprise targets as signed container.',
    detail: 'Benchmark report attached. Signed OCI image. HELM chart and deployment manifest included.',
    config: '{ "artifact": "oci", "sign": true }',
  },
];

export default function PipelineViz() {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
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
            }, idx * 100);
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
      style={{ padding: '96px 48px', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}
    >
      <span className="section-label">// HOW IT WORKS</span>
      <h2 className="section-title reveal">From Raw Model to<br />Production-Ready Asset</h2>
      <p className="section-sub reveal">
        Five deterministic stages transform your experimental checkpoint into a deployment-validated,
        hardware-tuned inference engine.
      </p>

      {/* Steps */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative',
        overflowX: 'auto', paddingBottom: '16px',
      }} className="pipeline-scroll">
        {STEPS.map((step, i) => {
          const isActive = activeStep === i;
          const isHover = hoverStep === i;
          return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
            <div
              ref={el => (stepsRef.current[i] = el)}
              data-step-idx={i}
              style={{
                flex: 1,
                opacity: visibleSteps[i] ? 1 : 0,
                transform: visibleSteps[i] ? 'none' : 'translateY(20px)',
                transition: 'opacity 0.45s ease, transform 0.45s ease',
                minWidth: 0,
              }}
            >
              <div
                className="card"
                onClick={() => { setActiveStep(isActive ? null : i); playTick(); }}
                onMouseEnter={() => { setHoverStep(i); playTick(); }}
                onMouseLeave={() => setHoverStep(null)}
                style={{
                  padding: '20px 18px',
                  cursor: 'none',
                  borderColor: isActive ? 'var(--green-neon)' : isHover ? 'var(--green-deep)' : 'var(--border-default)',
                  background: isActive ? 'var(--bg-elevated)' : isHover ? 'rgba(17,28,22,0.7)' : 'rgba(11,20,16,0.6)',
                }}
              >
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-disabled)',
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px',
                }}>
                  STEP {step.num}
                </div>

                <div style={{
                  width: '60px', height: '60px', borderRadius: '10px',
                  background: 'rgba(0,168,84,0.1)', border: '1px solid var(--green-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <img src={step.icon} alt={step.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                </div>

                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                  color: 'var(--text-primary)', marginBottom: '8px',
                }}>
                  {step.name}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.desc}
                </div>

                {/* Hidden config snippet — revealed on hover, mechanical reveal not bounce */}
                <div style={{
                  maxHeight: isHover || isActive ? '32px' : '0',
                  opacity: isHover || isActive ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.15s ease, opacity 0.15s ease',
                  marginTop: isHover || isActive ? '10px' : '0',
                  paddingTop: isHover || isActive ? '8px' : '0',
                  borderTop: isHover || isActive ? '1px solid var(--border-default)' : 'none',
                }}>
                  <code style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                    color: 'var(--green-stable)', letterSpacing: '0.01em', whiteSpace: 'nowrap',
                  }}>
                    {step.config}
                  </code>
                </div>

                {/* Detail expansion on click */}
                <div style={{
                  maxHeight: isActive ? '80px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                  marginTop: isActive ? '10px' : '0',
                }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                    color: 'var(--text-secondary)', letterSpacing: '0.03em', lineHeight: 1.7,
                  }}>
                    {step.detail}
                  </div>
                </div>
              </div>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', padding: '0 4px', marginTop: '46px',
                flexShrink: 0, opacity: visibleSteps[i] && visibleSteps[i + 1] ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}>
                <svg width="44" height="2" viewBox="0 0 44 2" overflow="visible">
                  <line
                    x1="0" y1="1" x2="44" y2="1"
                    stroke="var(--border-strong)" strokeWidth="1" fill="none"
                    strokeDasharray="6 3"
                    style={{ animation: 'data-flow 2s linear infinite' }}
                  />
                  <polygon points="44,1 39,-1.5 39,3.5" fill="var(--border-strong)" />
                </svg>
              </div>
            )}
          </div>
        );})}
      </div>

      {/* Pipeline status readout */}
      <div className="card" style={{
        marginTop: '32px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--green-deep)', letterSpacing: '0.1em' }}>
          PIPELINE STATUS
        </div>
        <div style={{ flex: 1, height: '2px', background: 'var(--bg-elevated)', position: 'relative', minWidth: '120px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--green-neon)' }} />
        </div>
        {['INTAKE', 'COMPILE', 'OPTIMIZE', 'TUNE', 'DEPLOY'].map((s, i) => (
          <span key={s} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            color: i < 3 ? 'var(--green-neon)' : 'var(--text-disabled)', letterSpacing: '0.08em',
          }}>
            {i > 0 ? '→ ' : ''}{s}
          </span>
        ))}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--green-stable)',
          background: 'rgba(0,255,133,0.08)', border: '1px solid var(--green-dark)',
          padding: '3px 8px', borderRadius: '3px',
        }}>
          ✓ 99.97% ACCURACY
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pipeline-scroll { flex-direction: column !important; overflow-x: visible !important; }
          .pipeline-scroll > div { flex-direction: column !important; }
          #pipeline { padding: 64px 24px !important; }
        }
        @media (max-width: 425px) {
          #pipeline { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #pipeline { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}
