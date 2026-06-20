// import SimulationScene from './SimScene';

// type SimMode = 'overview' | 'input' | 'process' | 'output';

// const MODE_LABELS: Record<string, string> = {
//   overview: 'OVERVIEW MODE',
//   input: 'INPUT NODE — DETAIL',
//   process: 'PROCESS NODE — DETAIL',
//   output: 'OUTPUT NODE — DETAIL',
// };

// export default function SimulationPlatform() {
//   const { canvasRef, mode, paused, switchMode, togglePause, detailInfo } = SimulationScene();

//   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

//   return (
//     <section
//       id="simulation"
//       style={{
//         padding: '96px 48px',
//         background: 'var(--bg-secondary)',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Ambient glow */}
//       <div style={{
//         position: 'absolute',
//         top: '20%',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         width: '600px',
//         height: '600px',
//         borderRadius: '50%',
//         background: 'radial-gradient(circle, rgba(0,255,133,0.04) 0%, transparent 70%)',
//         pointerEvents: 'none',
//       }} />

//       <span className="section-label">// LIVE SIMULATION</span>
//       <h2 className="section-title reveal">See The Optimization Engine<br />in Action</h2>
//       <p className="section-sub reveal">
//         An interactive real-time Three.js simulation of QueryNexes' model compilation
//         and inference acceleration pipeline. Click any island to zoom in.
//       </p>

//       {/* Controls */}
//       <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
//         {([
//           { id: 'overview' as SimMode, label: '▶ OVERVIEW' },
//           { id: 'input' as SimMode, label: '⇥ INPUT NODE' },
//           { id: 'process' as SimMode, label: '⚙ PROCESS NODE' },
//           { id: 'output' as SimMode, label: '✓ OUTPUT NODE' },
//         ] as { id: SimMode; label: string }[]).map(btn => (
//           <button
//             key={btn.id}
//             onClick={() => switchMode(btn.id)}
//             style={{
//               fontFamily: 'JetBrains Mono, monospace',
//               fontSize: '12px',
//               letterSpacing: '0.05em',
//               padding: '10px 18px',
//               borderRadius: '6px',
//               border: mode === btn.id ? '1px solid var(--green-deep)' : '1px solid var(--border-default)',
//               background: mode === btn.id ? 'rgba(0,255,133,0.07)' : 'var(--bg-surface)',
//               color: mode === btn.id ? 'var(--green-neon)' : 'var(--text-secondary)',
//               cursor: 'none',
//               transition: 'all 0.2s',
//             }}
//           >
//             {btn.label}
//           </button>
//         ))}
//         <button
//           onClick={togglePause}
//           style={{
//             fontFamily: 'JetBrains Mono, monospace',
//             fontSize: '12px',
//             letterSpacing: '0.05em',
//             padding: '10px 18px',
//             borderRadius: '6px',
//             border: '1px solid var(--border-default)',
//             background: 'var(--bg-surface)',
//             color: 'var(--text-secondary)',
//             cursor: 'none',
//             transition: 'all 0.2s',
//           }}
//         >
//           {paused ? '▶ PLAY' : '⏸ PAUSE'}
//         </button>
//         {mode !== 'overview' && (
//           <button
//             onClick={() => switchMode('overview')}
//             style={{
//               fontFamily: 'JetBrains Mono, monospace',
//               fontSize: '12px',
//               letterSpacing: '0.05em',
//               padding: '10px 18px',
//               borderRadius: '6px',
//               border: '1px solid var(--green-dark)',
//               background: 'rgba(0,168,84,0.05)',
//               color: 'var(--green-neon)',
//               cursor: 'none',
//               transition: 'all 0.2s',
//             }}
//           >
//             ← BACK TO OVERVIEW
//           </button>
//         )}
//       </div>

//       {/* Mobile notice */}
//       {isMobile ? (
//         <div style={{
//           padding: '48px 24px',
//           textAlign: 'center',
//           border: '1px solid var(--border-default)',
//           borderRadius: '12px',
//           background: 'var(--bg-surface)',
//         }}>
//           <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '16px', color: 'var(--green-neon)', marginBottom: '10px' }}>
//             3D Simulation Available on Desktop
//           </div>
//           <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
//             Resize your browser to 768px+ to experience the interactive Three.js simulation
//             of QueryNexes' optimization pipeline.
//           </p>
//         </div>
//       ) : (
//         <div style={{
//           width: '100%',
//           height: '560px',
//           borderRadius: '16px',
//           border: '1px solid var(--border-default)',
//           overflow: 'hidden',
//           position: 'relative',
//           background: 'var(--bg-primary)',
//         }}>
//           <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

//           {/* Mode label */}
//           <div style={{
//             position: 'absolute',
//             top: '16px',
//             left: '16px',
//             fontFamily: 'JetBrains Mono, monospace',
//             fontSize: '11px',
//             color: 'var(--text-muted)',
//             background: 'rgba(5,10,7,0.85)',
//             border: '1px solid var(--border-default)',
//             padding: '6px 12px',
//             borderRadius: '4px',
//             letterSpacing: '0.1em',
//             backdropFilter: 'blur(8px)',
//           }}>
//             {MODE_LABELS[mode]}
//           </div>

//           {/* Hint on overview */}
//           {mode === 'overview' && (
//             <div style={{
//               position: 'absolute',
//               bottom: '16px',
//               left: '50%',
//               transform: 'translateX(-50%)',
//               fontFamily: 'JetBrains Mono, monospace',
//               fontSize: '10px',
//               color: 'var(--text-disabled)',
//               letterSpacing: '0.1em',
//               background: 'rgba(5,10,7,0.7)',
//               padding: '6px 14px',
//               borderRadius: '4px',
//               whiteSpace: 'nowrap',
//               backdropFilter: 'blur(8px)',
//             }}>
//               CLICK AN ISLAND TO INSPECT · USE CONTROLS ABOVE TO NAVIGATE
//             </div>
//           )}

//           {/* Detail panel */}
//           {mode !== 'overview' && detailInfo.lines.length > 0 && (
//             <div style={{
//               position: 'absolute',
//               right: '16px',
//               top: '50%',
//               transform: 'translateY(-50%)',
//               width: '230px',
//               background: 'rgba(11,20,16,0.92)',
//               border: '1px solid var(--border-default)',
//               borderRadius: '10px',
//               padding: '18px',
//               fontFamily: 'JetBrains Mono, monospace',
//               fontSize: '11px',
//               backdropFilter: 'blur(16px)',
//               animation: 'fadeIn 0.3s ease',
//             }}>
//               <div style={{
//                 color: 'var(--green-neon)',
//                 letterSpacing: '0.1em',
//                 textTransform: 'uppercase',
//                 marginBottom: '14px',
//                 fontSize: '10px',
//                 fontWeight: 700,
//                 borderBottom: '1px solid var(--border-default)',
//                 paddingBottom: '10px',
//               }}>
//                 {detailInfo.title}
//               </div>

//               {detailInfo.lines.map(([k, v]) => (
//                 <div key={k} style={{
//                   color: 'var(--text-secondary)',
//                   marginBottom: '7px',
//                   lineHeight: 1.5,
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   gap: '8px',
//                 }}>
//                   <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{k}</span>
//                   <span style={{ color: 'var(--green-stable)', textAlign: 'right' }}>{v}</span>
//                 </div>
//               ))}

