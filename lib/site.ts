export const FEATURES = [
  { title: 'Tanpa iklan', body: 'Tidak ada iklan audio maupun banner di seluruh aplikasi.' },
  { title: 'Lirik tersinkron', body: 'Lirik bergulir mengikuti posisi lagu, dengan mode terjemahan.' },
  { title: 'Unduhan offline', body: 'Simpan lagu, album, dan playlist untuk didengar tanpa jaringan.' },
  { title: 'Equalizer', body: 'Atur nada, bass, dan preset perangkat dari dalam aplikasi.' },
  { title: 'Kontrol cepat', body: 'Widget, notifikasi media, dan tombol headset bekerja seperti pemutar bawaan.' },
  { title: 'Dengar bersama', body: 'Buat ruang dan putar satu antrean yang sama dengan teman.' },
] as const;

export const FAQ = [
  {
    q: 'Varian mana yang harus saya ambil?',
    a: 'Ambil Lantunan.apk. Varian Cast hanya kalau kamu memutar ke Chromecast atau speaker Cast. Varian izzy hanya untuk kurator F-Droid dan IzzyOnDroid.',
  },
  {
    q: 'Apakah perlu akun YouTube Music?',
    a: 'Bisa tanpa akun. Tanpa login, aplikasi memakai sesi anonim dan tetap bisa memutar serta mengunduh. Login hanya untuk playlist dan riwayat akunmu.',
  },
  {
    q: 'Apakah bisa unduh lagu untuk offline?',
    a: 'Bisa. Pilih lagu, album, atau playlist, lalu unduh. Isi unduhan tetap di penyimpanan lokal aplikasi.',
  },
  {
    q: 'Kenapa APK tidak ada di Play Store?',
    a: 'Aplikasi ini memakai YouTube Music di luar API resmi, jadi tidak bisa didistribusikan lewat Play Store.',
  },
  {
    q: 'Apakah update otomatis?',
    a: 'Ya. Aplikasi memeriksa rilis baru dari GitHub dan memasang pembaruannya sendiri lewat izin install paket.',
  },
  {
    q: 'Apakah data saya dikirim ke suatu tempat?',
    a: 'Tidak ke server kami. Tidak ada akun, tidak ada analitik di aplikasi, dan situs ini tidak memakai cookie.',
  },
] as const;

export const PERMISSIONS = [
  { p: 'android.permission.INTERNET', why: 'Mengambil katalog dan streaming dari YouTube Music.' },
  { p: 'android.permission.POST_NOTIFICATIONS', why: 'Kontrol pemutaran di notifikasi.' },
  { p: 'android.permission.ACCESS_NETWORK_STATE', why: 'Memilih kualitas saat jaringan berubah.' },
  { p: 'android.permission.RECEIVE_BOOT_COMPLETED', why: 'Memulihkan antrean setelah perangkat menyala ulang.' },
  { p: 'android.permission.WAKE_LOCK', why: 'Menjaga pemutaran tetap jalan saat layar mati.' },
  { p: 'android.permission.SCHEDULE_EXACT_ALARM', why: 'Pengingat tidur dan penjadwal pemutaran.' },
  { p: 'android.permission.FOREGROUND_SERVICE', why: 'Menjalankan pemutaran sebagai layanan latar depan.' },
  { p: 'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK', why: 'Tipe layanan pemutaran media.' },
  { p: 'android.permission.FOREGROUND_SERVICE_DATA_SYNC', why: 'Menyelesaikan unduhan di latar belakang.' },
  { p: 'android.permission.FOREGROUND_SERVICE_MICROPHONE', why: 'Layanan mikrofon saat fitur kenali musik dipakai.' },
  { p: 'android.permission.RECORD_AUDIO', why: 'Hanya untuk fitur kenali musik, aktif saat kamu menekannya.' },
] as const;
