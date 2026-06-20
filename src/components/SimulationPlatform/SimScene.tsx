// import { useEffect, useRef, useState, useCallback } from 'react';
// import * as THREE from 'three';
// import { playSimClick, playIslandHover } from '../../utils/audio';

// type SimMode = 'overview' | 'input' | 'process' | 'output';

// interface Island {
//   group: THREE.Group;
//   ring: THREE.Mesh;
//   base: THREE.Mesh;
//   label: string;
//   sublabel: string;
//   position: [number, number, number];
// }

// interface DetailInfo {
//   title: string;
//   lines: [string, string][];
//   progress?: { label: string; pct: number }[];
// }

// const DETAIL_DATA: Record<string, DetailInfo> = {
//   overview: { title: '', lines: [] },
//   input: {
//     title: 'INPUT NODE',
//     lines: [
//       ['FORMAT', 'PyTorch 2.1'],
//       ['PARAMETERS', '7.3B'],
//       ['LAYERS DETECTED', '312'],
//       ['COMPATIBILITY', '✓ VERIFIED'],
//       ['STATUS', 'SCANNING...'],
//     ],
//   },
//   process: {
//     title: 'PROCESS NODE',
//     lines: [
//       ['PASS', '3 / 7'],
//       ['ACCURACY', '99.97% PRESERVED'],
//       ['KERNELS', 'FUSING...'],
//       ['PRECISION', 'INT8 / FP16'],
//     ],
//     progress: [
//       { label: 'MEMORY REDUCTION', pct: 78 },
//       { label: 'LATENCY OPTIMIZE', pct: 62 },
//       { label: 'THROUGHPUT GAIN', pct: 91 },
//     ],
//   },
//   output: {
//     title: 'OUTPUT NODE',
//     lines: [
//       ['CLOUD GPU', '✓ READY  12.4×'],
//       ['EDGE DEVICE', '✓ READY  67% ↓'],
//       ['ENTERPRISE', '✓ READY  99.8%'],
//       ['LATENCY', '3.2ms (was 41ms)'],
//       ['THROUGHPUT', '8,900 req/s'],
//     ],
//   },
// };

// function buildIsland(
//   x: number, y: number, z: number,
//   baseColor: number, emissiveColor: number,
//   isCenter = false
// ): { group: THREE.Group; ring: THREE.Mesh; base: THREE.Mesh } {
//   const group = new THREE.Group();
//   group.position.set(x, y, z);

//   // Multi-layer PCB stack
//   const layerCount = isCenter ? 5 : 3;
//   for (let i = 0; i < layerCount; i++) {
//     const size = 2.2 - i * (isCenter ? 0.18 : 0.2);
//     const mat = new THREE.MeshStandardMaterial({
//       color: i === 0 ? baseColor : new THREE.Color(baseColor).lerp(new THREE.Color(0x16241D), i * 0.25).getHex(),
//       metalness: 0.88,
//       roughness: 0.12,
//       emissive: emissiveColor,
//       emissiveIntensity: 0.3 + (layerCount - i) * 0.05,
//     });
//     const slab = new THREE.Mesh(new THREE.BoxGeometry(size, 0.12, size), mat);
//     slab.position.y = 0.25 + i * 0.14 + (isCenter ? i * 0.03 : 0);
//     slab.castShadow = true;
//     group.add(slab);
//   }

//   // Base platform
//   const baseMat = new THREE.MeshStandardMaterial({
//     color: baseColor,
//     metalness: 0.9,
//     roughness: 0.15,
//     emissive: emissiveColor,
//     emissiveIntensity: 0.5,
//   });
//   const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 2.6), baseMat);
//   base.position.y = 0;
//   base.castShadow = true;
//   base.receiveShadow = true;
//   group.add(base);

//   // Pulsing ring
//   const ring = new THREE.Mesh(
//     new THREE.TorusGeometry(1.9, 0.04, 8, 48),
//     new THREE.MeshBasicMaterial({ color: 0x00FF85, transparent: true, opacity: 0.5 })
//   );
//   ring.rotation.x = Math.PI / 2;
//   ring.position.y = -0.28;
//   group.add(ring);

//   // Outer ring
//   const outerRing = new THREE.Mesh(
//     new THREE.TorusGeometry(2.5, 0.02, 6, 48),
//     new THREE.MeshBasicMaterial({ color: 0x00A854, transparent: true, opacity: 0.3 })
//   );
//   outerRing.rotation.x = Math.PI / 2;
//   outerRing.position.y = -0.28;
//   group.add(outerRing);

//   // LED strips on sides
//   if (isCenter) {
//     const ledMat = new THREE.MeshBasicMaterial({ color: 0x00FF85 });
//     for (let side = 0; side < 4; side++) {
//       const led = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.6, 0.02), ledMat);
//       const angle = (side / 4) * Math.PI * 2;
//       led.position.set(Math.cos(angle) * 1.3, 0.3, Math.sin(angle) * 1.3);
//       group.add(led);
//     }
//   }

//   // Core sphere (center only)
//   if (isCenter) {
//     const core = new THREE.Mesh(
//       new THREE.SphereGeometry(0.3, 16, 16),
//       new THREE.MeshStandardMaterial({ color: 0x00FFC3, emissive: 0x00FFC3, emissiveIntensity: 2 })
//     );
//     core.position.y = 1.0;
//     group.add(core);
//   }

//   return { group, ring, base };
// }

// function buildDataTube(from: THREE.Vector3, to: THREE.Vector3): { tube: THREE.Mesh; glowTube: THREE.Mesh } {
//   const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
//   mid.y += 1.5;
//   const curve = new THREE.CatmullRomCurve3([from, mid, to]);
//   const geo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
//   const mat = new THREE.MeshBasicMaterial({ color: 0x00A854, transparent: true, opacity: 0.5 });
//   const tube = new THREE.Mesh(geo, mat);

//   const glowGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
//   const glowMat = new THREE.MeshBasicMaterial({ color: 0x00FF85, transparent: true, opacity: 0.08 });
//   const glowTube = new THREE.Mesh(glowGeo, glowMat);

