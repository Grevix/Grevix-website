export type EventType = 'hackathon' | 'quiz' | 'workshop' | 'competition';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export type EventMode = 'online' | 'offline' | 'hybrid';

export type EventSourceType = 'verified_admin' | 'devpost' | 'unstop' | 'mlh' | 'community';

export interface EventOrganizer {
  name: string;
  verified?: boolean;
  website?: string;
  slug?: string;
  contactUrl?: string;
}

export interface PrizeBreakdown {
  rank: string;
  prize: string;
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
  completed?: boolean;
}

export interface Winner {
  rank: string;
  teamName: string;
  projectTitle: string;
  repoUrl?: string;
  demoUrl?: string;
  members: string[];
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  type: EventType;
  status: EventStatus;
  mode: EventMode;
  location: string;
  organizer: EventOrganizer;
  registrationUrl: string;
  sourceUrl?: string;
  sourceType: EventSourceType;
  lastSyncedAt: string;
  startDate: string;
  endDate: string;
  registrationOpen?: string;
  registrationDeadline: string;
  submissionDeadline?: string;
  isClosingSoon?: boolean;
  prizePool: {
    totalValue: string;
    currency: string;
    breakdown?: PrizeBreakdown[];
  };
  tracks: string[];
  skills: string[];
  eligibility: string;
  teamSize: {
    min: number;
    max: number;
    label: string;
  };
  entryFee: string;
  timelineMilestones?: Milestone[];
  rules?: string[];
  winners?: Winner[];
  isMockData?: boolean;
}

export interface EventFilterState {
  search: string;
  tab: EventStatus;
  type: EventType | 'all';
  mode: EventMode | 'all';
  track: string | 'all';
  sortBy: 'deadline_asc' | 'created_desc' | 'prize_desc' | 'start_asc';
}
