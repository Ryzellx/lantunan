'use client';
import Shot from './Shot';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ShowcaseGrid.module.css';

export type Shot = {
  id: string;
  file: string;
  asset: string;
  title: string;
  caption: string;
  alt: string;
  w: number;
  h: number;
};

export default function ShowcaseGrid({ shots }: { shots: Shot[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const restoreFocus = useCallback(() => {
    const el = triggerRef.current;
    if (el) window.setTimeout(() => el.focus(), 0);
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpenIdx(null);
    restoreFocus();
  }, [restoreFocus]);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIdx((i) => (i === null ? i : (i + dir + shots.length) % shots.length));
    },
    [shots.length],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onNativeClose = () => {
      setOpenIdx(null);
      restoreFocus();
    };
    d.addEventListener('close', onNativeClose);
    return () => d.removeEventListener('close', onNativeClose);
  }, [restoreFocus]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    };
    d.addEventListener('keydown', onKey);
    return () => d.removeEventListener('keydown', onKey);
  }, [step]);

  const current = openIdx === null ? null : shots[openIdx];

  return (
    <>
      <ul className={styles.grid}>
        {shots.map((s, i) => (
          <li key={s.id} className={styles.cell}>
            <button
              type="button"
              className={styles.thumb}
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setOpenIdx(i);
                dialogRef.current?.showModal();
              }}
              aria-label={`Buka ${s.title}`}
            >
              <Shot
                file={s.asset}
                alt={s.alt}
                width={360}
                height={800}
                sizes="(max-width: 640px) 45vw, 260px"
              />
            </button>
            <p className={styles.cap}><span className="mono">{s.caption}</span></p>
          </li>
        ))}
      </ul>

      <dialog ref={dialogRef} className={styles.dialog} aria-label="Galeri screenshot">
        {current && (
          <div className={styles.inner}>
            <Shot
              file={current.asset}
              alt={current.alt}
              width={current.w}
              height={current.h}
              sizes="90vw"
              priority
            />
            <p className={styles.dialogCap}>{current.title} · {current.caption}</p>
            <div className={styles.controls}>
              <button type="button" className="btn btn--ghost" onClick={() => step(-1)} aria-label="Sebelumnya">Sebelumnya</button>
              <button type="button" className="btn btn--ghost" onClick={() => step(1)} aria-label="Berikutnya">Berikutnya</button>
              <button type="button" className="btn btn--primary" onClick={close}>Tutup</button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
