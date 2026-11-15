import Link from 'next/link';
import Shot from './Shot';
import styles from './Hero.module.css';

type Props = {
  headline: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  heroShot: string;
};

export default function Hero({ headline, body, primaryHref, primaryLabel, secondaryHref, heroShot }: Props) {
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
        <Shot
          file={heroShot}
          alt="Layar Now Playing Lantunan di ponsel Android"
          width={540}
          height={1200}
          priority
          sizes="(max-width: 900px) 55vw, 340px"
        />
      </div>
    </section>
  );
}
