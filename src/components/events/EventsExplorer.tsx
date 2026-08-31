'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Event } from '@/types/event';
import { FeaturedEventCard } from './FeaturedEventCard';
import { EventList } from './EventList';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface EventsExplorerProps {
  initialEvents?: Event[];
}

export function EventsExplorer({ initialEvents }: EventsExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { events: contextEvents, isAdmin, openEditorForEvent, resetAllEvents } = useAdminAuth();

  const allEvents = contextEvents && contextEvents.length > 0 ? contextEvents : (initialEvents || []);

  // Primary subpage tabs: 'hackathon' (default & biggest), 'quiz', 'workshop', or 'all'
  const activeType = searchParams.get('type') || 'hackathon';
  const activeStatus = searchParams.get('status') || 'all';
  const activeSort = searchParams.get('sort') || 'recent';
  const activeSearch = searchParams.get('search') || '';

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const updateQueryState = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.replace(`/events?${params.toString()}`, { scroll: false });
    });
  };

  const handleResetFilters = () => {
    startTransition(() => {
      router.replace('/events?type=hackathon', { scroll: false });
    });
  };

  // Flagship event (Genesis Hack 2026)
  const flagshipEvent = useMemo(() => {
    return allEvents.find((e) => e.slug === 'grevix-genesis-hack-2026') || allEvents[0];
  }, [allEvents]);

  // Filter events based on active category tab & search
  const filteredEvents = useMemo(() => {
    let list = [...allEvents];

    if (activeType !== 'all') {
      list = list.filter((e) => e.type === activeType);
    }

    if (activeStatus !== 'all') {
      list = list.filter((e) => e.status === activeStatus);
    }

    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tracks.some((t) => t.toLowerCase().includes(q)) ||
          e.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (activeSort === 'deadline') {
        return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
      }
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    return list;
  }, [allEvents, activeType, activeStatus, activeSearch, activeSort]);

  const counts = useMemo(() => {
    return {
      hackathon: allEvents.filter((e) => e.type === 'hackathon').length,
      quiz: allEvents.filter((e) => e.type === 'quiz').length,
      workshop: allEvents.filter((e) => e.type === 'workshop').length,
      all: allEvents.length,
    };
  }, [allEvents]);

  return (
    <div className="space-y-10">
      {/* 1. TOP FLAGSHIP HACKATHON FEATURED CARD (Biggest visual anchor on page) */}
      {flagshipEvent && (
        <FeaturedEventCard event={flagshipEvent} />
      )}

      {/* 2. THE 3 SUB-PAGES / CATEGORY SWITCHER */}
      <div>
        {/* Main 3 Category Tabs matching user directive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#141C2E] mb-6 font-mono text-xs">
          {/* Main 3 Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => updateQueryState('type', 'hackathon')}
              className={`px-4 py-2 rounded-[3px] transition-all font-display text-sm tracking-wider font-bold ${
                activeType === 'hackathon'
                  ? 'bg-[#1E293B] text-[#60A5FA] border border-[#3B82F6]/50 shadow-sm'
                  : 'text-[#8092A8] hover:text-[#F1F5F9] hover:bg-[#0D1322]'
              }`}
            >
              HACKATHONS ({counts.hackathon})
            </button>

            <button
              type="button"
              onClick={() => updateQueryState('type', 'quiz')}
              className={`px-4 py-2 rounded-[3px] transition-all font-display text-sm tracking-wider font-bold ${
                activeType === 'quiz'
                  ? 'bg-[#1E293B] text-[#60A5FA] border border-[#3B82F6]/50 shadow-sm'
                  : 'text-[#8092A8] hover:text-[#F1F5F9] hover:bg-[#0D1322]'
              }`}
            >
              QUIZZES ({counts.quiz})
            </button>

            <button
              type="button"
              onClick={() => updateQueryState('type', 'workshop')}
              className={`px-4 py-2 rounded-[3px] transition-all font-display text-sm tracking-wider font-bold ${
                activeType === 'workshop'
                  ? 'bg-[#1E293B] text-[#60A5FA] border border-[#3B82F6]/50 shadow-sm'
                  : 'text-[#8092A8] hover:text-[#F1F5F9] hover:bg-[#0D1322]'
              }`}
            >
              WORKSHOPS ({counts.workshop})
            </button>
          </div>

          {/* Right Sort & Admin Quick Actions */}
          <div className="flex items-center gap-4 text-xs font-mono">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditorForEvent()}
                  className="px-2.5 py-1 bg-[#1E293B] hover:bg-[#334155] text-[#60A5FA] border border-[#3B82F6]/50 rounded-[2px] font-bold text-[11px]"
                >
                  + Add Event
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all events to default data?')) resetAllEvents();
                  }}
                  className="text-[10px] text-[#64748B] hover:text-[#EF4444]"
                  title="Reset stored data to initial mock events"
                >
                  [Reset Data]
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[#50627A] uppercase text-[10px]">SORT BY:</span>
              <select
                value={activeSort}
                onChange={(e) => updateQueryState('sort', e.target.value)}
                className="bg-transparent text-[#F1F5F9] font-medium border-b border-[#1E293B] focus:outline-none focus:border-[#60A5FA] cursor-pointer text-xs"
              >
                <option value="recent" className="bg-[#060810]">RECENT ∨</option>
                <option value="deadline" className="bg-[#060810]">DATE / DEADLINE ∨</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sub-status filters (Upcoming vs Completed vs Live) & Search input */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => updateQueryState('status', 'all')}
              className={`px-2.5 py-1 text-[11px] rounded-[2px] ${
                activeStatus === 'all' ? 'bg-[#1E293B] text-[#F1F5F9] font-semibold' : 'text-[#64748B] hover:text-[#F1F5F9]'
              }`}
            >
              ALL STATUS
            </button>
            <button
              type="button"
              onClick={() => updateQueryState('status', 'upcoming')}
              className={`px-2.5 py-1 text-[11px] rounded-[2px] ${
                activeStatus === 'upcoming' ? 'bg-[#1E293B] text-[#60A5FA] font-semibold' : 'text-[#64748B] hover:text-[#F1F5F9]'
              }`}
            >
              UPCOMING & OPEN
            </button>
            <button
              type="button"
              onClick={() => updateQueryState('status', 'ongoing')}
              className={`px-2.5 py-1 text-[11px] rounded-[2px] ${
                activeStatus === 'ongoing' ? 'bg-[#1E293B] text-[#10B981] font-semibold' : 'text-[#64748B] hover:text-[#F1F5F9]'
              }`}
            >
              LIVE NOW
            </button>
            <button
              type="button"
              onClick={() => updateQueryState('status', 'completed')}
              className={`px-2.5 py-1 text-[11px] rounded-[2px] ${
                activeStatus === 'completed' ? 'bg-[#1E293B] text-[#F1F5F9] font-semibold' : 'text-[#64748B] hover:text-[#F1F5F9]'
              }`}
            >
              COMPLETED & RESULTS
            </button>
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={activeSearch}
              onChange={(e) => updateQueryState('search', e.target.value)}
              placeholder={`Search ${activeType}s by name or tech...`}
              className="w-full bg-[#080C16] border border-[#141C2E] text-[#F1F5F9] text-xs px-3 py-1.5 rounded-[2px] placeholder:text-[#50627A] focus:outline-none focus:border-[#3B82F6]"
            />
            {activeSearch && (
              <button
                type="button"
                onClick={() => updateQueryState('search', '')}
                className="absolute right-2 top-1.5 text-xs text-[#64748B] hover:text-[#F1F5F9]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Numbered Event Rows Stream */}
        <div className={isPending ? 'opacity-50 transition-opacity' : ''}>
          <EventList
            events={filteredEvents}
            hasFilters={activeStatus !== 'all' || Boolean(activeSearch)}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}