//               {/* Progress bars (process mode) */}
//               {detailInfo.progress && (
//                 <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-default)', paddingTop: '12px' }}>
//                   {detailInfo.progress.map(p => (
//                     <div key={p.label} style={{ marginBottom: '10px' }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
//                         <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{p.label}</span>
//                         <span style={{ fontSize: '10px', color: 'var(--green-neon)' }}>{p.pct}%</span>
//                       </div>
//                       <div style={{ height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
//                         <div style={{
//                           height: '100%',
//                           width: `${p.pct}%`,
//                           background: 'linear-gradient(90deg, var(--green-neon), var(--green-stable))',
//                           borderRadius: '2px',
//                           boxShadow: '0 0 6px var(--green-neon)',
//                           transition: 'width 1s ease',
//                         }} />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Pulsing status dot */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', borderTop: '1px solid var(--border-default)', paddingTop: '10px' }}>
//                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-neon)', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
//                 <span style={{ fontSize: '9px', color: 'var(--green-stable)', letterSpacing: '0.1em' }}>SYSTEM ACTIVE</span>
//               </div>
//             </div>
//           )}

//           {/* Corner accents */}
//           {['tl', 'tr', 'bl', 'br'].map(c => (
//             <div key={c} style={{
//               position: 'absolute',
//               width: '18px', height: '18px',
//               ...(c[0] === 't' ? { top: 0 } : { bottom: 0 }),
//               ...(c[1] === 'l' ? { left: 0 } : { right: 0 }),
//               borderTop: c[0] === 't' ? '2px solid var(--green-deep)' : 'none',
//               borderBottom: c[0] === 'b' ? '2px solid var(--green-deep)' : 'none',
//               borderLeft: c[1] === 'l' ? '2px solid var(--green-deep)' : 'none',
//               borderRight: c[1] === 'r' ? '2px solid var(--green-deep)' : 'none',
//             }} />
//           ))}
//         </div>
//       )}

//       {/* Island legend */}
//       {!isMobile && (
//         <div style={{
//           display: 'flex',
//           gap: '24px',
//           marginTop: '20px',
//           justifyContent: 'center',
//           flexWrap: 'wrap',
//         }}>
//           {[
//             { label: 'INPUT NODE', desc: 'Model Repository / Training Environment', color: 'var(--green-deep)' },
//             { label: 'PROCESS NODE', desc: 'Compilation · Optimization · Acceleration', color: 'var(--green-neon)' },
//             { label: 'OUTPUT NODE', desc: 'Cloud · Edge · Enterprise Deployment', color: 'var(--glow-cyan)' },
//           ].map(item => (
//             <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
//               <div>
//                 <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: item.color, letterSpacing: '0.1em' }}>{item.label}</div>
//                 <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <style>{`
//         @media (max-width: 768px) {
//           #simulation { padding-left: 20px !important; padding-right: 20px !important; }
//         }
//       `}</style>
//     </section>
//   );
// }
// src/components/SimulationPlatform/index.tsx
// Complete rewrite: No Three.js. Pure React + framer-motion + SVG pipeline topology.
// .................................................................................................
// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// // ─── Types ───────────────────────────────────────────────────────────────────
// type NodeId = 'input' | 'process' | 'output';

// interface ProgressBar { label: string; pct: number; }
// interface NodeDetail {
//   title: string;
//   badge: string;
//   lines: [string, string][];
//   progress?: ProgressBar[];
//   logs?: string[];
// }

// // ─── Data ────────────────────────────────────────────────────────────────────
// const NODE_DETAILS: Record<NodeId, NodeDetail> = {
//   input: {
//     title: 'INPUT NODE',
//     badge: 'SCANNING',
//     lines: [
//       ['FORMAT',         'PyTorch 2.1 / ONNX'],
//       ['PARAMETERS',     '7.3B'],
//       ['LAYERS',         '312 detected'],
//       ['DTYPE',          'FP32 → mixed'],
//       ['COMPATIBILITY',  '✓ VERIFIED'],
//       ['GRAPH NODES',    '1,847'],
//       ['STATUS',         'INGESTING...'],
//     ],
//     logs: [
//       '$ qnx ingest --model resnet-x.pt',
//       'Reading checkpoint... done',
//       'Graph extraction: 1847 ops',
//       'Dtype audit: FP32 ⇒ autocast',
//       'Compatibility check: PASS',
//     ],
//   },
//   process: {
//     title: 'PROCESS NODE',
//     badge: 'COMPILING',
//     lines: [
//       ['PASS',       '3 / 7'],
//       ['ACCURACY',   '99.97% preserved'],
//       ['KERNELS',    'fusing (38/94)'],
//       ['PRECISION',  'INT8 / FP16'],
//       ['BACKEND',    'NVIDIA H100'],
//       ['CACHE HIT',  '74%'],
//     ],
//     progress: [
//       { label: 'MEMORY REDUCTION',  pct: 78 },
//       { label: 'LATENCY OPTIMIZE',  pct: 62 },
//       { label: 'THROUGHPUT GAIN',   pct: 91 },
//       { label: 'KERNEL FUSION',     pct: 85 },
//     ],
//     logs: [
//       'Kernel fusion pass 3/7...',
//       'INT8 calibration: 2048 samples',
//       'Graph partitioning: done',
//       'CUDA graph capture: active',
//     ],
//   },
//   output: {
//     title: 'OUTPUT NODE',
//     badge: 'DEPLOYED',
//     lines: [
//       ['CLOUD GPU',    '✓ READY  12.4×'],
//       ['EDGE DEVICE',  '✓ READY  67% ↓'],
//       ['ENTERPRISE',   '✓ READY  99.8%'],
//       ['LATENCY',      '11.6ms (was 118.4ms)'],
//       ['THROUGHPUT',   '8,900 req/s'],
//       ['MODEL SIZE',   '1.8 GB → 412 MB'],
//     ],
//     logs: [
//       'Artifact signed: sha256:a3f9...',
//       'Cloud GPU: deployed ✓',
//       'Edge bundle: packaged ✓',
//       'Enterprise API: live ✓',
//     ],
//   },
// };

// const PIPELINE_NODES: { id: NodeId; label: string; sub: string; color: string }[] = [
//   { id: 'input',   label: 'INPUT',   sub: 'Model Repository',            color: '#00A854' },
//   { id: 'process', label: 'PROCESS', sub: 'Compilation · Optimization',  color: '#00FF85' },
//   { id: 'output',  label: 'OUTPUT',  sub: 'Cloud · Edge · Enterprise',   color: '#2ED3FF' },
// ];

// // ─── Latency chart data ───────────────────────────────────────────────────────
// const CHART_W = 560;
// const CHART_H = 140;
// const RAW_POINTS = [118.4, 104, 88, 71, 54, 38, 27, 19.5, 15.2, 12.8, 11.6];
// const toSVG = (pts: number[]) => {
//   const min = Math.min(...pts) - 4;
//   const max = Math.max(...pts) + 4;
//   return pts.map((v, i) => {
//     const x = (i / (pts.length - 1)) * CHART_W;
//     const y = CHART_H - ((v - min) / (max - min)) * CHART_H;
//     return `${x},${y}`;
//   });
// };
// const svgPts   = toSVG(RAW_POINTS);
// const linePath = `M ${svgPts.join(' L ')}`;
// const [lastX, lastY] = svgPts[svgPts.length - 1].split(',').map(Number);
// const areaPath = `${linePath} L ${CHART_W},${CHART_H} L 0,${CHART_H} Z`;

// // ─── Sub-components ───────────────────────────────────────────────────────────

// /** Animated counter from `from` to `to` */
// function AnimatedNumber({ from, to, decimals = 1, suffix = '' }: {
//   from: number; to: number; decimals?: number; suffix?: string;
// }) {
//   const mv = useMotionValue(from);
//   const display = useTransform(mv, v => v.toFixed(decimals) + suffix);
//   useEffect(() => {
//     const c = animate(mv, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
//     return c.stop;
//   }, [mv, to]);
//   return <motion.span style={{ fontVariantNumeric: 'tabular-nums' }}>{display}</motion.span>;
// }

