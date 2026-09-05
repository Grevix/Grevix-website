'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { EventDetail } from './EventDetail';

interface DynamicEventViewerProps {
  slug: string;
}

export function DynamicEventViewer({ slug }: DynamicEventViewerProps) {
  const { events } = useAdminAuth();

  const matchedEvent = events.find((e) => e.slug === slug);

  if (matchedEvent) {
    return <EventDetail event={matchedEvent} />;
  }

  return (
    <div className="py-20 text-center font-mono space-y-6 max-w-lg mx-auto">
      <div className="text-4xl text-[#60A5FA]">⌖</div>
      <div className="space-y-2">
        <h2 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase">
          Event Not Located
        </h2>
        <p className="text-xs text-[#8092A8] leading-relaxed">
          The requested event dossier (<code className="text-[#60A5FA]">{slug}</code>) could not be found in the current archive.
        </p>
      </div>
      <div>
        <Link
          href="/events"
          className="inline-block px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#FFFFFF] text-[#060810] font-bold text-xs rounded-[2px] transition-colors"
        >
          ← Return to Events Directory
        </Link>
      </div>
    </div>
  );
}
