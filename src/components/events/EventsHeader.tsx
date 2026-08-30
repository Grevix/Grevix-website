import React from 'react';

export function EventsHeader() {
  return (
    <div className="pt-6 pb-10 border-b border-[#1E2330]">
      {/* Editorial Index Stamp */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="font-mono text-xs text-[#8D98A8] tracking-widest uppercase">
          03 / OPPORTUNITIES
        </div>
        <div className="font-mono text-[11px] text-[#5A6475] hidden sm:block">
          CURATED TECHNICAL INDEX ? 2026
        </div>
      </div>

      {/* Main Editorial Headline */}
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F4F5F6] leading-[1.08] mb-4 max-w-4xl uppercase">
        FIND SOMETHING<br />WORTH BUILDING.
      </h1>

      {/* Editorial Subtitle */}
      <p className="text-base sm:text-lg text-[#8D98A8] max-w-2xl leading-relaxed font-sans">
        A curated selection of student hackathons, algorithmic speed sprints, systems workshops, and competitive programming opportunities.
      </p>
    </div>
  );
}