// /** Animated progress bar */
// function ProgressBar({ label, pct, delay }: ProgressBar & { delay: number }) {
//   return (
//     <div style={{ marginBottom: 12 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
//         <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{label}</span>
//         <span style={{ fontSize: 10, color: '#00FF85', fontWeight: 700 }}>{pct}%</span>
//       </div>
//       <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: `${pct}%` }}
//           transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
//           style={{
//             height: '100%',
//             background: 'linear-gradient(90deg, #00A854, #00FF85)',
//             borderRadius: 2,
//             boxShadow: '0 0 8px #00FF85',
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// /** Self-drawing SVG latency chart */
// function LatencyChart() {
//   return (
//     <div style={{ padding: '24px 0 8px' }}>
//       {/* Header row */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
//         <div>
//           <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>
//             INFERENCE LATENCY — LIVE TELEMETRY
//           </div>
//           <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
//             <span style={{ fontSize: 32, fontWeight: 700, color: '#00FF85', lineHeight: 1 }}>
//               <AnimatedNumber from={118.4} to={11.6} decimals={1} suffix="ms" />
//             </span>
//             <span style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>118.4ms</span>
//             <span style={{ fontSize: 11, color: '#00FF85', background: 'rgba(0,255,133,0.1)', padding: '2px 8px', borderRadius: 4 }}>
//               10.2× faster
//             </span>
//           </div>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 2 }}>THROUGHPUT</div>
//           <div style={{ fontSize: 18, fontWeight: 700, color: '#2ED3FF' }}>8,900 <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>req/s</span></div>
//         </div>
//       </div>

//       {/* SVG chart */}
//       <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(0,255,133,0.1)' }}>
//         {/* Y-axis labels */}
//         <div style={{
//           position: 'absolute', left: 0, top: 0, bottom: 0, width: 44,
//           display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
//           padding: '8px 0', pointerEvents: 'none', zIndex: 2,
//         }}>
//           {[120, 80, 40, 0].map(v => (
//             <span key={v} style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', paddingLeft: 6 }}>{v}ms</span>
//           ))}
//         </div>

//         <svg
//           viewBox={`0 0 ${CHART_W} ${CHART_H}`}
//           preserveAspectRatio="none"
//           style={{ width: '100%', height: 140, display: 'block', background: 'rgba(5,10,7,0.6)' }}
//         >
//           {/* Horizontal grid lines */}
//           {[0.25, 0.5, 0.75].map(f => (
//             <line
//               key={f}
//               x1={0} y1={CHART_H * f} x2={CHART_W} y2={CHART_H * f}
//               stroke="rgba(255,255,255,0.04)" strokeWidth={1}
//             />
//           ))}

//           {/* Area fill */}
//           <motion.path
//             d={areaPath}
//             fill="url(#areaGrad)"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.8 }}
//           />

//           {/* Main line — self-drawing */}
//           <motion.path
//             d={linePath}
//             fill="none"
//             stroke="#00FF85"
//             strokeWidth={2}
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             initial={{ pathLength: 0, opacity: 0 }}
//             animate={{ pathLength: 1, opacity: 1 }}
//             transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
//           />

//           {/* Live pulse at end */}
//           <motion.circle
//             cx={lastX} cy={lastY} r={4}
//             fill="#00FF85"
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
//             transition={{ delay: 2.0, duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
//           />
//           <motion.circle
//             cx={lastX} cy={lastY} r={2.5}
//             fill="#00FF85"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 2.0 }}
//           />

//           {/* "BEFORE" label */}
//           <text x={6} y={14} fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="JetBrains Mono, monospace">
//             BEFORE: 118.4ms
//           </text>
//           {/* "AFTER" label */}
//           <text x={CHART_W - 6} y={lastY - 8} fill="#00FF85" fontSize={9} fontFamily="JetBrains Mono, monospace" textAnchor="end">
//             NOW: 11.6ms
//           </text>

//           <defs>
//             <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%"   stopColor="#00FF85" stopOpacity={0.12} />
//               <stop offset="100%" stopColor="#00FF85" stopOpacity={0} />
//             </linearGradient>
//           </defs>
//         </svg>

//         {/* Live ticker row */}
//         <div style={{
//           background: 'rgba(5,10,7,0.8)', borderTop: '1px solid rgba(0,255,133,0.08)',
//           padding: '6px 12px', display: 'flex', gap: 24,
//         }}>
//           {[
//             { l: 'P50', v: '9.4ms' }, { l: 'P95', v: '14.2ms' }, { l: 'P99', v: '21.7ms' },
//             { l: 'ΣRTT', v: '3.2ms' }, { l: 'GPU UTIL', v: '94%' },
//           ].map(({ l, v }) => (
//             <div key={l} style={{ fontSize: 10, color: 'var(--text-muted)' }}>
//               {l} <span style={{ color: '#00FF85', fontWeight: 700 }}>{v}</span>
//             </div>
//           ))}
//           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
//             <motion.div
//               animate={{ opacity: [1, 0.3, 1] }}
//               transition={{ duration: 1, repeat: Infinity }}
//               style={{ width: 5, height: 5, borderRadius: '50%', background: '#00FF85' }}
//             />
//             <span style={{ fontSize: 9, color: '#00FF85', letterSpacing: '0.1em' }}>LIVE</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /** Terminal log block */
// function TerminalLog({ lines }: { lines: string[] }) {
//   return (
//     <div style={{
//       background: 'rgba(0,0,0,0.4)',
//       border: '1px solid rgba(0,255,133,0.08)',
//       borderRadius: 6,
//       padding: '10px 14px',
//       marginTop: 16,
//     }}>
//       {/* titlebar */}
//       <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
//         {['#2A3F34', '#2A3F34', '#2A3F34'].map((c, i) => (
//           <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
//         ))}
//         <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', marginLeft: 6, letterSpacing: '0.08em' }}>compile.log</span>
//       </div>
//       {lines.map((line, i) => (
//         <motion.div
//           key={i}
//           initial={{ opacity: 0, x: -6 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: i * 0.14, duration: 0.3 }}
//           style={{
//             fontSize: 11,
//             color: line.startsWith('$') ? 'var(--text-primary)' : line.includes('✓') || line.includes('PASS') ? '#00FF85' : 'var(--text-secondary)',
//             lineHeight: 1.8,
//             fontFamily: 'JetBrains Mono, monospace',
//             whiteSpace: 'nowrap',
//           }}
//         >
//           {line}
//         </motion.div>
//       ))}
//       <motion.span
//         animate={{ opacity: [1, 0, 1] }}
//         transition={{ duration: 0.9, repeat: Infinity }}
//         style={{ display: 'inline-block', width: 7, height: 13, background: '#00FF85', verticalAlign: 'middle', marginTop: 2 }}
//       />
//     </div>
//   );
// }

// /** Expanded node detail overlay */
// function NodeDetailPanel({ nodeId, onClose }: { nodeId: NodeId; onClose: () => void }) {
//   const d = NODE_DETAILS[nodeId];
//   const accentColor = PIPELINE_NODES.find(n => n.id === nodeId)!.color;

//   return (
//     <motion.div
//       layoutId={`node-${nodeId}`}
//       initial={{ opacity: 0, scale: 0.96 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.96 }}
//       transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
//       style={{
//         background: '#0B1410',
//         border: `1px solid ${accentColor}22`,
//         borderRadius: 12,
//         padding: '28px 28px 24px',
//         position: 'relative',
//         boxShadow: `0 0 60px ${accentColor}10`,
//       }}
//     >
//       {/* Close */}
//       <button
//         onClick={onClose}
//         style={{
//           position: 'absolute', top: 16, right: 16,
//           background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
//           borderRadius: 6, padding: '4px 10px',
//           fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
//           color: 'var(--text-muted)', cursor: 'pointer', letterSpacing: '0.08em',
//         }}
//       >
//         ← BACK
//       </button>