//   return { tube, glowTube };
// }

// export default function SimulationScene() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const modeRef = useRef<SimMode>('overview');
//   const pausedRef = useRef(false);
//   const frameRef = useRef<number>(0);
//   const sceneDataRef = useRef<{
//     scene: THREE.Scene;
//     camera: THREE.PerspectiveCamera;
//     renderer: THREE.WebGLRenderer;
//     islands: Island[];
//     raycaster: THREE.Raycaster;
//     dataParticleGeo: THREE.BufferGeometry;
//     dpAngles: Float32Array;
//     dpT: Float32Array;
//     dpSeg: Int32Array;
//     orbitGeo: THREE.BufferGeometry;
//     orbitAngles: Float32Array;
//     orbitRadii: Float32Array;
//     orbitMesh: THREE.Points;
//     camTarget: { x: number; y: number; z: number };
//     camLook: THREE.Vector3;
//     inputDetailGroup: THREE.Group;
//     processDetailGroup: THREE.Group;
//     outputDetailGroup: THREE.Group;
//     processLayerOffsets: Float32Array;
//     outputPackets: { mesh: THREE.Mesh; t: number; speed: number; target: THREE.Vector3 }[];
//   } | null>(null);

//   const [mode, setMode] = useState<SimMode>('overview');
//   const [paused, setPaused] = useState(false);
//   const [hovered, setHovered] = useState<number | null>(null);

//   const switchMode = useCallback((newMode: SimMode) => {
//     modeRef.current = newMode;
//     setMode(newMode);
//     playSimClick();

//     const data = sceneDataRef.current;
//     if (!data) return;

//     // Update camera target
//     if (newMode === 'overview') {
//       data.camTarget = { x: 0, y: 6, z: 16 };
//       data.camLook.set(0, 0, 0);
//     } else if (newMode === 'input') {
//       data.camTarget = { x: -5.5, y: 3, z: 8 };
//       data.camLook.set(-5.5, 0.5, 0);
//     } else if (newMode === 'process') {
//       data.camTarget = { x: 0, y: 4, z: 8 };
//       data.camLook.set(0, 1, 0);
//     } else if (newMode === 'output') {
//       data.camTarget = { x: 5.5, y: 3, z: 8 };
//       data.camLook.set(5.5, 0.5, 0);
//     }

//     // Show/hide detail groups
//     data.inputDetailGroup.visible = newMode === 'input';
//     data.processDetailGroup.visible = newMode === 'process';
//     data.outputDetailGroup.visible = newMode === 'output';
//     data.orbitMesh.visible = newMode !== 'overview';
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || window.innerWidth < 768) return;

//     const w = canvas.clientWidth;
//     const h = canvas.clientHeight;

//     const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
//     renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
//     renderer.setSize(w, h);
//     renderer.setClearColor(0x050A07, 1);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//     const scene = new THREE.Scene();
//     scene.fog = new THREE.FogExp2(0x050A07, 0.025);

//     const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
//     camera.position.set(0, 6, 16);

//     // Lighting
//     scene.add(new THREE.AmbientLight(0x003818, 0.8));
//     const mainLight = new THREE.DirectionalLight(0x00FF85, 1.2);
//     mainLight.position.set(5, 12, 8);
//     mainLight.castShadow = true;
//     scene.add(mainLight);
//     const fillLight = new THREE.PointLight(0x00FFC3, 2, 30);
//     fillLight.position.set(0, 8, 0);
//     scene.add(fillLight);
//     const rimLight = new THREE.PointLight(0x00A854, 1.5, 25);
//     rimLight.position.set(-8, 4, -4);
//     scene.add(rimLight);

//     // Grid
//     const gridGeo = new THREE.PlaneGeometry(40, 40, 36, 36);
//     const gridMat = new THREE.MeshBasicMaterial({ color: 0x00A854, wireframe: true, transparent: true, opacity: 0.04 });
//     const gridMesh = new THREE.Mesh(gridGeo, gridMat);
//     gridMesh.rotation.x = -Math.PI / 2;
//     gridMesh.position.y = -2;
//     scene.add(gridMesh);

//     // Islands
//     const islandDefs = [
//       { x: -5.5, y: 0, z: 0, color: 0x0B1410, emissive: 0x001808, label: 'INPUT', sublabel: 'Model Repository', center: false },
//       { x: 0, y: 0.6, z: 0, color: 0x111C16, emissive: 0x002810, label: 'PROCESS', sublabel: 'Compilation · Optimization', center: true },
//       { x: 5.5, y: 0, z: 0, color: 0x0B1410, emissive: 0x001808, label: 'OUTPUT', sublabel: 'Cloud · Edge · Enterprise', center: false },
//     ];

//     const islands: Island[] = islandDefs.map(d => {
//       const { group, ring, base } = buildIsland(d.x, d.y, d.z, d.color, d.emissive, d.center);
//       scene.add(group);
//       return { group, ring, base, label: d.label, sublabel: d.sublabel, position: [d.x, d.y, d.z] };
//     });

//     // Tubes between islands
//     const tubeData = [
//       { from: new THREE.Vector3(-3.2, 0.5, 0), to: new THREE.Vector3(-1.3, 0.8, 0) },
//       { from: new THREE.Vector3(1.3, 0.8, 0), to: new THREE.Vector3(3.2, 0.5, 0) },
//     ];
//     tubeData.forEach(td => {
//       const { tube, glowTube } = buildDataTube(td.from, td.to);
//       scene.add(tube);
//       scene.add(glowTube);
//     });

//     // Data stream particles
//     const dpCount = 160;
//     const dpPos = new Float32Array(dpCount * 3);
//     const dpT = new Float32Array(dpCount);
//     const dpSeg = new Int32Array(dpCount);
//     for (let i = 0; i < dpCount; i++) {
//       dpT[i] = Math.random();
//       dpSeg[i] = Math.floor(Math.random() * 2);
//     }
//     const dpGeo = new THREE.BufferGeometry();
//     dpGeo.setAttribute('position', new THREE.BufferAttribute(dpPos, 3));
//     const dpMesh = new THREE.Points(dpGeo, new THREE.PointsMaterial({
//       color: 0x00FF85, size: 0.09, transparent: true, opacity: 0.9,
//     }));
//     scene.add(dpMesh);

