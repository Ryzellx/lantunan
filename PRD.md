# PRD Lantunan Web

**Produk:** situs unduh + showcase untuk aplikasi Android **Lantunan**
**Versi dokumen:** 1.0 · 15 November 2026
**Status:** siap eksekusi
**Pemilik:** Ryzellx
**Referensi kompetitor:** https://metrolist.cc

---

## 1. Ringkasan

Lantunan adalah YouTube Music client untuk Android, fork dari Sakayori Music
(GPL-3.0), dibangun dengan Kotlin + Jetpack Compose, tema Material 3 Lavender
`#CD5CFF`. Sumber ada di `Ryzellx/lantunankotlin` (private). Build resmi
dipublikasikan ke `Ryzellx/lantunan-releases` (public) sebagai tiga APK:

| Varian | Nama aset | Ukuran | Untuk |
|---|---|---|---|
| FOSS | `Lantunan.apk` | ~26,8 MB | semua device, tanpa layanan Google |
| Cast | `Lantunan-with-Google-Cast.apk` | ~28,3 MB | butuh Chromecast |
| Izzy | `Lantunan-izzy.apk` | ~26,8 MB | F-Droid / IzzyOnDroid |

Situs ini punya satu pekerjaan: **membuat orang percaya dan bisa memasang
aplikasinya dalam di bawah 60 detik**, plus memamerkan antarmuka aplikasi
sebagai bukti kualitas.

Bukan toko aplikasi, bukan player di browser. Nol pemutaran audio di web.

### 1.1 Masalah yang dipecahkan

1. Halaman unduh proyek open-source Android biasanya rusak: blok unduh
   berulang, "no matching build", versi tidak sinkron dengan release terbaru.
2. Showcase biasanya screenshot basi dari versi lama, atau mockup palsu.
3. Pengguna Android tidak tahu varian mana yang harus diambil.
4. Tidak ada verifikasi integritas file, padahal ini APK yang minta izin install.

### 1.2 Non-goals

- Tidak ada player musik di web.
- Tidak ada akun, login, atau sinkronisasi.
- Tidak ada mirror APK sendiri: unduhan selalu ke GitHub.
- Tidak ada iklan, tracker pihak ketiga, atau cookie non-esensial.

---

## 2. Target pengguna

| Persona | Konteks | Yang dia butuhkan |
|---|---|---|
| **Pengguna YT Music biasa** | Dengar musik tiap hari, kesal sama iklan | Tombol unduh jelas, varian default sudah benar |
| **Pengguna teknis** | Peduli FOSS, cek hash, baca changelog | Varian, ukuran, checksum, link ke repo |
| **Pengguna Cast** | Streaming ke TV/speaker | Varian Cast ditandai jelas, bukan disembunyikan |
| **Kurator F-Droid/Izzy** | Cek sumber dan lisensi | Link lisensi, versi, dan repo |

---

## 3. Analisis metrolist.cc dan celah yang diambil

Yang mereka lakukan dengan baik: hero singkat, tab platform, showcase interaktif,
daftar fitur yang spesifik.

Yang bisa dikalahkan:

| Kelemahan metrolist.cc | Respons Lantunan |
|---|---|
| Blok unduh muncul 4 kali, isinya "No matching build was found" | Satu blok unduh kanonik, nol duplikat, nol dead state |
| Error release dibiarkan terlihat sebagai teks kosong | Fallback ke snapshot versi terakhir + badge "cached" |
| Multi-platform (5 OS) membuat halaman berat dan bertele-tele | Satu platform (Android), tiga varian, keputusan dalam 5 detik |
| Showcase terasa seperti mockup, bukan aplikasi nyata | Screenshot dirender dari build asli di CI, ada versi + tanggal |
| Tidak ada checksum | SHA-256 ditampilkan kalau release menyediakannya |
| Tidak ada panduan "varian mana yang saya butuhkan" | Pemilih varian dengan 2 pertanyaan, hasil langsung |

---

## 4. Prinsip desain

**Design Read:** halaman unduh untuk aplikasi musik, audiens pengguna Android
Indonesia yang melek teknologi, bahasa visual "ruang dengar malam" dengan aksen
lavender, dial **ENERGY 3 / RHYTHM 3 / MOTION 2**.

