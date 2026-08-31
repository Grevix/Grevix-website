import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { ProjectTags } from './ProjectTags';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between border-b border-[#162032] pb-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#8D98A8] hover:text-[#F4F5F6] transition-colors uppercase tracking-wider"
        >
          <span>←</span>
          <span>02 / ALL PROJECTS</span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#5A6475]">
          <span>STATUS:</span>
          <span className="text-[#6F9FFF] font-semibold uppercase">{project.statusLabel}</span>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#6F9FFF] tracking-widest uppercase font-semibold">
            01 / PROJECT
          </span>
          <div className="w-12 h-[1px] bg-[#3B82F6]" />
          <span className="font-mono text-[10px] text-[#5A6475] uppercase">
            {project.categoryLabel}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-[#F4F5F6] tracking-tight uppercase leading-[0.95]">
              {project.name}
            </h1>
            {project.version && (
              <span className="font-mono text-xs text-[#8D98A8] border border-[#1E2330] px-2 py-0.5 rounded-[2px] bg-[#090D18]">
                {project.version}
              </span>
            )}
          </div>

          {/* Direct GitHub Link */}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F4F5F6] hover:bg-[#FFFFFF] text-[#050609] font-sans font-semibold text-xs rounded-[2px] transition-colors shrink-0"
          >
            <span>VIEW ON GITHUB</span>
            <span className="text-sm leading-none">↗</span>
          </a>
        </div>

        <p className="font-sans text-base sm:text-lg text-[#8D98A8] leading-relaxed max-w-3xl pt-2">
          {project.tagline}
        </p>

        <div className="pt-2">
          <ProjectTags tags={project.topics} limit={8} variant="highlight" />
        </div>
      </div>

      {/* Main Narrative Split: Why it exists & What it does */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 border-y border-[#162032]">
        {/* Left Column: WHY IT EXISTS (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="font-mono text-xs text-[#6F9FFF] uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F9FFF]" />
            <span>WHY IT EXISTS</span>
          </div>
          <p className="font-sans text-sm text-[#8D98A8] leading-relaxed">
            {project.whyItExists || project.longDescription}
          </p>
        </div>

        {/* Right Column: WHAT IT DOES (6 Cols) */}
        <div className="lg:col-span-6 space-y-3 lg:border-l lg:border-[#162032] lg:pl-8">
          <div className="font-mono text-xs text-[#10B981] uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>WHAT IT DOES</span>
          </div>
          <p className="font-sans text-sm text-[#8D98A8] leading-relaxed">
            {project.whatItDoes || project.shortDescription}
          </p>
        </div>
      </div>

      {/* HOW IT WORKS (Workflow / Architecture if available) */}
      {project.howItWorks && project.howItWorks.length > 0 && (
        <section className="space-y-6" aria-labelledby="how-it-works-title">
          <div className="font-mono text-xs text-[#8D98A8] uppercase tracking-wider">
            // HOW IT WORKS & ARCHITECTURE
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.howItWorks.map((step) => (
              <div
                key={step.step}
                className="relative p-5 bg-[#090D18] border border-[#162238] rounded-[3px] space-y-2 group hover:border-[#253556] transition-colors"
              >
                <div className="flex items-center justify-between font-mono text-xs text-[#5A6475]">
                  <span className="text-[#6F9FFF] font-bold">{step.step}</span>
                  <span className="text-[10px] uppercase">// STEP</span>
                </div>
                <h4 className="font-display font-bold text-base text-[#F4F5F6] tracking-tight">
                  {step.title}
                </h4>
                <p className="font-sans text-xs text-[#8D98A8] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TECHNOLOGY STACK BREAKDOWN */}
      <section className="space-y-4 pt-4 border-t border-[#162032]" aria-labelledby="tech-stack-title">
        <div className="font-mono text-xs text-[#8D98A8] uppercase tracking-wider">
          // TECHNOLOGY & TOOLCHAIN
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-[#080C16] border border-[#162032] rounded-[3px]">
          <div>
            <div className="text-[10px] font-mono text-[#5A6475] uppercase tracking-wider">PRIMARY LANGUAGE</div>
            <div className="text-sm font-display font-bold text-[#F4F5F6] mt-1">{project.language}</div>
            {project.techStackBreakdown?.languages && (
              <div className="text-xs font-mono text-[#8D98A8] mt-1">
                {project.techStackBreakdown.languages.join(' • ')}
              </div>
            )}
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#5A6475] uppercase tracking-wider">FRAMEWORKS / SPEC</div>
            <div className="text-xs font-mono text-[#8D98A8] mt-1">
              {project.techStackBreakdown?.frameworks ? project.techStackBreakdown.frameworks.join(', ') : project.technologies.slice(0, 3).join(', ')}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#5A6475] uppercase tracking-wider">LIBRARIES / INTERFACES</div>
            <div className="text-xs font-mono text-[#8D98A8] mt-1">
              {project.techStackBreakdown?.libraries ? project.techStackBreakdown.libraries.join(', ') : project.technologies.slice(3, 6).join(', ') || 'Native Rust/Go standard libraries'}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#5A6475] uppercase tracking-wider">LICENSE</div>
            <div className="text-xs font-mono text-[#F4F5F6] mt-1">{project.license}</div>
          </div>
        </div>
      </section>

      {/* PROJECT ACTIVITY & METRICS */}
      <section className="space-y-4 pt-4 border-t border-[#162032]">
        <div className="font-mono text-xs text-[#8D98A8] uppercase tracking-wider">
          // PROJECT ACTIVITY & GITHUB METRICS
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-[#090D18] border border-[#162238] rounded-[2px]">
            <div className="font-mono text-[10px] text-[#5A6475] uppercase">STARS</div>
            <div className="font-mono text-2xl font-bold text-[#F4F5F6] mt-1 flex items-center gap-1.5">
              <span className="text-[#F59E0B] text-lg">★</span>
              <span>{project.stars}</span>
            </div>
          </div>

          <div className="p-4 bg-[#090D18] border border-[#162238] rounded-[2px]">
            <div className="font-mono text-[10px] text-[#5A6475] uppercase">FORKS</div>
            <div className="font-mono text-2xl font-bold text-[#F4F5F6] mt-1 flex items-center gap-1.5">
              <span className="text-[#8D98A8] text-lg">⑂</span>
              <span>{project.forks}</span>
            </div>
          </div>

          <div className="p-4 bg-[#090D18] border border-[#162238] rounded-[2px]">
            <div className="font-mono text-[10px] text-[#5A6475] uppercase">OPEN ISSUES</div>
            <div className="font-mono text-2xl font-bold text-[#F4F5F6] mt-1">
              {project.openIssues}
            </div>
          </div>

          <div className="p-4 bg-[#090D18] border border-[#162238] rounded-[2px]">
            <div className="font-mono text-[10px] text-[#5A6475] uppercase">LATEST UPDATE</div>
            <div className="font-mono text-sm font-medium text-[#F4F5F6] mt-2">
              {project.updatedAt}
            </div>
          </div>
        </div>
      </section>

      {/* EXTERNAL LINKS */}
      <section className="p-6 sm:p-8 bg-[#090D18] border border-[#162238] rounded-[3px] space-y-4">
        <div className="font-mono text-xs text-[#8D98A8] uppercase tracking-wider">
          // REPOSITORY & DOCUMENTATION ACCESS
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-[#F4F5F6] hover:bg-[#FFFFFF] text-[#050609] font-sans font-semibold text-xs rounded-[2px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>GITHUB REPOSITORY</span>
            <span className="text-sm">↗</span>
          </a>

          {project.docsUrl && (
            <a
              href={project.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 border border-[#1E293B] hover:border-[#8D98A8] text-[#F4F5F6] font-mono text-xs rounded-[2px] transition-colors inline-flex items-center gap-1.5"
            >
              <span>DOCUMENTATION</span>
              <span className="text-sm">↗</span>
            </a>
          )}

          {project.packageUrl && (
            <a
              href={project.packageUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 border border-[#3B82F6]/50 bg-[#1E293B]/40 hover:bg-[#1E293B] text-[#6F9FFF] font-mono text-xs rounded-[2px] transition-colors inline-flex items-center gap-1.5"
            >
              <span>PACKAGE ON {project.packageType?.toUpperCase()}</span>
              <span className="text-sm">↗</span>
            </a>
          )}

          <Link
            href="/projects"
            className="px-5 py-2.5 text-[#8D98A8] hover:text-[#F4F5F6] font-mono text-xs transition-colors ml-auto"
          >
            ← Back to Archive
          </Link>
        </div>
      </section>
    </div>
  );
}
