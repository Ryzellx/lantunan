import type { MetadataRoute } from 'next';
import { getRelease } from '@/lib/release';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://lantunan.ryzellx.my.id';
  const release = await getRelease();
  const releaseDate = release.publishedAt ? new Date(release.publishedAt) : new Date();

  return [
    { url: `${base}/`, lastModified: releaseDate, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/download`, lastModified: releaseDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/showcase`, lastModified: releaseDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/changelog`, lastModified: releaseDate, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];
}
