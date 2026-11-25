'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CoverOrbit.module.css';

const COVERS = [
  { src: '/showcase/covers/falling.webp', title: 'Falling', artist: 'Trevor Daniel', glow: 'rgba(204, 130, 255, 0.38)' },
  { src: '/showcase/covers/anything.webp', title: 'anything', artist: 'Adrianne Lenker', glow: 'rgba(164, 152, 255, 0.34)' },
  { src: '/showcase/covers/stop-the-wedding.webp', title: 'Stop The Wedding!', artist: 'Ashe', glow: 'rgba(232, 146, 214, 0.36)' },
  { src: '/showcase/covers/clairo.webp', title: 'Sofia', artist: 'Clairo', glow: 'rgba(176, 140, 255, 0.38)' },
  { src: '/showcase/covers/karol-g.webp', title: 'Si Antes Te Hubiera Conocido', artist: 'KAROL G', glow: 'rgba(138, 178, 255, 0.34)' },
];

export default function CoverOrbit({ className = '' }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const dragStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % COVERS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [paused]);

  const step = (dir: 1 | -1) => {
    setActive((prev) => (prev + dir + COVERS.length) % COVERS.length);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    setPaused(true);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current !== null) {
      const dx = e.clientX - dragStartX.current;
      if (Math.abs(dx) > 36) {
        step(dx < 0 ? 1 : -1);
      }
      dragStartX.current = null;
    }
    setPaused(false);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
    setTilt({ x: -ny * 7, y: nx * 9 });
  };

  const onPointerLeave = () => {
    dragStartX.current = null;
    setPaused(false);
    setTilt({ x: 0, y: 0 });
  };

  const current = COVERS[active];

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div
        className={styles.stage}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      >
        <div
          className={styles.aura}
          style={{ background: `radial-gradient(circle, ${current.glow} 0%, transparent 68%)` }}
          aria-hidden="true"
        />

        <div
          className={styles.deck}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {COVERS.map((c, i) => {
            let offset = i - active;
            const half = Math.floor(COVERS.length / 2);
            if (offset > half) offset -= COVERS.length;
            if (offset < -half) offset += COVERS.length;

            const abs = Math.abs(offset);
            const isCenter = offset === 0;
            const tx = offset * 108;
            const tz = -abs * 115;
            const ry = offset * -24;
            const sc = isCenter ? 1 : Math.max(0.72, 1 - abs * 0.14);
            const op = isCenter ? 1 : Math.max(0.28, 1 - abs * 0.34);

            return (
              <button
                key={c.src}
                type="button"
                className={`${styles.card} ${isCenter ? styles.cardActive : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Putar pratinjau cover ${c.title} oleh ${c.artist}`}
                style={{
                  transform: `translate3d(${tx}px, ${isCenter ? -6 : abs * 6}px, ${tz}px) rotateY(${ry}deg) scale(${sc})`,
                  opacity: op,
                  zIndex: 10 - abs,
                }}
              >
                <img src={c.src} alt={`${c.title} oleh ${c.artist}`} width={320} height={320} draggable={false} />
                <span className={styles.sheen} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

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
        <div className={styles.dots} role="tablist" aria-label="Pilih cover">
          {COVERS.map((c, i) => (
            <button
              key={c.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={c.title}
              className={`${styles.dotBtn} ${i === active ? styles.dotActive : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
