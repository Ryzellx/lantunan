'use client';

import { useState } from 'react';
import { FAQ } from '@/lib/site';
import styles from './FaqList.module.css';

export default function FaqList({ limit }: { limit?: number }) {
  const items = typeof limit === 'number' ? FAQ.slice(0, limit) : FAQ;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className={styles.list}>
      {items.map((f, idx) => {
        const isOpen = openIdx === idx;
        const panelId = `faq-panel-${idx}`;
        return (
          <div key={f.q} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <span>{f.q}</span>
              <span className={styles.icon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </span>
            </button>
            <div id={panelId} className={styles.panel} role="region">
              <div className={styles.panelInner}>
                <p className="muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
