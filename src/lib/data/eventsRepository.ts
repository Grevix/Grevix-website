import { Event, EventStatus } from '@/types/event';
import { DbEventRow } from '@/types/database';
import { normalizeDbEvent } from '../normalizers/eventNormalizer';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { MOCK_EVENTS } from '@/data/mockEvents';

export interface GetEventsParams {
  tab?: EventStatus;
  type?: string;
  mode?: string;
  track?: string;
  location?: string;
  search?: string;
  sort?: string;
}

export interface EventsResult {
  events: Event[];
  counts: {
    upcoming: number;
    ongoing: number;
    completed: number;
  };
  isFromDatabase: boolean;
  error?: string;
}

/**
 * Data Access Layer for GREViX Events.
 * Queries Supabase PostgreSQL if available, otherwise falls back gracefully to the validated community seed store.
 */
export async function getEvents(params: GetEventsParams = {}): Promise<EventsResult> {
  const {
    tab = 'upcoming',
    type = 'all',
    mode = 'all',
    track = 'all',
    location = 'all',
    search = '',
    sort = 'deadline_asc',
  } = params;

  let allEvents: Event[] = [];
  let isFromDatabase = false;
  let queryError: string | undefined;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.warn('[EventsRepository] Supabase query error:', error.message);
        queryError = error.message;
      } else if (data && data.length > 0) {
        allEvents = data.map((row: DbEventRow) => normalizeDbEvent(row));
        isFromDatabase = true;
      }
    } catch (err: any) {
      console.warn('[EventsRepository] Supabase connection failed:', err?.message || err);
      queryError = 'Database unavailable. Using local fallback cache.';
    }
  }

  // Fallback to MOCK_EVENTS if Supabase is not configured or table is empty
  if (allEvents.length === 0) {
    allEvents = MOCK_EVENTS;
  }

  // Calculate tab counts
  const counts = {
    upcoming: allEvents.filter((e) => e.status === 'upcoming').length,
    ongoing: allEvents.filter((e) => e.status === 'ongoing').length,
    completed: allEvents.filter((e) => e.status === 'completed').length,
  };

  // Filter by tab
  let filtered = allEvents.filter((e) => e.status === tab);

  // Filter by type
  if (type !== 'all') {
    filtered = filtered.filter((e) => e.type === type);
  }

  // Filter by mode
  if (mode !== 'all') {
    filtered = filtered.filter((e) => e.mode === mode);
  }

  // Filter by track
  if (track !== 'all') {
    filtered = filtered.filter((e) =>
      e.tracks.some((t) => t.toLowerCase().includes(track.toLowerCase()))
    );
  }

  // Filter by location
  if (location !== 'all') {
    const loc = location.toLowerCase();
    filtered = filtered.filter((e) =>
      e.location.toLowerCase().includes(loc) ||
      (loc === 'global' && e.mode === 'online')
    );
  }

  // Filter by search
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.tagline.toLowerCase().includes(q) ||
        e.organizer.name.toLowerCase().includes(q) ||
        e.tracks.some((t) => t.toLowerCase().includes(q)) ||
        e.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  // Sort
  filtered.sort((a, b) => {
    if (sort === 'deadline_asc') {
      return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
    }
    if (sort === 'start_asc') {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    if (sort === 'prize_desc') {
      return b.prizePool.totalValue.localeCompare(a.prizePool.totalValue);
    }
    return 0;
  });

  return {
    events: filtered,
    counts,
    isFromDatabase,
    error: queryError,
  };
}

/**
 * Retrieve a single event by slug with fallback.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return normalizeDbEvent(data as DbEventRow);
      }
    } catch (err) {
      console.warn('[EventsRepository] Failed to fetch slug from DB:', err);
    }
  }

  // Fallback to local store
  const found = MOCK_EVENTS.find((e) => e.slug === slug);
  return found || null;
}
