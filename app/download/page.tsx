import type { Metadata } from 'next';
import Shot from '@/components/Shot';
import { getRelease } from '@/lib/release';
import { formatBytes } from '@/lib/format';
import { PERMISSIONS } from '@/lib/site';
import DownloadBlock from '@/components/DownloadBlock';
import showcaseData from '@/data/showcase.json';
import VariantPicker from '@/components/VariantPicker';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Unduh',
  description: 'Tiga varian APK Lantunan, langkah pemasangan, daftar izin, dan cara verifikasi unduhan.',
};

const STEPS = [
  { title: 'Unduh APK', body: 'Pilih varian di atas. Berkas diambil langsung dari halaman rilis GitHub.' },
  { title: 'Izinkan sumber', body: 'Saat diminta, buka Pengaturan lalu aktifkan izin pemasangan dari sumber ini.' },
  { title: 'Buka berkasnya', body: 'Ketuk berkas APK di unduhan atau notifikasi. Android menampilkan ringkasan izin.' },
  { title: 'Pasang', body: 'Ketuk Pasang. Setelah selesai, aplikasi muncul di launcher seperti biasa.' },
];

export default async function DownloadPage() {
  const release = await getRelease();

  return (
    <>
      <section className="wrap section">
        <h1>Unduh Lantunan</h1>
        <p className="muted">
          APK langsung dari GitHub. Tanpa Play Store, tanpa akun, tanpa perantara.
        </p>
      </section>

      <div className="wrap">
        <DownloadBlock release={release} heading={false} />
      </div>

      <section className="wrap section" aria-labelledby="banding">
        <h2 id="banding">Perbandingan varian</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>Perbandingan varian</caption>
            <thead>
              <tr>
                <th scope="col">Varian</th>
                <th scope="col">Ukuran</th>
                <th scope="col">Cast</th>
                <th scope="col">Layanan Google</th>
                <th scope="col">Update in-app</th>
              </tr>
            </thead>
            <tbody>
              {release.variants.map((v) => (
                <tr key={v.id}>
                  <th scope="row">{v.title}</th>
                  <td className="mono">{v.sizeBytes ? formatBytes(v.sizeBytes) : 'Tidak tersedia'}</td>
                  <td>{v.id === 'cast' ? 'Ya' : 'Tidak'}</td>
                  <td>{v.id === 'cast' ? 'Ya' : 'Tidak'}</td>
                  <td>Ya</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className={styles.picker}>
          <summary>Varian mana yang saya butuhkan?</summary>
          <VariantPicker />
        </details>
      </section>

      <section className="wrap section" id="panduan" aria-labelledby="panduan-h">
        <h2 id="panduan-h">Empat langkah memasang</h2>
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className={`mono ${styles.stepNo}`} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p className="muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="izin">
        <h2 id="izin">Izin yang diminta aplikasi</h2>
        <p className="muted">Daftar ini diambil dari manifes build Android. Tidak ada izin tambahan di situs.</p>
        <dl className={styles.perms}>
          {PERMISSIONS.map((p) => (
            <div key={p.p}>
              <dt className="mono">{p.p}</dt>
              <dd className="muted">{p.why}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap section" aria-labelledby="verifikasi">
        <h2 id="verifikasi">Verifikasi unduhan</h2>
        {release.sha256 ? (
          <>
            <p className="muted">Bandingkan hash berkas yang kamu unduh dengan yang ada di rilis.</p>
            <ul className={styles.shaList}>
              {Object.entries(release.sha256).map(([name, hash]) => (
                <li key={name}>
                  <p className="mono">{name}</p>
                  <p className="mono">{hash}</p>
                </li>
              ))}
            </ul>
            <p className="mono">sha256sum Lantunan.apk</p>
          </>
        ) : (
          <p className="muted">
            Rilis ini belum menyertakan SHA256SUMS.txt. Unduhan tetap diambil langsung dari
            github.com/Ryzellx/lantunan-releases.
          </p>
        )}
      </section>

      <section className="wrap section" aria-labelledby="update">
        <h2 id="update">Kalau sudah terpasang</h2>
        <p className="muted">
          Aplikasi memeriksa rilis baru sendiri dari GitHub, lalu menawarkan pembaruan di dalam
          aplikasi. Kamu tidak perlu membuka situs ini lagi. Unduhan tetap berasal dari repo rilis
          yang sama.
        </p>
      </section>

      {release.extras.length > 0 && (
        <section className="wrap section" aria-labelledby="berkas-lain">
          <h2 id="berkas-lain">Berkas lain di rilis ini</h2>
          <ul className={styles.extraList}>
            {release.extras.map((e) => (
              <li key={e.name}>
                {e.url ? <a href={e.url} rel="noopener">{e.name}</a> : e.name}
                {e.size ? <span className="mono muted"> · {formatBytes(e.size)}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="wrap section" aria-labelledby="shot">
        <h2 id="shot">Sekilas tampilan</h2>
        <div className={styles.shot}>
          <Shot
            file={showcaseData.screens.find((s) => s.id === 'home')?.asset ?? 'home'}
            alt="Layar Home Lantunan dengan rekomendasi playlist"
            width={360}
            height={800}
            sizes="(max-width: 720px) 80vw, 320px"
          />
        </div>
      </section>
    </>
  );
}
