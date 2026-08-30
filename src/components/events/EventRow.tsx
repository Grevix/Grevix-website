'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { EventStatus } from './EventStatus';
import { formatDate } from '@/lib/utils';

interface EventRowProps {
  event: Event;
  isFeatured?: boolean;
}

export function EventRow({ event, isFeatured = false }: EventRowProps) {
  const typeLabels: Record<string, string> = {
    hackathon: 'Hackathon',
    quiz: 'Coding Quiz',
    workshop: 'Workshop',
    competition: 'Competition',
  };

  // Format month and day for editorial date stamp
  let dateFormatted = 'TBA';
  try {
    const d = new Date(event.startDate);
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    dateFormatted = `${month} ${day < 10 ? '0' + day : day}`;
  } catch {
    dateFormatted = 'TBA';
  }

  const modeText = event.mode === 'online'
    ? 'Online'
    : event.mode === 'hybrid'
    ? 'Hybrid'
    : event.location;

  return (
    <article
      className={`group py-6 border-b border-[#1E2330] transition-colors ${
        isFeatured ? 'bg-[#0B0D14]/80 p-6 rounded-[2px] border border-[#2D3548] mb-4' : 'hover:bg-[#0B0D14]/30'
      }`}
    >
      {/* DESKTOP EDITORIAL LAYOUT (Hidden on mobile) */}
      <div className="hidden md:grid grid-cols-12 gap-6 items-center">
        {/* Col 1-2: Date Block & Status */}
        <div className="col-span-2 space-y-1">
          <div className="font-mono text-sm font-semibold text-[#F4F5F6] tracking-wider">
            {dateFormatted}
          </div>
          <div className="text-xs text-[#5A6475]">
            {event.status === 'ongoing' ? (
              <span className="text-[#10B981] font-medium">? LIVE NOW</span>
            ) : event.isClosingSoon ? (
              <span className="text-[#F59E0B] font-medium">CLOSING SOON</span>
            ) : (
              <span>{typeLabels[event.type]}</span>
            )}
          </div>
        </div>

        {/* Col 3-7: Event Name & Host */}
        <div className="col-span-5 space-y-1.5">
          <Link
            href={`/events/${event.slug}`}
            className="block group-hover:text-[#6F9FFF] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            <h3 className="font-display font-semibold text-lg text-[#F4F5F6] leading-tight">
              {event.title}
            </h3>
          </Link>
          <div className="text-xs text-[#8D98A8] flex items-center gap-2 flex-wrap">
            <span className="text-[#F4F5F6]">{event.organizer.name}</span>
            <span className="text-[#5A6475]">?</span>
            <span>{modeText}</span>
          </div>
          <div className="text-xs text-[#5A6475] flex items-center gap-2 flex-wrap pt-0.5">
            {event.tracks.slice(0, 3).map((track, i) => (
              <span key={track}>
                {track}
                {i < Math.min(event.tracks.length, 3) - 1 && <span className="ml-2 text-[#2D3548]">/</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Col 8-9: Prize / Incentive */}
        <div className="col-span-2 text-xs space-y-0.5">
          <div className="text-[#5A6475] uppercase text-[10px] tracking-wider font-mono">Incentive</div>
          <div className="text-[#F4F5F6] font-medium truncate" title={event.prizePool.totalValue}>
            {event.prizePool.totalValue}
          </div>
        </div>

        {/* Col 10-11: Deadline Signal */}
        <div className="col-span-2 text-right text-xs space-y-0.5">
          <div className="text-[#5A6475] uppercase text-[10px] tracking-wider font-mono">
            {event.status === 'completed' ? 'Ended' : 'Deadline'}
          </div>
          <div className={`font-medium ${event.isClosingSoon ? 'text-[#F59E0B]' : 'text-[#F4F5F6]'}`}>
            {formatDate(event.registrationDeadline)}
          </div>
        </div>

        {/* Col 12: Action Link */}
        <div className="col-span-1 text-right">
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-semibold text-[#F4F5F6] hover:text-[#6F9FFF] transition-colors py-1 pl-2"
            aria-label={`Register for ${event.title} on official platform`}
          >
            {event.status === 'completed' ? 'Archive ?' : 'Register ?'}
          </a>
        </div>
      </div>

      {/* MOBILE EDITORIAL LAYOUT (Visible < 768px) */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-mono font-semibold text-[#F4F5F6]">{dateFormatted}</span>
          <EventStatus status={event.status} isClosingSoon={event.isClosingSoon} />
        </div>

        <div>
          <Link href={`/events/${event.slug}`}>
            <h3 className="font-display font-semibold text-base text-[#F4F5F6] leading-snug group-hover:text-[#6F9FFF]">
              {event.title}
            </h3>
          </Link>
          <div className="text-xs text-[#8D98A8] mt-1">
            {event.organizer.name} ? {modeText}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-[#5A6475] pt-1">
          {event.tracks.map((track) => (
            <span key={track}>{track}</span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1E2330]">
          <div>
            <span className="text-[#5A6475]">Prize: </span>
            <span className="text-[#F4F5F6] font-medium">{event.prizePool.totalValue}</span>
          </div>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#F4F5F6] hover:text-[#6F9FFF]"
          >
            {event.status === 'completed' ? 'View Results ?' : 'Register ?'}
          </a>
        </div>
      </div>
    </article>
  );
}
