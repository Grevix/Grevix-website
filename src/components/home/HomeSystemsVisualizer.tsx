'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProjectGraphicSchematic } from '@/components/projects/ProjectGraphicSchematic';
import { GREVIX_PROJECTS } from '@/data/projectsData';

export function HomeSystemsVisualizer() {
  const [activeSlug, setActiveSlug] = useState('berryn');

  return (
    <section className="mb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E2330] pb-4">
        <div>
          <div className="font-mono text-xs text-[#6F9FFF] tracking-widest uppercase">
            // SYSTEMS ARCHITECTURE & REPOSITORIES
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F5F6] tracking-tight uppercase mt-1">
            EXPLORE GREViX CORE SYSTEMS
          </h2>
        </div>
        <Link
          href="/projects"
          className="font-mono text-xs text-[#8D98A8] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 shrink-0"
        >
          <span>VIEW FULL PROJECTS CATALOG</span>
          <span>→</span>
        </Link>
      </div>

      {/* Project Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {GREVIX_PROJECTS.map((project) => {
          const isActive = activeSlug === project.slug;
          return (
            <button
              key={project.slug}
              type="button"
              onClick={() => setActiveSlug(project.slug)}
              className={`px-4 py-2 rounded-[3px] border transition-all text-xs flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#1E293B] border-[#3B82F6] text-[#FFFFFF] shadow-sm'
                  : 'bg-[#090D18] border-[#162238] text-[#8D98A8] hover:border-[#253556] hover:text-[#F4F5F6]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#3B82F6]' : 'bg-[#5A6475]'}`} />
              <span className="font-bold">{project.name}</span>
              <span className="text-[10px] text-[#5A6475]">({project.language})</span>
            </button>
          );
        })}
      </div>

      {/* Active Project Card + Schematic */}
      <div className="space-y-4">
        <ProjectGraphicSchematic slug={activeSlug} />

        <div className="flex items-center justify-between text-xs font-mono pt-1">
          <Link
            href={`/projects/${activeSlug}`}
            className="text-[#6F9FFF] hover:underline flex items-center gap-1"
          >
            <span>Open Deep-Dive Specification for {activeSlug.toUpperCase()}</span>
            <span>↗</span>
          </Link>
          <a
            href={`https://github.com/Grevix/${activeSlug}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[#8D98A8] hover:text-[#FFFFFF] transition-colors flex items-center gap-1"
          >
            <span>github.com/Grevix/{activeSlug}</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
