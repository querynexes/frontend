import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { playSimClick, playIslandHover } from '../../utils/audio';

type SimMode = 'overview' | 'input' | 'process' | 'output';

interface Island {
  group: THREE.Group;
  ring: THREE.Mesh;
  base: THREE.Mesh;
  label: string;
  sublabel: string;
  position: [number, number, number];
}

interface DetailInfo {
  title: string;
  lines: [string, string][];
  progress?: { label: string; pct: number }[];
}

const DETAIL_DATA: Record<string, DetailInfo> = {
  overview: { title: '', lines: [] },
  input: {
    title: 'INPUT NODE',
    lines: [
      ['FORMAT', 'PyTorch 2.1'],
      ['PARAMETERS', '7.3B'],
      ['LAYERS DETECTED', '312'],
      ['COMPATIBILITY', '✓ VERIFIED'],
      ['STATUS', 'SCANNING...'],
    ],
  },
  process: {
    title: 'PROCESS NODE',
    lines: [
      ['PASS', '3 / 7'],
      ['ACCURACY', '99.97% PRESERVED'],
      ['KERNELS', 'FUSING...'],
      ['PRECISION', 'INT8 / FP16'],
    ],
    progress: [
      { label: 'MEMORY REDUCTION', pct: 78 },
      { label: 'LATENCY OPTIMIZE', pct: 62 },
      { label: 'THROUGHPUT GAIN', pct: 91 },
    ],
  },
  output: {
    title: 'OUTPUT NODE',
    lines: [
      ['CLOUD GPU', '✓ READY  12.4×'],
      ['EDGE DEVICE', '✓ READY  67% ↓'],
      ['ENTERPRISE', '✓ READY  99.8%'],
      ['LATENCY', '3.2ms (was 41ms)'],
      ['THROUGHPUT', '8,900 req/s'],
    ],
  },
};

function buildIsland(
  x: number, y: number, z: number,
  baseColor: number, emissiveColor: number,
  isCenter = false
): { group: THREE.Group; ring: THREE.Mesh; base: THREE.Mesh } {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // Multi-layer PCB stack
  const layerCount = isCenter ? 5 : 3;
  for (let i = 0; i < layerCount; i++) {
    const size = 2.2 - i * (isCenter ? 0.18 : 0.2);
    const mat = new THREE.MeshStandardMaterial({
      color: i === 0 ? baseColor : new THREE.Color(baseColor).lerp(new THREE.Color(0x16241D), i * 0.25).getHex(),
      metalness: 0.88,
      roughness: 0.12,
      emissive: emissiveColor,
      emissiveIntensity: 0.3 + (layerCount - i) * 0.05,
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(size, 0.12, size), mat);
    slab.position.y = 0.25 + i * 0.14 + (isCenter ? i * 0.03 : 0);
    slab.castShadow = true;
    group.add(slab);
  }

  // Base platform
  const baseMat = new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.9,
    roughness: 0.15,
    emissive: emissiveColor,
    emissiveIntensity: 0.5,
  });
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 2.6), baseMat);
  base.position.y = 0;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Pulsing ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.04, 8, 48),
    new THREE.MeshBasicMaterial({ color: 0x00FF85, transparent: true, opacity: 0.5 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.28;
  group.add(ring);

  // Outer ring
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.02, 6, 48),
    new THREE.MeshBasicMaterial({ color: 0x00A854, transparent: true, opacity: 0.3 })
  );
  outerRing.rotation.x = Math.PI / 2;
  outerRing.position.y = -0.28;
  group.add(outerRing);

  // LED strips on sides
  if (isCenter) {
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00FF85 });
    for (let side = 0; side < 4; side++) {
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.6, 0.02), ledMat);
      const angle = (side / 4) * Math.PI * 2;
      led.position.set(Math.cos(angle) * 1.3, 0.3, Math.sin(angle) * 1.3);
      group.add(led);
    }
  }

  // Core sphere (center only)
  if (isCenter) {
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x00FFC3, emissive: 0x00FFC3, emissiveIntensity: 2 })
    );
    core.position.y = 1.0;
    group.add(core);
  }

  return { group, ring, base };
}