//       {/* Title */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
//         <div style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
//         <span style={{ fontSize: 11, color: accentColor, fontWeight: 700, letterSpacing: '0.12em' }}>{d.title}</span>
//         <span style={{
//           fontSize: 9, color: accentColor, background: `${accentColor}15`,
//           border: `1px solid ${accentColor}40`, borderRadius: 4, padding: '2px 8px', letterSpacing: '0.1em',
//         }}>
//           {d.badge}
//         </span>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
//         {/* Left: data grid + progress */}
//         <div>
//           {/* Key-value grid */}
//           <div style={{
//             display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px',
//             padding: '14px', borderRadius: 8,
//             border: '1px solid rgba(255,255,255,0.05)',
//             background: 'rgba(0,0,0,0.3)', marginBottom: 16,
//           }}>
//             {d.lines.map(([k, v], i) => (
//               <motion.div
//                 key={k}
//                 initial={{ opacity: 0, y: 4 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.06 }}
//                 style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 5, paddingTop: 5 }}
//               >
//                 <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>{k}</span>
//                 <span style={{ fontSize: 10, color: k === 'STATUS' || k.includes('LATENCY') ? accentColor : 'var(--text-secondary)', fontWeight: 600 }}>{v}</span>
//               </motion.div>
//             ))}
//           </div>

//           {/* Progress bars */}
//           {d.progress && (
//             <div style={{ padding: '14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
//               <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 12 }}>
//                 OPTIMIZATION METRICS
//               </div>
//               {d.progress.map((p, i) => <ProgressBar key={p.label} {...p} delay={0.3 + i * 0.15} />)}
//             </div>
//           )}
//         </div>

//         {/* Right: latency chart + terminal */}
//         <div>
//           <LatencyChart />
//           {d.logs && <TerminalLog lines={d.logs} />}
//         </div>
//       </div>

//       {/* Status footer */}
//       <div style={{
//         marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)',
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//           <motion.div
//             animate={{ opacity: [1, 0.3, 1] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//             style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor }}
//           />
//           <span style={{ fontSize: 9, color: accentColor, letterSpacing: '0.1em' }}>SYSTEM ACTIVE</span>
//         </div>
//         <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em' }}>
//           QNX v2.4.1 · {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
//         </span>
//       </div>
//     </motion.div>
//   );
// }

// /** Animated SVG dashed connector between nodes */
// function FlowConnector({ active }: { active: boolean }) {
//   return (
//     <div style={{ flex: 1, position: 'relative', minWidth: 48, height: 56, display: 'flex', alignItems: 'center' }}>
//       <svg width="100%" height="32" viewBox="0 0 120 32" preserveAspectRatio="none" overflow="visible">
//         {/* Glow track */}
//         <line x1={0} y1={16} x2={120} y2={16} stroke="rgba(0,255,133,0.06)" strokeWidth={8} />
//         {/* Base dashed line */}
//         <line x1={0} y1={16} x2={120} y2={16} stroke="rgba(0,168,84,0.25)" strokeWidth={1} strokeDasharray="4 6" />
//         {/* Animated flow dash */}
//         <motion.line
//           x1={0} y1={16} x2={120} y2={16}
//           stroke="#00FF85"
//           strokeWidth={1.5}
//           strokeDasharray="12 24"
//           animate={{ strokeDashoffset: active ? [0, -36] : 0 }}
//           transition={{ duration: 0.7, repeat: active ? Infinity : 0, ease: 'linear' }}
//         />
//         {/* Arrow head */}
//         <polygon points="116,10 124,16 116,22" fill="rgba(0,255,133,0.5)" />
//         {/* Data packet dots */}
//         {active && [0, 0.4, 0.75].map((delay, i) => (
//           <motion.circle
//             key={i} r={2.5} cy={16} fill="#00FF85"
//             initial={{ cx: 0, opacity: 0.9 }}
//             animate={{ cx: 122, opacity: [0.9, 0.9, 0] }}
//             transition={{ duration: 1.1, delay, repeat: Infinity, ease: 'linear' }}
//           />
//         ))}
//       </svg>
//     </div>
//   );
// }

// /** Mini pipeline node card */
// function PipelineNodeCard({
//   node, isActive, isExpanded, onClick,
// }: {
//   node: typeof PIPELINE_NODES[0];
//   isActive: boolean;
//   isExpanded: boolean;
//   onClick: () => void;
// }) {
//   const isProcess = node.id === 'process';
//   return (
//     <motion.div
//       layoutId={`node-${node.id}`}
//       onClick={onClick}
//       whileHover={{ y: -3, boxShadow: `0 8px 32px ${node.color}20` }}
//       whileTap={{ scale: 0.97 }}
//       style={{
//         width: isProcess ? 220 : 180,
//         background: '#0B1410',
//         border: `1px solid ${isActive ? node.color + '60' : 'rgba(30,46,38,0.8)'}`,
//         borderRadius: 10,
//         padding: '18px 20px',
//         cursor: 'pointer',
//         position: 'relative',
//         overflow: 'hidden',
//         userSelect: 'none',
//         transition: 'border-color 0.25s',
//         opacity: isExpanded ? 0.3 : 1,
//       }}
//     >
//       {/* Ambient glow */}
//       {isActive && (
//         <div style={{
//           position: 'absolute', inset: 0,
//           background: `radial-gradient(ellipse at 50% 0%, ${node.color}08 0%, transparent 70%)`,
//           pointerEvents: 'none',
//         }} />
//       )}

//       {/* Top row */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//           <motion.div
//             animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
//             transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
//             style={{ width: 6, height: 6, borderRadius: '50%', background: node.color, boxShadow: `0 0 6px ${node.color}` }}
//           />
//           <span style={{ fontSize: 9, color: node.color, fontWeight: 700, letterSpacing: '0.12em' }}>{node.label}</span>
//         </div>
//         <span style={{
//           fontSize: 8, color: node.color, background: `${node.color}12`,
//           border: `1px solid ${node.color}30`, borderRadius: 4, padding: '2px 7px', letterSpacing: '0.08em',
//         }}>
//           {node.id === 'input' ? 'READY' : node.id === 'process' ? 'ACTIVE' : 'LIVE'}
//         </span>
//       </div>

//       {/* Mini metric */}
//       <div style={{ marginBottom: 8 }}>
//         <div style={{ fontSize: 22, fontWeight: 700, color: node.color, lineHeight: 1, letterSpacing: '-0.02em' }}>
//           {node.id === 'input' ? '7.3B' : node.id === 'process' ? '10.2×' : '11.6ms'}
//         </div>
//         <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: '0.06em' }}>
//           {node.id === 'input' ? 'parameters' : node.id === 'process' ? 'speedup' : 'latency'}
//         </div>
//       </div>

//       {/* Sub label */}
//       <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{node.sub}</div>

//       {/* Bottom mini bar (process node only) */}
//       {isProcess && (
//         <div style={{ marginTop: 12, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
//           <motion.div
//             animate={{ width: ['0%', '100%', '0%'] }}
//             transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
//             style={{ height: '100%', background: 'linear-gradient(90deg, transparent, #00FF85, transparent)' }}
//           />
//         </div>
//       )}

