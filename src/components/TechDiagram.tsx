// src/components/TechDiagram.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { playTick } from '../utils/audio';

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Architecture Data
// ─────────────────────────────────────────────────────────────────────────────

const PIPELINE_DATA = [
  {
    id: 'compiler',
    layerLabel: '01. IR COMPILER',
    color: '#00A854',
    nodes: [
      { 
        id: 'ingestion', label: 'Model Ingestion', tech: 'Checkpoint Parser',
        details: 'Parses raw model topologies from 23 supported frameworks. Automatically maps input/output tensors and isolates unsupported operations for fallback execution.'
      },
      { 
        id: 'ir', label: 'IR Lowering', tech: 'Graph Extraction', badge: 'CORE',
        details: 'Converts framework-specific graphs into a unified Intermediate Representation (IR). Normalizes variable precisions and standardizes operator definitions.'
      },
      { 
        id: 'graphopt', label: 'Graph Optimizer', tech: 'DCE / CSE',
        details: 'Executes aggressive dead-code elimination (DCE) and common subexpression elimination (CSE) to reduce memory overhead before compilation.'
      },
    ]
  },
  {
    id: 'engine',
    layerLabel: '02. OPTIMIZATION ENGINE',
    color: '#2ED3FF',
    nodes: [
      { 
        id: 'quant', label: 'INT8 Quantization', tech: 'PTQ / QAT',
        details: 'Applies Post-Training Quantization (PTQ) using KL-divergence calibration to reduce model footprint by 4x with near-zero accuracy degradation.'
      },
      { 
        id: 'fusion', label: 'Kernel Fusion', tech: 'TensorRT', badge: 'GPU',
        details: 'Fuses vertical and horizontal operations (e.g., Conv2D + BatchNorm + ReLU) into singular, highly optimized CUDA kernels to eliminate memory bandwidth bottlenecks.'
      },
      { 
        id: 'sparsity', label: 'Sparsity Pruning', tech: '2:4 Structured',
        details: 'Exploits NVIDIA Ampere/Hopper architecture by enforcing 2:4 structured sparsity, doubling math throughput for compatible matrix multiplications.'
      },
    ]
  },
  {
    id: 'runtime',
    layerLabel: '03. RUNTIME & DEPLOY',
    color: '#FFB020',
    nodes: [
      { 
        id: 'tuned', label: 'Tuned Runtime', tech: 'CUDA Graphs',
        details: 'Captures execution traces into CUDA Graphs to bypass CPU launch overhead, ensuring deterministic, ultra-low latency inference.'
      },
      { 
        id: 'bench', label: 'Perf Benchmark', tech: 'Latency / Throughput', badge: 'AUTO',
        details: 'Runs isolated stress tests across targeted hardware bounds, establishing baseline SLAs for P99 latency and maximum requests per second.'
      },
      { 
        id: 'artifact', label: 'QNX Artifact', tech: 'Signed / Versioned',
        details: 'Packages the optimized engine, metadata, and dynamic library dependencies into a single, cryptographicially signed deployment artifact.'
      },
    ]
  }
];

import siliconArchitecture from '../assets/gallery/Silicon Architecture.webp';
import gpuCluster from '../assets/gallery/GPU Cluster.webp';
import codeCompilation from '../assets/gallery/Code Compilation.webp';
import archEdgeDeployment from '../assets/gallery/Edge Deployment_AO.webp';
import neuralNetworkMapping from '../assets/gallery/Neural network Mapping.webp';
import hardwareLab from '../assets/gallery/hardware Lab.webp';
import serverTelemetry from '../assets/gallery/Server Telemetry.webp';
import querynexesInterface from '../assets/gallery/Queynexes Interface.webp';

const GALLERY_ITEMS = [
  { id: 1, title: 'Silicon Architecture', desc: 'H100 Tensor Core microscopic view', img: siliconArchitecture },
  { id: 2, title: 'GPU Cluster', desc: 'Enterprise A100 data center', img: gpuCluster },
  { id: 3, title: 'Code Compilation', desc: 'IR Graph lowering process', img: codeCompilation },
  { id: 4, title: 'Edge Deployment', desc: 'Jetson Orin inference testing', img: archEdgeDeployment },
  { id: 5, title: 'Neural Network Mapping', desc: 'Visualizing node activations', img: neuralNetworkMapping },
  { id: 6, title: 'Hardware Lab', desc: 'Testing physical NPU limits', img: hardwareLab },
  { id: 7, title: 'Server Telemetry', desc: 'Live monitoring of memory bandwidth', img: serverTelemetry },
  { id: 8, title: 'QueryNexes Interface', desc: 'The optimization dashboard', img: querynexesInterface },
];

