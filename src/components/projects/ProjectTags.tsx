import React from 'react';

interface ProjectTagsProps {
  tags: string[];
  limit?: number;
  variant?: 'subtle' | 'mono' | 'highlight';
}

export function ProjectTags({ tags, limit = 5, variant = 'subtle' }: ProjectTagsProps) {
  const visibleTags = tags.slice(0, limit);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] transition-colors ${
            variant === 'highlight'
              ? 'bg-[#1E293B]/80 text-[#6F9FFF] border border-[#3B82F6]/30'
              : variant === 'mono'
              ? 'bg-[#0A0E1A] text-[#8D98A8] border border-[#162032]'
              : 'bg-[#0D1322] text-[#8092A8] border border-[#182338]'
          }`}
        >
          {tag}
        </span>
      ))}
      {tags.length > limit && (
        <span className="text-[10px] font-mono text-[#5A6475] pl-1">
          +{tags.length - limit}
        </span>
      )}
    </div>
  );
}
