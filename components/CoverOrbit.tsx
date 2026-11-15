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
      const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.8);

      const group = new THREE.Group();
      group.scale.setScalar(0.86);
      scene.add(group);

      const radius = 1.5;
      const frameGeo = new THREE.PlaneGeometry(1.92, 1.92);
      const artGeo = new THREE.PlaneGeometry(1.8, 1.8);

      const materials: import('three').Material[] = [];
      const geometries = [frameGeo, artGeo];
      const pivots: import('three').Object3D[] = [];

      COVERS.forEach((cover, i) => {
        const angle = (i / COVERS.length) * Math.PI * 2;
        const pivot = new THREE.Object3D();
        pivot.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);

        const frameMat = new THREE.MeshBasicMaterial({
          color: 0x1d1a24,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide,
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.z = -0.02;
        pivot.add(frame);

        const tex = new THREE.TextureLoader().load(cover.src);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        const artMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        pivot.add(new THREE.Mesh(artGeo, artMat));

        materials.push(frameMat, artMat);
        pivots.push(pivot);
        group.add(pivot);
      });

      let spin = 0;
      let target = 0;
      let dragging = false;
      let lastX = 0;
      let elapsed = 0;

      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        host.setPointerCapture(e.pointerId);
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!dragging) return;
        target += (e.clientX - lastX) * 0.007;
        lastX = e.clientX;
      };
      const onPointerUp = () => {
        dragging = false;
      };

      host.addEventListener('pointerdown', onPointerDown);
      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('pointerup', onPointerUp);
      host.addEventListener('pointercancel', onPointerUp);

      // tiap cover selalu menghadap kamera, jadi tidak ada bidang punggung yang hilang
      const place = () => {
        group.rotation.y = spin;
        for (let i = 0; i < pivots.length; i += 1) {
          const p = pivots[i];
          p.position.y = Math.sin(elapsed * 0.7 + i * 1.3) * 0.07;
          p.lookAt(camera.position);
        }
      };

      const render = () => renderer.render(scene, camera);

      let raf = 0;
      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.05);
        elapsed += dt;
        if (!dragging) target += dt * 0.22;
        spin += (target - spin) * 0.07;
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
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => {
          (m as import('three').MeshBasicMaterial).map?.dispose();
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
      <p className={styles.caption}>Cover dari lagu yang kamu putar. Geser untuk memutar.</p>
    </div>
  );
}
