import React from 'react';
import { Container } from '@/components/layout/Container';

export function ProjectsHero() {
  return (
    <section className="relative bg-[#F4F5F7] text-[#0A0D14] pt-8 pb-20 md:pb-28 overflow-hidden">
      <Container className="relative">
        {/* Left vertical rotated stamp */}
        <div className="hidden xl:block absolute -left-12 top-10 transform -rotate-90 origin-top-left font-mono text-[9px] tracking-[0.3em] text-[#94A3B8] uppercase select-none">
          GREViX COMMUNITY
        </div>

        {/* Header Tag with horizontal line & node */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#0A0D14] tracking-wider uppercase font-semibold">
            02 / PROJECTS
          </span>
          <div className="w-16 h-[1px] bg-[#3B82F6] relative">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] absolute -right-0.5 -top-[2px]" />
          </div>
        </div>

        {/* 2-Column Asymmetric Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          {/* Left: Giant 3-Line Title & Manifesto */}
          <div className="lg:col-span-8 space-y-4">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-[0.95]">
              <span className="text-[#0A0D14] block">PROJECTS</span>
              <span className="text-[#7A889B] block">THAT CREATE</span>
              <span className="text-[#7A889B] block">REAL IMPACT.</span>
            </h1>

            <p className="text-xs sm:text-sm font-sans text-[#475569] max-w-lg leading-relaxed pt-2">
              From memory-bounded inference runtimes and adversarial AI verifiers to polyglot monorepo build coordinators, explore the open-source engineering systems built within the GREViX student community.
            </p>
          </div>

          {/* Right: Architectural Callout Box with Corner Brackets */}
          <div className="lg:col-span-4 lg:pt-4">
            <div className="relative p-5 border border-[#CBD5E1] bg-[#FFFFFF]/70 backdrop-blur-xs">
              {/* 4 Architectural Corner Brackets */}
              <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#0A0D14]" />
              <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#0A0D14]" />
              <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#0A0D14]" />
              <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#0A0D14]" />

              <div className="flex items-center justify-between font-mono text-[10px] text-[#0A0D14] font-bold uppercase tracking-wider mb-2">
                <span>// WHAT WE BUILD</span>
                <span className="w-1 h-1 rounded-full bg-[#0A0D14]" />
              </div>

              <p className="font-sans text-xs text-[#475569] leading-relaxed">
                We build practical, local-first engineering systems. Every project originates from genuine technical bottlenecks—eliminating silent dependency corruption, enforcing hard OS memory budgets, and establishing deterministic proof before code execution.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator on left */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-[#64748B] uppercase tracking-widest pt-4">
          <span className="border border-[#CBD5E1] px-1.5 py-0.5 rounded-[2px] bg-[#FFFFFF]">SCROLL</span>
          <span>↓</span>
        </div>
      </Container>

      {/* Slanted diagonal bottom divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 md:h-12 bg-[#060810]"
        style={{
          clipPath: 'polygon(0 100%, 100% 0, 100% 100%)'
        }}
      />
    </section>
  );
}