//     // Orbital particles (detail mode)
//     const orbitCount = 100;
//     const orbitPos = new Float32Array(orbitCount * 3);
//     const orbitAngles = new Float32Array(orbitCount);
//     const orbitRadii = new Float32Array(orbitCount);
//     for (let i = 0; i < orbitCount; i++) {
//       orbitAngles[i] = Math.random() * Math.PI * 2;
//       orbitRadii[i] = 1.8 + Math.random() * 2.2;
//     }
//     const orbitGeo = new THREE.BufferGeometry();
//     orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
//     const orbitMesh = new THREE.Points(orbitGeo, new THREE.PointsMaterial({
//       color: 0x00FFC3, size: 0.065, transparent: true, opacity: 0.75,
//     }));
//     orbitMesh.visible = false;
//     scene.add(orbitMesh);

//     // --- INPUT DETAIL GROUP ---
//     const inputDetailGroup = new THREE.Group();
//     inputDetailGroup.visible = false;
//     const fileFormats = ['model.pt', 'model.onnx', 'model.pb', 'model.tflite'];
//     fileFormats.forEach((_, fi) => {
//       const angle = (fi / fileFormats.length) * Math.PI * 2;
//       const fm = new THREE.Mesh(
//         new THREE.BoxGeometry(0.9, 0.05, 1.2),
//         new THREE.MeshStandardMaterial({ color: 0x111C16, metalness: 0.8, roughness: 0.2, emissive: 0x002210, emissiveIntensity: 0.5 })
//       );
//       fm.position.set(
//         Math.cos(angle) * 2.5 - 5.5,
//         1.5 + Math.sin(fi) * 0.3,
//         Math.sin(angle) * 1.5
//       );
//       fm.rotation.x = -0.3;
//       inputDetailGroup.add(fm);

//       // File edge glow
//       const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.05, 1.2));
//       const edgeMat = new THREE.LineBasicMaterial({ color: 0x00FF85, transparent: true, opacity: 0.8 });
//       const edgeMesh = new THREE.LineSegments(edges, edgeMat);
//       edgeMesh.position.copy(fm.position);
//       edgeMesh.rotation.copy(fm.rotation);
//       inputDetailGroup.add(edgeMesh);
//     });
//     // Intake funnel
//     const funnel = new THREE.Mesh(
//       new THREE.ConeGeometry(0.8, 1.5, 12, 1, true),
//       new THREE.MeshBasicMaterial({ color: 0x00A854, wireframe: true, transparent: true, opacity: 0.6 })
//     );
//     funnel.position.set(-5.5, 0.5, 0);
//     inputDetailGroup.add(funnel);
//     scene.add(inputDetailGroup);

//     // --- PROCESS DETAIL GROUP ---
//     const processDetailGroup = new THREE.Group();
//     processDetailGroup.visible = false;
//     const layerColors = [0x001808, 0x002210, 0x003018, 0x00401C];
//     const processLayerOffsets = new Float32Array(4);
//     for (let li = 0; li < 4; li++) {
//       const layer = new THREE.Mesh(
//         new THREE.BoxGeometry(2.0 - li * 0.1, 0.08, 2.0 - li * 0.1),
//         new THREE.MeshStandardMaterial({ color: 0x111C16, emissive: layerColors[li], emissiveIntensity: 1.5, transparent: true, opacity: 0.9 })
//       );
//       layer.position.y = li * 0.4;
//       processDetailGroup.add(layer);
//       processLayerOffsets[li] = li * 0.4;
//     }
//     // IR graph nodes
//     const nodeCount = 12;
//     const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00FF85, emissive: 0x00FF85, emissiveIntensity: 1.5 });
//     const nodePositions: THREE.Vector3[] = [];
//     for (let ni = 0; ni < nodeCount; ni++) {
//       const nMesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), nodeMat);
//       const np = new THREE.Vector3(
//         (Math.random() - 0.5) * 1.6,
//         Math.random() * 1.2 + 0.2,
//         (Math.random() - 0.5) * 1.6
//       );
//       nMesh.position.copy(np);
//       nodePositions.push(np);
//       processDetailGroup.add(nMesh);
//     }
//     // Edges between nodes
//     for (let ni = 0; ni < nodeCount - 1; ni++) {
//       const pts = [nodePositions[ni], nodePositions[ni + 1]];
//       const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
//       processDetailGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x00A854, transparent: true, opacity: 0.5 })));
//     }
//     processDetailGroup.position.set(0, 0, 0);
//     scene.add(processDetailGroup);

//     // --- OUTPUT DETAIL GROUP ---
//     const outputDetailGroup = new THREE.Group();
//     outputDetailGroup.visible = false;
//     const deployTargets = [
//       { x: -1.8, y: 0.8, z: -1, color: 0x2ED3FF, label: 'CLOUD' },
//       { x: 0, y: 1.2, z: 0.5, color: 0x00FF85, label: 'EDGE' },
//       { x: 1.8, y: 0.8, z: -1, color: 0xFFB020, label: 'ENTERPRISE' },
//     ];
//     deployTargets.forEach(dt => {
//       const zone = new THREE.Mesh(
//         new THREE.BoxGeometry(0.9, 0.6, 0.9),
//         new THREE.MeshStandardMaterial({ color: 0x111C16, emissive: new THREE.Color(dt.color).multiplyScalar(0.3).getHex(), emissiveIntensity: 1 })
//       );
//       zone.position.set(dt.x + 5.5, dt.y, dt.z);
//       outputDetailGroup.add(zone);
//       // Status LED
//       const led = new THREE.Mesh(
//         new THREE.SphereGeometry(0.1, 8, 8),
//         new THREE.MeshBasicMaterial({ color: dt.color })
//       );
//       led.position.set(dt.x + 5.5, dt.y + 0.5, dt.z);
//       outputDetailGroup.add(led);
//     });

