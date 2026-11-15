import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import releaseSnapshot from '@/data/releases.snapshot.json';
import changelogSnapshot from '@/data/changelog.snapshot.json';

export type VariantId = 'foss' | 'cast' | 'izzy';

export type VariantSpec = {
  id: VariantId;
  assetName: string;
  title: string;
  label: string | null;
  blurb: string;
};

export const VARIANTS: readonly VariantSpec[] = [
  { id: 'foss', assetName: 'Lantunan.apk', title: 'Lantunan', label: 'Disarankan', blurb: 'FOSS, tanpa layanan Google' },
  { id: 'cast', assetName: 'Lantunan-with-Google-Cast.apk', title: 'Lantunan dengan Cast', label: 'Dengan Cast', blurb: 'Butuh Chromecast atau speaker Cast' },
  { id: 'izzy', assetName: 'Lantunan-izzy.apk', title: 'Lantunan untuk F-Droid', label: 'F-Droid', blurb: 'Build untuk IzzyOnDroid' },
] as const;

export type Variant = {
  id: VariantId;
  title: string;
  label: string | null;
  blurb: string;
  available: boolean;
  assetName: string;
  sizeBytes: number | null;
  url: string | null;
  downloads: number | null;
};

export type ExtraAsset = { name: string; size: number | null; url: string | null };

export type ReleaseView = {
  tag: string;
  name: string;
  publishedAt: string | null;
  notes: string;
  releaseUrl: string;
  variants: Variant[];
  extras: ExtraAsset[];
  sha256: Record<string, string> | null;
  source: 'live' | 'snapshot' | 'none';
  fetchedAt: string;
};

const REPO = 'Ryzellx/lantunan-releases';
const API = `https://api.github.com/repos/${REPO}`;

type Raw = Record<string, any>;

export function normaliseRelease(raw: Raw, source: ReleaseView['source'] = 'live'): ReleaseView {
  const assets: Raw[] = Array.isArray(raw?.assets) ? raw.assets : [];
  const byName = new Map<string, Raw>();
  for (const a of assets) if (a?.name) byName.set(String(a.name).toLowerCase(), a);

  const used = new Set<string>();

  const variants: Variant[] = VARIANTS.map((spec) => {
    const a = byName.get(spec.assetName.toLowerCase());
    if (a) used.add(String(a.name).toLowerCase());
    return {
      id: spec.id,
      title: spec.title,
      label: spec.label,
      blurb: spec.blurb,
      available: Boolean(a),
      assetName: spec.assetName,
      sizeBytes: a ? Number(a.size) : null,
      url: a ? String(a.browser_download_url) : null,
      downloads: a && typeof a.download_count === 'number' ? a.download_count : null,
    };
  });

  const extras: ExtraAsset[] = assets
    .filter((a) => a?.name && !used.has(String(a.name).toLowerCase()))
    .map((a) => ({
      name: String(a.name),
      size: Number.isFinite(a.size) ? Number(a.size) : null,
      url: a.browser_download_url ?? null,
    }));

  const tag = String(raw?.tag_name ?? '');
  return {
    tag,
    name: String(raw?.name || tag),
    publishedAt: raw?.published_at ?? null,
    notes: typeof raw?.body === 'string' ? raw.body : '',
    releaseUrl: raw?.html_url || `https://github.com/${REPO}/releases`,
    variants,
    extras,
    sha256: null,
    source,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchJson(url: string): Promise<Raw> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'lantunan-site',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers, cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`github ${res.status}`);
  return res.json() as Promise<Raw>;
}

function readFixture(name: string): Raw {
  return JSON.parse(readFileSync(join(process.cwd(), 'tests', 'fixtures', name), 'utf8')) as Raw;
}

async function fetchShaMap(release: Raw): Promise<Record<string, string> | null> {
  const sums = (release?.assets ?? []).find((a: Raw) => /sha256sums?\.txt$/i.test(String(a?.name ?? '')));
  if (!sums?.browser_download_url) return null;
  try {
    const res = await fetch(String(sums.browser_download_url), {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const map: Record<string, string> = {};
    for (const line of text.split(/\r?\n/)) {
      const m = line.trim().match(/^([a-f0-9]{64})\s+\*?(.+)$/i);
      if (m) map[m[2].trim().toLowerCase()] = m[1].toLowerCase();
    }
    return Object.keys(map).length ? map : null;
  } catch {
    return null;
  }
}

async function loadLive(): Promise<ReleaseView> {
  const fixture = process.env.RELEASE_FIXTURE;
  if (fixture === 'fail') throw new Error('forced release failure');
  if (fixture === 'full' || fixture === 'missing-cast') {
    return normaliseRelease(readFixture(`release-${fixture}.json`), 'live');
  }
  const data = await fetchJson(`${API}/releases/latest`);
  const view = normaliseRelease(data, 'live');
  view.sha256 = await fetchShaMap(data);
  return view;
}

function loadSnapshot(): ReleaseView | null {
  try {
    const raw = releaseSnapshot as unknown as Raw;
    if (!raw || !raw.tag_name) return null;
    return normaliseRelease(raw, 'snapshot');
  } catch {
    return null;
  }
}

export async function getRelease(): Promise<ReleaseView> {
  try {
    const { unstable_cache } = await import('next/cache');
    const cached = unstable_cache(loadLive, ['release-latest'], { revalidate: 300, tags: ['release'] });
    return await cached();
  } catch {
    const snap = loadSnapshot();
    if (snap) return snap;
    return normaliseRelease({ tag_name: '' }, 'none');
  }
}

export type ChangelogEntry = {
  tag: string;
  name: string;
  publishedAt: string | null;
  notes: string;
  url: string;
};

export async function getReleases(limit = 10): Promise<ChangelogEntry[]> {
  try {
    const data = await fetchJson(`${API}/releases?per_page=${limit}`);
    const list: Raw[] = Array.isArray(data) ? data : [];
    return list
      .filter((r) => !r?.draft && !r?.prerelease)
      .slice(0, limit)
      .map((r) => ({
        tag: String(r.tag_name),
        name: String(r.name || r.tag_name),
        publishedAt: r.published_at ?? null,
        notes: String(r.body ?? ''),
        url: String(r.html_url),
      }));
  } catch {
    return readChangelogSnapshot(limit);
  }
}

function readChangelogSnapshot(limit: number): ChangelogEntry[] {
  try {
    const raw = changelogSnapshot as unknown as ChangelogEntry[];
    return Array.isArray(raw) ? raw.slice(0, limit) : [];
  } catch {
    return [];
  }
}
