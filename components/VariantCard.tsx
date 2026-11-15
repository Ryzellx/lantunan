import type { Variant } from '@/lib/release';
import { formatBytes } from '@/lib/format';
import styles from './VariantCard.module.css';

type Props = { variant: Variant; tag: string; recommended?: boolean; sha?: string | null };

export default function VariantCard({ variant, tag, recommended, sha }: Props) {
  const meta = [tag, variant.available && variant.sizeBytes ? formatBytes(variant.sizeBytes) : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className={`${styles.card} ${recommended ? styles.recommended : ''}`} aria-labelledby={`v-${variant.id}`}>
      <div className={styles.head}>
        <h3 id={`v-${variant.id}`}>{variant.title}</h3>
        {variant.label && <span className={recommended ? styles.badgeAccent : styles.badge}>{variant.label}</span>}
      </div>
      <p className={styles.blurb}>{variant.blurb}</p>
      <p className={`mono ${styles.meta}`}>{meta}</p>

      {variant.available && variant.url ? (
        <a className={`btn btn--primary ${styles.action}`} href={variant.url} rel="noopener">
          Unduh APK{variant.sizeBytes ? ` · ${formatBytes(variant.sizeBytes)}` : ''}
        </a>
      ) : (
        <>
          <p className={`${styles.missing} mono`}>Varian ini tidak ada di rilis terbaru</p>
          <a
            className={`btn btn--ghost ${styles.action}`}
            href={`https://github.com/Ryzellx/lantunan-releases/releases/tag/${tag}`}
            rel="noopener"
          >
            Lihat semua rilis
          </a>
        </>
      )}

      {variant.available && sha && (
        <details className={styles.sha}>
          <summary>Verifikasi SHA-256</summary>
          <p className="mono">{sha}</p>
          <p className="mono">sha256sum {variant.assetName}</p>
        </details>
      )}
    </article>
  );
}