### 4.1 Arah visual

Kanvas gelap hangat, bukan hitam pekat, karena ini produk audio dan situs dibuka
malam hari. Lavender `#CD5CFF` hanya untuk aksi utama dan satu elemen grafis,
bukan untuk seluruh halaman.

| Token | Nilai | Alasan |
|---|---|---|
| `--ink` | `#0C0B0E` | dasar, hitam kebiruan, bukan #000 |
| `--surface` | `#15131A` | kartu dan panel |
| `--surface-2` | `#1D1A24` | hover, input |
| `--line` | `#2C2833` | garis 1px, bukan shadow |
| `--text` | `#F3F0F7` | kontras 15:1 |
| `--muted` | `#A7A1B4` | kontras 6,4:1 |
| `--accent` | `#CD5CFF` | hanya CTA utama, progress, satu glow |
| `--accent-soft` | `#3A2145` | latar chip aktif |
| `--ok` | `#5FD08A` | status terverifikasi |
| `--warn` | `#E0A64B` | fallback / cached |

Larangan: gradient ungu-biru, glassmorphism di navbar, glow di semua elemen,
border-radius pil untuk semua komponen, ikon sparkle/lightning/robot.

### 4.2 Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Display | **Bricolage Grotesque** | karakter kuat, bukan Inter/Geist default |
| Body | **Public Sans** | diakritik Indonesia lengkap, netral, enak dibaca |
| Data | **JetBrains Mono** | versi, ukuran file, hash |

Skala: 12 / 14 / 16 / 18 / 24 / 32 / 44 / 64. Body 16px, line-height 1.55.
Judul pakai `text-wrap: balance`.

### 4.3 Layout

- Grid 12 kolom, gutter 24px, max-width 1160px.
- Ritme seksi tidak seragam: hero asimetris (teks kiri 7 kolom, ponsel kanan 5),
  fitur jadi daftar bertingkat, bukan grid kartu identik.
- Satu focal point per layar.
- Whitespace sebagai pemisah, bukan sisa.

### 4.4 Motion

| Kejadian | Durasi | Easing | Tujuan |
|---|---|---|---|
| Masuk hero | 420ms | `cubic-bezier(.2,.8,.2,1)` | menarik mata ke judul |
| Kartu unduh muncul | 240ms, stagger 60ms | sama | urutan baca |
| Hover tombol | 120ms | `ease-out` | umpan balik |
| Progress unduh | mengikuti byte asli | linear | kejujuran status |
| Buka lightbox | 260ms | spring ringan | kontinuitas fokus |
| Scroll reveal | 1x per elemen, 320ms | sama | hanya untuk 3 seksi |

Wajib: `prefers-reduced-motion: reduce` mematikan semua transform, sisakan
opacity. Tidak ada parallax, tidak ada animasi lebih dari 5 detik.

---

## 5. Arsitektur informasi

```
/                 Beranda: hero, unduh, showcase ringkas, fitur, FAQ
/download         Semua varian, langkah install, verifikasi, catatan izin
/showcase         Galeri screenshot dari build asli + lightbox
/changelog        Riwayat rilis dari GitHub releases
/faq              Pertanyaan nyata seputar varian, update, izin, lisensi
/privacy          Nol tracker, apa yang dicatat (atau tidak)
```

Navbar hanya berisi tautan yang benar-benar ada: Unduh, Showcase, Changelog,
FAQ. Nol link mati.

---

## 6. Halaman dan komponen

### 6.1 Beranda

Urutan:

1. **Hero.** Judul: "Musik tanpa gangguan." Satu kalimat penjelas, dua tombol:
   "Unduh untuk Android" (utama) dan "Lihat tampilannya" (sekunder). Di kanan,
   satu ponsel mockup dengan screenshot asli, sedikit miring, bayangan halus.
2. **Strip fakta.** Versi terbaru, tanggal rilis, ukuran, lisensi GPL-3.0.
   Empat item, bukan kartu.
3. **Blok unduh.** Tiga kartu varian, default FOSS ditandai "Disarankan".
   Tombol menampilkan ukuran file. Di bawahnya: "Tidak yakin? Ini panduannya".
