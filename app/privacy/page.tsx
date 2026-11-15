import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privasi',
  description: 'Situs ini tanpa cookie, tanpa analitik, dan tanpa formulir.',
};

export default function PrivacyPage() {
  return (
    <section className="wrap section">
      <h1>Privasi</h1>
      <p className="muted">
        Situs ini tidak memasang cookie, tidak memuat skrip analitik, dan tidak punya formulir.
        Tidak ada data yang dikumpulkan di sini.
      </p>
      <p className="muted">
        Unduhan diambil langsung dari github.com. Saat kamu menekan tombol unduh, permintaan
        berkas pergi ke GitHub, bukan ke server situs ini.
      </p>
      <p className="muted">
        Penyedia hosting mencatat permintaan HTTP standar, termasuk alamat IP, untuk keperluan
        operasional dan penyalahgunaan. Catatan itu tidak dipakai untuk profil pengguna.
      </p>
      <p className="muted">Aplikasi Android tidak mengirim data ke server kami.</p>
    </section>
  );
}
