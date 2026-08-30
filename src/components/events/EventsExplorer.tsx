'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Event } from '@/types/event';
import { FeaturedEventCard } from './FeaturedEventCard';
import { EventList } from './EventList';
import { MobileFilterDrawer } from './MobileFilterDrawer';

interface EventsExplorerProps {
  initialEvents: Event[];
}

export function EventsExplorer({ initialEvents }: EventsExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeType = searchParams.get('type') || 'all';
  const activeMode = searchParams.get('mode') || 'all';
  const activeTrack = searchParams.get('track') || 'all';
  const activeLocation = searchParams.get('location') || 'all';
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
      router.replace('/events', { scroll: false });
    });
  };

  // Find featured/most recent event
  const featuredEvent = useMemo(() => {
    return initialEvents.find((e) => e.status === 'ongoing') || initialEvents[0];
  }, [initialEvents]);

  // Filter remaining events
  const filteredEvents = useMemo(() => {
    let list = [...initialEvents];

    if (activeType !== 'all') {
      list = list.filter((e) => e.type === activeType);
    }

    if (activeMode !== 'all') {
      list = list.filter((e) => e.mode === activeMode);
    }

    if (activeTrack !== 'all') {
      list = list.filter((e) =>
        e.tracks.some((t) => t.toLowerCase().includes(activeTrack.toLowerCase()))
      );
    }

    if (activeLocation !== 'all') {
      const loc = activeLocation.toLowerCase();
      list = list.filter((e) =>
        e.location.toLowerCase().includes(loc) ||
        (loc === 'global' && e.mode === 'online')
      );
    }

    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.organizer.name.toLowerCase().includes(q) ||
          e.tracks.some((t) => t.toLowerCase().includes(q)) ||
          e.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      if (activeSort === 'deadline') {
        return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
      }
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    return list;
  }, [initialEvents, activeType, activeMode, activeTrack, activeLocation, activeSearch, activeSort]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeMode !== 'all') count++;
    if (activeTrack !== 'all') count++;
    if (activeLocation !== 'all') count++;
    return count;
  }, [activeMode, activeTrack, activeLocation]);

  const typeTabs = [
    { value: 'all', label: 'ALL' },
    { value: 'hackathon', label: 'HACKATHONS' },
    { value: 'quiz', label: 'QUIZZES' },
    { value: 'workshop', label: 'WORKSHOPS' },
    { value: 'competition', label: 'COMPETITIONS' },
  ];

  return (
    <div className="space-y-10">
      {/* 1. MOST RECENT FEATURED OPPORTUNITY CARD */}
      {featuredEvent && (
        <FeaturedEventCard event={featuredEvent} />
      )}

      {/* 2. ALL OPPORTUNITIES SECTION HEADER & FILTER TOOLBAR */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#141C2E] mb-6 font-mono text-xs">
          {/* Section Title matching screenshot */}
          <div className="text-[#8092A8] uppercase tracking-wider font-semibold">
            // ALL OPPORTUNITIES
          </div>

          {/* Right Sort Selector matching screenshot */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#50627A] uppercase text-[10px]">SORT BY:</span>
              <select
                value={activeSort}
                onChange={(e) => updateQueryState('sort', e.target.value)}
                className="bg-transparent text-[#F1F5F9] font-medium border-b border-[#1E293B] focus:outline-none focus:border-[#60A5FA] cursor-pointer text-xs"
              >
                <option value="recent" className="bg-[#060810]">RECENT ?</option>
                <option value="deadline" className="bg-[#060810]">CLOSING SOON ?</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="text-[#64748B] hover:text-[#F1F5F9] flex items-center gap-1 pl-2 border-l border-[#1E293B]"
            >
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#3B82F6] text-[#FFFFFF] text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Pills & Search Line */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 font-mono text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {typeTabs.map((tab) => {
              const isSelected = activeType === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => updateQueryState('type', tab.value)}
                  className={`px-3 py-1.5 rounded-[2px] transition-colors whitespace-nowrap text-[11px] font-semibold tracking-wider ${
                    isSelected
                      ? 'bg-[#1E293B] text-[#60A5FA] border border-[#3B82F6]/40'
                      : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#0E1524]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={activeSearch}
              onChange={(e) => updateQueryState('search', e.target.value)}
              placeholder="Search by tech, host, or keyword..."
              className="w-full bg-[#080C16] border border-[#141C2E] text-[#F1F5F9] text-xs px-3 py-1.5 rounded-[2px] placeholder:text-[#50627A] focus:outline-none focus:border-[#3B82F6]"
            />
            {activeSearch && (
              <button
                type="button"
                onClick={() => updateQueryState('search', '')}
                className="absolute right-2 top-1.5 text-xs text-[#64748B] hover:text-[#F1F5F9]"
              >
                ?
              </button>
            )}
          </div>
        </div>

        {/* Numbered Event Rows Stream */}
        <div className={isPending ? 'opacity-50 transition-opacity' : ''}>
          <EventList
            events={filteredEvents}
            hasFilters={activeFilterCount > 0 || activeType !== 'all' || Boolean(activeSearch)}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile / Secondary Filter Sheet */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentMode={activeMode}
        currentTrack={activeTrack}
        currentLocation={activeLocation}
        currentSort={activeSort}
        onFilterChange={updateQueryState}
        onReset={handleResetFilters}
        totalResults={filteredEvents.length}
      />
    </div>
  );
}
