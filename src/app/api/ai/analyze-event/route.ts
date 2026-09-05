import { NextRequest, NextResponse } from 'next/server';
import { getEventBySlug } from '@/lib/data/eventsRepository';
import { analyzeEventIntelligence } from '@/lib/ai/aiClient';

const SLUG_REGEX = /^[a-z0-9-]+$/;
const MAX_SLUG_LENGTH = 100;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { slug } = body;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Event slug is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedSlug = slug.trim();
    if (trimmedSlug.length > MAX_SLUG_LENGTH || !SLUG_REGEX.test(trimmedSlug)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    const event = await getEventBySlug(trimmedSlug);
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
