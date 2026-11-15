import Link from 'next/link';
import Logo from './Logo';
import styles from './SiteHeader.module.css';

const NAV = [
  { href: '/download', label: 'Unduh' },
  { href: '/showcase', label: 'Showcase' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/faq', label: 'FAQ' },
];

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Lantunan, beranda">
          <Logo className={styles.logo} />
          <span className={styles.word}>Lantunan</span>
        </Link>
        <nav aria-label="Navigasi utama">
          <ul className={styles.nav}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/download" className={`btn btn--primary ${styles.cta}`}>Unduh APK</Link>
      </div>
    </header>
  );
}
