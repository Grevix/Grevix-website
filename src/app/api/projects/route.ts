import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/data/projectsRepository';

export const revalidate = 3600;

export async function GET() {
  try {
    const result = await getProjects();
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
