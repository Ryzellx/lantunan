import { FEATURES } from '@/lib/site';
import styles from './FeatureList.module.css';

export default function FeatureList() {
  return (
    <ul className={styles.list}>
      {FEATURES.map((f, i) => (
        <li key={f.title} className={styles.row}>
          <span className={`mono ${styles.n}`} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3>{f.title}</h3>
            <p className="muted">{f.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
