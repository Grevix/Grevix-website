import React from 'react';
import { Milestone } from '@/types/event';

interface EventTimelineProps {
  milestones: Milestone[];
}

export function EventTimeline({ milestones }: EventTimelineProps) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="relative border-l border-[#203050] ml-3 pl-6 space-y-6 my-4 font-mono text-xs">
      {milestones.map((m, idx) => (
        <div key={idx} className="relative group">
          <span
            className={`absolute -left-[31px] top-0.5 w-2.5 h-2.5 rounded-full border ${
              m.completed
                ? 'bg-[#10B981] border-[#10B981]'
                : 'bg-[#050505] border-[#7090B0]'
            }`}
          />
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[#7090B0] font-semibold">{m.date}</span>
            <span className="text-[#606880]">•</span>
            <span className="text-[#D0F0F0] font-medium font-sans">{m.title}</span>
            {m.completed && (
              <span className="text-[10px] text-[#10B981] bg-[#10B981]/10 px-1.5 rounded-[2px]">
                COMPLETED
              </span>
            )}
          </div>
          <p className="text-[#9090A0] text-xs font-sans leading-relaxed">
            {m.description}
          </p>
        </div>
      ))}
    </div>
  );
}
