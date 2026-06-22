import { useState } from 'react';
import { playTick } from '../utils/audio';

const FAQS = [
  {
    q: 'What ML frameworks does QueryNexes support?',
    a: 'QueryNexes supports 23 ML runtimes including PyTorch 2.x, TensorFlow 2.x, ONNX 1.x, JAX, CoreML, TFLite, PaddlePaddle, MXNet, and more. Custom framework adapters are available under Enterprise plans.',
  },
  {
    q: 'How does the compilation engine preserve model accuracy?',
    a: 'Our optimization pipeline applies accuracy-preserving quantization (INT8/FP16 with calibration datasets), structured pruning with sensitivity analysis, and layer-by-layer accuracy validation. Mean accuracy preservation across all benchmark models is 99.97%.',
  },
  {
    q: 'What hardware targets are supported?',
    a: '150+ targets including NVIDIA A100/H100/RTX series, AMD MI300, Apple M-series (ANE), ARM Cortex, NVIDIA Jetson (Orin/Xavier), Intel Gaudi, AWS Inferentia, and all major cloud GPU instances across AWS, GCP, and Azure.',
  },
  {
    q: 'Is QueryNexes compatible with NVIDIA TensorRT?',
    a: 'Yes. QueryNexes is built on NVIDIA SDK primitives including TensorRT 10.x, cuDNN, and NCCL. Our compilation engine outputs natively optimized TensorRT engines as first-class artifacts for any supported NVIDIA hardware target.',
  },
  {
    q: 'How does the API work for CI/CD pipeline integration?',
    a: 'QueryNexes provides REST and gRPC APIs with SDKs for Python, Node.js, Go, and Java. Native integrations for GitHub Actions, GitLab CI, Jenkins, and ArgoCD are available. Each compilation job returns a signed artifact URL and benchmark report.',
  },
  {
    q: 'What performance improvement can I expect?',
    a: 'Across our benchmark suite of 847K+ models, average inference speedup is 12.4× with 67% memory reduction. Transformer-based LLMs typically see 8–15× speedup; CNN-based vision models see 10–20×. Results vary by model architecture and target hardware.',
  },
  {
    q: 'Is there on-premises deployment available?',
    a: 'Yes, Enterprise plans include full on-premises deployment via Docker containers or Kubernetes Helm charts. Air-gapped environments are supported with offline license validation. Dedicated infrastructure support is included.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
    playTick();
  };

  return (
    <section
      id="faq"
      style={{
        padding: '96px 48px',
        background: 'var(--bg-primary)',
      }}
    >
      <span className="section-label">// FREQUENTLY ASKED</span>
      <h2 className="section-title reveal">Common Questions</h2>
      <p className="section-sub reveal">
        Everything you need to know about integrating QueryNexes into your ML workflow.
      </p>

      <div style={{
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            style={{
              borderBottom: i < FAQS.length - 1 ? '1px solid var(--border-default)' : 'none',
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '22px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'none',
                textAlign: 'left',
                transition: 'background 0.2s',
                borderLeft: openIdx === i ? '3px solid var(--green-neon)' : '3px solid transparent',
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
              onMouseOut={e => (e.currentTarget.style.background = 'none')}
            >
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                color: 'var(--text-primary)',
                paddingRight: '16px',
                lineHeight: 1.4,
              }}>
                {faq.q}
              </span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '20px',
                color: openIdx === i ? 'var(--green-neon)' : 'var(--green-dark)',
                transition: 'transform 0.3s, color 0.2s',
                transform: openIdx === i ? 'rotate(45deg)' : 'none',
                flexShrink: 0,
                lineHeight: 1,
              }}>
                +
              </span>
            </button>

            <div style={{
              maxHeight: openIdx === i ? '220px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease',
            }}>
              <div style={{
                padding: '0 28px 22px 31px',
              }}>
                <p style={{
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                }}>
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #faq { padding: 64px 24px !important; }
        }
        @media (max-width: 425px) {
          #faq { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #faq { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}