4. **Showcase ringkas.** Tiga screenshot dengan label fitur yang diwakili.
5. **Fitur.** Enam item, disusun sebagai daftar dua kolom dengan ikon garis
   buatan sendiri, bukan grid kartu seragam.
6. **FAQ.** Enam pertanyaan nyata (lihat 6.5).
7. **Footer.** Lisensi, kredit upstream (Sakayori, InnerTune, OuterTune),
   tautan repo, tanggal build situs.

### 6.2 Blok unduh (komponen kritis)

Kartu varian berisi:

```
Lantunan                                    [Disarankan]
FOSS · tanpa layanan Google
v2.1.47 · 26,8 MB · 15 Nov 2026
[ Unduh APK ]
```

Aturan:

- Versi dan ukuran diambil dari release, bukan hardcode.
- Tombol membuka `https://github.com/Ryzellx/lantunan-releases/releases/download/<tag>/<asset>`.
- Kalau `SHA256SUMS.txt` ada di release, tampilkan baris "Verifikasi" yang bisa
  dibuka, berisi hash dan perintah `sha256sum`.
- Kalau aset tidak ditemukan: kartu menampilkan "Varian ini tidak ada di rilis
  terbaru" dan tombol menuju halaman releases. Tidak pernah hilang diam-diam.
- Kalau API gagal total: tampilkan snapshot terakhir dari `releases.json` yang
  di-commit ke repo situs, dengan badge **"Versi tersimpan, mungkin belum
  terbaru"**. Nol layar kosong.

### 6.3 Halaman unduh

- Tabel perbandingan tiga varian: ukuran, Cast, layanan Google, update in-app.
- Panduan 4 langkah dengan gambar kecil: unduh, izinkan sumber, buka, pasang.
- Catatan izin: apa yang diminta APK dan kenapa.
- Verifikasi: hash + perintah.
- Bagian "Kalau update": aplikasi update sendiri dari dalam, tanpa browser.

### 6.4 Showcase

- Grid masonry ringan, 6 sampai 8 screenshot, rasio asli ponsel.
- Klik membuka lightbox: tombol prev/next, tutup dengan Escape, fokus terkurung.
- Tiap gambar punya caption fitur ("Lirik tersinkron", "Equalizer").
- Label versi: "Dirender dari build v2.1.47, 15 Nov 2026".
- Placeholder blurhash sebelum gambar termuat, dengan dimensi eksplisit.

### 6.5 FAQ (harus pertanyaan nyata)

1. Varian mana yang harus saya ambil?
2. Apakah perlu akun YouTube Music?
3. Apakah bisa unduh lagu untuk offline?
4. Kenapa APK tidak ada di Play Store?
5. Apakah update otomatis?
6. Apakah data saya dikirim ke suatu tempat?

Nol pertanyaan template seperti "Is my data secure?".

---

## 7. Sinkronisasi rilis otomatis

### 7.1 Sumber kebenaran

`GET https://api.github.com/repos/Ryzellx/lantunan-releases/releases/latest`

Release `latest` otomatis mengecualikan prerelease dan draft. Kalau rilis
terbaru ditandai prerelease, situs tetap menampilkan rilis stabil terakhir.

### 7.2 Alur

```
cron / revalidate (5 menit)
  -> GET release latest (If-None-Match: ETag)
  -> 304: selesai, pakai cache
  -> 200: normalisasi -> tulis releases.json (snapshot) -> revalidate halaman
```

### 7.3 Normalisasi

```json
{
  "tag": "v2.1.47",
  "name": "v2.1.47",
  "publishedAt": "2026-11-15T07:00:00Z",
  "notes": "...",
  "assets": [
    { "name": "Lantunan.apk", "size": 26845123, "url": "https://github.com/...", "downloads": 1 }
  ],
  "sha256": { "Lantunan.apk": "abc..." }
}
```

Pemetaan varian memakai **nama aset persis**, bukan tebakan:

| Nama aset | Varian | Label |
|---|---|---|
| `Lantunan.apk` | foss | Disarankan |
| `Lantunan-with-Google-Cast.apk` | cast | Dengan Cast |
| `Lantunan-izzy.apk` | izzy | F-Droid |

