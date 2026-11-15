import { describe, expect, it } from 'vitest';
import { normaliseRelease, VARIANTS } from '../lib/release';
import full from './fixtures/release-full.json';
import missingCast from './fixtures/release-missing-cast.json';

describe('normaliseRelease', () => {
  it('maps exact asset names to variants in stable order', () => {
    const r = normaliseRelease(full as any);
    expect(r.tag).toBe('v2.1.47');
    expect(r.variants.map((v) => v.id)).toEqual(['foss', 'cast', 'izzy']);
    expect(r.variants[0]).toMatchObject({
      available: true,
      assetName: 'Lantunan.apk',
      sizeBytes: 26845123,
    });
    expect(r.variants[0].url).toContain('/releases/download/v2.1.47/Lantunan.apk');
  });

  it('marks a missing asset unavailable instead of dropping the card', () => {
    const r = normaliseRelease(missingCast as any);
    expect(r.variants).toHaveLength(3);
    const cast = r.variants.find((v) => v.id === 'cast')!;
    expect(cast.available).toBe(false);
    expect(cast.sizeBytes).toBeNull();
    expect(cast.url).toBeNull();
    expect(r.variants.filter((v) => v.available)).toHaveLength(2);
  });

  it('routes unknown assets to extras', () => {
    const withExtra = JSON.parse(JSON.stringify(full));
    withExtra.assets.push({
      name: 'Lantunan-debug.apk',
      size: 1000,
      browser_download_url: 'https://example.com/y',
      download_count: 0,
    });
    const r = normaliseRelease(withExtra);
    expect(r.extras.map((e) => e.name)).toEqual(['Lantunan-debug.apk']);
  });

  it('tolerates null body and missing published_at', () => {
    const r = normaliseRelease({ ...full, body: null, published_at: null } as any);
    expect(r.notes).toBe('');
    expect(r.publishedAt).toBeNull();
  });

  it('exposes a releaseUrl that points at the tag', () => {
    expect(normaliseRelease(full as any).releaseUrl).toBe(
      'https://github.com/Ryzellx/lantunan-releases/releases/tag/v2.1.47',
    );
  });

  it('declares the three variants in PRD order with labels', () => {
    expect(VARIANTS.map((v) => [v.id, v.label])).toEqual([
      ['foss', 'Disarankan'],
      ['cast', 'Dengan Cast'],
      ['izzy', 'F-Droid'],
    ]);
  });
});
