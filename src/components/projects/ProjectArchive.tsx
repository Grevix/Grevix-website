'use client';

import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '@/types/project';
import { ProjectRow } from './ProjectRow';

interface ProjectArchiveProps {
  initialProjects: Project[];
}

export function ProjectArchive({ initialProjects }: ProjectArchiveProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    let list = [...initialProjects];

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.language.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)) ||
          p.topics.some((topic) => topic.toLowerCase().includes(q))
      );
    }

    return list;
  }, [initialProjects, activeCategory, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: initialProjects.length,
      systems: initialProjects.filter((p) => p.category === 'systems').length,
      'ai-research': initialProjects.filter((p) => p.category === 'ai-research').length,
      'developer-tools': initialProjects.filter((p) => p.category === 'developer-tools').length,
      quantitative: initialProjects.filter((p) => p.category === 'quantitative').length,
    };
  }, [initialProjects]);

  return (
    <section className="space-y-8" aria-labelledby="project-archive-title">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-[#162032] font-mono text-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-[2px] transition-all font-mono text-xs ${
              activeCategory === 'all'
                ? 'bg-[#1E293B] text-[#F4F5F6] font-semibold border border-[#3B82F6]/40'
                : 'text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#0D1322]'
            }`}
          >
            ALL ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('systems')}
            className={`px-3 py-1.5 rounded-[2px] transition-all font-mono text-xs ${
              activeCategory === 'systems'
                ? 'bg-[#1E293B] text-[#F4F5F6] font-semibold border border-[#3B82F6]/40'
                : 'text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#0D1322]'
            }`}
          >
            SYSTEMS ({counts.systems})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('ai-research')}
            className={`px-3 py-1.5 rounded-[2px] transition-all font-mono text-xs ${
              activeCategory === 'ai-research'
                ? 'bg-[#1E293B] text-[#F4F5F6] font-semibold border border-[#3B82F6]/40'
                : 'text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#0D1322]'
            }`}
          >
            AI RESEARCH ({counts['ai-research']})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('developer-tools')}
            className={`px-3 py-1.5 rounded-[2px] transition-all font-mono text-xs ${
              activeCategory === 'developer-tools'
                ? 'bg-[#1E293B] text-[#F4F5F6] font-semibold border border-[#3B82F6]/40'
                : 'text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#0D1322]'
            }`}
          >
            DEV TOOLS ({counts['developer-tools']})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('quantitative')}
            className={`px-3 py-1.5 rounded-[2px] transition-all font-mono text-xs ${
              activeCategory === 'quantitative'
                ? 'bg-[#1E293B] text-[#F4F5F6] font-semibold border border-[#3B82F6]/40'
                : 'text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#0D1322]'
            }`}
          >
            QUANT ({counts.quantitative})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-[#080C16] border border-[#162032] text-[#F4F5F6] text-xs px-3 py-1.5 rounded-[2px] placeholder:text-[#5A6475] focus:outline-none focus:border-[#3B82F6]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-xs text-[#5A6475] hover:text-[#F4F5F6]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Section Sub-heading */}
      <div className="flex items-center justify-between font-mono text-xs text-[#8D98A8] uppercase tracking-wider">
        <h2 id="project-archive-title" className="text-xs font-mono font-normal">
          // ACTIVE COMMUNITY PROJECTS ({filteredProjects.length})
        </h2>
        <span className="text-[11px] text-[#5A6475]">INDEX 01 — 05</span>
      </div>

      {/* Project Rows Stream */}
      <div className="divide-y divide-[#162032] border-y border-[#162032]">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))
        ) : (
          <div className="py-16 text-center space-y-3 font-mono">
            <div className="text-[#5A6475] text-xs">No projects match your current filter.</div>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#6F9FFF] hover:underline"
            >
              [ Reset Filter & Search ]
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