//     // Output packets
//     const outputPackets: { mesh: THREE.Mesh; t: number; speed: number; target: THREE.Vector3 }[] = [];
//     deployTargets.forEach(dt => {
//       const pkg = new THREE.Mesh(
//         new THREE.BoxGeometry(0.18, 0.18, 0.18),
//         new THREE.MeshStandardMaterial({ color: 0x00FF85, emissive: 0x00FF85, emissiveIntensity: 1.5 })
//       );
//       outputPackets.push({ mesh: pkg, t: Math.random(), speed: 0.008 + Math.random() * 0.006, target: new THREE.Vector3(dt.x + 5.5, dt.y, dt.z) });
//       scene.add(pkg);
//     });
//     scene.add(outputDetailGroup);

//     // Raycaster
//     const raycaster = new THREE.Raycaster();
//     const mouse = new THREE.Vector2();

//     const camTarget = { x: 0, y: 6, z: 16 };
//     const camLook = new THREE.Vector3(0, 0, 0);

//     sceneDataRef.current = {
//       scene, camera, renderer, islands, raycaster,
//       dataParticleGeo: dpGeo,
//       dpAngles: new Float32Array(dpCount),
//       dpT, dpSeg,
//       orbitGeo, orbitAngles, orbitRadii, orbitMesh,
//       camTarget, camLook,
//       inputDetailGroup, processDetailGroup, outputDetailGroup,
//       processLayerOffsets,
//       outputPackets,
//     };

//     // Click handler
//     const onClick = (e: MouseEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//       mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
//       raycaster.setFromCamera(mouse, camera);
//       const baseMeshes = islands.map(isl => isl.base);
//       const hits = raycaster.intersectObjects(baseMeshes);
//       if (hits.length) {
//         const idx = baseMeshes.indexOf(hits[0].object as THREE.Mesh);
//         const modes: SimMode[] = ['input', 'process', 'output'];
//         switchMode(modes[idx]);
//       } else if (modeRef.current !== 'overview') {
//         // Click elsewhere in detail mode = back to overview
//       }
//     };
//     canvas.addEventListener('click', onClick);

//     // Hover handler
//     const onMouseMove = (e: MouseEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//       mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
//       raycaster.setFromCamera(mouse, camera);
//       const baseMeshes = islands.map(isl => isl.base);
//       const hits = raycaster.intersectObjects(baseMeshes);
//       if (hits.length) {
//         const idx = baseMeshes.indexOf(hits[0].object as THREE.Mesh);
//         setHovered(idx);
//         playIslandHover();
//       } else {
//         setHovered(null);
//       }
//     };
//     canvas.addEventListener('mousemove', onMouseMove);

//     // Animation loop
//     const animate = () => {
//       frameRef.current = requestAnimationFrame(animate);
//       if (pausedRef.current) return;

//       const now = Date.now();
//       const data = sceneDataRef.current!;

//       // Camera lerp
//       camera.position.x += (data.camTarget.x - camera.position.x) * 0.05;
//       camera.position.y += (data.camTarget.y - camera.position.y) * 0.05;
//       camera.position.z += (data.camTarget.z - camera.position.z) * 0.05;
//       camera.lookAt(data.camLook);

//       // Islands
//       islands.forEach((isl, i) => {
//         (isl.ring.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(now * 0.0018 + i * 2.1) * 0.22;
//         const baseY = islandDefs[i].y;
//         isl.group.position.y = baseY + Math.sin(now * 0.0009 + i * 1.4) * 0.1;
//         // Hover highlight
//         const isHovered = hovered === i;
//         (isl.base.material as THREE.MeshStandardMaterial).emissiveIntensity = isHovered ? 1.2 : 0.5;
//       });

//       // Data stream particles
//       const seg1 = [new THREE.Vector3(-5.5, 0.5, 0), new THREE.Vector3(0, 0.8, 0)];
//       const seg2 = [new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(5.5, 0.5, 0)];
//       const dpArr = dpPos;
//       for (let i = 0; i < dpCount; i++) {
//         dpT[i] += 0.007;
//         if (dpT[i] > 1) { dpT[i] = 0; dpSeg[i] = (dpSeg[i] + 1) % 2; }
//         const t = dpT[i];
//         const seg = dpSeg[i] === 0 ? seg1 : seg2;
//         const arcY = Math.sin(t * Math.PI) * 1.2;
//         dpArr[i * 3] = seg[0].x + (seg[1].x - seg[0].x) * t;
//         dpArr[i * 3 + 1] = seg[0].y + (seg[1].y - seg[0].y) * t + arcY;
//         dpArr[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
//       }
//       dpGeo.attributes.position.needsUpdate = true;

//       // Orbit particles (detail mode)
//       if (modeRef.current !== 'overview') {
//         const cx = modeRef.current === 'input' ? -5.5 : modeRef.current === 'output' ? 5.5 : 0;
//         const oArr = orbitPos;
//         for (let i = 0; i < orbitCount; i++) {
//           orbitAngles[i] += 0.018 + (i % 3) * 0.005;
//           const vy = Math.sin(orbitAngles[i] * 0.6) * 1.8;
//           oArr[i * 3] = cx + Math.cos(orbitAngles[i]) * orbitRadii[i];
//           oArr[i * 3 + 1] = vy + 0.8;
//           oArr[i * 3 + 2] = Math.sin(orbitAngles[i]) * orbitRadii[i];
//         }
//         orbitGeo.attributes.position.needsUpdate = true;
//       }

//       // Input detail — rotate file objects
//       if (data.inputDetailGroup.visible) {
//         data.inputDetailGroup.children.forEach((c, ci) => {
//           if (ci < 8) {
//             c.rotation.y += 0.004;
//           }
//         });
//         (data.inputDetailGroup.children[data.inputDetailGroup.children.length - 1] as THREE.Mesh).rotation.y += 0.01;
//       }

//       // Process detail — floating layers
//       if (data.processDetailGroup.visible) {
//         data.processDetailGroup.children.slice(0, 4).forEach((c, li) => {
//           c.position.y = data.processLayerOffsets[li] + Math.sin(now * 0.001 + li) * 0.06;
//         });
//       }

