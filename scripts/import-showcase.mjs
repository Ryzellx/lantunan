#!/usr/bin/env node
/**
 * Import real device screenshots (CI artifact) into the site.
 *
 *   node scripts/import-showcase.mjs <shots-dir> [version]
 *
 * Reads an optional data/showcase-map.json: { "<file>.png": { "file": "home", "title": "...", "caption": "...", "alt": "..." } }
 * Files without a mapping are skipped, so a stray screenshot never ships by accident.
 */
import sharp from 'sharp';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const dir = process.argv[2];
const version = process.argv[3] ?? null;
if (!dir) {
  console.error('usage: node scripts/import-showcase.mjs <shots-dir> [version]');
  process.exit(1);
}

let map = {};
try {
  map = JSON.parse(await readFile('data/showcase-map.json', 'utf8'));
} catch {
  console.error('missing data/showcase-map.json');
  process.exit(1);
}

const WIDTHS = [360, 720, 1080];
await mkdir('public/showcase', { recursive: true });

const entries = [];
const files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith('.png')).sort();
let order = 0;

for (const name of files) {
  const spec = map[name];
  if (!spec) {
    console.log('skip', name);
    continue;
  }
  const input = join(dir, name);
  const meta = await sharp(input).metadata();
  for (const width of WIDTHS) {
    const base = sharp(input)
      .flatten({ background: '#0c0b0e' })
      .resize({ width, withoutEnlargement: true });
    await base.clone().avif({ quality: 62, effort: 5 }).toFile(`public/showcase/${spec.file}-${width}.avif`);
    await base.clone().webp({ quality: 80 }).toFile(`public/showcase/${spec.file}-${width}.webp`);
    if (width === 360 || width === 720) {
      await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`public/showcase/${spec.file}-${width}.jpg`);
    }
  }
  entries.push({
    id: spec.file,
    file: spec.file,
    title: spec.title,
    caption: spec.caption,
    alt: spec.alt,
    w: meta.width ?? 1080,
    h: meta.height ?? 2400,
    order: order++,
    source: 'device',
  });
  console.log('imported', name, '->', spec.file);
}

if (!entries.length) {
  console.error('nothing imported');
  process.exit(1);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  version,
  source: 'device',
  screens: entries,
};
await writeFile('data/showcase.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('data/showcase.json', entries.length, 'screens, version', version ?? 'unset');
