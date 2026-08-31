import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { ProjectTags } from './ProjectTags';

interface FeaturedProjectProps {
  project: Project;
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  return (
    <section className="mb-14" aria-labelledby="featured-project-title">
      {/* Section Header */}
      <div className="flex items-center justify-between font-mono text-xs text-[#8D98A8] uppercase tracking-wider mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>// MOST RECENT RELEASE</span>
        </div>
        <div className="flex items-center gap-3">
          {project.stars > 0 && (
            <span className="text-xs font-mono text-[#8D98A8] flex items-center gap-1">
              <span className="text-[#F59E0B]">★</span> {project.stars}
            </span>
          )}
          {project.forks > 0 && (
            <span className="text-xs font-mono text-[#5A6475] flex items-center gap-1">
              <span>⑂</span> {project.forks}
            </span>
          )}
          <span className="text-[11px] text-[#5A6475]">UPDATED {project.updatedAt}</span>
        </div>
      </div>

      {/* Main Featured Box */}
      <div className="relative p-6 sm:p-8 bg-[#090D18] border border-[#162238] rounded-[4px] hover:border-[#253556] transition-all group">
        {/* Top Right GitHub Link */}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute top-6 right-6 text-[#8D98A8] hover:text-[#FFFFFF] transition-colors text-base font-mono flex items-center gap-1"
          aria-label="View repository on GitHub"
        >
          <span className="hidden sm:inline text-xs font-mono text-[#5A6475] group-hover:text-[#8D98A8]">
            github.com/Grevix/{project.slug}
          </span>
          <span className="text-sm">↗</span>
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Identity, Title, Tags (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-[#6F9FFF] bg-[#1E293B]/70 border border-[#3B82F6]/30 rounded-[2px]">
              {project.statusLabel.toUpperCase()}
            </div>

            <div>
              <div className="flex items-baseline gap-2.5">
                <Link href={`/projects/${project.slug}`} className="hover:underline">
                  <h3 id="featured-project-title" className="font-display font-bold text-2xl sm:text-3xl text-[#F4F5F6] tracking-tight group-hover:text-[#6F9FFF] transition-colors">
                    {project.name}
                  </h3>
                </Link>
                {project.version && (
                  <span className="font-mono text-[10px] text-[#8D98A8] border border-[#1E293B] px-1.5 py-0.5 rounded-[2px] bg-[#050609]">
                    {project.version}
                  </span>
                )}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#8D98A8] mt-2 leading-relaxed">
                {project.tagline}
              </p>
            </div>

            <div className="pt-1">
              <ProjectTags tags={project.topics} limit={4} variant="highlight" />
            </div>
          </div>

          {/* Center Column: Narrative Architecture & Capabilities (5 Cols) */}
          <div className="lg:col-span-5 space-y-3 font-sans text-xs text-[#8D98A8] leading-relaxed lg:border-l lg:border-[#162238] lg:pl-8">
            <div className="font-mono text-[10px] text-[#5A6475] uppercase tracking-wider">
              // ARCHITECTURE & INTEGRITY
            </div>
            <p>
              {project.longDescription}
            </p>
            <div className="pt-2 space-y-1.5 font-mono text-[11px] text-[#64748B]">
              {project.architectureHighlights.slice(0, 3).map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#6F9FFF] select-none">›</span>
                  <span className="text-[#8D98A8]">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Metadata & Actions (3 Cols) */}
          <div className="lg:col-span-3 space-y-4 font-mono text-xs lg:border-l lg:border-[#162238] lg:pl-8">
            <div>
              <div className="text-[10px] text-[#5A6475] uppercase tracking-wider">CATEGORY</div>
              <div className="text-[#F4F5F6] font-medium mt-0.5 font-sans">{project.categoryLabel}</div>
            </div>

            <div>
              <div className="text-[10px] text-[#5A6475] uppercase tracking-wider">PRIMARY LANGUAGE</div>
              <div className="text-[#F4F5F6] font-medium mt-0.5">{project.language}</div>
            </div>

            {project.packageUrl && project.packageType && (
              <div>
                <div className="text-[10px] text-[#5A6475] uppercase tracking-wider">PACKAGE REGISTRY</div>
                <a
                  href={project.packageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6F9FFF] hover:underline font-medium mt-0.5 inline-flex items-center gap-1"
                >
                  <span>{project.packageType} ({project.version})</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>
            )}

            <div>
              <div className="text-[10px] text-[#5A6475] uppercase tracking-wider">LICENSE</div>
              <div className="text-[#8D98A8] mt-0.5">{project.license}</div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/projects/${project.slug}`}
                className="inline-block w-full text-center px-4 py-2.5 bg-[#F4F5F6] hover:bg-[#FFFFFF] text-[#050609] font-sans font-semibold text-xs rounded-[2px] transition-colors"
              >
                View Project Details ↗
              </Link>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full text-center px-4 py-1.5 border border-[#1E293B] hover:border-[#8D98A8] text-[#8D98A8] hover:text-[#F4F5F6] font-mono text-[11px] rounded-[2px] transition-colors"
              >
                GitHub Repository ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