//       // Output packets
//       outputPackets.forEach(pkt => {
//         pkt.t += pkt.speed;
//         if (pkt.t > 1) pkt.t = 0;
//         const origin = new THREE.Vector3(5.5, 1, 0);
//         pkt.mesh.position.lerpVectors(origin, pkt.target, pkt.t);
//         pkt.mesh.visible = data.outputDetailGroup.visible;
//       });

//       // Fill light pulse
//       fillLight.intensity = 1.8 + Math.sin(now * 0.0008) * 0.5;

//       renderer.render(scene, camera);
//     };
//     animate();

//     const onResize = () => {
//       const nw = canvas.clientWidth;
//       const nh = canvas.clientHeight;
//       renderer.setSize(nw, nh);
//       camera.aspect = nw / nh;
//       camera.updateProjectionMatrix();
//     };
//     window.addEventListener('resize', onResize);

//     return () => {
//       cancelAnimationFrame(frameRef.current);
//       canvas.removeEventListener('click', onClick);
//       canvas.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('resize', onResize);
//       renderer.dispose();
//     };
//   }, [switchMode]);

//   const togglePause = () => {
//     pausedRef.current = !pausedRef.current;
//     setPaused(p => !p);
//   };

//   const detailInfo = DETAIL_DATA[mode];

//   return { canvasRef, mode, paused, hovered, switchMode, togglePause, detailInfo };
// }
// src/components/SimulationPlatform/SimScene.tsx
//
// Three.js has been completely removed.
// This file now exports a lightweight hook that provides live latency
// telemetry state for use in the topology panel and standalone chart.
// All animation is handled by framer-motion in index.tsx.
//...................................................................................................
// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useMotionValue, animate } from 'framer-motion';

// // ─── Types ────────────────────────────────────────────────────────────────────
// export type SimMode = 'overview' | 'input' | 'process' | 'output';

// export interface LiveMetrics {
//   latencyMs: number;       // current simulated latency (ticks around 11.6ms live)
//   throughput: number;      // req/s
//   gpuUtil: number;         // 0–100
//   memUsage: number;        // GB
//   p50: number;
//   p95: number;
//   p99: number;
// }

// export interface SimSceneReturn {
//   /** framer-motion value of the latency number (for AnimatedNumber consumers) */
//   latencyMV: ReturnType<typeof useMotionValue>;
//   /** Stable live metric snapshot, updated every ~800ms */
//   metrics: LiveMetrics;
//   /** Whether the simulation ticker is paused */
//   paused: boolean;
//   togglePause: () => void;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function jitter(base: number, range: number) {
//   return +(base + (Math.random() - 0.5) * range * 2).toFixed(1);
// }

// // ─── Hook ─────────────────────────────────────────────────────────────────────
// /**
//  * useSimScene — provides live telemetry values for the simulation panel.
//  * No Three.js, no canvas, no WebGL. Pure state + framer-motion.
//  */
// export function useSimScene(): SimSceneReturn {
//   const latencyMV = useMotionValue(118.4);
//   const pausedRef  = useRef(false);
//   const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const [paused, setPaused] = useState(false);
//   const [metrics, setMetrics] = useState<LiveMetrics>({
//     latencyMs: 118.4,
//     throughput: 0,
//     gpuUtil: 0,
//     memUsage: 0,
//     p50: 9.4,
//     p95: 14.2,
//     p99: 21.7,
//   });

//   // Drive latency from 118.4 → 11.6 on mount (the "optimization" animation)
//   useEffect(() => {
//     const ctrl = animate(latencyMV, 11.6, {
//       duration: 2.2,
//       ease: [0.16, 1, 0.3, 1],
//     });
//     return ctrl.stop;
//   }, [latencyMV]);

//   // Live jitter tick — simulates real telemetry fluctuation
//   const tick = useCallback(() => {
//     if (!pausedRef.current) {
//       const live = jitter(11.6, 0.8);
//       latencyMV.set(live);
//       setMetrics({
//         latencyMs: live,
//         throughput: jitter(8900, 200),
//         gpuUtil:   jitter(94.2, 3),
//         memUsage:  jitter(1.82, 0.04),
//         p50:       jitter(9.4, 0.6),
//         p95:       jitter(14.2, 1.2),
//         p99:       jitter(21.7, 2.0),
//       });
//     }
//     timerRef.current = setTimeout(tick, 800 + Math.random() * 400);
//   }, [latencyMV]);

//   // Start ticker after the draw animation completes
//   useEffect(() => {
//     timerRef.current = setTimeout(tick, 2400);
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [tick]);

//   const togglePause = useCallback(() => {
//     pausedRef.current = !pausedRef.current;
//     setPaused(p => !p);
//   }, []);

//   return { latencyMV, metrics, paused, togglePause };
// }

// // Default export for backward-compatible imports
// export default useSimScene;


// src/components/SimulationPlatform/SimScene.tsx
//
// ARCHITECTURAL NOTE:
// Three.js has been completely removed from this file.
// This module is now the "Telemetry Engine" — a pure React/TypeScript
// data layer that drives all live simulation state for the 2D DOM/SVG
// pipeline topology in index.tsx.
//
// Responsibilities:
//   • Live metric generation with realistic jitter + event spikes
//   • Rolling chart history for the latency sparkline
//   • Compilation log streaming (per-node terminal output)
//   • Per-node detail data with animated progress values
//   • Kernel pass counter, packet counters, throughput curves
//   • Pause / resume / reset controls
//   • SSE-style event bus so index.tsx can subscribe to node events

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useMotionValue, animate } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SimMode = 'overview' | 'input' | 'process' | 'output';
export type NodeId  = 'input' | 'process' | 'output';
export type NodeStatus = 'IDLE' | 'SCANNING' | 'ACTIVE' | 'COMPILING' | 'FUSING' | 'DEPLOYING' | 'LIVE' | 'READY';

/** Single point in the rolling latency history */
export interface LatencyPoint {
  t: number;       // timestamp ms
  ms: number;      // latency value
}

