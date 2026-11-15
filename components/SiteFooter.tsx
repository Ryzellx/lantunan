import Link from 'next/link';
import Logo from './Logo';
import styles from './SiteFooter.module.css';

const BUILD_DATE = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta',
}).format(new Date());

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div>
          <p className={styles.name}>
            <Logo className={styles.logo} />
            Lantunan
          </p>
          <p className="muted">
            Musik tanpa iklan, lirik yang mengalir, dan unduhan offline. Semua dalam satu APK.
          </p>
        </div>
        <nav aria-label="Tautan situs">
          <ul className={styles.list}>
            <li><Link href="/download">Unduh</Link></li>
            <li><Link href="/showcase">Showcase</Link></li>
            <li><Link href="/changelog">Changelog</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/privacy">Privasi</Link></li>
          </ul>
        </nav>
        <nav aria-label="Sorotan">
          <ul className={styles.list}>
            <li><Link href="/download#banding">Bandingkan varian</Link></li>
            <li><Link href="/download#panduan">Cara memasang</Link></li>
            <li><Link href="/showcase">Tampilan aplikasi</Link></li>
            <li><Link href="/faq">Pertanyaan umum</Link></li>
          </ul>
        </nav>
      </div>
      <div className={`wrap ${styles.base}`}>
        <p className="muted">Lantunan untuk Android. Situs diperbarui {BUILD_DATE}.</p>
      </div>
    </footer>
  );
}
