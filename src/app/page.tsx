import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export default function HomePage() {
  return (
    <div className="py-20 md:py-32">
      <Container>
        {/* Editorial Hero */}
        <div className="max-w-4xl space-y-8 mb-20">
          <div className="font-mono text-xs text-[#8D98A8] tracking-widest uppercase">
            GREViX // STUDENT TECHNOLOGY & RESEARCH
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-[#F4F5F6] tracking-tight leading-[1.05] uppercase">
            GROW ? BUILD<br />? IMPACT.
          </h1>

          <p className="text-base sm:text-xl text-[#8D98A8] leading-relaxed max-w-2xl font-sans">
            A student-driven community building production software, participating in global hackathons, and fostering technical research.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <Link
              href="/events"
              className="px-5 py-3 bg-[#F4F5F6] hover:bg-[#E5E7EB] text-[#050609] font-semibold rounded-[2px] transition-colors"
            >
              Explore Opportunities ?
            </Link>
            <a
              href="https://github.com/Grevix"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 border border-[#1E2330] hover:border-[#8D98A8] text-[#F4F5F6] rounded-[2px] transition-colors"
            >
              GitHub Organization ?
            </a>
          </div>
        </div>

        {/* Subtle Metric Rules */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[#1E2330] mb-20 text-xs">
          <div>
            <div className="font-mono text-2xl font-bold text-[#F4F5F6]">7+</div>
            <div className="text-[#5A6475] mt-1">Core Builders</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#F4F5F6]">8+</div>
            <div className="text-[#5A6475] mt-1">Active Competitions</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#F4F5F6]">100%</div>
            <div className="text-[#5A6475] mt-1">Open Source</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#F4F5F6]">3+</div>
            <div className="text-[#5A6475] mt-1">Special Interest Labs</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
