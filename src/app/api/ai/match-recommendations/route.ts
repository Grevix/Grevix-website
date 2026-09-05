import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/data/eventsRepository';
import { calculateOpportunityMatch } from '@/lib/ai/aiClient';
import { StudentProfile } from '@/types/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawProfile = body.profile;

    // Sanitize and validate student profile inputs
    const profile: StudentProfile = {
      skills: Array.isArray(rawProfile?.skills)
        ? rawProfile.skills
            .filter((s: any) => typeof s === 'string' && s.trim().length > 0 && s.length <= 50)
            .slice(0, 30)
        : [],
      interests: Array.isArray(rawProfile?.interests)
        ? rawProfile.interests
            .filter((i: any) => typeof i === 'string' && i.trim().length > 0 && i.length <= 50)
            .slice(0, 30)
        : [],
      preferredMode:
        typeof rawProfile?.preferredMode === 'string' &&
        ['online', 'offline', 'hybrid', 'any'].includes(rawProfile.preferredMode)
          ? rawProfile.preferredMode
          : 'any',
    };

    const { events } = await getEvents({ tab: 'upcoming' });
    const matches = events.map((event) => calculateOpportunityMatch(event, profile));

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ matches });
  } catch (err: any) {
    console.error('[API /api/ai/match-recommendations] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