/** One streaming log line */
export interface LogLine {
  id: number;
  text: string;
  kind: 'cmd' | 'ok' | 'warn' | 'info' | 'metric';
  ts: string;      // HH:MM:SS
}

/** Live metrics snapshot (updated every tick) */
export interface LiveMetrics {
  latencyMs:   number;
  throughput:  number;   // req/s
  gpuUtil:     number;   // 0–100 %
  cpuUtil:     number;   // 0–100 %
  memUsageGB:  number;
  modelSizeGB: number;
  p50:         number;
  p95:         number;
  p99:         number;
  errorRate:   number;   // per 10k requests
  cacheHit:    number;   // %
  kernelPass:  number;   // 0–7
  packetsIn:   number;
  packetsOut:  number;
}

/** Per-node progress bars (animated 0 → target) */
export interface ProgressMetric {
  label: string;
  pct: number;
  live: number;   // current animated value (changes each tick slightly)
}

/** Static detail data per node (labels + values) */
export interface NodeDetail {
  title:    string;
  badge:    NodeStatus;
  color:    string;
  lines:    [string, string][];
  progress?: ProgressMetric[];
  logs:     LogLine[];
}

/** What useSimScene() returns */
export interface SimSceneReturn {
  // Framer-motion value for the hero latency number (index.tsx AnimatedNumber)
  latencyMV: ReturnType<typeof useMotionValue>;

  // Full live metrics snapshot
  metrics: LiveMetrics;

  // Rolling chart history — last MAX_HISTORY points
  history: LatencyPoint[];

  // Per-node details (lines, progress, logs)
  nodeDetails: Record<NodeId, NodeDetail>;

  // Active node (which detail panel is open)
  activeNode: NodeId | null;
  setActiveNode: (id: NodeId | null) => void;

  // Pipeline flow state
  paused: boolean;
  togglePause: () => void;
  resetSim: () => void;

  // Packet animation counters for SVG connectors
  packetCounters: { seg0: number; seg1: number };

