'use client';

import React from 'react';
import { Event } from '@/types/event';
import { EditorialEventRow } from './EditorialEventRow';
import { EmptyState } from './EmptyState';

interface EventListProps {
  events: Event[];
  hasFilters?: boolean;
  onResetFilters?: () => void;
}

export function EventList({ events, hasFilters = false, onResetFilters }: EventListProps) {
  if (events.length === 0) {
    return <EmptyState hasFilters={hasFilters} onReset={onResetFilters} />;
  }

  return (
    <div className="space-y-4">
      {/* Numbered Event Rows */}
      {events.map((event, idx) => (
        <EditorialEventRow key={event.id} event={event} index={idx} />
      ))}

      {/* Bottom Scroll Prompt matching screenshot */}
      <div className="py-12 flex flex-col items-center justify-center gap-2 font-mono text-[10px] text-[#64748B] uppercase tracking-widest select-none">
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[#1E293B]"></span>
          <span>?</span>
          <span className="w-8 h-[1px] bg-[#1E293B]"></span>
          <span>SCROLL TO EXPLORE MORE OPPORTUNITIES</span>
          <span className="inline-block px-1.5 py-0.5 border border-[#1E293B] rounded-[3px] text-xs leading-none">??</span>
          <span className="w-8 h-[1px] bg-[#1E293B]"></span>
          <span>?</span>
          <span className="w-8 h-[1px] bg-[#1E293B]"></span>
        </div>
        <div className="text-xs text-[#50627A]">?</div>
      </div>

      {/* Bottom Community Callout Box matching screenshot ("HAVE AN IDEA? BUILD IT WITH US.") */}
      <div className="pt-8 pb-16">
        <div className="font-mono text-xs text-[#8092A8] uppercase tracking-wider mb-3">
          // COMPETE. BUILD. IMPACT.
        </div>

        <div className="p-6 sm:p-10 bg-[#080C16] border border-[#141C2E] rounded-[4px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F1F5F9] uppercase tracking-tight">
              HOSTING AN EVENT? <span className="text-[#64748B]">LIST IT WITH US.</span>
            </h3>
            <p className="font-mono text-xs text-[#8092A8] max-w-lg leading-relaxed">
              We love spotlighting student hackathons, coding quizzes, and workshops that create real community impact.
            </p>
          </div>

          {/* Styled Button with Architectural Corner Brackets */}
          <div className="relative">
            <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#60A5FA]"></div>
            <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#60A5FA]"></div>
            <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#60A5FA]"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#60A5FA]"></div>

            <a
              href="/contact"
              className="px-6 py-3.5 bg-[#0B1020] hover:bg-[#121A30] border border-[#1E2B45] text-[#F1F5F9] font-mono text-xs tracking-wider font-semibold rounded-[2px] transition-colors flex items-center gap-3"
            >
              <span>SUBMIT AN OPPORTUNITY</span>
              <span className="text-sm leading-none text-[#60A5FA]">?</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
