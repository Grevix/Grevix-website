'use client';

import React from 'react';
import { EventStatus } from '@/types/event';

interface EventTimelineTabsProps {
  currentTab: EventStatus;
  onTabChange: (tab: EventStatus) => void;
  counts: {
    upcoming: number;
    ongoing: number;
    completed: number;
  };
}

export function EventTimelineTabs({ currentTab, onTabChange, counts }: EventTimelineTabsProps) {
  const tabs: { id: EventStatus; label: string; count: number; isLive?: boolean }[] = [
    { id: 'upcoming', label: 'UPCOMING', count: counts.upcoming },
    { id: 'ongoing', label: 'ONGOING', count: counts.ongoing, isLive: true },
    { id: 'completed', label: 'COMPLETED ARCHIVE', count: counts.completed },
  ];

  return (
    <div
      role="tablist"
      aria-label="Opportunity Timelines"
      className="flex items-center gap-2 border-b border-[#203050] overflow-x-auto no-scrollbar font-mono text-xs select-none"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium tracking-wider whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7090B0] ${
              isActive
                ? 'border-[#7090B0] text-[#D0F0F0] bg-[#101020]/50 font-semibold'
                : 'border-transparent text-[#606880] hover:text-[#9090A0] hover:bg-[#101020]/20'
            }`}
          >
            {tab.isLive && (
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" aria-hidden="true" />
            )}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-[2px] text-[10px] ${
                isActive
                  ? 'bg-[#203050] text-[#D0F0F0] font-bold'
                  : 'bg-[#101020] text-[#606880] border border-[#203050]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
