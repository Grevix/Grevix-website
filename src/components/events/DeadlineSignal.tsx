import React from 'react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { EventStatus } from '@/types/event';

interface DeadlineSignalProps {
  deadline: string;
  status: EventStatus;
  isClosingSoon?: boolean;
}

export function DeadlineSignal({ deadline, status, isClosingSoon }: DeadlineSignalProps) {
  if (status === 'completed') {
    return (
      <span className="text-xs text-[#5A6475] font-mono">
        Ended {formatDate(deadline)}
      </span>
    );
  }

  const relativeText = formatRelativeTime(deadline);

  return (
    <div className="text-right">
      <div className="text-[11px] text-[#5A6475]">
        {status === 'ongoing' ? 'Hacking Closes' : 'Registration Closes'}
      </div>
      <div className={`text-xs font-medium ${isClosingSoon ? 'text-[#F59E0B]' : 'text-[#F4F5F6]'}`}>
        {relativeText}
      </div>
    </div>
  );
}
