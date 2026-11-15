'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CoverOrbit.module.css';

const COVERS = [
  { src: '/showcase/covers/no-time-to-die.webp', title: 'No Time To Die', artist: 'Billie Eilish' },
  { src: '/showcase/covers/peace-salam.webp', title: 'Peace Salam', artist: 'Abdulrahman Mohammed' },
  { src: '/showcase/covers/wherever-you-go.webp', title: 'Wherever You Go', artist: 'Beach House' },
  { src: '/showcase/covers/basrah-watooh.webp', title: 'Basrah w Atooh', artist: 'Cairokee' },
  { src: '/showcase/covers/a-prayer.webp', title: 'A Prayer', artist: 'Faraj Suleiman' },
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
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch {
        return;
      }

      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.appendChild(renderer.domElement);
      setWebgl(true);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0.15, 7.2);

      const group = new THREE.Group();
      scene.add(group);

      const renderOnce = () => renderer.render(scene, camera);
      const loader = new THREE.TextureLoader();
      const radius = 3.05;
      const frameGeo = new THREE.PlaneGeometry(1.72, 1.72);
      const artGeo = new THREE.PlaneGeometry(1.6, 1.6);

      const materials: import('three').Material[] = [];
      const geometries = [frameGeo, artGeo];

      COVERS.forEach((cover, i) => {
        const angle = (i / COVERS.length) * Math.PI * 2;
        const pivot = new THREE.Group();
        pivot.position.set(Math.sin(angle) * radius, Math.cos(angle * 1.7) * 0.28, Math.cos(angle) * radius);
        pivot.rotation.y = -angle;

        const frameMat = new THREE.MeshBasicMaterial({ color: 0x1d1a24, transparent: true, opacity: 0.96 });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.z = -0.03;
        pivot.add(frame);

        const tex = loader.load(cover.src, () => {
          if (reduce) renderOnce();
        });
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        const artMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const art = new THREE.Mesh(artGeo, artMat);
        pivot.add(art);

        materials.push(frameMat, artMat);
        group.add(pivot);
      });

      let spin = 0;
      let target = 0;
      let dragging = false;
      let lastX = 0;

      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        host.setPointerCapture(e.pointerId);
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        target += dx * 0.006;
      };
      const onPointerUp = () => {
        dragging = false;
      };

      host.addEventListener('pointerdown', onPointerDown);
      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('pointerup', onPointerUp);
      host.addEventListener('pointercancel', onPointerUp);

      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      });
      io.observe(host);

      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!reduce && !dragging) target += dt * 0.16;
        spin += (target - spin) * 0.08;
        group.rotation.y = spin;
        group.rotation.x = Math.sin(spin * 0.6) * 0.03;
        renderer.render(scene, camera);
      };

      if (reduce) {
        group.rotation.y = 0.35;
        renderer.render(scene, camera);
      } else {
        tick();
      }

      const onResize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (reduce) renderer.render(scene, camera);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        host.removeEventListener('pointerdown', onPointerDown);
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('pointerup', onPointerUp);
        host.removeEventListener('pointercancel', onPointerUp);
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        materials.forEach((m) => {
          const map = (m as import('three').MeshBasicMaterial).map;
          map?.dispose();
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
      <ul className={styles.fallback} aria-hidden={webgl}>
        {COVERS.map((c) => (
          <li key={c.src}>
            <img src={c.src} alt={`${c.title} oleh ${c.artist}`} width={512} height={512} loading="lazy" />
          </li>
        ))}
      </ul>
      <p className={styles.caption}>Cover album yang diputar di aplikasi. Geser untuk memutar.</p>
    </div>
  );
}
