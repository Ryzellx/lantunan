import type { Metadata } from 'next';
import ShowcaseGrid, { type Shot } from '@/components/ShowcaseGrid';
import showcase from '@/data/showcase.json';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Showcase',
  description: 'Tangkapan layar Lantunan dari build Android: Home, Player, lirik, artis, dan dengar bersama.',
};

export default function ShowcasePage() {
  const shots = ([...showcase.screens].sort((a, b) => a.order - b.order)) as Shot[];
  const hasManifest = Boolean(showcase.generatedAt && showcase.version);

  return (
    <>
      <section className="wrap section">
        <h1>Showcase</h1>
        <p className="muted">
          Tangkapan layar dari aplikasi Android, bukan mockup. Ketuk satu gambar untuk memperbesar,
          lalu pakai panah kiri dan kanan.
        </p>
        <p className={`mono muted ${styles.meta}`}>
          {hasManifest
            ? `Dirender dari build ${showcase.version}, ${showcase.generatedAt}`
            : 'Screenshot dari build Android Lantunan.'}
        </p>
      </section>

      <div className="wrap">
        <ShowcaseGrid shots={shots} />
      </div>
    </>
  );
}
