#!/usr/bin/env node
import { writeFile, mkdir } from 'node:fs/promises';

const REPO = 'Ryzellx/lantunan-releases';
const token = process.env.GITHUB_TOKEN;
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'lantunan-web-snapshot' };
if (token) headers.Authorization = `Bearer ${token}`;

async function get(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

const base = 'https://api.github.com/repos/' + REPO;
const latest = await get(`${base}/releases/latest`);
const list = await get(`${base}/releases?per_page=10`);

const slim = {
  tag_name: latest.tag_name,
  name: latest.name,
  published_at: latest.published_at,
  body: latest.body,
  html_url: latest.html_url,
  prerelease: latest.prerelease,
  draft: latest.draft,
  assets: latest.assets.map((a) => ({
    name: a.name,
    size: a.size,
    browser_download_url: a.browser_download_url,
    download_count: a.download_count,
  })),
};

const changelog = list
  .filter((r) => !r.draft && !r.prerelease)
  .map((r) => ({
    tag: r.tag_name,
    name: r.name || r.tag_name,
    publishedAt: r.published_at,
    notes: r.body ?? '',
    url: r.html_url,
  }));

await mkdir('data', { recursive: true });
await writeFile('data/releases.snapshot.json', JSON.stringify(slim, null, 2) + '\n');
await writeFile('data/changelog.snapshot.json', JSON.stringify(changelog, null, 2) + '\n');
console.log('snapshot', slim.tag_name, 'assets', slim.assets.length, 'changelog', changelog.length);
