'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CoverOrbit.module.css';

const COVERS = [
  { src: '/showcase/covers/falling.webp', title: 'Falling', artist: 'Trevor Daniel' },
  { src: '/showcase/covers/anything.webp', title: 'anything', artist: 'Adrianne Lenker' },
  { src: '/showcase/covers/stop-the-wedding.webp', title: 'Stop The Wedding!', artist: 'Ashe' },
  { src: '/showcase/covers/clairo.webp', title: 'Sofia', artist: 'Clairo' },
  { src: '/showcase/covers/karol-g.webp', title: 'Si Antes Te Hubiera Conocido', artist: 'KAROL G' },
];

export default function CoverOrbit({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [webgl, setWebgl] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      } catch {
        return;
      }

      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.appendChild(renderer.domElement);
      setWebgl(true);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.12, 6.0);

      const group = new THREE.Group();
      group.scale.setScalar(0.88);
      scene.add(group);

      const radius = 1.62;
      const frameGeo = new THREE.PlaneGeometry(1.94, 1.94);
      const artGeo = new THREE.PlaneGeometry(1.82, 1.82);

      const frameMats: import('three').MeshBasicMaterial[] = [];
      const artMats: import('three').MeshBasicMaterial[] = [];
      const geometries = [frameGeo, artGeo];
      const pivots: import('three').Object3D[] = [];
      const baseAngles: number[] = [];

      COVERS.forEach((cover, i) => {
        const angle = (i / COVERS.length) * Math.PI * 2;
        baseAngles.push(angle);
        const pivot = new THREE.Object3D();
        pivot.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);

        const frameMat = new THREE.MeshBasicMaterial({
          color: 0x2a233b,
          transparent: true,
          opacity: 0.92,
          side: THREE.DoubleSide,
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.z = -0.025;
        pivot.add(frame);

        const tex = new THREE.TextureLoader().load(cover.src);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        const artMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        pivot.add(new THREE.Mesh(artGeo, artMat));

        frameMats.push(frameMat);
        artMats.push(artMat);
        pivots.push(pivot);
        group.add(pivot);
      });

      let spin = 0;
      let target = 0;
      let velocity = 0;
      let dragging = false;
      let hovering = false;
      let lastX = 0;
      let tiltTargetX = 0;
      let tiltTargetY = 0;
      let tiltX = 0;
      let tiltY = 0;
      let elapsed = 0;
      let currentFront = 0;

      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        velocity = 0;
        lastX = e.clientX;
        host.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
        tiltTargetX = -ny * 0.14;
        tiltTargetY = nx * 0.16;

        if (!dragging) return;
        const dx = e.clientX - lastX;
        const delta = dx * 0.0085;
        target += delta;
        velocity = delta * 0.72;
        lastX = e.clientX;
      };

      const onPointerUp = () => {
        dragging = false;
      };

      const onPointerEnter = () => {
        hovering = true;
      };

      const onPointerLeave = () => {
        hovering = false;
        tiltTargetX = 0;
        tiltTargetY = 0;
      };

      host.addEventListener('pointerdown', onPointerDown);
      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('pointerup', onPointerUp);
      host.addEventListener('pointercancel', onPointerUp);
      host.addEventListener('pointerenter', onPointerEnter);
      host.addEventListener('pointerleave', onPointerLeave);

      const place = () => {
        group.rotation.y = spin;
        group.rotation.x = tiltX;
        group.rotation.z = -tiltY * 0.25;

        let bestIdx = 0;
        let bestDepth = -Infinity;

        for (let i = 0; i < pivots.length; i += 1) {
          const p = pivots[i];
          const worldAngle = baseAngles[i] + spin;
          const depth = Math.cos(worldAngle); // -1 (back) to +1 (front)
          const t = (depth + 1) * 0.5; // 0 .. 1

          if (depth > bestDepth) {
            bestDepth = depth;
            bestIdx = i;
          }

          const scale = 0.78 + t * 0.34;
          p.scale.setScalar(scale);
          p.position.y = Math.sin(elapsed * 0.85 + i * 1.35) * 0.085 + (t - 0.5) * 0.08;
          p.lookAt(camera.position);

          artMats[i].opacity = 0.42 + t * 0.58;
          frameMats[i].opacity = 0.35 + t * 0.62;
          frameMats[i].color.setHex(t > 0.82 ? 0xc8a2ff : 0x262038);
        }

        if (bestIdx !== currentFront) {
          currentFront = bestIdx;
          setActiveIdx(bestIdx);
        }
      };

      const render = () => renderer.render(scene, camera);

      let raf = 0;
      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.05);
        elapsed += dt;

        if (!dragging) {
          if (Math.abs(velocity) > 0.0004) {
            target += velocity;
            velocity *= 0.94;
          } else {
            target += dt * (hovering ? 0.11 : 0.26);
          }
        }

        spin += (target - spin) * 0.085;
        tiltX += (tiltTargetX - tiltX) * 0.08;
        tiltY += (tiltTargetY - tiltY) * 0.08;

        place();
        render();
      };

      place();
      render();

      if (!reduce) tick();

      const onResize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (reduce) render();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        host.removeEventListener('pointerdown', onPointerDown);
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('pointerup', onPointerUp);
        host.removeEventListener('pointercancel', onPointerUp);
        host.removeEventListener('pointerenter', onPointerEnter);
        host.removeEventListener('pointerleave', onPointerLeave);
        geometries.forEach((g) => g.dispose());
        [...frameMats, ...artMats].forEach((m) => {
          m.map?.dispose();
          m.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  const current = COVERS[activeIdx] ?? COVERS[0];

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div ref={hostRef} className={`${styles.canvas} ${webgl ? styles.live : ''}`} />
      <ul className={styles.fallback}>
        {COVERS.map((c) => (
          <li key={c.src}>
            <img src={c.src} alt={`${c.title} oleh ${c.artist}`} width={512} height={512} loading="lazy" />
          </li>
        ))}
      </ul>
      <div className={styles.nowBar} aria-live="polite">
        <span className={styles.eq} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className={styles.trackMeta}>
          <strong>{current.title}</strong>
          <span>{current.artist}</span>
        </div>
        <span className={styles.hint}>Geser 3D</span>
      </div>
    </div>
  );
}