Aset tak dikenal masuk ke bagian "Berkas lain" di `/download`, tidak dibuang.

### 7.4 Batas dan fallback

- API GitHub tanpa token: 60 request/jam per IP. Situs wajib memakai route
  server dengan token read-only + cache, bukan fetch langsung dari browser.
- Cache: 5 menit di edge, `stale-while-revalidate=86400`.
- Kalau rate limit atau 5xx: pakai snapshot `releases.json`, tampilkan badge.
- Kalau nama aset berubah di rilis mendatang: varian yang tidak ketemu jatuh ke
  state "tidak tersedia", bukan crash.

### 7.5 Changelog

`/changelog` membaca 10 rilis terakhir, menampilkan tag, tanggal, dan isi notes
yang sudah dibersihkan (markdown ke HTML, tanpa HTML mentah).

---

## 8. Showcase dari kode asli

Screenshot tidak boleh mockup. Pipeline:

1. Di `Ryzellx/lantunankotlin`, workflow `showcase.yml` jalan saat release dibuat
   (atau manual):
   - build varian FOSS debug,
   - jalankan screenshot test Compose (Roborazzi/Paparazzi) untuk 7 layar kunci:
     Home, Player, Lyrics, Library, Playlist, Equalizer, Listen Together,
   - hasil PNG 1080x2400 masuk `showcase/`,
   - tulis `showcase/manifest.json`:
     ```json
     {
       "version": "2.1.47",
       "generatedAt": "2026-11-15T07:10:00Z",
       "screens": [
         { "id": "player", "file": "player.png", "w": 1080, "h": 2400, "title": "Player", "blurhash": "L6Pj0^..." }
       ]
     }
     ```
2. Artefak dipublikasikan ke `lantunan-releases` sebagai aset `showcase.zip`,
   atau ke branch `showcase` di repo yang sama.
3. Situs mengambil `manifest.json` lewat jsDelivr (bukan raw.githubusercontent,
   yang punya cache basi) dan menyajikan gambar dari CDN yang sama.
4. Kalau manifest tidak ada: pakai gambar bundel terakhir di repo situs, dan
   jangan tampilkan label versi palsu.

Kalau screenshot test belum ada di repo, PRD ini menganggapnya pekerjaan
terpisah di repo aplikasi, bukan blocker situs: situs tetap jalan dengan gambar
bundel.

---

## 9. Konten dan copy

- Bahasa Indonesia, sapaan "kamu", kalimat pendek.
- Nol em dash. Nol "seamless", "revolutionary", "next-gen", "ultimate".
- Nol angka karangan. Jumlah unduhan hanya ditampilkan kalau diambil dari API.
- CTA spesifik: "Unduh APK", "Lihat tampilannya", bukan "Get Started".
- Nada: tenang, percaya diri, teknis secukupnya.

Contoh hero:

> **Musik tanpa gangguan.**
> Lantunan memutar YouTube Music tanpa iklan, dengan lirik tersinkron,
> equalizer, dan unduhan offline. APK langsung, tanpa Play Store.

---

## 10. Aksesibilitas

- Kontras teks minimal 4,5:1, teks besar 3:1. Semua pasangan token di 4.1 sudah
  memenuhi; verifikasi ulang saat implementasi.
- Semua kontrol bisa dijangkau Tab, punya `:focus-visible` 2px accent.
- Lightbox: fokus terkurung, Escape menutup, panah kiri/kanan berpindah.
- Setiap gambar punya `alt` deskriptif; ikon dekoratif `aria-hidden`.
- Target sentuh minimal 44x44px.
- `prefers-reduced-motion` dihormati.
- Satu `h1` per halaman, hierarki heading tanpa lompatan.

---

## 11. Performa

| Metrik | Target |
|---|---|
| LCP | < 1,8 s (4G) |
| INP | < 200 ms |
| CLS | < 0,05 |
| JS terkirim | < 120 KB gzip |
| Gambar showcase | AVIF/WebP, `srcset`, dimensi eksplisit |
| Font | 2 keluarga, `font-display: swap`, subset latin |

Aturan:

- Nol library animasi berat. GSAP/Framer hanya kalau total < 30 KB dan benar-benar
  dipakai.
