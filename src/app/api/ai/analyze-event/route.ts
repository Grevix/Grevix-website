import { NextRequest, NextResponse } from 'next/server';
import { getEventBySlug } from '@/lib/data/eventsRepository';
import { analyzeEventIntelligence } from '@/lib/ai/aiClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Missing event slug' }, { status: 400 });
    }

    const event = await getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const analysis = await analyzeEventIntelligence(event);
    return NextResponse.json({ analysis });
  } catch (err: any) {
    console.error('[API /api/ai/analyze-event] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
