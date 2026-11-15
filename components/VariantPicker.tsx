'use client';
import { useState } from 'react';

type Answer = { cast: boolean | null; fdroid: boolean | null };

export default function VariantPicker() {
  const [a, setA] = useState<Answer>({ cast: null, fdroid: null });
  const result =
    a.fdroid === true ? 'izzy' : a.cast === true ? 'cast' : a.cast === false || a.fdroid === false ? 'foss' : null;

  return (
    <div>
      <p><strong>1. Kamu memutar ke Chromecast atau speaker Cast?</strong></p>
      <div role="group" aria-label="Cast">
        <button type="button" className="btn btn--ghost" aria-pressed={a.cast === true} onClick={() => setA((s) => ({ ...s, cast: true }))} style={{ marginRight: 8 }}>Ya</button>
        <button type="button" className="btn btn--ghost" aria-pressed={a.cast === false} onClick={() => setA((s) => ({ ...s, cast: false }))}>Tidak</button>
      </div>

      <p style={{ marginTop: '1.25rem' }}><strong>2. Kamu kurator F-Droid atau IzzyOnDroid?</strong></p>
      <div role="group" aria-label="F-Droid">
        <button type="button" className="btn btn--ghost" aria-pressed={a.fdroid === true} onClick={() => setA((s) => ({ ...s, fdroid: true }))} style={{ marginRight: 8 }}>Ya</button>
        <button type="button" className="btn btn--ghost" aria-pressed={a.fdroid === false} onClick={() => setA((s) => ({ ...s, fdroid: false }))}>Tidak</button>
      </div>

      <p role="status" aria-live="polite" style={{ marginTop: '1.25rem' }}>
        {result === 'foss' && 'Ambil Lantunan.apk, varian FOSS.'}
        {result === 'cast' && 'Ambil Lantunan-with-Google-Cast.apk.'}
        {result === 'izzy' && 'Ambil Lantunan-izzy.apk.'}
        {result === null && 'Jawab dua pertanyaan di atas untuk melihat varian yang cocok.'}
      </p>
    </div>
  );
}
