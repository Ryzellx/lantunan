import Link from 'next/link';
import type { ReleaseView } from '@/lib/release';
import { formatDate, formatDateTime } from '@/lib/format';
import VariantCard from './VariantCard';
import styles from './DownloadBlock.module.css';

export default function DownloadBlock({
  release,
  heading = true,
}: {
  release: ReleaseView;
  heading?: boolean;
}) {
  if (release.source === 'none') {
    return (
      <section className={styles.wrap} aria-labelledby="dl-empty">
        <h2 id="dl-empty">Rilis sedang tidak bisa dibaca</h2>
        <p className="muted">
          Situs belum menerima data rilis, dan belum ada versi tersimpan. Semua unduhan tetap
          tersedia di halaman rilis GitHub.
        </p>
        <a className="btn btn--primary" href="https://github.com/Ryzellx/lantunan-releases/releases" rel="noopener">
          Buka halaman rilis
        </a>
      </section>
    );
  }

  return (
    <section className={styles.wrap} aria-labelledby="dl-heading">
      {heading && <h2 id="dl-heading">Unduh Lantunan</h2>}
      <div className={styles.statusRow}>
        <p className="mono muted">
          {release.tag}
          {release.publishedAt ? ` · ${formatDate(release.publishedAt)}` : ''}
        </p>
        {release.source === 'snapshot' && (
          <p className={`${styles.badge} mono`} role="status">
            Versi tersimpan, mungkin belum terbaru
          </p>
        )}
      </div>

      <div className={styles.grid}>
        {release.variants.map((v) => (
          <VariantCard
            key={v.id}
            variant={v}
            tag={release.tag}
            recommended={v.id === 'foss'}
            sha={release.sha256?.[v.assetName.toLowerCase()] ?? null}
          />
        ))}
      </div>

      <p className={styles.helper}>
        Tidak yakin? <Link href="/download#panduan">Ini panduannya</Link>.
        {release.source === 'snapshot' && (
          <>
            {' '}
            <span className="muted">Data terakhir diperbarui {formatDateTime(release.fetchedAt)}.</span>
          </>
        )}
      </p>
    </section>
  );
}
