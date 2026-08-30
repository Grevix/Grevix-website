'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';

interface EditorialEventRowProps {
  event: Event;
  index: number;
}

export function EditorialEventRow({ event, index }: EditorialEventRowProps) {
  const indexFormatted = index < 9 ? `0${index + 1}` : `${index + 1}`;

  // Select wireframe icon based on event type or index
  const renderWireframeIcon = () => {
    switch (index % 4) {
      case 0:
        // Isometric Cube Wireframe
        return (
          <svg className="w-7 h-7 text-[#64748B] group-hover:text-[#60A5FA] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        );
      case 1:
        // Code Brackets { ? }
        return (
          <div className="font-mono text-base text-[#64748B] group-hover:text-[#60A5FA] transition-colors tracking-widest select-none">
            {'{ ? }'}
          </div>
        );
      case 2:
        // Terminal Prompt > _
        return (
          <div className="font-mono text-base text-[#64748B] group-hover:text-[#60A5FA] transition-colors tracking-widest select-none">
            {'> _'}
          </div>
        );
      default:
        // Node / Molecule Network Graph
        return (
          <svg className="w-7 h-7 text-[#64748B] group-hover:text-[#60A5FA] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        );
    }
  };

  let domain = 'official';
  try {
    const url = new URL(event.registrationUrl);
    domain = url.hostname.replace(/^www\./, '') + (url.pathname !== '/' ? url.pathname : '');
  } catch {
    domain = 'official portal';
  }

  return (
    <div className="flex items-center gap-3 sm:gap-5 group">
      {/* Left Circular Number matching screenshot */}
      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#1E293B] group-hover:border-[#60A5FA] bg-[#060810] flex items-center justify-center font-mono text-xs sm:text-sm text-[#64748B] group-hover:text-[#F1F5F9] transition-all select-none">
        {indexFormatted}
      </div>

      {/* Main Row Box */}
      <div className="flex-1 p-4 sm:p-6 bg-[#080C16] border border-[#141C2E] group-hover:border-[#253556] rounded-[4px] transition-all">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
          {/* Wireframe Icon Box (2 Cols) */}
          <div className="hidden sm:flex md:col-span-1 items-center justify-center p-2 rounded-[2px] bg-[#0A0E1A] border border-[#162032] aspect-square">
            {renderWireframeIcon()}
          </div>

          {/* Title & Description (6 Cols) */}
          <div className="md:col-span-6 space-y-1.5">
            <Link href={`/events/${event.slug}`}>
              <h4 className="font-display font-bold text-base sm:text-lg text-[#F1F5F9] uppercase tracking-wide group-hover:text-[#60A5FA] transition-colors leading-tight">
                {event.title}
              </h4>
            </Link>
            <p className="font-mono text-xs text-[#8092A8] line-clamp-2 leading-relaxed">
              {event.tagline || event.description}
            </p>
          </div>

          {/* Tech / Track Tags (3 Cols) */}
          <div className="md:col-span-3 flex flex-wrap gap-1.5">
            {event.tracks.slice(0, 3).map((track) => (
              <span
                key={track}
                className="px-2 py-0.5 bg-[#0D1322] border border-[#182338] text-[10px] font-mono text-[#8092A8] rounded-[2px] uppercase whitespace-nowrap"
              >
                {track}
              </span>
            ))}
          </div>

          {/* Right: Official Source & Link (2 Cols) */}
          <div className="md:col-span-2 text-left md:text-right font-mono text-xs space-y-0.5 pt-2 md:pt-0 border-t md:border-t-0 border-[#162032]">
            <div className="text-[9px] text-[#50627A] uppercase tracking-widest">OFFICIAL PORTAL</div>
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#60A5FA] hover:underline text-xs flex items-center justify-start md:justify-end gap-1 truncate"
            >
              <span className="truncate">{domain}</span>
              <span className="text-sm leading-none">?</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
