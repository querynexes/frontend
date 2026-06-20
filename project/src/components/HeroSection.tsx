import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ChevronDown } from 'lucide-react';
import { playTick } from '../utils/audio';

function buildChipGroup(): THREE.Group {
  const group = new THREE.Group();

  const dieMat = new THREE.MeshStandardMaterial({
    color: 0x111C16,
    metalness: 0.92,
    roughness: 0.08,
    emissive: 0x002210,
    emissiveIntensity: 0.4,
  });
  const spreadMat = new THREE.MeshStandardMaterial({
    color: 0x16241D,
    metalness: 0.85,
    roughness: 0.12,
    emissive: 0x001808,
    emissiveIntensity: 0.25,
  });
  const pinMat = new THREE.MeshStandardMaterial({ color: 0x2A3F34, metalness: 1, roughness: 0.04 });
  const ledMat = new THREE.MeshStandardMaterial({ color: 0x00FF85, emissive: 0x00FF85, emissiveIntensity: 2 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00FF85, opacity: 0.7, transparent: true });

  // Die body
  const die = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 2.6), dieMat);
  die.position.y = 0;
  group.add(die);

  // Heat spreader
  const spread = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 3.0), spreadMat);
  spread.position.y = 0.15;
  group.add(spread);

  // PCB base
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 3.4),
    new THREE.MeshStandardMaterial({ color: 0x0B1410, metalness: 0.3, roughness: 0.8 })
  );
  pcb.position.y = -0.18;
  group.add(pcb);

  // Pins grid
  for (let r = -4; r <= 4; r += 1) {
    for (let c = -4; c <= 4; c += 1) {
      if (Math.abs(r) >= 3 || Math.abs(c) >= 3) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 6), pinMat);
        pin.position.set(r * 0.36, -0.32, c * 0.36);
        group.add(pin);
      }
    }
  }

  // LED indicator dots
  for (let i = 0; i < 8; i++) {
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledMat);
    const angle = (i / 8) * Math.PI * 2;
    led.position.set(Math.cos(angle) * 1.1, 0.16, Math.sin(angle) * 1.1);
    group.add(led);
  }

  // Circuit traces
  for (let i = 0; i < 12; i++) {
    const pts: THREE.Vector3[] = [];
    const sx = (Math.random() - 0.5) * 2.2;
    const sz = (Math.random() - 0.5) * 2.2;
    const ex = sx + (Math.random() - 0.5) * 1.2;
    const ez = sz + (Math.random() - 0.5) * 1.2;
    // L-shaped trace
    pts.push(new THREE.Vector3(sx, 0.16, sz));
    pts.push(new THREE.Vector3(sx, 0.16, ez));
    pts.push(new THREE.Vector3(ex, 0.16, ez));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(geo, lineMat));
  }

  return group;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const metric1Ref = useRef<HTMLSpanElement>(null);
  const metric2Ref = useRef<HTMLSpanElement>(null);
  const metric3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x0B1410, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050A07, 0.05);

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 1.5, 9);

    // Lighting
    scene.add(new THREE.AmbientLight(0x00FF85, 0.25));
    const keyLight = new THREE.PointLight(0x00FF85, 3, 20);
    keyLight.position.set(0, 4, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x00FFC3, 1.5, 18);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x007A3D, 2, 12);
    rimLight.position.set(4, 2, -3);
    scene.add(rimLight);

    // Chip
    const chipGroup = buildChipGroup();
    chipGroup.rotation.x = -0.3;
    scene.add(chipGroup);

    // Grid plane with glowing lines
    const gridGeo = new THREE.PlaneGeometry(20, 20, 24, 24);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00A854,
      wireframe: true,
      transparent: true,
      opacity: 0.055,
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -3.2;
    scene.add(grid);

    // Particle flow around chip
    const pCount = window.innerWidth < 768 ? 90 : 280;
    const positions = new Float32Array(pCount * 3);
    const speeds = new Float32Array(pCount);
    const angles = new Float32Array(pCount);
    const radii = new Float32Array(pCount);
    const heights = new Float32Array(pCount);
    const heightSpeeds = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 1.8 + Math.random() * 2.8;
      speeds[i] = 0.006 + Math.random() * 0.018;
      heights[i] = (Math.random() - 0.5) * 3.5;
      heightSpeeds[i] = (Math.random() - 0.5) * 0.004;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00FF85,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Outer halo ring
    const haloGeo = new THREE.TorusGeometry(3.8, 0.015, 6, 80);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00FF85, transparent: true, opacity: 0.25 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -0.5;
    scene.add(halo);

    const halo2 = new THREE.Mesh(
      new THREE.TorusGeometry(5.0, 0.01, 6, 80),
      new THREE.MeshBasicMaterial({ color: 0x00A854, transparent: true, opacity: 0.15 })
    );
    halo2.rotation.x = Math.PI / 2;
    halo2.position.y = -1;
    scene.add(halo2);

    // Background micro-particles
    const bgCount = 600;
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPos[i * 3] = (Math.random() - 0.5) * 20;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMesh = new THREE.Points(bgGeo, new THREE.PointsMaterial({
      color: 0x00A854,
      size: 0.025,
      transparent: true,
      opacity: 0.4,
    }));
    scene.add(bgMesh);

    // Mouse parallax
    let targetX = 0, targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.12;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.08;
    };
    document.addEventListener('mousemove', onMouseMove);

    let frame = 0;
    let lastTime = performance.now();
    let fpsAcc = 0;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      frame++;

      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;
      fpsAcc += dt;

      if (fpsAcc > 500) {
        const fps = Math.round(1000 / (fpsAcc / 30));
        if (fpsRef.current) fpsRef.current.textContent = String(Math.min(fps, 60));
        fpsAcc = 0;
      }

      // Chip rotation
      chipGroup.rotation.y += 0.003;

      // Camera parallax
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (0.8 - targetY * 4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Particle animation
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        angles[i] += speeds[i];
        heights[i] += heightSpeeds[i];
        if (heights[i] > 2.5 || heights[i] < -2.5) heightSpeeds[i] *= -1;
        pos[i * 3] = Math.cos(angles[i]) * radii[i];
        pos[i * 3 + 1] = heights[i];
        pos[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
      }
      pGeo.attributes.position.needsUpdate = true;

      // Pulse key light
      keyLight.intensity = 2.5 + Math.sin(now * 0.0012) * 0.8;
      halo.material.opacity = 0.15 + Math.sin(now * 0.001) * 0.1;
      halo2.material.opacity = 0.08 + Math.sin(now * 0.0008 + 1) * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    // Counter animations
    function animateCounter(el: HTMLSpanElement | null, target: number, suffix: string, isFloat: boolean, duration = 1800) {
      if (!el) return;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val).toString()) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    setTimeout(() => {
      animateCounter(metric1Ref.current, 94.2, '%', true);
      animateCounter(metric2Ref.current, 67, '%', false);
      animateCounter(metric3Ref.current, 99.8, '%', true);
    }, 500);

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
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      bgGeo.dispose();
    };
  }, []);

  const scrollToSim = () => {
    document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '80px 48px 48px',
        gap: '64px',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
      className="hero-responsive"
    >
      {/* Background particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'var(--green-dark)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.25,
              animationName: 'particleDrift',
              animationDuration: `${7 + Math.random() * 7}s`,
              animationDelay: `${Math.random() * 8}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
        ))}
      </div>

      {/* Text column */}
      <div className="hero-text" style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid var(--border-default)',
          borderRadius: '100px',
          padding: '6px 14px',
          marginBottom: '32px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'var(--green-neon)',
          letterSpacing: '0.1em',
          background: 'rgba(0,255,133,0.05)',
          animation: 'fadeInUp 0.6s 0.1s ease both',
        }}>
          <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: 'var(--green-neon)',
            animation: 'pulse 1.5s infinite',
            flexShrink: 0,
          }} />
          LIVE SYSTEM &nbsp;—&nbsp; POWERED BY NVIDIA SDK
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(42px, 5vw, 76px)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: '24px',
          color: 'var(--text-primary)',
          animation: 'fadeInUp 0.7s 0.2s ease both',
        }}>
          The AI Model<br />
          Compilation &amp;<br />
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span className="gradient-text">Optimization</span>
            <span style={{
              position: 'absolute',
              bottom: '-4px',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, var(--green-neon), transparent)',
              borderRadius: '2px',
            }} />
          </span><br />
          Platform.
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          maxWidth: '480px',
          marginBottom: '36px',
          letterSpacing: '0.02em',
          animation: 'fadeInUp 0.7s 0.35s ease both',
        }}>
          Transform experimental ML models into production-ready,
          hardware-optimized assets for cloud, edge, and enterprise deployment.
          Inference accelerated. Deployment validated.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '44px',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.7s 0.48s ease both',
        }}>
          <a
            href="#pricing"
            onClick={e => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="btn-primary"
            onMouseEnter={playTick}
            style={{ padding: '14px 28px', fontSize: '15px', textDecoration: 'none' }}
          >
            Start Optimizing
          </a>
          <a
            href="#simulation"
            onClick={e => { e.preventDefault(); scrollToSim(); }}
            className="btn-outline"
            onMouseEnter={playTick}
            style={{ padding: '13px 26px', fontSize: '15px', textDecoration: 'none' }}
          >
            View Simulation →
          </a>
        </div>

        {/* Metrics */}
        <div style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.7s 0.6s ease both',
        }}>
          {[
            { ref: metric1Ref, suffix: '%', label: 'FASTER INFERENCE' },
            { ref: metric2Ref, suffix: '%', label: 'MEMORY REDUCTION' },
            { ref: metric3Ref, suffix: '%', label: 'UPTIME' },
          ].map((m, i) => (
            <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              <span ref={m.ref} style={{ color: 'var(--green-neon)', fontWeight: 700, fontSize: '14px' }}>0{m.suffix}</span>
              <br />
              <span style={{ fontSize: '10px', letterSpacing: '0.12em' }}>↑ {m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Three.js Canvas */}
      <div style={{
        position: 'relative',
        height: '600px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-secondary)',
        animation: 'fadeIn 0.9s 0.3s ease both',
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

        {/* Overlay badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'var(--green-neon)',
          letterSpacing: '0.15em',
          background: 'rgba(5,10,7,0.85)',
          border: '1px solid var(--border-default)',
          padding: '6px 12px',
          borderRadius: '4px',
          backdropFilter: 'blur(8px)',
        }}>
          ◉ LIVE RENDER — THREE.JS ENGINE
        </div>

        {/* Bottom stats */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          gap: '10px',
        }}>
          {[
            { label: 'FPS', val: <span ref={fpsRef}>60</span> },
            { label: 'PARTICLES', val: <span>{window.innerWidth < 768 ? '90' : '280'}</span> },
            { label: 'BLOOM', val: <span>ACTIVE</span> },
            { label: 'GPU', val: <span>NVIDIA RTX</span> },
          ].map((s, i) => (
            <div key={i} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'var(--text-muted)',
              background: 'rgba(5,10,7,0.75)',
              border: '1px solid var(--border-default)',
              padding: '5px 10px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
              backdropFilter: 'blur(8px)',
            }}>
              {s.label} <span style={{ color: 'var(--green-neon)' }}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Corner accents */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => (
          <div key={corner} style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            ...(corner.includes('top') ? { top: 0 } : { bottom: 0 }),
            ...(corner.includes('left') ? { left: 0 } : { right: 0 }),
            borderTop: corner.includes('top') ? '2px solid var(--green-deep)' : 'none',
            borderBottom: corner.includes('bottom') ? '2px solid var(--green-deep)' : 'none',
            borderLeft: corner.includes('left') ? '2px solid var(--green-deep)' : 'none',
            borderRight: corner.includes('right') ? '2px solid var(--green-deep)' : 'none',
          }} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        onClick={() => document.getElementById('stats-bar')?.scrollIntoView({ behavior: 'smooth' })}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'var(--text-disabled)',
          letterSpacing: '0.1em',
          animation: 'float 2.5s ease-in-out infinite',
          cursor: 'none',
        }}
      >
        <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, var(--green-dark), transparent)' }} />
        <ChevronDown size={14} color="var(--text-disabled)" />
        SCROLL
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-responsive {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 100px 32px 48px !important;
          }
          .hero-responsive > div:last-child { height: 420px !important; }
        }
        @media (max-width: 768px) {
          .hero-responsive { padding: 80px 20px 40px !important; }
          .hero-responsive > div:last-child { height: 320px !important; }
        }
      `}</style>
    </section>
  );
}
