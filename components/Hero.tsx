import Link from 'next/link';
import CoverOrbit from './CoverOrbit';
import styles from './Hero.module.css';

type Props = {
  headline: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
};

export default function Hero({ headline, body, primaryHref, primaryLabel, secondaryHref }: Props) {
  return (
    <section className={`wrap ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.text}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          Klien YouTube Music untuk Android
        </p>
        <h1 id="hero-title" className={styles.title}>{headline}</h1>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>
          <a className={`btn btn--primary ${styles.primaryBtn}`} href={primaryHref} rel="noopener">
            <span>{primaryLabel}</span>
            <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </a>
          <Link className={`btn btn--ghost ${styles.ghostBtn}`} href={secondaryHref}>
            <span>Lihat tampilannya</span>
            <svg className={styles.arrowRight} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      <div className={styles.device}>
        <CoverOrbit />
      </div>
    </section>
  );
}
