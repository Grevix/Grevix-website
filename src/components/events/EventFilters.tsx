'use client';

import React from 'react';
import { EventType } from '@/types/event';

interface EventFiltersProps {
  currentType: string;
  onTypeChange: (type: string) => void;
  onOpenMobileDrawer: () => void;
  activeFilterCount: number;
  typeCounts: Record<string, number>;
}

export function EventFilters({
  currentType,
  onTypeChange,
  onOpenMobileDrawer,
  activeFilterCount,
  typeCounts,
}: EventFiltersProps) {
  const tabs: { value: EventType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'competition', label: 'Competitions' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-2">
      {/* Horizontal Editorial Type Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isSelected = currentType === tab.value;
          const count = typeCounts[tab.value] ?? 0;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTypeChange(tab.value)}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-medium tracking-wide transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-[#F4F5F6] text-[#050609] font-semibold'
                  : 'text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#0B0D14]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 font-mono text-[10px] ${isSelected ? 'text-[#050609]/70' : 'text-[#5A6475]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Toggle Button */}
      <div>
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          className="flex items-center gap-1.5 text-xs text-[#8D98A8] hover:text-[#F4F5F6] px-3 py-1.5 border border-[#1E2330] hover:border-[#8D98A8] rounded-[2px] transition-colors"
        >
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#6F9FFF] text-[#050609] text-[10px] font-bold rounded-[2px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
