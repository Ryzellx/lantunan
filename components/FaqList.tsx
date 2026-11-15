import { FAQ } from '@/lib/site';
import styles from './FaqList.module.css';

export default function FaqList({ limit }: { limit?: number }) {
  const items = typeof limit === 'number' ? FAQ.slice(0, limit) : FAQ;
  return (
    <div className={styles.list}>
      {items.map((f) => (
        <details key={f.q} className={styles.item}>
          <summary>{f.q}</summary>
          <p className="muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
