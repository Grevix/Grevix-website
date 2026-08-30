'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';

interface FeaturedEventCardProps {
  event: Event;
}

export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  let domain = 'official portal';
  try {
    const url = new URL(event.registrationUrl);
    domain = url.hostname.replace(/^www\./, '') + (url.pathname !== '/' ? url.pathname : '');
  } catch {
    domain = 'official portal';
  }

  return (
    <section className="mb-14" aria-labelledby="featured-event-title">
      {/* Section Header */}
      <div className="font-mono text-xs text-[#8092A8] uppercase tracking-wider mb-3">
        // MOST RECENT OPPORTUNITY
      </div>

      {/* Featured Card Box matching Cubix screenshot */}
      <div className="relative p-6 sm:p-8 bg-[#090D18] border border-[#162238] rounded-[4px] hover:border-[#253556] transition-all group">
        {/* Top Right Arrow */}
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-6 right-6 text-[#8092A8] hover:text-[#FFFFFF] transition-colors text-base font-mono"
          aria-label="Apply on official website"
        >
          ?
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Title, Badge, Subtitle & Tags (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-[#60A5FA] bg-[#1E293B]/70 border border-[#3B82F6]/30 rounded-[2px]">
              {event.status === 'ongoing' ? 'LIVE NOW' : 'FEATURED'}
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <Link href={`/events/${event.slug}`}>
                  <h3 id="featured-event-title" className="font-display font-bold text-2xl sm:text-3xl text-[#F1F5F9] uppercase tracking-tight group-hover:text-[#60A5FA] transition-colors">
                    {event.title}
                  </h3>
                </Link>
                <span className="font-mono text-[10px] text-[#64748B] border border-[#1E293B] px-1.5 py-0.5 rounded-[2px]">
                  2026
                </span>
              </div>
              <p className="font-mono text-xs text-[#8092A8] mt-2 leading-relaxed">
                {event.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {event.tracks.slice(0, 3).map((track) => (
                <span
                  key={track}
                  className="px-2 py-0.5 bg-[#0D1322] border border-[#1E293B] text-[10px] font-mono text-[#8092A8] rounded-[2px] uppercase"
                >
                  {track}
                </span>
              ))}
            </div>
          </div>

          {/* Center Column: Full Narrative Description (5 Cols) */}
          <div className="lg:col-span-5 font-mono text-xs text-[#8092A8] leading-relaxed space-y-3 lg:border-l lg:border-[#162238] lg:pl-8">
            <p>
              {event.description}
            </p>
            <p className="text-[#64748B]">
              Open to: {event.eligibility}. Team size: {event.teamSize.label}.
            </p>
          </div>

          {/* Right Column: Metadata & Official link (3 Cols) */}
          <div className="lg:col-span-3 space-y-4 font-mono text-xs lg:border-l lg:border-[#162238] lg:pl-8">
            <div>
              <div className="text-[10px] text-[#50627A] uppercase tracking-wider">DOMAIN / FOCUS</div>
              <div className="text-[#F1F5F9] font-medium mt-0.5">{event.skills.slice(0, 2).join(', ')}</div>
            </div>

            <div>
              <div className="text-[10px] text-[#50627A] uppercase tracking-wider">PRIZE / INCENTIVE</div>
              <div className="text-[#F1F5F9] font-medium mt-0.5">{event.prizePool.totalValue}</div>
            </div>

            <div>
              <div className="text-[10px] text-[#50627A] uppercase tracking-wider">DEADLINE</div>
              <div className="text-[#F1F5F9] font-medium mt-0.5">{event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}</div>
            </div>

            <div className="pt-2">
              <div className="text-[10px] text-[#50627A] uppercase tracking-wider">OFFICIAL PORTAL</div>
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#60A5FA] hover:underline truncate block mt-0.5"
              >
                {domain} ?
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