export default function TechDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  
  // State for Inspector and Gallery
  const [activeNode, setActiveNode] = useState(PIPELINE_DATA[1].nodes[1]); // Default Node
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number | null>(null);

  // Measure carousel width for drag constraints
  useEffect(() => {
    if (dragContainerRef.current) {
      setCarouselWidth(dragContainerRef.current.scrollWidth - dragContainerRef.current.offsetWidth);
    }
    // Update on resize
    const handleResize = () => {
      if (dragContainerRef.current) {
        setCarouselWidth(dragContainerRef.current.scrollWidth - dragContainerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parallax Scroll Effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  // The wrapper moves automatically based on scroll
  const scrollOffset = useTransform(scrollYProgress, [0, 1], [0, -400]);

  // Gallery Navigation Handlers
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeGalleryIdx !== null) {
      setActiveGalleryIdx((prev) => (prev! + 1) % GALLERY_ITEMS.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeGalleryIdx !== null) {
      setActiveGalleryIdx((prev) => (prev! - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
  };

  return (
    <section
      id="tech-diagram"
      ref={containerRef}
        style={{
          padding: '120px 48px',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
    >
      {/* --- Fullscreen Gallery Lightbox --- */}
      <AnimatePresence>
        {activeGalleryIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGalleryIdx(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              padding: '40px'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveGalleryIdx(null)}
              style={{ position: 'absolute', top: '40px', right: '40px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={32} />
            </button>

            {/* Main Image Container */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
              
              <button onClick={handlePrev} style={{
                position: 'absolute', left: '16px', zIndex: 10,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
                padding: '10px', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, border-color 0.2s',
              }} className="gallery-nav">
                <ChevronLeft size={22} />
              </button>

              <motion.img
                key={activeGalleryIdx}
                src={GALLERY_ITEMS[activeGalleryIdx].img}
                alt={GALLERY_ITEMS[activeGalleryIdx].title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,255,133,0.1)' }}
              />

              <button onClick={handleNext} style={{
                position: 'absolute', right: '16px', zIndex: 10,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
                padding: '10px', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, border-color 0.2s',
              }} className="gallery-nav">
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Captions */}
            <motion.div 
              key={`text-${activeGalleryIdx}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ textAlign: 'center', marginTop: '32px' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '24px', margin: '0 0 8px 0', fontFamily: 'Space Grotesk, sans-serif' }}>{GALLERY_ITEMS[activeGalleryIdx].title}</h3>
              <p style={{ color: 'var(--green-neon)', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', margin: 0 }}>{GALLERY_ITEMS[activeGalleryIdx].desc}</p>
              <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                {activeGalleryIdx + 1} OF {GALLERY_ITEMS.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ambience */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 133, 0.03) 0%, transparent 60%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="section-label">// ARCHITECTURE OVERVIEW</span>
          <h2 className="section-title">The Optimization Forge</h2>
          <p className="section-sub">
            Explore our hardware telemetry below. QueryNexes dynamically restructures computational graphs to extract maximum FLOPs from target silicon.
          </p>
        </div>

        {/* Dual-Control Carousel (Scroll + Drag + Click) */}
        <div style={{ marginBottom: '80px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 20px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>TELEMETRY & VISUALIZERS</span>
            <span style={{ fontSize: '11px', color: 'var(--green-neon)', fontFamily: 'JetBrains Mono, monospace', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              SCROLL OR DRAG TO EXPLORE <ChevronRight size={14} />
            </span>
          </div>
          
          <div style={{ overflow: 'hidden' }}>
            {/* The wrapper handles the scroll parallax */}
            <motion.div style={{ x: scrollOffset }}>
              {/* The inner div handles the manual drag */}
              <motion.div 
                ref={dragContainerRef}
                drag="x" 
                dragConstraints={{ right: 0, left: -carouselWidth }}
                style={{ display: 'flex', gap: '20px', width: 'max-content', padding: '10px 20px', cursor: 'grab' }}
                whileTap={{ cursor: 'grabbing' }}
              >
                {GALLERY_ITEMS.map((item, idx) => (
                  <motion.div 
                    key={item.id} 
                    onClick={() => setActiveGalleryIdx(idx)}
                    onMouseEnter={() => playTick()}
                    whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,255,133,0.15)' }}
                    style={{ 
                      width: '320px', height: '180px', 
                      border: '1px solid var(--border-default)', borderRadius: '12px', 
                      overflow: 'hidden', position: 'relative',
                      cursor: 'pointer'
                    }}
                    className="gallery-card"
                  >
                    <img src={item.img} alt={item.title} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'opacity 0.3s' }} className="gallery-img" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', pointerEvents: 'none' }}>
                      <div style={{ fontSize: '10px', color: 'var(--green-neon)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '4px' }}>{item.id.toString().padStart(2, '0')} //</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{item.title}</div>
                    </div>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '4px', backdropFilter: 'blur(4px)' }} className="maximize-icon">
                      <Maximize2 size={14} style={{ color: 'var(--green-neon)' }} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* --- Command Center Grid (Strict 1:1 Alignment) --- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', // Strict equal widths
          gap: '32px',
          alignItems: 'stretch' // Forces equal heights
        }} className="command-center-layout">
          
          {/* Left: The Pipeline Diagram */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column',
            height: '100%' // Fill the stretched height
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', flexGrow: 1 }}>
              {PIPELINE_DATA.map((layer) => (
                <div key={layer.id}>
                  <div style={{ fontSize: '11px', color: layer.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '16px' }}>
                    {layer.layerLabel}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {layer.nodes.map(node => {
                      const isActive = activeNode.id === node.id;
                      return (
                        <div 
                          key={node.id}
                          onMouseEnter={() => { setActiveNode(node); playTick(); }}
                          style={{
                            background: isActive ? `${layer.color}10` : 'var(--bg-primary)',
                            border: `1px solid ${isActive ? layer.color : 'var(--border-default)'}`,
                            borderRadius: '8px',
                            padding: '16px 12px',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s ease',
                            transform: isActive ? 'translateY(-2px)' : 'none',
                          }}
                        >
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? layer.color : 'var(--text-disabled)', marginBottom: '12px', transition: 'background 0.2s' }} />
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{node.label}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{node.tech}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dynamic Inspector Panel */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '16px',
            padding: '40px',
            display: 'flex', flexDirection: 'column',
            height: '100%' // Matches left side height exactly
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '16px', marginBottom: '32px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--green-neon)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>ACTIVE NODE INSPECTOR</span>
            </div>

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--green-neon)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '12px' }}>
                    // {activeNode.tech.toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 24px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {activeNode.label}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.8, marginBottom: '40px' }}>
                    {activeNode.details}
                  </p>

                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)', padding: '24px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '12px' }}>SYSTEM LOG OUTPUT</div>
                    <div style={{ fontSize: '12px', color: 'var(--green-stable)', fontFamily: 'JetBrains Mono, monospace', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
                      <span>&gt; Initialize module: {activeNode.id.toUpperCase()}_PROC</span>
                      <span style={{ color: 'var(--text-muted)' }}>&gt; Checking hardware bounds... [VERIFIED]</span>
                      <span style={{ color: 'var(--text-muted)' }}>&gt; Allocating memory buffers... [SUCCESS]</span>
                      <span>&gt; Awaiting execution trigger...</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(0, 255, 133, 0.5); }
          50% { opacity: 0.4; box-shadow: none; }
        }
        .gallery-card .maximize-icon { opacity: 0; transition: opacity 0.2s; }
        .gallery-card:hover .maximize-icon { opacity: 1; }
        .gallery-card:hover .gallery-img { opacity: 1 !important; }
        .gallery-nav:hover { background: rgba(0, 255, 133, 0.2) !important; border-color: var(--green-neon) !important; }
        
        @media (max-width: 1024px) {
          .command-center-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .gallery-nav { display: flex !important; }
          #tech-diagram { padding: 64px 24px !important; }
        }
        @media (max-width: 480px) {
          .gallery-nav { padding: 8px !important; }
          .gallery-nav svg { width: 18px !important; height: 18px !important; }
        }
        @media (max-width: 425px) {
          #tech-diagram { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #tech-diagram { padding: 40px 12px !important; }
        }
        @media (max-width: 425px) {
          #tech-diagram { padding: 48px 16px !important; }
        }
        @media (max-width: 375px) {
          #tech-diagram { padding: 40px 12px !important; }
        }
      `}</style>
    </section>
  );
}