import React from 'react';
import Link from 'next/link';

export function ProjectCTA() {
  return (
    <section className="my-16 md:my-24" aria-labelledby="project-cta-title">
      <div className="relative p-8 sm:p-12 bg-[#090D18] border border-[#162238] rounded-[4px] overflow-hidden">
        {/* Subtle corner ticks */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#3B82F6]/60" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#3B82F6]/60" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#3B82F6]/60" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#3B82F6]/60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Manifesto */}
          <div className="lg:col-span-8 space-y-4">
            <div className="font-mono text-xs text-[#6F9FFF] uppercase tracking-widest">
              // COMMUNITY INITIATIVE
            </div>

            <h2 id="project-cta-title" className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F5F6] tracking-tight uppercase leading-[1.0]">
              HAVE AN IDEA?<br />
              <span className="text-[#8D98A8]">BUILD IT WITH US.</span>
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#8D98A8] max-w-xl leading-relaxed">
              GREViX is a student-driven technology collective. If you are building low-level systems, developer tooling, quantitative engines, or autonomous verification software, we provide peer code reviews, compute resources, and a focused collaborative environment.
            </p>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end justify-center">
            <Link
              href="/community"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F4F5F6] hover:bg-[#FFFFFF] text-[#050609] font-sans font-semibold text-xs tracking-wider uppercase rounded-[2px] transition-colors text-center w-full sm:w-auto lg:w-full"
            >
              <span>JOIN THE COMMUNITY</span>
              <span className="text-sm">↗</span>
            </Link>

            <a
              href="https://github.com/Grevix"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent hover:bg-[#0D1322] border border-[#1E293B] hover:border-[#8D98A8] text-[#F4F5F6] font-mono text-xs tracking-wider uppercase rounded-[2px] transition-colors text-center w-full sm:w-auto lg:w-full"
            >
              <span>GITHUB ORGANIZATION</span>
              <span className="text-sm">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
