import React from 'react';
import { EventSourceType } from '@/types/event';

interface EventSourceProps {
  sourceType: EventSourceType;
  organizerName: string;
  verified?: boolean;
}

export function EventSource({ sourceType, organizerName, verified = true }: EventSourceProps) {
  const sourceLabels: Record<EventSourceType, string> = {
    verified_admin: 'GREViX Direct',
    devpost: 'Devpost',
    unstop: 'Unstop',
    mlh: 'Major League Hacking',
    community: 'Community Curation'
  };

  return (
    <div className="text-xs text-[#8D98A8] flex items-center gap-1.5 flex-wrap">
      <span className="text-[#F4F5F6] font-medium">{organizerName}</span>
      <span className="text-[#5A6475]">?</span>
      <span className="text-[#5A6475]">{sourceLabels[sourceType]}</span>
    </div>
  );
}
