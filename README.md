# Lantunan Web

Situs unduh dan showcase untuk aplikasi Android **Lantunan**. Satu halaman unduh kanonik, data rilis dari GitHub, dan screenshot asli dari build Android.

Spesifikasi lengkap ada di `PRD.md`.

## Stack

- Next.js 15.5.29 (App Router, Server Components, ISR 300 detik)
- TypeScript, CSS Modules, tanpa framework UI
- Screenshot: AVIF/WebP 360/720/1080 yang digenerate di build time dengan sharp
- Data rilis: `lib/release.ts` (server-only) dengan cache 300 detik dan fallback snapshot

## Menjalankan

```bash
npm install
cp .env.example .env.local
# isi GITHUB_TOKEN dengan PAT read-only (public_repo)
npm run dev
```

Buka http://localhost:3000.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | server pengembangan |
| `npm run build` | build produksi |
| `npm start` | jalankan hasil build di port 3000 |
| `npm test` | unit test (vitest) |
| `npm run snapshot` | tulis ulang `data/*.snapshot.json` dari GitHub |
| `npm run showcase:images` | generate ulang gambar dari `assets-showcase/*` |
| `npm run acceptance` | cek HTML terhadap kriteria PRD (butuh server jalan) |
| `node scripts/selftest.mjs` | start server, jalankan acceptance, matikan server |

## Sumber data

`GET https://api.github.com/repos/Ryzellx/lantunan-releases/releases/latest`

Pemetaan varian memakai nama aset persis:

| Aset | Varian |
|---|---|
| `Lantunan.apk` | foss (disarankan) |
| `Lantunan-with-Google-Cast.apk` | cast |
| `Lantunan-izzy.apk` | izzy |

Aset tak dikenal masuk ke bagian "Berkas lain" di `/download`. Aset yang hilang menampilkan state "tidak tersedia", bukan kartu kosong.

Kalau API gagal, situs memakai `data/releases.snapshot.json` dan menampilkan badge "Versi tersimpan, mungkin belum terbaru".

## Snapshot

Snapshot di-commit supaya situs tidak pernah kosong saat GitHub down atau kena rate limit. Refresh manual:

```bash
GITHUB_TOKEN=$(cat ~/.github_token) npm run snapshot
```

Atau lewat workflow `.github/workflows/snapshot.yml` (tiap 6 jam).

## Deploy

1. Import repo ini di Vercel sebagai project Next.js.
2. Set environment variable `GITHUB_TOKEN` untuk Production (read-only PAT, jangan `NEXT_PUBLIC_`).
3. Tambahkan domain `lantunan.ryzellx.my.id` lalu CNAME `lantunan` ke `cname.vercel-dns.com`.

Jangan set `RELEASE_FIXTURE` di production. Variabel itu hanya untuk pengujian lokal.

## Struktur

```text
app/            rute: /, /download, /showcase, /changelog, /faq, /privacy, /api/release
components/     header, footer, kartu varian, grid showcase, lightbox
lib/            data rilis, format angka/tanggal, markdown renderer, copy
data/           snapshot rilis + manifest showcase
public/showcase gambar hasil generate
scripts/        snapshot, image build, acceptance, selftest
tests/          unit test + fixture
```

## Catatan

- Release notes diambil apa adanya dari GitHub, termasuk em dash di dalamnya. Copy situs sendiri tidak memakai em dash.
- Rilis `v2.1.47` belum menyertakan `SHA256SUMS.txt`, jadi blok verifikasi menampilkan penjelasan, bukan hash karangan.
- Screenshot berasal dari `fastlane/metadata/android/en-US/images/screenshots` di repo aplikasi (private). Tidak ada label versi karena manifest CI belum ada.
