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
        <p className={styles.eyebrow}>Klien YouTube Music untuk Android</p>
        <h1 id="hero-title">{headline}</h1>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>
          <a className="btn btn--primary" href={primaryHref} rel="noopener">{primaryLabel}</a>
          <Link className="btn btn--ghost" href={secondaryHref}>Lihat tampilannya</Link>
        </div>
      </div>
      <div className={styles.device}>
        <CoverOrbit />
      </div>
    </section>
  );
}
