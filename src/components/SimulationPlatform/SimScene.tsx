import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { playSimClick, playIslandHover } from '../../utils/audio';

// Drop your downloaded .glb files here: src/assets/models/1.glb, 2.glb, 3.glb
// 1.glb -> INPUT island, 2.glb -> PROCESS island (center), 3.glb -> OUTPUT island
const modelGlob = import.meta.glob('/src/assets/models/*.glb', { eager: true, import: 'default', query: '?url' });
const MODEL_URLS: Record<string, string> = {};
Object.entries(modelGlob).forEach(([path, url]) => {
  const name = path.match(/(\d+)\.glb$/)?.[1];
  if (name) MODEL_URLS[name] = url as string;
});

type SimMode = 'overview' | 'input' | 'process' | 'output';

interface Island {
  group: THREE.Group;      // wraps the loaded model — used for hover scale + bob animation
  model: THREE.Object3D;   // the actual loaded glTF scene, centered/scaled inside `group`
  hitbox: THREE.Mesh;      // invisible box used for raycasting (glb meshes vary too much to rely on directly)
  ring: THREE.Mesh;
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

/** Centers a loaded glTF scene on its own bounding-box center and scales it
 *  so its largest dimension equals `targetSize`. Mutates in place. */
function normalizeModel(root: THREE.Object3D, targetSize: number) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;
  root.scale.setScalar(scale);

  // Re-measure after scaling, then re-center so the model sits on y=0.
  const scaledBox = new THREE.Box3().setFromObject(root);
  const scaledCenter = new THREE.Vector3();
  scaledBox.getCenter(scaledCenter);
  root.position.x -= scaledCenter.x;
  root.position.z -= scaledCenter.z;
  root.position.y -= scaledBox.min.y; // rest on the ground plane

  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
}

