'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { ProjectTags } from './ProjectTags';
import { ProjectGraphicSchematic } from './ProjectGraphicSchematic';
import { sanitizeUrl } from '@/lib/utils';

interface ProjectRowProps {
  project: Project;
  index: number;
}

export function ProjectRow({ project, index }: ProjectRowProps) {
  const [showSchematic, setShowSchematic] = useState(false);
  const indexFormatted = index < 9 ? `0${index + 1}` : `${index + 1}`;

  return (
    <article className="border-b border-[#162032] last:border-b-0 py-6 transition-colors">
      <div className="flex items-start sm:items-center gap-3 sm:gap-6 group">
        {/* Left Number Index */}
        <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#1E293B] group-hover:border-[#6F9FFF] bg-[#060810] flex items-center justify-center font-mono text-xs sm:text-sm text-[#5A6475] group-hover:text-[#F4F5F6] transition-all select-none mt-1 sm:mt-0">
          {indexFormatted}
        </div>

        {/* Main Row Box */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start sm:items-center">
          {/* Title, Tagline & Tags (7 Cols) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href={`/projects/${project.slug}`}
                className="group/title inline-flex items-center gap-1.5"
              >
                <h4 className="font-display font-bold text-lg sm:text-xl text-[#F4F5F6] tracking-tight group-hover/title:text-[#6F9FFF] transition-colors leading-tight">
                  {project.name}
                </h4>
                <span className="text-xs text-[#5A6475] group-hover/title:text-[#6F9FFF] transition-colors">↗</span>
              </Link>

              <span className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-[2px] bg-[#0D1322] border border-[#1E293B] text-[#8D98A8]">
                {project.categoryLabel}
              </span>

              {project.version && (
                <span className="font-mono text-[9px] text-[#5A6475] border border-[#162032] px-1.5 py-0.2 rounded-[2px]">
                  {project.version}
                </span>
              )}

              {project.stars > 0 && (
                <span className="font-mono text-[10px] text-[#8D98A8] flex items-center gap-1">
                  <span className="text-[#F59E0B]">★</span> {project.stars}
                </span>
              )}

              {project.forks > 0 && (
                <span className="font-mono text-[10px] text-[#5A6475] flex items-center gap-1">
                  <span>⑂</span> {project.forks}
                </span>
              )}
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#8D98A8] leading-relaxed">
              {project.shortDescription}
            </p>

            <div className="pt-1 flex items-center gap-3 flex-wrap">
              <ProjectTags tags={project.technologies} limit={5} variant="subtle" />
              <button
                type="button"
                onClick={() => setShowSchematic(!showSchematic)}
                className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-[2px] border border-[#1E2E4A] hover:border-[#3B82F6] text-[#60A5FA] bg-[#080E1A] transition-colors inline-flex items-center gap-1"
              >
                <span>{showSchematic ? '[-] HIDE ARCHITECTURE' : '[+] VIEW ARCHITECTURAL SCHEMATIC'}</span>
              </button>
            </div>
          </div>

          {/* Technical Specs & Details (3 Cols) */}
          <div className="lg:col-span-3 space-y-1 font-mono text-xs text-[#8D98A8]">
            <div className="flex items-center gap-2">
              <span className="text-[#5A6475] text-[10px] uppercase">LANG:</span>
              <span className="text-[#F4F5F6] font-medium text-[11px]">{project.language}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#5A6475] text-[10px] uppercase">LICENSE:</span>
              <span className="text-[#8D98A8] text-[11px]">{project.license}</span>
            </div>

            {project.packageUrl && project.packageType && (
              <div className="flex items-center gap-2">
                <span className="text-[#5A6475] text-[10px] uppercase">PKG:</span>
                <a
                  href={sanitizeUrl(project.packageUrl)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#6F9FFF] hover:underline text-[11px]"
                >
                  {project.packageType}
                </a>
              </div>
            )}
          </div>

          {/* Action Links (2 Cols) */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col items-start lg:items-end justify-start lg:justify-center gap-2.5 font-mono text-xs">
            <Link
              href={`/projects/${project.slug}`}
              className="text-[#F4F5F6] hover:text-[#6F9FFF] transition-colors flex items-center gap-1 text-xs font-sans font-semibold"
            >
              <span>Details</span>
              <span className="text-xs">↗</span>
            </Link>

            <a
              href={sanitizeUrl(project.githubUrl)}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[#8D98A8] hover:text-[#F4F5F6] transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>GitHub</span>
              <span className="text-xs">↗</span>
            </a>

            {project.docsUrl && (
              <a
                href={sanitizeUrl(project.docsUrl)}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#5A6475] hover:text-[#8D98A8] transition-colors flex items-center gap-1 text-[11px]"
              >
                <span>Docs</span>
                <span className="text-xs">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Architectural Schematic */}
      {showSchematic && (
        <div className="mt-4 pt-4 border-t border-[#162032] pl-11 sm:pl-16">
          <ProjectGraphicSchematic slug={project.slug} />
        </div>
      )}
    </article>
  );
}