  // Spike event (null or a transient alert string)
  spikeAlert: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MAX_HISTORY  = 80;   // rolling chart points
const TICK_MS      = 750;  // main telemetry tick interval
const LOG_INTERVAL = 1800; // ms between new log lines per node
const BASE_LATENCY = 11.6;
const INITIAL_LATENCY = 118.4;

// ─────────────────────────────────────────────────────────────────────────────
// Static / seed data
// ─────────────────────────────────────────────────────────────────────────────

/** Input node log lines — cycle through these */
const INPUT_LOGS_POOL: Omit<LogLine, 'id' | 'ts'>[] = [
  { text: '$ qnx ingest --model resnet-x.pt --backend cuda', kind: 'cmd' },
  { text: 'Reading checkpoint... [1/3] weights', kind: 'info' },
  { text: 'Reading checkpoint... [2/3] optimizer', kind: 'info' },
  { text: 'Reading checkpoint... [3/3] metadata', kind: 'info' },
  { text: 'Graph extraction: 1,847 ops detected', kind: 'ok' },
  { text: 'Dtype audit: FP32 → autocast enabled', kind: 'ok' },
  { text: 'Layer analysis: 312 layers mapped', kind: 'ok' },
  { text: 'Shape inference: [B, 3, 224, 224] → [B, 1000]', kind: 'metric' },
  { text: 'Compatibility check: NVIDIA H100 ✓', kind: 'ok' },
  { text: 'Parameter count: 7.3B (7,340,221,440)', kind: 'metric' },
  { text: 'Sparsity detected: 12.4% (eligible for pruning)', kind: 'warn' },
  { text: 'Model hash: sha256:3f9a8b2c...', kind: 'info' },
  { text: 'Handoff to PROCESS NODE → ok', kind: 'ok' },
];

const PROCESS_LOGS_POOL: Omit<LogLine, 'id' | 'ts'>[] = [
  { text: '$ qnx compile --precision INT8/FP16 --fuse-kernels', kind: 'cmd' },
  { text: 'Pass 1/7: constant folding', kind: 'info' },
  { text: 'Pass 2/7: dead code elimination (−218 ops)', kind: 'ok' },
  { text: 'Pass 3/7: kernel fusion (38/94 candidates)', kind: 'info' },
  { text: 'Fusing: Conv2d + BN + ReLU → ConvBNReLU', kind: 'metric' },
  { text: 'Fusing: MatMul + Bias → FusedLinear', kind: 'metric' },
  { text: 'Pass 4/7: INT8 calibration (2048 samples)', kind: 'info' },
  { text: 'Calibration accuracy: 99.97% preserved', kind: 'ok' },
  { text: 'Pass 5/7: memory layout optimization', kind: 'info' },
  { text: 'NHWC → NCHW reorder: saved 340MB bandwidth', kind: 'metric' },
  { text: 'Pass 6/7: CUDA graph capture', kind: 'info' },
  { text: 'CUDA graph: 1,847 nodes captured', kind: 'ok' },
  { text: 'Pass 7/7: engine serialization', kind: 'info' },
  { text: 'Serialized: querynexes_engine_v2.qnx (412MB)', kind: 'ok' },
  { text: 'Latency benchmark: 11.6ms ↓ from 118.4ms', kind: 'metric' },
  { text: 'Memory reduction: 78% (6.4GB → 1.4GB)', kind: 'metric' },
];

const OUTPUT_LOGS_POOL: Omit<LogLine, 'id' | 'ts'>[] = [
  { text: '$ qnx deploy --targets cloud,edge,enterprise', kind: 'cmd' },
  { text: 'Artifact signed: sha256:a3f9b2d1...', kind: 'ok' },
  { text: 'Cloud GPU: pushing to registry...', kind: 'info' },
  { text: 'Cloud GPU: deployed ✓ (12.4× speedup)', kind: 'ok' },
  { text: 'Edge: packaging ONNX runtime bundle...', kind: 'info' },
  { text: 'Edge: deployed ✓ (67% memory reduction)', kind: 'ok' },
  { text: 'Enterprise API: provisioning endpoint...', kind: 'info' },
  { text: 'Enterprise API: live ✓ (99.8% uptime SLA)', kind: 'ok' },
  { text: 'Throughput test: 8,900 req/s ✓', kind: 'metric' },
  { text: 'Latency P50: 9.4ms  P95: 14.2ms  P99: 21.7ms', kind: 'metric' },
  { text: 'Health check: all targets GREEN', kind: 'ok' },
  { text: 'Monitoring: Prometheus scrape_interval=15s', kind: 'info' },
];

const LOG_POOLS: Record<NodeId, Omit<LogLine, 'id' | 'ts'>[]> = {
  input:   INPUT_LOGS_POOL,
  process: PROCESS_LOGS_POOL,
  output:  OUTPUT_LOGS_POOL,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

let _logId = 0;
const nextLogId = () => ++_logId;

function jitter(base: number, range: number, decimals = 1): number {
  return +(base + (Math.random() - 0.5) * range * 2).toFixed(decimals);
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function nowHMS(): string {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
}

function makeMetrics(kernelPass: number, packetsIn: number, packetsOut: number): LiveMetrics {
  return {
    latencyMs:   jitter(BASE_LATENCY, 0.9),
    throughput:  jitter(8900, 220, 0),
    gpuUtil:     jitter(94.2, 2.8, 1),
    cpuUtil:     jitter(31.4, 4.0, 1),
    memUsageGB:  jitter(1.82, 0.05, 2),
    modelSizeGB: 0.40,
    p50:         jitter(9.4,  0.7),
    p95:         jitter(14.2, 1.4),
    p99:         jitter(21.7, 2.2),
    errorRate:   jitter(0.3,  0.2, 2),
    cacheHit:    jitter(74.0, 3.0, 1),
    kernelPass:  clamp(kernelPass, 0, 7),
    packetsIn,
    packetsOut,
  };
}

/** Build per-node detail record */
function buildNodeDetail(
  id: NodeId,
  metrics: LiveMetrics,
  logs: LogLine[]
): NodeDetail {
  if (id === 'input') {
    return {
      title: 'INPUT NODE',
      badge: 'SCANNING',
      color: '#00A854',
      lines: [
        ['FORMAT',        'PyTorch 2.1 / ONNX'],
        ['PARAMETERS',    '7.3B (7,340,221,440)'],
        ['LAYERS',        '312 detected'],
        ['GRAPH OPS',     '1,847'],
        ['DTYPE',         'FP32 → autocast'],
        ['SPARSITY',      '12.4%'],
        ['COMPAT',        '✓ VERIFIED'],
        ['PKT IN',        String(metrics.packetsIn)],
        ['STATUS',        'INGESTING...'],
      ],
      logs,
    };
  }
  if (id === 'process') {
    return {
      title: 'PROCESS NODE',
      badge: 'COMPILING',
      color: '#00FF85',
      lines: [
        ['PASS',          `${metrics.kernelPass} / 7`],
        ['ACCURACY',      '99.97% preserved'],
        ['KERNELS',       'fusing (38/94)'],
        ['PRECISION',     'INT8 / FP16'],
        ['BACKEND',       'NVIDIA H100'],
        ['CACHE HIT',     `${metrics.cacheHit}%`],
        ['CPU UTIL',      `${metrics.cpuUtil}%`],
        ['GPU UTIL',      `${metrics.gpuUtil}%`],
      ],
      progress: [
        { label: 'MEMORY REDUCTION',  pct: 78, live: jitter(78,  1.5, 1) },
        { label: 'LATENCY OPTIMIZE',  pct: 62, live: jitter(62,  2.0, 1) },
        { label: 'THROUGHPUT GAIN',   pct: 91, live: jitter(91,  1.0, 1) },
        { label: 'KERNEL FUSION',     pct: 85, live: jitter(85,  1.2, 1) },
      ],
      logs,
    };
  }
  // output
  return {
    title: 'OUTPUT NODE',
    badge: 'LIVE',
    color: '#2ED3FF',
    lines: [
      ['CLOUD GPU',    `✓ READY  12.4×`],
      ['EDGE DEVICE',  `✓ READY  67% ↓`],
      ['ENTERPRISE',   `✓ READY  99.8%`],
      ['LATENCY',      `${metrics.latencyMs}ms (was 118.4ms)`],
      ['THROUGHPUT',   `${metrics.throughput.toLocaleString()} req/s`],
      ['P50 / P95',    `${metrics.p50}ms / ${metrics.p95}ms`],
      ['MODEL SIZE',   '1.8 GB → 412 MB'],
      ['ERROR RATE',   `${metrics.errorRate}/10k`],
    ],
    logs,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Initial node details (shown before first tick)
// ─────────────────────────────────────────────────────────────────────────────

function makeInitialDetails(): Record<NodeId, NodeDetail> {
  const m0 = makeMetrics(0, 0, 0);
  return {
    input:   buildNodeDetail('input',   m0, []),
    process: buildNodeDetail('process', m0, []),
    output:  buildNodeDetail('output',  m0, []),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// The hook
// ─────────────────────────────────────────────────────────────────────────────

export function useSimScene(): SimSceneReturn {
  const latencyMV = useMotionValue(INITIAL_LATENCY);

  // Simulation state
  const pausedRef        = useRef(false);
  const kernelPassRef    = useRef(0);
  const packetsInRef     = useRef(0);
  const packetsOutRef    = useRef(0);
  const logIndexRef      = useRef<Record<NodeId, number>>({ input: 0, process: 0, output: 0 });
  const logTimerRef      = useRef<Record<NodeId, ReturnType<typeof setTimeout>>>({} as never);
  const tickTimerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const spikeTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [paused,       setPaused]       = useState(false);
  const [metrics,      setMetrics]      = useState<LiveMetrics>(() => makeMetrics(0, 0, 0));
  const [history,      setHistory]      = useState<LatencyPoint[]>(() =>
    // Pre-fill with the "before" curve so chart isn't empty on mount
    Array.from({ length: 11 }, (_, i) => ({
      t:  Date.now() - (10 - i) * 1000,
      ms: [118.4, 104, 88, 71, 54, 38, 27, 19.5, 15.2, 12.8, 11.6][i],
    }))
  );
  const [nodeDetails,  setNodeDetails]  = useState<Record<NodeId, NodeDetail>>(makeInitialDetails);
  const [activeNode,   setActiveNode]   = useState<NodeId | null>(null);
  const [packetCounters, setPacketCounters] = useState({ seg0: 0, seg1: 0 });
  const [spikeAlert,   setSpikeAlert]   = useState<string | null>(null);
  // Per-node log buffers (kept in ref so we can append without triggering full re-renders on every line)
  const logBufsRef = useRef<Record<NodeId, LogLine[]>>({ input: [], process: [], output: [] });

  // ── Animate hero latency from 118.4 → 11.6 on mount ──
  useEffect(() => {
    const ctrl = animate(latencyMV, BASE_LATENCY, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return ctrl.stop;
  }, [latencyMV]);

  // ── Log streamer — appends one log line per node on schedule ──
  const streamLog = useCallback((nodeId: NodeId) => {
    if (pausedRef.current) {
      logTimerRef.current[nodeId] = setTimeout(() => streamLog(nodeId), LOG_INTERVAL);
      return;
    }
    const pool  = LOG_POOLS[nodeId];
    const idx   = logIndexRef.current[nodeId] % pool.length;
    const entry = pool[idx];
    logIndexRef.current[nodeId]++;

    const newLine: LogLine = {
      id:   nextLogId(),
      text: entry.text,
      kind: entry.kind,
      ts:   nowHMS(),
    };

    logBufsRef.current[nodeId] = [
      ...logBufsRef.current[nodeId].slice(-29), // keep last 30
      newLine,
    ];

    // Flush to state (only the active node's logs need reactivity; others are read on open)
    setNodeDetails(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], logs: logBufsRef.current[nodeId] },
    }));

    const jitterMs = LOG_INTERVAL + (Math.random() - 0.5) * 600;
    logTimerRef.current[nodeId] = setTimeout(() => streamLog(nodeId), jitterMs);
  }, []);

  // ── Main telemetry tick ──
  const tick = useCallback(() => {
    if (pausedRef.current) return;

    kernelPassRef.current  = (kernelPassRef.current + 1) % 8;
    packetsInRef.current  += Math.floor(jitter(120, 30, 0));
    packetsOutRef.current += Math.floor(jitter(115, 28, 0));

    const newMetrics = makeMetrics(
      kernelPassRef.current,
      packetsInRef.current,
      packetsOutRef.current
    );

    // Update framer-motion value with live jitter
    latencyMV.set(newMetrics.latencyMs);

    // Push to rolling chart history
    setHistory(prev => {
      const next = [...prev, { t: Date.now(), ms: newMetrics.latencyMs }];
      return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
    });

    // Update metrics state
    setMetrics(newMetrics);

    // Rebuild node details with fresh metrics (logs already streamed separately)
    setNodeDetails(prev => ({
      input:   buildNodeDetail('input',   newMetrics, logBufsRef.current.input),
      process: buildNodeDetail('process', newMetrics, logBufsRef.current.process),
      output:  buildNodeDetail('output',  newMetrics, logBufsRef.current.output),
    }));

    // Packet counters for connector animation
    setPacketCounters(prev => ({
      seg0: prev.seg0 + Math.floor(Math.random() * 3),
      seg1: prev.seg1 + Math.floor(Math.random() * 3),
    }));

    // Occasional latency spike event (every ~30 ticks, ~1.5%)
    if (Math.random() < 0.015) {
      const spikeMs = jitter(42, 8);
      setSpikeAlert(`⚡ SPIKE DETECTED: ${spikeMs}ms — auto-rerouting`);
      latencyMV.set(spikeMs);
      if (spikeTimerRef.current) clearTimeout(spikeTimerRef.current);
      spikeTimerRef.current = setTimeout(() => {
        setSpikeAlert(null);
        latencyMV.set(jitter(BASE_LATENCY, 0.6));
      }, 2800);
    }
  }, [latencyMV]);

  // ── Start / stop tick + log timers ──
  useEffect(() => {
    // Start tick 2.5s after mount (after the hero animation completes)
    const startDelay = setTimeout(() => {
      tickTimerRef.current = setInterval(tick, TICK_MS);
      // Stagger log streams so they don't all fire simultaneously
      (['input', 'process', 'output'] as NodeId[]).forEach((id, i) => {
        logTimerRef.current[id] = setTimeout(() => streamLog(id), 400 + i * 600);
      });
    }, 2500);

    return () => {
      clearTimeout(startDelay);
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      (['input', 'process', 'output'] as NodeId[]).forEach(id => {
        if (logTimerRef.current[id]) clearTimeout(logTimerRef.current[id]);
      });
      if (spikeTimerRef.current) clearTimeout(spikeTimerRef.current);
    };
  }, [tick, streamLog]);

  // ── Controls ──
  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(p => !p);
  }, []);

  const resetSim = useCallback(() => {
    kernelPassRef.current  = 0;
    packetsInRef.current   = 0;
    packetsOutRef.current  = 0;
    logIndexRef.current    = { input: 0, process: 0, output: 0 };
    logBufsRef.current     = { input: [], process: [], output: [] };
    setHistory([{ t: Date.now(), ms: INITIAL_LATENCY }]);
    setPacketCounters({ seg0: 0, seg1: 0 });
    setSpikeAlert(null);
    latencyMV.set(INITIAL_LATENCY);
    const ctrl = animate(latencyMV, BASE_LATENCY, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return ctrl.stop;
  }, [latencyMV]);

  return {
    latencyMV,
    metrics,
    history,
    nodeDetails,
    activeNode,
    setActiveNode,
    paused,
    togglePause,
    resetSim,
    packetCounters,
    spikeAlert,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Re-export types for index.tsx consumption
// ─────────────────────────────────────────────────────────────────────────────
export type { SimSceneReturn };
export default useSimScene;