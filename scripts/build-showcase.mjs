#!/usr/bin/env node
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const MAP = [
  ['s1.png', 'home'],
  ['s5.png', 'now-playing'],
  ['s6.png', 'lyrics'],
  ['s2.png', 'artist'],
  ['s4.png', 'together'],
  ['s3.png', 'recognize'],
];

const WIDTHS = [360, 720, 1080];

const TEXT = {
  home: ['Home', 'Rekomendasi playlist dan quick picks', 'Layar Home Lantunan dengan kartu playlist dan lagu cepat'],
  'now-playing': ['Player', 'Pemutar utama', 'Layar Now Playing dengan cover album besar dan kontrol pemutaran'],
  lyrics: ['Lirik', 'Lirik tersinkron', 'Layar lirik dengan lirik tersinkron yang menyorot baris aktif'],
  artist: ['Halaman artis', 'Profil artis dan lagu teratas', 'Halaman artis dengan foto, jumlah pendengar, dan lagu teratas'],
  together: ['Dengar bersama', 'Ruang dengar bersama', 'Layar Listen Together dengan kolom nama pengguna dan kode ruang'],
  recognize: ['Kenali musik', 'Kenali lagu yang sedang diputar', 'Dialog kenali musik yang mendengarkan audio sekitar'],
};

await mkdir('public/showcase', { recursive: true });

for (const [src, name] of MAP) {
  for (const width of WIDTHS) {
    const base = sharp(`assets-showcase/${src}`).resize({ width, withoutEnlargement: true });
    await base.clone().avif({ quality: 62, effort: 5 }).toFile(`public/showcase/${name}-${width}.avif`);
    await base.clone().webp({ quality: 78 }).toFile(`public/showcase/${name}-${width}.webp`);
    if (width === 360 || width === 720) {
      await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(`public/showcase/${name}-${width}.jpg`);
    }
  }
  console.log(name, 'done');
}

const json = {
  generatedAt: null,
  version: null,
  screens: MAP.map(([, file], i) => {
    const [title, caption, alt] = TEXT[file];
    return { id: file, file, title, caption, alt, w: 1080, h: 2400, order: i };
  }),
};
await writeFile('data/showcase.json', JSON.stringify(json, null, 2) + '\n');
console.log('data/showcase.json written', json.screens.length);
