'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface EditorialEventRowProps {
  event: Event;
  index: number;
}

export function EditorialEventRow({ event, index }: EditorialEventRowProps) {
  const { isAdmin, openEditorForEvent } = useAdminAuth();
  const indexFormatted = index < 9 ? `0${index + 1}` : `${index + 1}`;

  // Formatted date and time
  const startDate = new Date(event.startDate);
  const dateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Select wireframe icon based on event type
  const renderWireframeIcon = () => {
    if (event.type === 'hackathon') {
      return (
        <svg className="w-7 h-7 text-[#64748B] group-hover:text-[#60A5FA] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    } else if (event.type === 'quiz') {
      return (
        <div className="font-mono text-base text-[#64748B] group-hover:text-[#60A5FA] transition-colors tracking-widest select-none">
          {'> _'}
        </div>
      );
    } else {
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

  const isHackathon = event.type === 'hackathon';
  const isQuiz = event.type === 'quiz';
  const isWorkshop = event.type === 'workshop';

  return (
    <div className="flex items-center gap-3 sm:gap-5 group">
      {/* Left Circular Number matching screenshot */}
      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#1E293B] group-hover:border-[#60A5FA] bg-[#060810] flex items-center justify-center font-mono text-xs sm:text-sm text-[#64748B] group-hover:text-[#F1F5F9] transition-all select-none">
        {indexFormatted}
      </div>

      {/* Main Row Box */}
      <div className="flex-1 p-4 sm:p-6 bg-[#080C16] border border-[#141C2E] group-hover:border-[#253556] rounded-[4px] transition-all space-y-3 relative">
        {/* Admin Edit Floating Action */}
        {isAdmin && (
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openEditorForEvent(event);
              }}
              className="px-2 py-0.5 bg-[#1E293B] hover:bg-[#334155] text-[#60A5FA] border border-[#3B82F6]/50 rounded-[2px] font-mono text-[10px] flex items-center gap-1"
            >
              <span>✎</span>
              <span>EDIT</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start sm:items-center">
          {/* Wireframe Icon Box (1 Col) */}
          <div className="hidden sm:flex lg:col-span-1 items-center justify-center p-2 rounded-[2px] bg-[#0A0E1A] border border-[#162032] aspect-square">
            {renderWireframeIcon()}
          </div>

          {/* Title, Tagline & Details (6 Cols) */}
          <div className="lg:col-span-6 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/events/${event.slug}`}>
                <h4 className="font-display font-bold text-base sm:text-lg text-[#F1F5F9] uppercase tracking-wide group-hover:text-[#60A5FA] transition-colors leading-tight">
                  {event.title}
                </h4>
              </Link>
              <span className={`px-2 py-0.2 font-mono text-[9px] uppercase tracking-wider rounded-[2px] ${
                event.status === 'ongoing'
                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                  : event.status === 'upcoming'
                  ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40'
                  : 'bg-[#1E293B] text-[#64748B] border border-[#334155]'
              }`}>
                {event.status === 'ongoing' ? 'LIVE NOW' : event.status === 'upcoming' ? 'UPCOMING' : 'COMPLETED'}
              </span>
            </div>

            <p className="font-mono text-xs text-[#8092A8] line-clamp-2 leading-relaxed">
              {event.tagline || event.description}
            </p>

            {/* Quick Summary Meta (Date, Time, Place/Mode) */}
            <div className="font-mono text-[11px] text-[#64748B] flex items-center gap-3 flex-wrap pt-0.5">
              <span>📅 {dateStr} at {timeStr}</span>
              <span>•</span>
              <span>📍 {event.location}</span>
              {isHackathon && (
                <>
                  <span>•</span>
                  <span>👥 {event.teamSize.label}</span>
                </>
              )}
            </div>
          </div>

          {/* Specialized Metadata Column (3 Cols) */}
          <div className="lg:col-span-3 space-y-1.5 font-mono text-xs">
            {isHackathon && (
              <div>
                <div className="text-[9px] text-[#50627A] uppercase tracking-wider">PRIZE & BOUNTIES</div>
                <div className="text-[#F1F5F9] font-medium truncate">{event.prizePool.totalValue}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {event.tracks.slice(0, 2).map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.2 bg-[#0D1322] border border-[#182338] text-[#8092A8] rounded-[2px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isQuiz && (
              <div>
                <div className="text-[9px] text-[#50627A] uppercase tracking-wider">CONTEST FORMAT & REWARD</div>
                <div className="text-[#F1F5F9] font-medium truncate">{event.prizePool.totalValue}</div>
                <div className="text-[10px] text-[#8092A8] mt-1">
                  Focus: {event.tracks.slice(0, 2).join(', ')}
                </div>
              </div>
            )}

            {isWorkshop && (
              <div>
                <div className="text-[9px] text-[#50627A] uppercase tracking-wider">WORKSHOP PERKS</div>
                <div className="text-[#F1F5F9] font-medium truncate">{event.prizePool.totalValue}</div>
                <div className="text-[10px] text-[#8092A8] mt-1">
                  Stack: {event.skills.slice(0, 3).join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* Action Link (2 Cols) */}
          <div className="lg:col-span-2 text-left lg:text-right font-mono text-xs space-y-0.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#162032]">
            <div className="text-[9px] text-[#50627A] uppercase tracking-widest">
              {event.status === 'completed' ? 'PROJECT REPO' : 'REGISTRATION'}
            </div>
            <Link
              href={`/events/${event.slug}`}
              className="text-[#60A5FA] hover:underline text-xs flex items-center justify-start lg:justify-end gap-1"
            >
              <span>{event.status === 'completed' ? 'View Results' : 'View Details'}</span>
              <span className="text-sm leading-none">↗</span>
            </Link>
          </div>
        </div>

        {/* Winner podium banner for completed hackathons or recruitment quiz */}
        {event.winners && event.winners.length > 0 && (
          <div className="mt-2 pt-2 border-t border-[#141C2E] flex items-center justify-between text-xs font-mono text-[#8092A8]">
            <div className="flex items-center gap-2">
              <span className="text-[#F59E0B]">🏆 {event.type === 'quiz' ? 'Inducted Core Builders:' : '1st Place:'}</span>
              <span className="text-[#F1F5F9]">{event.winners[0].teamName} ({event.winners[0].projectTitle})</span>
            </div>
            {event.winners[0].repoUrl && (
              <a href={event.winners[0].repoUrl} target="_blank" rel="noreferrer" className="text-[#60A5FA] hover:underline text-[11px]">
                GitHub Repo ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
