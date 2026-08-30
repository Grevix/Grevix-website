import React from 'react';
import { EventStatus as StatusType } from '@/types/event';

interface EventStatusProps {
  status: StatusType;
  isClosingSoon?: boolean;
}

export function EventStatus({ status, isClosingSoon = false }: EventStatusProps) {
  if (status === 'ongoing') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
        LIVE NOW
      </span>
    );
  }

  if (isClosingSoon && status === 'upcoming') {
    return (
      <span className="text-xs font-medium text-[#F59E0B]">
        CLOSING SOON
      </span>
    );
  }

  if (status === 'upcoming') {
    return (
      <span className="text-xs font-medium text-[#8D98A8]">
        OPEN
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-[#5A6475]">
      CONCLUDED
    </span>
  );
}
