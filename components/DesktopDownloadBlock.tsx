import type { DesktopReleaseView } from '@/lib/release';
import { formatBytes, formatDate } from '@/lib/format';
import styles from './DesktopDownloadBlock.module.css';

export default function DesktopDownloadBlock({
  release,
  heading = true,
}: {
  release: DesktopReleaseView;
  heading?: boolean;
}) {
  return (
    <section id="desktop" className={styles.wrap} aria-labelledby="dl-desktop-heading">
      {heading && (
        <div className={styles.titleRow}>
          <h2 id="dl-desktop-heading">Unduh untuk Windows Desktop</h2>
          <span className={`mono ${styles.pill}`}>100% Pure Rust · ~96 MB RAM</span>
        </div>
      )}

      <div className={styles.statusRow}>
        <p className="mono muted">
          {release.tag}
          {release.publishedAt ? ` · ${formatDate(release.publishedAt)}` : ''}
          {' · Windows 10 / 11 (x64)'}
        </p>
      </div>

      <div className={styles.grid}>
        {release.variants.map((v) => {
          const isInstaller = v.id === 'installer';
          const meta = [release.tag, v.sizeBytes ? formatBytes(v.sizeBytes) : null]
            .filter(Boolean)
            .join(' · ');

          return (
            <article
              key={v.id}
              className={`${styles.card} ${isInstaller ? styles.recommended : ''}`}
              aria-labelledby={`dv-${v.id}`}
            >
              <div className={styles.head}>
                <h3 id={`dv-${v.id}`}>{v.title}</h3>
                <span className={isInstaller ? styles.badgeAccent : styles.badge}>{v.label}</span>
              </div>
              <p className={styles.blurb}>{v.blurb}</p>
              <p className={`mono ${styles.meta}`}>{meta}</p>

              {v.available && v.url ? (
                <a
                  className={`btn ${isInstaller ? 'btn--primary' : 'btn--ghost'} ${styles.action}`}
                  href={v.url}
                  rel="noopener"
                >
                  Unduh {isInstaller ? 'Installer' : 'Portable'}
                  {v.sizeBytes ? ` · ${formatBytes(v.sizeBytes)}` : ''}
                </a>
              ) : (
                <a className={`btn btn--ghost ${styles.action}`} href={release.releaseUrl} rel="noopener">
                  Lihat rilis di GitHub
                </a>
              )}
            </article>
          );
        })}
      </div>

      <p className={styles.helper}>
        Rilis resmi diambil langsung dari{' '}
        <a href={release.releaseUrl} rel="noopener">
          github.com/Ryzellx/lantunandesktop
        </a>
        . Tanpa iklan, tanpa Electron, dilengkapi Floating Dynamic Island &amp; Discord Rich Presence.
      </p>
    </section>
  );
}