- Screenshot di bawah fold `loading="lazy"`, hero `fetchpriority="high"`.
- Nol script pihak ketiga di `<head>`.

---

## 12. Keamanan dan kepercayaan

- Unduhan selalu ke `github.com/Ryzellx/lantunan-releases`, bukan mirror.
- Tampilkan SHA-256 kalau release menyediakannya, beserta perintah verifikasi.
- Tampilkan lisensi GPL-3.0 dan kredit upstream.
- Nol auto-download, nol eksekusi otomatis.
- Nol form yang mengumpulkan data.
- Analitik: hanya agregat tanpa cookie (Plausible/Umami self-host), atau nol
  sama sekali. Kalau nol, halaman privacy cukup satu paragraf.

---

## 13. Anti-slop checklist (wajib lulus sebelum rilis)

- [ ] Nol em dash di seluruh teks.
- [ ] Nol gradient ungu-biru, nol glow di lebih dari 2 elemen.
- [ ] Nol navbar glassmorphism.
- [ ] Nol grid kartu identik untuk fitur.
- [ ] Nol ikon sparkle, star, lightning, robot.
- [ ] Nol badge kapsul "AI", "Beta", "New" tanpa fungsi.
- [ ] Nol testimoni atau angka karangan.
- [ ] Nol link mati di navbar.
- [ ] Nol tombol tanpa aksi.
- [ ] Setiap seksi punya alasan isi, bukan mengisi template.
- [ ] Tema hanya satu (gelap) karena produk audio; kontras tetap AA.
- [ ] Nama produk ditukar dengan produk lain: halaman masih terasa milik
      Lantunan karena palet lavender dan screenshot asli.

---

## 14. Kriteria penerimaan

1. Blok unduh menampilkan tag rilis terbaru dalam 2 detik setelah halaman siap,
   dan angkanya sama dengan `https://api.github.com/repos/Ryzellx/lantunan-releases/releases/latest`.
2. Saat API disimulasikan gagal (500), halaman tetap menampilkan versi dari
   snapshot dengan badge "Versi tersimpan", dan tombol unduh tetap mengarah ke
   halaman releases.
3. Saat aset `Lantunan-with-Google-Cast.apk` dihapus dari rilis, kartu Cast
   menampilkan state "tidak tersedia", dua kartu lain normal.
4. Rilis baru (tag berbeda) muncul di situs tanpa deploy manual, maksimal 5
   menit setelah publish.
5. Showcase menampilkan minimal 6 gambar dengan caption dan label versi yang
   cocok dengan manifest.
6. Escape menutup lightbox dan fokus kembali ke thumbnail asal.
7. Lighthouse mobile: Performance >= 95, Accessibility >= 95, Best Practices
   >= 95, SEO >= 95.
8. Nol error console di beranda, /download, /showcase.
9. Pada 360px, nol horizontal scroll dan nol teks terpotong.
10. Semua teks lolos checklist anti-slop di bagian 13.

---

## 15. Roadmap

| Fase | Isi | Estimasi |
|---|---|---|
| **MVP** | Beranda, /download, blok unduh live, FAQ, footer | 4 hari |
| **v1.1** | /showcase + lightbox + manifest dari CI | 3 hari |
| **v1.2** | /changelog, checksum, halaman privacy | 2 hari |
| **v1.3** | OG image dinamis per versi, RSS rilis | 1 hari |

---

## 16. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Nama aset berubah di rilis baru | Kartu varian kosong | Pemetaan longgar + state "tidak tersedia" + alert di CI |
| API GitHub kena rate limit | Data basi | Cache 5 menit + snapshot + token server |
| Repo aplikasi private | CI screenshot tidak bisa dari situs | Manifest dipublikasikan ke repo releases |
| Screenshot test belum ada | Showcase pakai gambar bundel | Jangan klaim versi yang tidak dirender |
| APK makin besar | Kartu melar | Format ukuran 1 desimal, satuan MB |

---

## 17. Definisi selesai

Situs dianggap selesai kalau semua kriteria di bagian 14 lulus, diuji di
Chromium dan Firefox, pada 360px, 768px, dan 1440px, dengan API dalam kondisi
normal, gagal, dan aset hilang.
