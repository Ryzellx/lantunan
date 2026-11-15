import type { Metadata } from 'next';
import { getReleases } from '@/lib/release';
import { formatDate } from '@/lib/format';
import { renderNotes } from '@/lib/markdown';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Sepuluh rilis terakhir Lantunan, lengkap dengan tanggal dan catatan perubahan.',
};

export default async function ChangelogPage() {
  const releases = await getReleases(10);

  return (
    <>
      <section className="wrap section">
        <h1>Changelog</h1>
        <p className="muted">Sepuluh rilis terakhir, diambil dari halaman rilis GitHub.</p>
      </section>

      <div className="wrap">
        {releases.length === 0 ? (
          <p className="muted">Daftar rilis belum bisa dibaca. Semua catatan ada di halaman rilis GitHub.</p>
        ) : (
          <div className={styles.list}>
            {releases.map((r) => (
              <article key={r.tag} className={styles.entry}>
                <header className={styles.head}>
                  <h2 className="mono">{r.tag}</h2>
                  {r.publishedAt && (
                    <time className="mono muted" dateTime={r.publishedAt}>
                      {formatDate(r.publishedAt)}
                    </time>
                  )}
                </header>
                <div className={styles.notes} dangerouslySetInnerHTML={{ __html: renderNotes(r.notes) }} />
                <a className={styles.link} href={r.url} rel="noopener">Lihat rilis di GitHub</a>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
