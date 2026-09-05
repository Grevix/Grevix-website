import React from 'react';
import { Container } from '../layout/Container';

export function EventsHero() {
  return (
    <section className="relative bg-[#F4F5F7] text-[#0A0D14] pt-8 pb-20 md:pb-28 overflow-hidden">
      <Container className="relative">
        {/* Header Tag with horizontal line */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#0A0D14] tracking-wider uppercase font-semibold">
            03 / EVENTS
          </span>
          <div className="w-16 h-[1px] bg-[#3B82F6] relative">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] absolute -right-0.5 -top-[2px]"></div>
          </div>
        </div>

        {/* 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-4">
          {/* Left: Giant 3-Line Title */}
          <div className="lg:col-span-8 space-y-4">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-[0.95]">
              <span className="text-[#0A0D14] block">EVENTS</span>
              <span className="text-[#7A889B] block">THAT CREATE</span>
              <span className="text-[#7A889B] block">REAL IMPACT.</span>
            </h1>

            <p className="text-xs sm:text-sm font-mono text-[#475569] max-w-md leading-relaxed pt-2">
              From 48-hour student hackathons to high-speed algorithmic quizzes and technical workshops, explore the community initiatives we&apos;ve built, are running, and are hosting.
            </p>
          </div>

          {/* Right: Architectural Callout Box with Corner Brackets */}
          <div className="lg:col-span-4 lg:pt-4">
            <div className="relative p-5 border border-[#CBD5E1] bg-[#FFFFFF]/60 backdrop-blur-xs">
              {/* Corner ticks */}
              <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#0A0D14]"></div>
              <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#0A0D14]"></div>
              <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#0A0D14]"></div>
              <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#0A0D14]"></div>

              <div className="flex items-center justify-between font-mono text-[10px] text-[#0A0D14] font-bold uppercase tracking-wider mb-2">
                <span>// COMMUNITY INITIATIVES</span>
                <span className="w-1 h-1 rounded-full bg-[#0A0D14]"></span>
              </div>

              <p className="font-mono text-xs text-[#475569] leading-relaxed">
                We build with purpose. Our hackathons, speed coding quizzes, and workshops are student-led, open-source, and focused on practical engineering skills.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Slanted diagonal bottom divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 md:h-12 bg-[#060810]"
        style={{
          clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
        }}
      />
    </section>
  );
}