function buildIslandRig(
  x: number, y: number, z: number,
  model: THREE.Object3D,
  isCenter: boolean,
  label: string,
  sublabel: string
): { group: THREE.Group; hitbox: THREE.Mesh; ring: THREE.Mesh } {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const targetSize = isCenter ? 2.6 : 2.1;
  normalizeModel(model, targetSize);
  group.add(model);

  // Invisible raycast hitbox — sized to the model's footprint, since glb
  // geometry varies too much (and may be multi-mesh) to raycast reliably.
  const hitbox = new THREE.Mesh(
    new THREE.BoxGeometry(targetSize * 1.15, targetSize * 1.15, targetSize * 1.15),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitbox.position.y = targetSize * 0.5;
  group.add(hitbox);

  // Subtle grounding ring kept as a UI accent (not the model itself)
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(targetSize * 0.85, 0.03, 8, 48),
    new THREE.MeshBasicMaterial({ color: 0x00FF85, transparent: true, opacity: 0.4 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.02;
  group.add(ring);

  void label; void sublabel; // kept on Island record for the UI legend, not used in-scene
  return { group, hitbox, ring };
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
    dpT: Float32Array;
    dpSeg: Int32Array;
    orbitGeo: THREE.BufferGeometry;
    orbitAngles: Float32Array;
    orbitRadii: Float32Array;
    orbitMesh: THREE.Points;
    camTarget: { x: number; y: number; z: number };
    camLook: THREE.Vector3;
    controls: OrbitControls;
  } | null>(null);

  const [mode, setMode] = useState<SimMode>('overview');
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const setHoveredBoth = useCallback((idx: number | null) => {
    hoveredRef.current = idx;
    setHovered(idx);
  }, []);

  const switchMode = useCallback((newMode: SimMode) => {
    modeRef.current = newMode;
    setMode(newMode);
    playSimClick();

    const data = sceneDataRef.current;
    if (!data) return;

    if (newMode === 'overview') {
      data.controls.enabled = false;
      data.controls.autoRotate = false;
      data.camTarget = { x: 0, y: 6, z: 16 };
      data.camLook.set(0, 0, 0);
    } else {
      let cx = 0, cy = 0, cz = 0;
      if (newMode === 'input') { cx = -5.5; }
      else if (newMode === 'process') { cy = 0.6; }
      else if (newMode === 'output') { cx = 5.5; }

      data.controls.target.set(cx, cy + 0.5, cz);
      data.controls.enabled = true;
      data.controls.autoRotate = true;
      data.camera.position.set(cx + 3.5, cy + 2, cz + 3.5);
      data.controls.update();
    }

    data.orbitMesh.visible = newMode !== 'overview';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.innerWidth < 768) return;

    let disposed = false;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x050A07, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

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

    const islandDefs = [
      { x: -5.5, y: 0, z: 0, modelKey: '1', label: 'INPUT', sublabel: 'Model Repository', center: false },
      { x: 0, y: 0.6, z: 0, modelKey: '2', label: 'PROCESS', sublabel: 'Compilation · Optimization', center: true },
      { x: 5.5, y: 0, z: 0, modelKey: '3', label: 'OUTPUT', sublabel: 'Cloud · Edge · Enterprise', center: false },
    ];

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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const camTarget = { x: 0, y: 6, z: 16 };
    const camLook = new THREE.Vector3(0, 0, 0);

    let islands: Island[] = [];
    let onClick: (e: MouseEvent) => void = () => {};
    let onMouseMove: (e: MouseEvent) => void = () => {};
    let animate: () => void = () => {};
    let onResize: () => void = () => {};

    // ---- Load all 3 GLB models, then assemble the islands ----
    const loader = new GLTFLoader();
    const missing = islandDefs.filter(d => !MODEL_URLS[d.modelKey]);
    if (missing.length) {
      setLoadError(
        `Missing model file(s): ${missing.map(m => `${m.modelKey}.glb`).join(', ')}. ` +
        `Place them in src/assets/models/.`
      );
      setLoading(false);
      return () => { renderer.dispose(); };
    }
    const badUrls = islandDefs.filter(d => typeof MODEL_URLS[d.modelKey] !== 'string');
    if (badUrls.length) {
      setLoadError(
        `Model URL resolved to a non-string value for: ${badUrls.map(m => `${m.modelKey}.glb`).join(', ')}. ` +
        `This usually means the Vite glob options need { import: 'default' }.`
      );
      setLoading(false);
      return () => { renderer.dispose(); };
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3;
    controls.maxDistance = 12;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 2.0;
    controls.enabled = false;
    controls.target.set(0, 0, 0);

    Promise.all(
      islandDefs.map(d => loader.loadAsync(MODEL_URLS[d.modelKey]))
    ).then((gltfs) => {
      if (disposed) return;

      islands = islandDefs.map((d, i) => {
        const root = gltfs[i].scene;
        const { group, hitbox, ring } = buildIslandRig(d.x, d.y, d.z, root, d.center, d.label, d.sublabel);
        scene.add(group);
        return { group, model: root, hitbox, ring, label: d.label, sublabel: d.sublabel, position: [d.x, d.y, d.z] };
      });

      sceneDataRef.current = {
        scene, camera, renderer, islands, raycaster,
        dpT, dpSeg,
        orbitGeo, orbitAngles, orbitRadii, orbitMesh,
        camTarget, camLook,
        controls,
      };

      onClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hitboxes = islands.map(isl => isl.hitbox);
        const hits = raycaster.intersectObjects(hitboxes);
        if (hits.length) {
          const idx = hitboxes.indexOf(hits[0].object as THREE.Mesh);
          const modes: SimMode[] = ['input', 'process', 'output'];
          switchMode(modes[idx]);
        }
      };
      canvas.addEventListener('click', onClick);

      onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hitboxes = islands.map(isl => isl.hitbox);
        const hits = raycaster.intersectObjects(hitboxes);
        if (hits.length) {
          const idx = hitboxes.indexOf(hits[0].object as THREE.Mesh);
          setHoveredBoth(idx);
          playIslandHover();
        } else {
          setHoveredBoth(null);
        }
      };
      canvas.addEventListener('mousemove', onMouseMove);

      animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        if (pausedRef.current) return;

        const now = Date.now();
        const data = sceneDataRef.current!;

        if (data.controls.enabled) {
          data.controls.update();
        } else {
          camera.position.x += (data.camTarget.x - camera.position.x) * 0.05;
          camera.position.y += (data.camTarget.y - camera.position.y) * 0.05;
          camera.position.z += (data.camTarget.z - camera.position.z) * 0.05;
          camera.lookAt(data.camLook);
        }

        islands.forEach((isl, i) => {
          (isl.ring.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(now * 0.0018 + i * 2.1) * 0.18;
          const baseY = islandDefs[i].y;
          isl.group.position.y = baseY + Math.sin(now * 0.0009 + i * 1.4) * 0.08;
          // Hover highlight via gentle scale, since glb material can't be
          // reliably overridden the way a procedural emissive mesh could be.
          const isHovered = hoveredRef.current === i;
          const targetScale = isHovered ? 1.06 : 1.0;
          isl.model.scale.setScalar(
            isl.model.scale.x + (targetScale * (isl.model.userData.baseScale ?? 1) - isl.model.scale.x) * 0.15
          );
        });

        const seg1 = [new THREE.Vector3(-5.5, 0.5, 0), new THREE.Vector3(0, 0.8, 0)];
        const seg2 = [new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(5.5, 0.5, 0)];
        for (let i = 0; i < dpCount; i++) {
          dpT[i] += 0.007;
          if (dpT[i] > 1) { dpT[i] = 0; dpSeg[i] = (dpSeg[i] + 1) % 2; }
          const t = dpT[i];
          const seg = dpSeg[i] === 0 ? seg1 : seg2;
          const arcY = Math.sin(t * Math.PI) * 1.2;
          dpPos[i * 3] = seg[0].x + (seg[1].x - seg[0].x) * t;
          dpPos[i * 3 + 1] = seg[0].y + (seg[1].y - seg[0].y) * t + arcY;
          dpPos[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
        }
        dpGeo.attributes.position.needsUpdate = true;

        if (modeRef.current !== 'overview') {
          const cx = modeRef.current === 'input' ? -5.5 : modeRef.current === 'output' ? 5.5 : 0;
          for (let i = 0; i < orbitCount; i++) {
            orbitAngles[i] += 0.018 + (i % 3) * 0.005;
            const vy = Math.sin(orbitAngles[i] * 0.6) * 1.8;
            orbitPos[i * 3] = cx + Math.cos(orbitAngles[i]) * orbitRadii[i];
            orbitPos[i * 3 + 1] = vy + 0.8;
            orbitPos[i * 3 + 2] = Math.sin(orbitAngles[i]) * orbitRadii[i];
          }
          orbitGeo.attributes.position.needsUpdate = true;
        }

        fillLight.intensity = 1.8 + Math.sin(now * 0.0008) * 0.5;
        renderer.render(scene, camera);
      };

      islands.forEach(isl => { isl.model.userData.baseScale = isl.model.scale.x; });
      animate();

      onResize = () => {
        const nw = canvas.clientWidth;
        const nh = canvas.clientHeight;
        renderer.setSize(nw, nh);
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      setLoading(false);
    }).catch((err) => {
      console.error('Failed to load island models:', err);
      setLoadError('One or more .glb models failed to load. Check the console for details.');
      setLoading(false);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
    };
  }, [switchMode]);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(p => !p);
  };

  const detailInfo = DETAIL_DATA[mode];

  return { canvasRef, mode, paused, hovered, loading, loadError, switchMode, togglePause, detailInfo };
}