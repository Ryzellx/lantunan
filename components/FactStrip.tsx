import styles from './FactStrip.module.css';

export default function FactStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <section className="wrap" aria-label="Ringkasan rilis">
      <dl className={styles.strip}>
        {items.map((i) => (
          <div key={i.label} className={styles.item}>
            <dt>{i.label}</dt>
            <dd className="mono">{i.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
