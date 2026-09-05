'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { sanitizeUrl } from '@/lib/utils';

interface EditorialEventRowProps {
  event: Event;
  index: number;
}

export function EditorialEventRow({ event, index }: EditorialEventRowProps) {
  const { isAdmin, openEditorForEvent } = useAdminAuth();
  const indexFormatted = index < 9 ? `0${index + 1}` : `${index + 1}`;

  const isHackathon = event.type === 'hackathon';
  const isQuiz = event.type === 'quiz';
  const isWorkshop = event.type === 'workshop';

  return (
    <article className="flex items-start sm:items-center gap-3 sm:gap-6 group py-6 border-b border-[#162032] last:border-b-0">
      {/* Left Number Index matching Page 2 numbered rows style */}
      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#1E293B] group-hover:border-[#6F9FFF] bg-[#060810] flex items-center justify-center font-mono text-xs sm:text-sm text-[#5A6475] group-hover:text-[#F4F5F6] transition-all select-none mt-1 sm:mt-0">
        {indexFormatted}
      </div>

      {/* Main Row Box */}
      <div className="flex-1 bg-[#090D18] border border-[#162238] rounded-[3px] p-4 sm:p-6 group-hover:border-[#253556] transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start sm:items-center">
          {/* Title, Tagline & Tags (7 Cols) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href={`/events/${event.slug}`}
                className="group/title inline-flex items-center gap-1.5"
              >
                <h4 className="font-display font-bold text-lg sm:text-xl text-[#F4F5F6] tracking-tight group-hover/title:text-[#6F9FFF] transition-colors leading-tight">
                  {event.title}
                </h4>
                <span className="text-xs text-[#5A6475] group-hover/title:text-[#6F9FFF] transition-colors">↗</span>
              </Link>

              <span className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-[2px] bg-[#0D1322] border border-[#1E293B] text-[#8D98A8]">
                {event.type.toUpperCase()}
              </span>

              {event.mode && (
                <span className="font-mono text-[9px] text-[#5A6475] border border-[#162032] px-1.5 py-0.2 rounded-[2px]">
                  {event.mode.toUpperCase()}
                </span>
              )}
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#8D98A8] leading-relaxed">
              {event.tagline}
            </p>

            {/* Tags: Tracks & Skills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {event.tracks.slice(0, 3).map((track) => (
                <span
                  key={track}
                  className="px-2 py-0.5 font-mono text-[10px] bg-[#0D1322] border border-[#162032] text-[#8D98A8] rounded-[2px]"
                >
                  {track}
                </span>
              ))}
              {event.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 font-mono text-[10px] bg-[#090D18] border border-[#162032] text-[#5A6475] rounded-[2px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Type-Specific Metrics (3 Cols) */}
          <div className="lg:col-span-3 space-y-1 font-mono text-xs text-[#8D98A8]">
            <div className="flex items-center gap-2">
              <span className="text-[#5A6475] text-[10px] uppercase">STATUS:</span>
              <span
                className={`px-1.5 py-0.2 text-[9px] font-bold rounded-[2px] ${
                  event.status === 'ongoing'
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                    : event.status === 'upcoming'
                    ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40'
                    : 'bg-[#1E293B] text-[#8D98A8]'
                }`}
              >
                {event.status === 'ongoing' ? 'LIVE NOW' : event.status === 'upcoming' ? 'UPCOMING' : 'COMPLETED'}
              </span>
            </div>

            {isHackathon && (
              <div>
                <div className="text-[9px] text-[#5A6475] uppercase tracking-wider">PRIZE POOL</div>
                <div className="text-[#F1F5F9] font-medium truncate">{event.prizePool.totalValue}</div>
                <div className="text-[10px] text-[#8092A8] mt-1">
                  Team: {event.teamSize.label}
                </div>
              </div>
            )}

            {isQuiz && (
              <div>
                <div className="text-[9px] text-[#5A6475] uppercase tracking-wider">CONTEST FORMAT & REWARD</div>
                <div className="text-[#F1F5F9] font-medium truncate">{event.prizePool.totalValue}</div>
                <div className="text-[10px] text-[#8092A8] mt-1">
                  Focus: {event.tracks.slice(0, 2).join(', ')}
                </div>
              </div>
            )}

            {isWorkshop && (
              <div>
                <div className="text-[9px] text-[#5A6475] uppercase tracking-wider">WORKSHOP PERKS</div>
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
              <a
                href={sanitizeUrl(event.winners[0].repoUrl)}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#60A5FA] hover:underline text-[11px]"
              >
                GitHub Repo ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
