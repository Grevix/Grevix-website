import { Event, EventType, EventStatus, EventMode, EventSourceType } from '@/types/event';
import { DbEventRow } from '@/types/database';

/**
 * Validates and safely parses an ISO date string, falling back to a sensible default.
 */
function safeIsoDate(dateStr: string | null | undefined, fallback: string = new Date().toISOString()): string {
  if (!dateStr) return fallback;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallback;
    return d.toISOString();
  } catch {
    return fallback;
  }
}

/**
 * Checks if the event data is stale (last verified more than 7 days ago).
 */
export function isEventDataStale(lastVerifiedAt: string | null | undefined): boolean {
  if (!lastVerifiedAt) return true;
  try {
    const verifiedTime = new Date(lastVerifiedAt).getTime();
    if (isNaN(verifiedTime)) return true;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - verifiedTime > sevenDaysInMs;
  } catch {
    return true;
  }
}

/**
 * Normalizes a raw database row or external API object into a strict, validated Event model.
 */
export function normalizeDbEvent(row: Partial<DbEventRow>): Event {
  const id = row.id || `evt-${Math.random().toString(36).substring(2, 9)}`;
  const title = (row.title || 'Untitled Technical Opportunity').trim();
  const slug = (row.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || id;

  // Safe type mapping
  const validTypes: EventType[] = ['hackathon', 'quiz', 'workshop', 'competition'];
  const rawType = (row.event_type || 'hackathon').toLowerCase() as EventType;
  const type: EventType = validTypes.includes(rawType) ? rawType : 'hackathon';

  // Safe mode mapping
  const validModes: EventMode[] = ['online', 'offline', 'hybrid'];
  const rawMode = (row.mode || 'online').toLowerCase() as EventMode;
  const mode: EventMode = validModes.includes(rawMode) ? rawMode : 'online';

  // Dates parsing
  const startDate = safeIsoDate(row.start_date);
  const endDate = safeIsoDate(row.end_date, startDate);
  const registrationDeadline = safeIsoDate(row.registration_deadline, startDate);

  // Status calculation with dynamic expiration fallback
  let status: EventStatus = (row.status as EventStatus) || 'upcoming';
  const now = Date.now();
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const deadlineMs = new Date(registrationDeadline).getTime();

  if (now > endMs) {
    status = 'completed';
  } else if (now >= startMs && now <= endMs) {
    status = 'ongoing';
  } else {
    status = 'upcoming';
  }

  const isClosingSoon = status === 'upcoming' && deadlineMs - now > 0 && deadlineMs - now <= 48 * 60 * 60 * 1000;

  // Safe skills & categories
  let tracks: string[] = [];
  if (Array.isArray(row.categories)) {
    tracks = row.categories.map(String);
  } else if (typeof row.categories === 'string' && row.categories) {
    tracks = row.categories.split(',').map((s) => s.trim());
  }

  let skills: string[] = [];
  if (Array.isArray(row.skills)) {
    skills = row.skills.map(String);
  } else if (typeof row.skills === 'string' && row.skills) {
    skills = row.skills.split(',').map((s) => s.trim());
  }

  if (tracks.length === 0) tracks = ['General Tech'];
  if (skills.length === 0) skills = ['Problem Solving'];

  // Safe prizes parsing
  let prizePool = {
    totalValue: 'Certificates & Swag',
    currency: 'USD',
    breakdown: undefined,
  };

  if (row.prizes) {
    if (typeof row.prizes === 'object') {
      prizePool = {
        totalValue: row.prizes.totalValue || row.prizes.value || 'Certificates & Swag',
        currency: row.prizes.currency || 'USD',
        breakdown: row.prizes.breakdown,
      };
    } else if (typeof row.prizes === 'string') {
      prizePool = {
        totalValue: row.prizes,
        currency: 'USD',
        breakdown: undefined,
      };
    }
  }

  // Safe registration URL
  let registrationUrl = row.registration_url?.trim() || '';
  if (!registrationUrl.startsWith('http://') && !registrationUrl.startsWith('https://')) {
    registrationUrl = registrationUrl ? `https://${registrationUrl}` : 'https://grevix.org/events';
  }

  // Source Type
  const validSources: EventSourceType[] = ['verified_admin', 'devpost', 'unstop', 'mlh', 'community'];
  const rawSource = (row.source_name || 'verified_admin').toLowerCase() as EventSourceType;
  const sourceType: EventSourceType = validSources.includes(rawSource) ? rawSource : 'verified_admin';

  return {
    id,
    slug,
    title,
    tagline: row.theme || `${title} ? Student opportunity curated on GREViX`,
    description: row.description || 'Complete details, rules, and problem statements are available on the official registration source.',
    type,
    status,
    mode,
    location: row.location || (mode === 'online' ? 'Online (Global)' : 'In-Person (TBA)'),
    organizer: {
      name: row.organizer || 'GREViX Community',
      verified: true,
      website: row.source_url || undefined,
    },
    registrationUrl,
    sourceUrl: row.source_url || undefined,
    sourceType,
    lastSyncedAt: safeIsoDate(row.last_verified_at || row.updated_at || row.created_at),
    startDate,
    endDate,
    registrationDeadline,
    isClosingSoon,
    prizePool,
    tracks,
    skills,
    eligibility: row.eligibility || 'Open to all enrolled students and developers worldwide',
    teamSize: {
      min: row.team_min || 1,
      max: row.team_max || 4,
      label: row.team_min === 1 && row.team_max === 1 ? 'Solo Participation' : `${row.team_min || 1} - ${row.team_max || 4} Members`,
    },
    entryFee: '100% Free',
    isMockData: false,
  };
}