function buildDataTube(from: THREE.Vector3, to: THREE.Vector3): { tube: THREE.Mesh; glowTube: THREE.Mesh } {
  const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
  mid.y += 1.5;
  const curve = new THREE.CatmullRomCurve3([from, mid, to]);
  const geo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00A854, transparent: true, opacity: 0.5 });
  const tube = new THREE.Mesh(geo, mat);

  const glowGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x00FF85, transparent: true, opacity: 0.08 });
  const glowTube = new THREE.Mesh(glowGeo, glowMat);

  return { tube, glowTube };
}

export default function SimulationScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<SimMode>('overview');
  const pausedRef = useRef(false);
  const frameRef = useRef<number>(0);
  const sceneDataRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    islands: Island[];
    raycaster: THREE.Raycaster;
    dataParticleGeo: THREE.BufferGeometry;
    dpAngles: Float32Array;
    dpT: Float32Array;
    dpSeg: Int32Array;
    orbitGeo: THREE.BufferGeometry;
    orbitAngles: Float32Array;
    orbitRadii: Float32Array;
    orbitMesh: THREE.Points;
    camTarget: { x: number; y: number; z: number };
    camLook: THREE.Vector3;
    inputDetailGroup: THREE.Group;
    processDetailGroup: THREE.Group;
    outputDetailGroup: THREE.Group;
    processLayerOffsets: Float32Array;
    outputPackets: { mesh: THREE.Mesh; t: number; speed: number; target: THREE.Vector3 }[];
  } | null>(null);

  const [mode, setMode] = useState<SimMode>('overview');
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const switchMode = useCallback((newMode: SimMode) => {
    modeRef.current = newMode;
    setMode(newMode);
    playSimClick();

    const data = sceneDataRef.current;
    if (!data) return;

    // Update camera target
    if (newMode === 'overview') {
      data.camTarget = { x: 0, y: 6, z: 16 };
      data.camLook.set(0, 0, 0);
    } else if (newMode === 'input') {
      data.camTarget = { x: -5.5, y: 3, z: 8 };
      data.camLook.set(-5.5, 0.5, 0);
    } else if (newMode === 'process') {
      data.camTarget = { x: 0, y: 4, z: 8 };
      data.camLook.set(0, 1, 0);
    } else if (newMode === 'output') {
      data.camTarget = { x: 5.5, y: 3, z: 8 };
      data.camLook.set(5.5, 0.5, 0);
    }

    // Show/hide detail groups
    data.inputDetailGroup.visible = newMode === 'input';
    data.processDetailGroup.visible = newMode === 'process';
    data.outputDetailGroup.visible = newMode === 'output';
    data.orbitMesh.visible = newMode !== 'overview';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.innerWidth < 768) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x050A07, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050A07, 0.025);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
    camera.position.set(0, 6, 16);

    // Lighting
    scene.add(new THREE.AmbientLight(0x003818, 0.8));
    const mainLight = new THREE.DirectionalLight(0x00FF85, 1.2);
    mainLight.position.set(5, 12, 8);
    mainLight.castShadow = true;
    scene.add(mainLight);
    const fillLight = new THREE.PointLight(0x00FFC3, 2, 30);
    fillLight.position.set(0, 8, 0);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x00A854, 1.5, 25);
    rimLight.position.set(-8, 4, -4);
    scene.add(rimLight);

    // Grid
    const gridGeo = new THREE.PlaneGeometry(40, 40, 36, 36);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00A854, wireframe: true, transparent: true, opacity: 0.04 });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -2;
    scene.add(gridMesh);

    // Islands
    const islandDefs = [
      { x: -5.5, y: 0, z: 0, color: 0x0B1410, emissive: 0x001808, label: 'INPUT', sublabel: 'Model Repository', center: false },
      { x: 0, y: 0.6, z: 0, color: 0x111C16, emissive: 0x002810, label: 'PROCESS', sublabel: 'Compilation · Optimization', center: true },
      { x: 5.5, y: 0, z: 0, color: 0x0B1410, emissive: 0x001808, label: 'OUTPUT', sublabel: 'Cloud · Edge · Enterprise', center: false },
    ];

    const islands: Island[] = islandDefs.map(d => {
      const { group, ring, base } = buildIsland(d.x, d.y, d.z, d.color, d.emissive, d.center);
      scene.add(group);
      return { group, ring, base, label: d.label, sublabel: d.sublabel, position: [d.x, d.y, d.z] };
    });

    // Tubes between islands
    const tubeData = [
      { from: new THREE.Vector3(-3.2, 0.5, 0), to: new THREE.Vector3(-1.3, 0.8, 0) },
      { from: new THREE.Vector3(1.3, 0.8, 0), to: new THREE.Vector3(3.2, 0.5, 0) },
    ];
    tubeData.forEach(td => {
      const { tube, glowTube } = buildDataTube(td.from, td.to);
      scene.add(tube);
      scene.add(glowTube);
    });

    // Data stream particles
    const dpCount = 160;
    const dpPos = new Float32Array(dpCount * 3);
    const dpT = new Float32Array(dpCount);
    const dpSeg = new Int32Array(dpCount);
    for (let i = 0; i < dpCount; i++) {
      dpT[i] = Math.random();
      dpSeg[i] = Math.floor(Math.random() * 2);
    }
    const dpGeo = new THREE.BufferGeometry();
    dpGeo.setAttribute('position', new THREE.BufferAttribute(dpPos, 3));
    const dpMesh = new THREE.Points(dpGeo, new THREE.PointsMaterial({
      color: 0x00FF85, size: 0.09, transparent: true, opacity: 0.9,
    }));
    scene.add(dpMesh);

    // Orbital particles (detail mode)
    const orbitCount = 100;
    const orbitPos = new Float32Array(orbitCount * 3);
    const orbitAngles = new Float32Array(orbitCount);
    const orbitRadii = new Float32Array(orbitCount);
    for (let i = 0; i < orbitCount; i++) {
      orbitAngles[i] = Math.random() * Math.PI * 2;
      orbitRadii[i] = 1.8 + Math.random() * 2.2;
    }
    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
    const orbitMesh = new THREE.Points(orbitGeo, new THREE.PointsMaterial({
      color: 0x00FFC3, size: 0.065, transparent: true, opacity: 0.75,
    }));
    orbitMesh.visible = false;
    scene.add(orbitMesh);

    // --- INPUT DETAIL GROUP ---
    const inputDetailGroup = new THREE.Group();
    inputDetailGroup.visible = false;
    const fileFormats = ['model.pt', 'model.onnx', 'model.pb', 'model.tflite'];
    fileFormats.forEach((_, fi) => {
      const angle = (fi / fileFormats.length) * Math.PI * 2;
      const fm = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.05, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x111C16, metalness: 0.8, roughness: 0.2, emissive: 0x002210, emissiveIntensity: 0.5 })
      );
      fm.position.set(
        Math.cos(angle) * 2.5 - 5.5,
        1.5 + Math.sin(fi) * 0.3,
        Math.sin(angle) * 1.5
      );
      fm.rotation.x = -0.3;
      inputDetailGroup.add(fm);

      // File edge glow
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.05, 1.2));
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x00FF85, transparent: true, opacity: 0.8 });
      const edgeMesh = new THREE.LineSegments(edges, edgeMat);
      edgeMesh.position.copy(fm.position);
      edgeMesh.rotation.copy(fm.rotation);
      inputDetailGroup.add(edgeMesh);
    });
    // Intake funnel
    const funnel = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 1.5, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x00A854, wireframe: true, transparent: true, opacity: 0.6 })
    );
    funnel.position.set(-5.5, 0.5, 0);
    inputDetailGroup.add(funnel);
    scene.add(inputDetailGroup);

    // --- PROCESS DETAIL GROUP ---
    const processDetailGroup = new THREE.Group();
    processDetailGroup.visible = false;
    const layerColors = [0x001808, 0x002210, 0x003018, 0x00401C];
    const processLayerOffsets = new Float32Array(4);
    for (let li = 0; li < 4; li++) {
      const layer = new THREE.Mesh(
        new THREE.BoxGeometry(2.0 - li * 0.1, 0.08, 2.0 - li * 0.1),
        new THREE.MeshStandardMaterial({ color: 0x111C16, emissive: layerColors[li], emissiveIntensity: 1.5, transparent: true, opacity: 0.9 })
      );
      layer.position.y = li * 0.4;
      processDetailGroup.add(layer);
      processLayerOffsets[li] = li * 0.4;
    }
    // IR graph nodes
    const nodeCount = 12;
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00FF85, emissive: 0x00FF85, emissiveIntensity: 1.5 });
    const nodePositions: THREE.Vector3[] = [];
    for (let ni = 0; ni < nodeCount; ni++) {
      const nMesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), nodeMat);
      const np = new THREE.Vector3(
        (Math.random() - 0.5) * 1.6,
        Math.random() * 1.2 + 0.2,
        (Math.random() - 0.5) * 1.6
      );
      nMesh.position.copy(np);
      nodePositions.push(np);
      processDetailGroup.add(nMesh);
    }
    // Edges between nodes
    for (let ni = 0; ni < nodeCount - 1; ni++) {
      const pts = [nodePositions[ni], nodePositions[ni + 1]];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      processDetailGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x00A854, transparent: true, opacity: 0.5 })));
    }
    processDetailGroup.position.set(0, 0, 0);
    scene.add(processDetailGroup);

    // --- OUTPUT DETAIL GROUP ---
    const outputDetailGroup = new THREE.Group();
    outputDetailGroup.visible = false;
    const deployTargets = [
      { x: -1.8, y: 0.8, z: -1, color: 0x2ED3FF, label: 'CLOUD' },
      { x: 0, y: 1.2, z: 0.5, color: 0x00FF85, label: 'EDGE' },
      { x: 1.8, y: 0.8, z: -1, color: 0xFFB020, label: 'ENTERPRISE' },
    ];
    deployTargets.forEach(dt => {
      const zone = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.6, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x111C16, emissive: new THREE.Color(dt.color).multiplyScalar(0.3).getHex(), emissiveIntensity: 1 })
      );
      zone.position.set(dt.x + 5.5, dt.y, dt.z);
      outputDetailGroup.add(zone);
      // Status LED
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: dt.color })
      );
      led.position.set(dt.x + 5.5, dt.y + 0.5, dt.z);
      outputDetailGroup.add(led);
    });

    // Output packets
    const outputPackets: { mesh: THREE.Mesh; t: number; speed: number; target: THREE.Vector3 }[] = [];
    deployTargets.forEach(dt => {
      const pkg = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.18, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x00FF85, emissive: 0x00FF85, emissiveIntensity: 1.5 })
      );
      outputPackets.push({ mesh: pkg, t: Math.random(), speed: 0.008 + Math.random() * 0.006, target: new THREE.Vector3(dt.x + 5.5, dt.y, dt.z) });
      scene.add(pkg);
    });
    scene.add(outputDetailGroup);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const camTarget = { x: 0, y: 6, z: 16 };
    const camLook = new THREE.Vector3(0, 0, 0);

    sceneDataRef.current = {
      scene, camera, renderer, islands, raycaster,
      dataParticleGeo: dpGeo,
      dpAngles: new Float32Array(dpCount),
      dpT, dpSeg,
      orbitGeo, orbitAngles, orbitRadii, orbitMesh,
      camTarget, camLook,
      inputDetailGroup, processDetailGroup, outputDetailGroup,
      processLayerOffsets,
      outputPackets,
    };

    // Click handler
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const baseMeshes = islands.map(isl => isl.base);
      const hits = raycaster.intersectObjects(baseMeshes);
      if (hits.length) {
        const idx = baseMeshes.indexOf(hits[0].object as THREE.Mesh);
        const modes: SimMode[] = ['input', 'process', 'output'];
        switchMode(modes[idx]);
      } else if (modeRef.current !== 'overview') {
        // Click elsewhere in detail mode = back to overview
      }
    };
    canvas.addEventListener('click', onClick);

    // Hover handler
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const baseMeshes = islands.map(isl => isl.base);
      const hits = raycaster.intersectObjects(baseMeshes);
      if (hits.length) {
        const idx = baseMeshes.indexOf(hits[0].object as THREE.Mesh);
        setHovered(idx);
        playIslandHover();
      } else {
        setHovered(null);
      }
    };
    canvas.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (pausedRef.current) return;

      const now = Date.now();
      const data = sceneDataRef.current!;

      // Camera lerp
      camera.position.x += (data.camTarget.x - camera.position.x) * 0.05;
      camera.position.y += (data.camTarget.y - camera.position.y) * 0.05;
      camera.position.z += (data.camTarget.z - camera.position.z) * 0.05;
      camera.lookAt(data.camLook);

      // Islands
      islands.forEach((isl, i) => {
        (isl.ring.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(now * 0.0018 + i * 2.1) * 0.22;
        const baseY = islandDefs[i].y;
        isl.group.position.y = baseY + Math.sin(now * 0.0009 + i * 1.4) * 0.1;
        // Hover highlight
        const isHovered = hovered === i;
        (isl.base.material as THREE.MeshStandardMaterial).emissiveIntensity = isHovered ? 1.2 : 0.5;
      });

      // Data stream particles
      const seg1 = [new THREE.Vector3(-5.5, 0.5, 0), new THREE.Vector3(0, 0.8, 0)];
      const seg2 = [new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(5.5, 0.5, 0)];
      const dpArr = dpPos;
      for (let i = 0; i < dpCount; i++) {
        dpT[i] += 0.007;
        if (dpT[i] > 1) { dpT[i] = 0; dpSeg[i] = (dpSeg[i] + 1) % 2; }
        const t = dpT[i];
        const seg = dpSeg[i] === 0 ? seg1 : seg2;
        const arcY = Math.sin(t * Math.PI) * 1.2;
        dpArr[i * 3] = seg[0].x + (seg[1].x - seg[0].x) * t;
        dpArr[i * 3 + 1] = seg[0].y + (seg[1].y - seg[0].y) * t + arcY;
        dpArr[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
      }
      dpGeo.attributes.position.needsUpdate = true;

      // Orbit particles (detail mode)
      if (modeRef.current !== 'overview') {
        const cx = modeRef.current === 'input' ? -5.5 : modeRef.current === 'output' ? 5.5 : 0;
        const oArr = orbitPos;
        for (let i = 0; i < orbitCount; i++) {
          orbitAngles[i] += 0.018 + (i % 3) * 0.005;
          const vy = Math.sin(orbitAngles[i] * 0.6) * 1.8;
          oArr[i * 3] = cx + Math.cos(orbitAngles[i]) * orbitRadii[i];
          oArr[i * 3 + 1] = vy + 0.8;
          oArr[i * 3 + 2] = Math.sin(orbitAngles[i]) * orbitRadii[i];
        }
        orbitGeo.attributes.position.needsUpdate = true;
      }

      // Input detail — rotate file objects
      if (data.inputDetailGroup.visible) {
        data.inputDetailGroup.children.forEach((c, ci) => {
          if (ci < 8) {
            c.rotation.y += 0.004;
          }
        });
        (data.inputDetailGroup.children[data.inputDetailGroup.children.length - 1] as THREE.Mesh).rotation.y += 0.01;
      }

      // Process detail — floating layers
      if (data.processDetailGroup.visible) {
        data.processDetailGroup.children.slice(0, 4).forEach((c, li) => {
          c.position.y = data.processLayerOffsets[li] + Math.sin(now * 0.001 + li) * 0.06;
        });
      }

      // Output packets
      outputPackets.forEach(pkt => {
        pkt.t += pkt.speed;
        if (pkt.t > 1) pkt.t = 0;
        const origin = new THREE.Vector3(5.5, 1, 0);
        pkt.mesh.position.lerpVectors(origin, pkt.target, pkt.t);
        pkt.mesh.visible = data.outputDetailGroup.visible;
      });

      // Fill light pulse
      fillLight.intensity = 1.8 + Math.sin(now * 0.0008) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = canvas.clientWidth;
      const nh = canvas.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [switchMode]);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(p => !p);
  };

  const detailInfo = DETAIL_DATA[mode];

  return { canvasRef, mode, paused, hovered, switchMode, togglePause, detailInfo };
}