//       {/* Corner accent */}
//       <div style={{
//         position: 'absolute', bottom: 0, right: 0, width: 14, height: 14,
//         borderBottom: `2px solid ${node.color}50`, borderRight: `2px solid ${node.color}50`,
//         borderBottomRightRadius: 10,
//       }} />
//       <div style={{
//         position: 'absolute', top: 0, left: 0, width: 14, height: 14,
//         borderTop: `2px solid ${node.color}50`, borderLeft: `2px solid ${node.color}50`,
//         borderTopLeftRadius: 10,
//       }} />

//       {/* Tap hint */}
//       <div style={{
//         position: 'absolute', bottom: 8, right: 12,
//         fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em',
//       }}>
//         CLICK TO INSPECT →
//       </div>
//     </motion.div>
//   );
// }

// // ─── Main export ─────────────────────────────────────────────────────────────
// export default function SimulationPlatform() {
//   const [activeNode, setActiveNode] = useState<NodeId | null>(null);
//   const sectionRef = useRef<HTMLElement>(null);

//   const openNode = (id: NodeId) => setActiveNode(id);
//   const closeNode = () => setActiveNode(null);

//   return (
//     <section
//       id="simulation"
//       ref={sectionRef}
//       style={{
//         padding: '96px 48px',
//         background: 'var(--bg-secondary)',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Grid texture overlay */}
//       <div style={{
//         position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
//         backgroundImage: `
//           linear-gradient(rgba(0,255,133,0.015) 1px, transparent 1px),
//           linear-gradient(90deg, rgba(0,255,133,0.015) 1px, transparent 1px)
//         `,
//         backgroundSize: '40px 40px',
//       }} />

//       {/* Ambient radial glow */}
//       <div style={{
//         position: 'absolute', top: '30%', left: '50%',
//         transform: 'translateX(-50%)',
//         width: 700, height: 400, borderRadius: '50%',
//         background: 'radial-gradient(ellipse, rgba(0,255,133,0.04) 0%, transparent 70%)',
//         pointerEvents: 'none', zIndex: 0,
//       }} />

//       <div style={{ position: 'relative', zIndex: 1 }}>
//         {/* Section header */}
//         <span className="section-label">// LIVE SIMULATION</span>
//         <h2 className="section-title reveal">
//           Interactive Optimization<br />Pipeline Topology
//         </h2>
//         <p className="section-sub reveal" style={{ marginBottom: 40 }}>
//           A real-time 2D system topology of the QueryNexes compilation and inference
//           acceleration pipeline. Click any node to inspect live telemetry and metrics.
//         </p>

//         {/* ── Pipeline topology ── */}
//         <div style={{ marginBottom: 32 }}>
//           {/* Node row */}
//           <div style={{
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             gap: 0, flexWrap: 'nowrap', padding: '0 0 8px',
//           }}>
//             {PIPELINE_NODES.map((node, i) => (
//               <>
//                 <PipelineNodeCard
//                   key={node.id}
//                   node={node}
//                   isActive={activeNode === node.id}
//                   isExpanded={activeNode !== null && activeNode !== node.id}
//                   onClick={() => openNode(node.id)}
//                 />
//                 {i < PIPELINE_NODES.length - 1 && (
//                   <FlowConnector key={`conn-${i}`} active={activeNode === null} />
//                 )}
//               </>
//             ))}
//           </div>

//           {/* Pipeline label row */}
//           <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
//             {PIPELINE_NODES.map((n, i) => (
//               <>
//                 <div key={n.id} style={{ textAlign: 'center', width: n.id === 'process' ? 220 : 180 }}>
//                   <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
//                     {n.id === 'input' ? 'MODEL INGESTION' : n.id === 'process' ? 'COMPILATION ENGINE' : 'DEPLOYMENT TARGETS'}
//                   </div>
//                 </div>
//                 {i < PIPELINE_NODES.length - 1 && <div key={`sp-${i}`} style={{ flex: 1, minWidth: 48 }} />}
//               </>
//             ))}
//           </div>
//         </div>

//         {/* ── Expanded detail panel ── */}
//         <AnimatePresence mode="wait">
//           {activeNode && (
//             <motion.div
//               key={activeNode}
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 8 }}
//               transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//             >
//               <NodeDetailPanel nodeId={activeNode} onClose={closeNode} />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ── Standalone latency chart (when no node expanded) ── */}
//         {!activeNode && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             style={{
//               background: '#0B1410',
//               border: '1px solid rgba(30,46,38,0.8)',
//               borderRadius: 12,
//               padding: '24px 28px',
//             }}
//           >
//             <LatencyChart />

//             {/* Bottom stat row */}
//             <div style={{
//               display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
//               gap: 1, marginTop: 20,
//               border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, overflow: 'hidden',
//             }}>
//               {[
//                 { label: 'MEMORY SAVED',   value: '67%',   color: '#00FF85' },
//                 { label: 'MODEL SIZE ↓',   value: '4.4×',  color: '#00FF85' },
//                 { label: 'GPU UTIL',        value: '94.2%', color: '#2ED3FF' },
//                 { label: 'UPTIME',          value: '99.8%', color: '#00A854' },
//               ].map(({ label, value, color }) => (
//                 <div key={label} style={{
//                   padding: '16px 20px',
//                   background: 'rgba(0,0,0,0.3)',
//                   borderRight: '1px solid rgba(255,255,255,0.04)',
//                 }}>
//                   <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
//                   <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}

//         {/* ── Legend ── */}
//         <div style={{
//           display: 'flex', gap: 24, marginTop: 20,
//           justifyContent: 'center', flexWrap: 'wrap',
//         }}>
//           {PIPELINE_NODES.map(n => (
//             <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, boxShadow: `0 0 6px ${n.color}` }} />
//               <div>
//                 <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: n.color, letterSpacing: '0.1em' }}>{n.label} NODE</div>
//                 <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{n.sub}</div>
//               </div>
//             </div>
//           ))}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <svg width="32" height="12" viewBox="0 0 32 12">
//               <line x1={0} y1={6} x2={32} y2={6} stroke="#00FF85" strokeWidth={1.5} strokeDasharray="6 4" />
//             </svg>
//             <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Live data flow</span>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @media (max-width: 768px) {
//           #simulation { padding-left: 20px !important; padding-right: 20px !important; padding-top: 64px !important; }
//         }
//       `}</style>
//     </section>
//   );
// }



// src/components/SimulationPlatform/index.tsx
// Fully rewritten — No Three.js. Pure React + framer-motion + SVG.
// Consumes the rich useSimScene() telemetry engine from SimScene.tsx.

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import useSimScene, {
  type NodeId,
  type NodeDetail,
  type LatencyPoint,
  type LogLine,
  type LiveMetrics,
  type ProgressMetric,
} from './SimScene';

// ─────────────────────────────────────────────────────────────────────────────
// Constants & config
// ─────────────────────────────────────────────────────────────────────────────

