import React from 'react';
import { Project } from '@/types/project';

interface ProjectMetaProps {
  project: Project;
  layout?: 'row' | 'stack';
}

export function ProjectMeta({ project, layout = 'stack' }: ProjectMetaProps) {
  const isRow = layout === 'row';

  return (
    <div className={`font-mono text-xs ${isRow ? 'flex flex-wrap items-center gap-4' : 'space-y-3'}`}>
      <div>
        <div className="text-[10px] text-[#5A6475] uppercase tracking-wider">CATEGORY</div>
        <div className="text-[#F4F5F6] font-medium text-xs mt-0.5">{project.categoryLabel}</div>
      </div>

      <div>
        <div className="text-[10px] text-[#5A6475] uppercase tracking-wider">PRIMARY LANGUAGE</div>
        <div className="text-[#F4F5F6] font-medium text-xs mt-0.5">{project.language}</div>
      </div>

      {project.packageUrl && project.packageType && (
        <div>
          <div className="text-[10px] text-[#5A6475] uppercase tracking-wider">PACKAGE REGISTRY</div>
          <a
            href={project.packageUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#6F9FFF] hover:underline font-medium text-xs mt-0.5 inline-flex items-center gap-1"
          >
            <span>{project.packageType} ({project.version || 'latest'})</span>
            <span className="text-xs">↗</span>
          </a>
        </div>
      )}

      <div>
        <div className="text-[10px] text-[#5A6475] uppercase tracking-wider">LICENSE</div>
        <div className="text-[#8D98A8] text-xs mt-0.5">{project.license}</div>
      </div>
    </div>
  );
}
