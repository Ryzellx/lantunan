import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="wrap section">
      <h1>Halaman tidak ada</h1>
      <p className="muted">Alamat ini tidak dikenal. Dua tautan ini biasanya cukup.</p>
      <p>
        <Link className="btn btn--primary" href="/">Kembali ke beranda</Link>{' '}
        <Link className="btn btn--ghost" href="/download">Unduh APK</Link>
      </p>
    </section>
  );
}
