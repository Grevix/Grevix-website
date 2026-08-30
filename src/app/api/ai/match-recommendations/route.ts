import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/data/eventsRepository';
import { calculateOpportunityMatch } from '@/lib/ai/aiClient';
import { StudentProfile } from '@/types/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: StudentProfile = body.profile || { skills: [], interests: [] };

    const { events } = await getEvents({ tab: 'upcoming' });
    const matches = events.map((event) => calculateOpportunityMatch(event, profile));

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ matches });
  } catch (err: any) {
    console.error('[API /api/ai/match-recommendations] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
