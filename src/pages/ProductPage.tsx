import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { playTick } from '../utils/audio';
import logoLight from '../assets/logos/querynexes-logo.webp';

type Page = 'home' | 'product' | 'privacy' | 'terms';

const SECTIONS = [
  {
    title: 'Platform Overview',
    description: 'QueryNex One is the enterprise-class AI compilation and optimization platform for teams that need speed, accuracy, and production confidence at every stage of model delivery.',
  },
  {
    title: 'Unified Workflow',
    description: 'Ingest raw PyTorch, TensorFlow, or ONNX models once, then let QueryNex One transform them into tightly tuned runtime engines for edge, cloud, and hybrid GPU fleets.',
  },
  {
    title: 'Production Ready',
    description: 'Every deployment is backed by hardware-aware optimizations, audit-ready model metadata, and a scaled inference pipeline that keeps modern AI systems predictable and efficient.',
  },
];

const WORKFLOW = [
  {
    step: 'Model Ingestion',
    desc: 'Accept raw models from multiple frameworks and normalize them into a canonical intermediate representation for deterministic compilation.',
  },
  {
    step: 'Graph Transformation',
    desc: 'Apply fused operator passes, layer contraction, and topology-aware transformations to reduce runtime overhead without sacrificing fidelity.',
  },
  {
    step: 'Quantization & Pruning',
    desc: 'Use advanced INT8/FP16 quantization and structured pruning strategies to cut memory and compute load while preserving model quality.',
  },
  {
    step: 'Inference Deployment',
    desc: 'Publish optimized engines with Triton-backed serving, versioned rollouts, and hardware-tuned execution on H100/A100 and other GPU targets.',
  },
];

const SDKS = [
  {
    name: 'NVIDIA TensorRT',
    detail: 'The core compiler and optimizer for model conversion, operator fusion, and automated quantization that enables fast, production-grade runtime engines.',
  },
  {
    name: 'NVIDIA TensorRT-LLM',
    detail: 'Specialized transformer acceleration, custom attention kernels, and batch fusion for generative AI workloads at scale.',
  },
  {
    name: 'NVIDIA Triton Inference Server',
    detail: 'Production serving, model versioning, rollback, and dynamic batching for consistent, high-utilization deployments.',
  },
  {
    name: 'NVIDIA CUDA Toolkit',
    detail: 'Low-level parallel compute primitives and custom CUDA kernels that maximize memory bandwidth on H100/A100 hardware.',
  },
];

const STATS = [
  { label: 'Enterprise SLAs', value: '99.8%' },
  { label: 'Frameworks Supported', value: 'PyTorch · TensorFlow · ONNX' },
  { label: 'Targeted Speedup', value: '12×+ inference acceleration' },
];

export default function ProductPage({ onNavigate, muted, onMuteToggle }: {
  onNavigate: (page: Page) => void;
  muted?: boolean;
  onMuteToggle?: () => void;
}) {
  return (
    <>
      <Navbar currentPage="product" onNavigate={onNavigate} muted={muted} onMuteToggle={onMuteToggle} />
      <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <section style={{ padding: '120px 48px 64px', textAlign: 'center', position: 'relative' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--green-deep)' }}>ENTERPRISE PLATFORM</span>
            </div>
            <span className="section-label">// QUERYNEX ONE</span>
            <h1 className="section-title" style={{ marginBottom: '20px' }}>
              Enterprise AI Optimization,
              <br />compilation, and inference delivery.
            </h1>
            <p className="section-sub" style={{ margin: '0 auto 32px', maxWidth: '680px' }}>
              QueryNex One brings model engineering, compiler intelligence, and GPU deployment into one polished platform. It is designed for teams who need reliable model performance in production, not experimental proof-of-concept speedups.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href="https://app.querynexes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                onMouseEnter={playTick}
                style={{ padding: '14px 28px', minWidth: '210px', justifyContent: 'center' }}
              >
                Launch QueryNex One
              </a>
              <button
                className="btn-outline"
                onMouseEnter={playTick}
                onClick={() => onNavigate('home')}
                style={{ padding: '14px 28px', minWidth: '210px' }}
              >
                Return to Home
              </button>
            </div>
          </div>
        </section>

        <section style={{ padding: '72px 48px', background: 'rgba(11,20,16,0.65)', borderTop: '1px solid var(--border-default)' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <span className="section-label">// WHY IT MATTERS</span>
            <h2 className="section-title">Built for AI teams that treat performance as a product requirement.</h2>
            <p className="section-sub">
              QueryNex One turns complex model compilation workflows into a single, predictable platform that works across cloud, edge, and on-prem infrastructure.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px', marginTop: '42px' }} className="product-grid">
              {SECTIONS.map((section) => (
                <div key={section.title} className="card" style={{ padding: '28px', minHeight: '210px' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '14px' }}>
                    {section.title}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '72px 48px' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <span className="section-label">// HOW IT WORKS</span>
            <h2 className="section-title">A continuous pipeline from raw model to tuned runtime.</h2>
            <p className="section-sub">
              Under the hood, QueryNex One ingests model artifacts from multiple frameworks and applies graph-level, hardware-aware optimizations to unlock consistent, gated performance gains.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginTop: '40px' }} className="product-grid">
              {WORKFLOW.map((item) => (
                <div key={item.step} className="card" style={{ padding: '26px', minHeight: '190px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '12px' }}>{item.step}</div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '72px 48px', background: 'rgba(5,10,7,0.9)' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <span className="section-label">// NVIDIA AI SDK SELECTION</span>
            <h2 className="section-title">Powered by the NVIDIA stack for compiler and inference excellence.</h2>
            <p className="section-sub">
              QueryNex One is designed to leverage NVIDIA TensorRT, TensorRT-LLM, Triton Server, and CUDA so every compiled model is optimized for modern GPU architectures from the ground up.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px', marginTop: '40px' }} className="product-grid">
              {SDKS.map((sdk) => (
                <div key={sdk.name} className="card" style={{ padding: '28px', minHeight: '190px' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '17px', marginBottom: '12px' }}>{sdk.name}</div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{sdk.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '72px 48px' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <span className="section-label">// ENTERPRISE FOCUS</span>
            <h2 className="section-title">Move beyond experimentation to dependable production delivery.</h2>
            <p className="section-sub">
              QueryNex One gives AI teams the confidence to deploy large-scale transformer workloads with low latency and repeatable results, while keeping engineering workflows simple and transparent.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '40px' }} className="product-grid">
              <div className="card" style={{ padding: '28px' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>Enterprise Ready</div>
                <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px' }}>
                  <li>Hardware-aware optimization for NVIDIA H100 / A100 at scale.</li>
                  <li>Model versioning, instant rollback, and dynamic batching from Triton.</li>
                  <li>REST and gRPC API access with audit logging and SSO-ready integrations.</li>
                </ul>
              </div>
              <div className="card" style={{ padding: '28px' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>Performance Signals</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '22px' }}>{stat.value}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.15em', marginTop: '6px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '52px', textAlign: 'center' }}>
              <a
                href="https://app.querynexes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                onMouseEnter={playTick}
                style={{ padding: '14px 30px', fontSize: '15px' }}
              >
                Open the Product App
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />

      <style>{`
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          section { padding: 64px 24px !important; }
          .product-grid { grid-template-columns: 1fr !important; }
          .section-sub { margin-bottom: 40px !important; }
        }
        @media (max-width: 425px) {
          section { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          section { padding: 40px 12px !important; }
        }
      `}</style>
    </>
  );
}