const PIPELINE_NODES: { id: NodeId; label: string; sub: string; color: string; accentBg: string }[] = [
  { id: 'input',   label: 'INPUT',   sub: 'Model Repository',           color: '#00A854', accentBg: 'rgba(0,168,84,0.06)'  },
  { id: 'process', label: 'PROCESS', sub: 'Compilation · Optimization', color: '#00FF85', accentBg: 'rgba(0,255,133,0.06)' },
  { id: 'output',  label: 'OUTPUT',  sub: 'Cloud · Edge · Enterprise',  color: '#2ED3FF', accentBg: 'rgba(46,211,255,0.06)' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedNumber({
  from, to, decimals = 1, suffix = '', duration = 2.2,
}: {
  from: number; to: number; decimals?: number; suffix?: string; duration?: number;
}) {
  const mv      = useMotionValue(from);
  const display = useTransform(mv, v => v.toFixed(decimals) + suffix);
  useEffect(() => {
    const c = animate(mv, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return c.stop;
  }, [mv, to, duration]);
  return <motion.span style={{ fontVariantNumeric: 'tabular-nums' }}>{display}</motion.span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Live latency chart (bespoke SVG, self-drawing, from SimScene history)
// ─────────────────────────────────────────────────────────────────────────────

const CHART_W = 520;
const CHART_H = 130;

function historyToPath(pts: LatencyPoint[]): { line: string; area: string; lastX: number; lastY: number } {
  if (pts.length < 2) return { line: '', area: '', lastX: 0, lastY: CHART_H };
  const minMs = Math.min(...pts.map(p => p.ms)) - 3;
  const maxMs = Math.max(...pts.map(p => p.ms)) + 3;
  const coords = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * CHART_W;
    const y = CHART_H - ((p.ms - minMs) / (maxMs - minMs || 1)) * CHART_H;
    return { x, y };
  });
  const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${d} L ${CHART_W},${CHART_H} L 0,${CHART_H} Z`;
  const last = coords[coords.length - 1];
  return { line: d, area, lastX: last.x, lastY: last.y };
}

function LatencyChart({ history, metrics }: { history: LatencyPoint[]; metrics: LiveMetrics }) {
  const { line, area, lastX, lastY } = historyToPath(history);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: 6 }}>
            INFERENCE LATENCY — LIVE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: '#00FF85', lineHeight: 1, letterSpacing: '-0.02em' }}>
              <AnimatedNumber from={118.4} to={metrics.latencyMs} decimals={1} suffix="ms" duration={2.2} />
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>118.4ms</span>
            <span style={{
              fontSize: 10, color: '#00FF85',
              background: 'rgba(0,255,133,0.1)', border: '1px solid rgba(0,255,133,0.2)',
              padding: '2px 8px', borderRadius: 4, letterSpacing: '0.04em',
            }}>
              10.2× faster
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 4 }}>THROUGHPUT</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#2ED3FF', lineHeight: 1 }}>
            {metrics.throughput.toLocaleString()}
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>req/s</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(0,255,133,0.08)' }}>
        {/* Y-axis ticks */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 28, width: 40,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '6px 0', pointerEvents: 'none', zIndex: 2,
        }}>
          {['120ms', '80ms', '40ms', '0ms'].map(v => (
            <span key={v} style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', paddingLeft: 5 }}>{v}</span>
          ))}
        </div>

        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: CHART_H, display: 'block', background: 'rgba(5,10,7,0.6)' }}
        >
          {/* Grid */}
          {[0.25, 0.5, 0.75].map(f => (
            <line key={f} x1={0} y1={CHART_H * f} x2={CHART_W} y2={CHART_H * f}
              stroke="rgba(255,255,255,0.035)" strokeWidth={1} />
          ))}
          {/* Vertical time ticks */}
          {[0.25, 0.5, 0.75].map(f => (
            <line key={`v${f}`} x1={CHART_W * f} y1={0} x2={CHART_W * f} y2={CHART_H}
              stroke="rgba(255,255,255,0.02)" strokeWidth={1} />
          ))}

          {/* Area fill */}
          {area && (
            <motion.path d={area} fill="url(#areaGrad)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
          )}

          {/* Main line */}
          {line && (
            <motion.path
              d={line} fill="none" stroke="#00FF85" strokeWidth={1.8}
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            />
          )}

          {/* Live pulse dot */}
          {line && lastX > 0 && (
            <>
              <motion.circle cx={lastX} cy={lastY} r={6} fill="#00FF85" fillOpacity={0.12}
                animate={{ r: [6, 12, 6], fillOpacity: [0.12, 0, 0.12] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
              />
              <motion.circle cx={lastX} cy={lastY} r={3} fill="#00FF85"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              />
            </>
          )}

          {/* Before label */}
          <text x={4} y={13} fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="JetBrains Mono, monospace">
            BEFORE: 118.4ms
          </text>
          {/* After label */}
          {line && lastX > 0 && (
            <text x={lastX - 2} y={lastY - 8} fill="#00FF85" fontSize={8}
              fontFamily="JetBrains Mono, monospace" textAnchor="end">
              {metrics.latencyMs.toFixed(1)}ms
            </text>
          )}

          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#00FF85" stopOpacity={0.14} />
              <stop offset="100%" stopColor="#00FF85" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>

        {/* Live ticker bar */}
        <div style={{
          background: 'rgba(5,10,7,0.85)', borderTop: '1px solid rgba(0,255,133,0.07)',
          padding: '7px 12px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap',
        }}>
          {[
            { l: 'P50', v: `${metrics.p50}ms` },
            { l: 'P95', v: `${metrics.p95}ms` },
            { l: 'P99', v: `${metrics.p99}ms` },
            { l: 'GPU', v: `${metrics.gpuUtil}%` },
            { l: 'MEM', v: `${metrics.memUsageGB}GB` },
            { l: 'ERR', v: `${metrics.errorRate}/10k` },
          ].map(({ l, v }) => (
            <div key={l} style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
              {l} <span style={{ color: '#00FF85', fontWeight: 700 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
            <motion.div
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#00FF85' }}
            />
            <span style={{ fontSize: 8, color: '#00FF85', letterSpacing: '0.12em' }}>LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated progress bar
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({ label, pct, live, delay }: ProgressMetric & { delay: number }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: 9, color: '#00FF85', fontWeight: 700 }}>
          <AnimatedNumber from={0} to={live} decimals={1} suffix="%" duration={1.1} />
        </span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${live}%` }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00A854, #00FF85)',
            borderRadius: 2,
            boxShadow: '0 0 8px rgba(0,255,133,0.6)',
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Terminal log
// ─────────────────────────────────────────────────────────────────────────────

const LOG_COLORS: Record<LogLine['kind'], string> = {
  cmd:    'var(--text-primary)',
  ok:     '#00FF85',
  warn:   '#FFB020',
  info:   'rgba(255,255,255,0.45)',
  metric: '#2ED3FF',
};

function TerminalLog({ lines, maxVisible = 9 }: { lines: LogLine[]; maxVisible?: number }) {
  const endRef = useRef<HTMLDivElement>(null);
  const shown  = lines.slice(-maxVisible);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines.length]);

  return (
    <div style={{
      background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,255,133,0.07)',
      borderRadius: 7, overflow: 'hidden', marginTop: 14,
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px',
        borderBottom: '1px solid rgba(0,255,133,0.06)', background: 'rgba(0,0,0,0.3)',
      }}>
        {['#1a2e24', '#1a2e24', '#1a2e24'].map((c, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', marginLeft: 6, letterSpacing: '0.08em' }}>
          compile.log
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 8, color: 'rgba(255,255,255,0.1)' }}>
          {lines.length} lines
        </span>
      </div>

      {/* Log lines */}
      <div style={{ padding: '8px 12px', minHeight: 120, maxHeight: 160, overflowY: 'auto' }}>
        <AnimatePresence initial={false}>
          {shown.map(line => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -8, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{
                fontSize: 10.5, lineHeight: 1.75,
                fontFamily: 'JetBrains Mono, monospace',
                color: LOG_COLORS[line.kind],
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.15)', marginRight: 8 }}>{line.ts}</span>
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{
            display: 'inline-block', width: 7, height: 12,
            background: '#00FF85', verticalAlign: 'middle', marginTop: 2,
          }}
        />
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Node detail panel (expanded view)
// ─────────────────────────────────────────────────────────────────────────────

function NodeDetailPanel({
  nodeId, detail, history, metrics, onClose,
}: {
  nodeId: NodeId;
  detail: NodeDetail;
  history: LatencyPoint[];
  metrics: LiveMetrics;
  onClose: () => void;
}) {
  const { color } = detail;

  return (
    <motion.div
      key={nodeId}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#0B1410',
        border: `1px solid ${color}25`,
        borderRadius: 12,
        padding: '26px 28px 24px',
        position: 'relative',
        boxShadow: `0 4px 80px ${color}0D, 0 0 0 1px ${color}10`,
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6, padding: '4px 12px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          color: 'rgba(255,255,255,0.35)', cursor: 'pointer', letterSpacing: '0.06em',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
      >
        ← BACK
      </button>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <motion.div
          animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }}
        />
        <span style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: '0.14em' }}>{detail.title}</span>
        <span style={{
          fontSize: 9, color, background: `${color}14`,
          border: `1px solid ${color}35`, borderRadius: 4,
          padding: '2px 9px', letterSpacing: '0.1em',
        }}>
          {detail.badge}
        </span>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>

        {/* LEFT: data grid + progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Key-value grid */}
          <div style={{
            background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 8, padding: '12px 16px',
          }}>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', marginBottom: 10 }}>
              NODE TELEMETRY
            </div>
            {detail.lines.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', justifyContent: 'space-between', gap: 12,
                  padding: '5px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.035)',
                }}
              >
                <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em', flexShrink: 0 }}>{k}</span>
                <span style={{
                  fontSize: 9.5, fontWeight: 600, textAlign: 'right',
                  color: v.includes('✓') ? color : v.includes('ms') || v.includes('req') ? '#2ED3FF' : 'rgba(255,255,255,0.7)',
                }}>
                  {v}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress bars */}
          {detail.progress && detail.progress.length > 0 && (
            <div style={{
              background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 8, padding: '12px 16px',
            }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', marginBottom: 12 }}>
                OPTIMIZATION METRICS
              </div>
              {detail.progress.map((p, i) => (
                <ProgressBar key={p.label} {...p} delay={0.2 + i * 0.12} />
              ))}
            </div>
          )}

          {/* Kernel pass (process node) */}
          {nodeId === 'process' && (
            <div style={{
              background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 8, padding: '12px 16px',
            }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', marginBottom: 12 }}>
                COMPILATION PASSES
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: 7 }, (_, i) => (
                  <motion.div
                    key={i}
                    animate={i < metrics.kernelPass
                      ? { background: '#00FF85', boxShadow: '0 0 8px #00FF85' }
                      : { background: 'rgba(255,255,255,0.07)', boxShadow: 'none' }}
                    transition={{ duration: 0.4 }}
                    style={{ flex: 1, height: 20, borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                ))}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 7, letterSpacing: '0.06em' }}>
                PASS {metrics.kernelPass} / 7 COMPLETE
              </div>
            </div>
          )}

          {/* Deploy targets (output node) */}
          {nodeId === 'output' && (
            <div style={{
              background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 8, padding: '12px 16px',
            }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', marginBottom: 12 }}>
                DEPLOYMENT TARGETS
              </div>
              {[
                { label: 'CLOUD GPU',   color: '#2ED3FF', speedup: '12.4×' },
                { label: 'EDGE DEVICE', color: '#00FF85', speedup: '67% ↓ mem' },
                { label: 'ENTERPRISE',  color: '#FFB020', speedup: '99.8% SLA' },
              ].map(t => (
                <div key={t.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.035)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: Math.random() }}
                      style={{ width: 5, height: 5, borderRadius: '50%', background: t.color }}
                    />
                    <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{t.label}</span>
                  </div>
                  <span style={{ fontSize: 9.5, color: t.color, fontWeight: 600 }}>{t.speedup}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: chart + terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <LatencyChart history={history} metrics={metrics} />
          <TerminalLog lines={detail.logs} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: color }}
          />
          <span style={{ fontSize: 9, color, letterSpacing: '0.1em' }}>SYSTEM ACTIVE</span>
        </div>
        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.06em' }}>
          QNX v2.4.1 · PKT IN {metrics.packetsIn.toLocaleString()} · PKT OUT {metrics.packetsOut.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated SVG data-flow connector
// ─────────────────────────────────────────────────────────────────────────────

function FlowConnector({ paused, packetCount }: { paused: boolean; packetCount: number }) {
  return (
    <div style={{ flex: 1, minWidth: 40, height: 56, display: 'flex', alignItems: 'center', position: 'relative' }}>
      <svg width="100%" height="28" viewBox="0 0 110 28" preserveAspectRatio="none" overflow="visible">
        {/* Glow blur track */}
        <line x1={0} y1={14} x2={110} y2={14} stroke="rgba(0,255,133,0.05)" strokeWidth={10} />
        {/* Base rail */}
        <line x1={0} y1={14} x2={110} y2={14} stroke="rgba(0,168,84,0.18)" strokeWidth={1} strokeDasharray="3 7" />
        {/* Animated flow dash */}
        <motion.line
          x1={0} y1={14} x2={110} y2={14}
          stroke="#00FF85" strokeWidth={1.5} strokeDasharray="10 20"
          animate={!paused ? { strokeDashoffset: [0, -30] } : { strokeDashoffset: 0 }}
          transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
        />
        {/* Arrowhead */}
        <polygon points="107,9 115,14 107,19" fill="rgba(0,255,133,0.45)" />
        {/* Packet dots — staggered */}
        {!paused && [0, 0.38, 0.72].map((delay, i) => (
          <motion.circle
            key={`${i}-${packetCount}`}
            r={2.8} cy={14} fill="#00FF85"
            initial={{ cx: 0, opacity: 1 }}
            animate={{ cx: 112, opacity: [1, 1, 0] }}
            transition={{ duration: 1.05, delay, ease: 'linear' }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline node card (collapsed view)
// ─────────────────────────────────────────────────────────────────────────────

function PipelineNodeCard({
  node, detail, metrics, isOpen, isDimmed, onClick,
}: {
  node: typeof PIPELINE_NODES[0];
  detail: NodeDetail;
  metrics: LiveMetrics;
  isOpen: boolean;
  isDimmed: boolean;
  onClick: () => void;
}) {
  const isProcess = node.id === 'process';
  const heroValue = node.id === 'input' ? '7.3B' : node.id === 'process' ? '10.2×' : `${metrics.latencyMs.toFixed(1)}ms`;
  const heroSub   = node.id === 'input' ? 'parameters' : node.id === 'process' ? 'speedup' : 'latency';

  return (
    <motion.div
      onClick={onClick}
      animate={{
        opacity: isDimmed ? 0.28 : 1,
        scale:   isDimmed ? 0.97 : 1,
        y:       isOpen   ? -4   : 0,
      }}
      whileHover={!isDimmed ? { y: -4, boxShadow: `0 12px 40px ${node.color}18` } : {}}
      whileTap={!isDimmed ? { scale: 0.97 } : {}}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: isProcess ? 216 : 176,
        background: '#0B1410',
        border: `1px solid ${isOpen ? node.color + '55' : 'rgba(30,46,38,0.8)'}`,
        borderRadius: 10,
        padding: '18px 20px',
        cursor: isDimmed ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        transition: 'border-color 0.25s',
        boxShadow: isOpen ? `0 0 0 1px ${node.color}20` : 'none',
      }}
    >
      {/* Ambient top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 60,
        background: `radial-gradient(ellipse at 50% 0%, ${node.color}0B 0%, transparent 80%)`,
        pointerEvents: 'none',
      }} />

      {/* Status row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: node.color, boxShadow: `0 0 7px ${node.color}` }}
          />
          <span style={{ fontSize: 9, color: node.color, fontWeight: 700, letterSpacing: '0.13em' }}>{node.label}</span>
        </div>
        <span style={{
          fontSize: 8, color: node.color, background: `${node.color}12`,
          border: `1px solid ${node.color}28`, borderRadius: 4, padding: '2px 7px', letterSpacing: '0.08em',
        }}>
          {detail.badge}
        </span>
      </div>

      {/* Hero metric */}
      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontSize: isProcess ? 26 : 24, fontWeight: 700, color: node.color,
          lineHeight: 1, letterSpacing: '-0.02em',
        }}>
          {node.id === 'output'
            ? <AnimatedNumber from={118.4} to={metrics.latencyMs} decimals={1} suffix="ms" duration={0.5} />
            : heroValue
          }
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 3, letterSpacing: '0.05em' }}>
          {heroSub}
        </div>
      </div>

      {/* Sub label */}
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.27)', letterSpacing: '0.03em', marginBottom: isProcess ? 10 : 0 }}>
        {node.sub}
      </div>

      {/* Process node: live scan bar */}
      {isProcess && (
        <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden', marginTop: 8 }}>
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '50%', height: '100%', background: `linear-gradient(90deg, transparent, ${node.color}, transparent)` }}
          />
        </div>
      )}

      {/* Corner brackets */}
      {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
        <div key={`${v}${h}`} style={{
          position: 'absolute', width: 11, height: 11,
          [v]: 0, [h]: 0,
          [`border${v.charAt(0).toUpperCase() + v.slice(1)}`]: `1.5px solid ${node.color}45`,
          [`border${h.charAt(0).toUpperCase() + h.slice(1)}`]: `1.5px solid ${node.color}45`,
          [`border${v.charAt(0).toUpperCase() + v.slice(1)}${h.charAt(0).toUpperCase() + h.slice(1)}Radius`]: 10,
        }} />
      ))}

      {/* Tap hint */}
      {!isDimmed && (
        <div style={{
          position: 'absolute', bottom: 8, right: 10,
          fontSize: 7.5, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em',
        }}>
          INSPECT →
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Overview stats bar (shown when no node is expanded)
// ─────────────────────────────────────────────────────────────────────────────

function OverviewStats({ metrics, history }: { metrics: LiveMetrics; history: LatencyPoint[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#0B1410',
        border: '1px solid rgba(30,46,38,0.8)',
        borderRadius: 12,
        padding: '22px 26px',
      }}
    >
      <LatencyChart history={history} metrics={metrics} />

      {/* KPI strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, marginTop: 18,
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: 8, overflow: 'hidden',
      }}>
        {[
          { label: 'MEMORY SAVED',  value: '67%',    color: '#00FF85' },
          { label: 'MODEL SIZE ↓',  value: '4.4×',   color: '#00FF85' },
          { label: 'GPU UTIL',       value: `${metrics.gpuUtil}%`,  color: '#2ED3FF' },
          { label: 'UPTIME',         value: '99.8%',  color: '#00A854' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            padding: '15px 18px',
            background: 'rgba(0,0,0,0.28)',
            borderRight: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 7 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1, letterSpacing: '-0.01em' }}>{value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function SimulationPlatform() {
  const {
    latencyMV, metrics, history,
    nodeDetails, activeNode, setActiveNode,
    paused, togglePause, resetSim,
    packetCounters, spikeAlert,
  } = useSimScene();

  const openNode  = useCallback((id: NodeId) => setActiveNode(id), [setActiveNode]);
  const closeNode = useCallback(() => setActiveNode(null), [setActiveNode]);

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
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,255,133,0.012) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,133,0.012) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
      }} />
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 450, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,255,133,0.032) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <span className="section-label">// LIVE SIMULATION</span>
        <h2 className="section-title reveal">
          Interactive Optimization<br />Pipeline Topology
        </h2>
        <p className="section-sub reveal" style={{ marginBottom: 36 }}>
          A 2D real-time system topology of the QueryNexes compilation and inference
          acceleration pipeline. Click any node to inspect live telemetry &amp; metrics.
        </p>

        {/* Controls bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          <button
            onClick={togglePause}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              letterSpacing: '0.06em', padding: '8px 16px', borderRadius: 6,
              border: '1px solid rgba(30,46,38,0.9)',
              background: paused ? 'rgba(0,255,133,0.07)' : 'rgba(0,0,0,0.3)',
              color: paused ? '#00FF85' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {paused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
          <button
            onClick={resetSim}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              letterSpacing: '0.06em', padding: '8px 16px', borderRadius: 6,
              border: '1px solid rgba(30,46,38,0.9)',
              background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.35)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            ↺ RESET
          </button>
          {activeNode && (
            <button
              onClick={closeNode}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                letterSpacing: '0.06em', padding: '8px 16px', borderRadius: 6,
                border: '1px solid rgba(0,168,84,0.35)',
                background: 'rgba(0,168,84,0.06)', color: '#00A854',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              ← BACK TO OVERVIEW
            </button>
          )}
          {/* Live PKT counter */}
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em',
          }}>
            <span>PKT IN <span style={{ color: '#00A854' }}>{metrics.packetsIn.toLocaleString()}</span></span>
            <span>PKT OUT <span style={{ color: '#00FF85' }}>{metrics.packetsOut.toLocaleString()}</span></span>
          </div>
        </div>

        {/* ── Spike alert ── */}
        <AnimatePresence>
          {spikeAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              style={{
                marginBottom: 16, padding: '9px 16px', borderRadius: 7,
                background: 'rgba(255,176,32,0.07)', border: '1px solid rgba(255,176,32,0.3)',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                color: '#FFB020', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                ●
              </motion.span>
              {spikeAlert}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pipeline topology ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
            {PIPELINE_NODES.map((node, i) => (
              <div key={node.id} style={{ display: 'flex', alignItems: 'center', flex: node.id === 'process' ? 0 : 0 }}>
                <PipelineNodeCard
                  node={node}
                  detail={nodeDetails[node.id]}
                  metrics={metrics}
                  isOpen={activeNode === node.id}
                  isDimmed={activeNode !== null && activeNode !== node.id}
                  onClick={() => activeNode === node.id ? closeNode() : openNode(node.id)}
                />
                {i < PIPELINE_NODES.length - 1 && (
                  <FlowConnector
                    paused={paused}
                    packetCount={i === 0 ? packetCounters.seg0 : packetCounters.seg1}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Pipeline node labels */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, gap: 0 }}>
            {PIPELINE_NODES.map((n, i) => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: n.id === 'process' ? 216 : 176, textAlign: 'center' }}>
                  <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em' }}>
                    {n.id === 'input' ? 'MODEL INGESTION' : n.id === 'process' ? 'COMPILATION ENGINE' : 'DEPLOYMENT TARGETS'}
                  </div>
                </div>
                {i < PIPELINE_NODES.length - 1 && <div style={{ flex: 1, minWidth: 40 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail panel or overview stats ── */}
        <AnimatePresence mode="wait">
          {activeNode ? (
            <NodeDetailPanel
              key={activeNode}
              nodeId={activeNode}
              detail={nodeDetails[activeNode]}
              history={history}
              metrics={metrics}
              onClose={closeNode}
            />
          ) : (
            <OverviewStats key="overview" metrics={metrics} history={history} />
          )}
        </AnimatePresence>

        {/* ── Legend ── */}
        <div style={{
          display: 'flex', gap: 28, marginTop: 22,
          justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {PIPELINE_NODES.map(n => (
            <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.color, boxShadow: `0 0 6px ${n.color}` }} />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, color: n.color, letterSpacing: '0.1em' }}>
                  {n.label} NODE
                </div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>{n.sub}</div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="28" height="10" viewBox="0 0 28 10">
              <line x1={0} y1={5} x2={28} y2={5} stroke="#00FF85" strokeWidth={1.5} strokeDasharray="5 4" />
            </svg>
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>Live data flow</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #simulation {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: 64px !important;
          }
        }
      `}</style>
    </section>
  );
}