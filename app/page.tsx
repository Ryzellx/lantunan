import Link from 'next/link';
import Shot from '@/components/Shot';
import Reveal from '@/components/Reveal';
import { getRelease } from '@/lib/release';
import { formatBytes, formatDate } from '@/lib/format';
import Hero from '@/components/Hero';
import FactStrip from '@/components/FactStrip';
import DownloadBlock from '@/components/DownloadBlock';
import FeatureList from '@/components/FeatureList';
import FaqList from '@/components/FaqList';
import showcase from '@/data/showcase.json';
import styles from './page.module.css';

export const revalidate = 300;

export default async function Home() {
  const release = await getRelease();
  const recommended = release.variants.find((v) => v.id === 'foss');
  const teaser = [...showcase.screens].sort((a, b) => a.order - b.order).slice(0, 3);

  return (
    <>
      <Hero
        headline="Musik tanpa gangguan."
        body="Lantunan memutar YouTube Music tanpa iklan, dengan lirik tersinkron, equalizer, dan unduhan offline. APK langsung, tanpa Play Store."
        primaryHref={recommended?.url ?? '/download'}
        primaryLabel={
          recommended?.sizeBytes
            ? `Unduh untuk Android · ${formatBytes(recommended.sizeBytes)}`
            : 'Unduh untuk Android'
        }
        secondaryHref="/showcase"
      />

      <Reveal>
      <FactStrip
        items={[
          { label: 'Versi terbaru', value: release.tag || 'Belum tersedia' },
          { label: 'Tanggal rilis', value: release.publishedAt ? formatDate(release.publishedAt) : 'Belum tersedia' },
          { label: 'Ukuran FOSS', value: recommended?.sizeBytes ? formatBytes(recommended.sizeBytes) : 'Belum tersedia' },
          { label: 'Lisensi', value: 'GPL-3.0' },
        ]}
      />
      </Reveal>

      <div className={`wrap section ${styles.dl}`}>
        <DownloadBlock release={release} />
      </div>

      <Reveal><section className={`wrap section ${styles.showcaseTeaser}`} aria-labelledby="showcase-teaser">
        <div className={styles.teaserHead}>
          <h2 id="showcase-teaser">Tampilannya, bukan mockup</h2>
          <Link href="/showcase" className="muted">Lihat semua</Link>
        </div>
        <div className={styles.teaserGrid}>
          {teaser.map((shot) => (
            <figure key={shot.id} className={styles.teaserFig}>
              <Shot
                file={shot.asset}
                alt={shot.alt}
                width={360}
                height={800}
                sizes="(max-width: 720px) 45vw, 300px"
              />
              <figcaption className="mono muted">{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section></Reveal>

      <Reveal><section className="wrap section" aria-labelledby="fitur">
        <h2 id="fitur">Yang kamu dapat</h2>
        <FeatureList />
      </section></Reveal>

      <Reveal><section className="wrap section" aria-labelledby="faq-home">
        <h2 id="faq-home">Pertanyaan yang sering muncul</h2>
        <FaqList limit={6} />
        <p className={styles.link}>
          <Link href="/faq">Semua pertanyaan</Link>
        </p>
      </section></Reveal>
    </>
  );
}
