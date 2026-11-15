import { NextResponse } from 'next/server';
import { getRelease } from '@/lib/release';

export const dynamic = 'force-static';
export const revalidate = 300;

export async function GET() {
  const release = await getRelease();
  return NextResponse.json(release, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  });
}
