import Link from 'next/link';
import styles from './SiteFooter.module.css';

const BUILD_DATE = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta',
}).format(new Date());

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div>
          <p className={styles.name}>Lantunan</p>
          <p className="muted">Klien YouTube Music untuk Android. Lisensi GPL-3.0.</p>
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
        <nav aria-label="Tautan proyek">
          <ul className={styles.list}>
            <li><a href="https://github.com/Ryzellx/lantunan-releases" rel="noopener">Rilis APK</a></li>
            <li><a href="https://github.com/Ryzellx/lantunan-releases/blob/main/LICENSE" rel="noopener">Lisensi GPL-3.0</a></li>
            <li><a href="https://github.com/Ryzellx" rel="noopener">Ryzellx</a></li>
          </ul>
        </nav>
      </div>
      <div className={`wrap ${styles.base}`}>
        <p className="muted">
          Dibangun dari Sakayori Music, InnerTune, dan OuterTune. Situs dibangun {BUILD_DATE}.
        </p>
      </div>
    </footer>
  );
}
