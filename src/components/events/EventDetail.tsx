'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { EventStatus } from './EventStatus';
import { formatDate } from '@/lib/utils';
import { isEventDataStale } from '@/lib/normalizers/eventNormalizer';
import { AiInsightCard } from './AiInsightCard';

interface EventDetailProps {
  event: Event;
}

export function EventDetail({ event }: EventDetailProps) {
  const [copied, setCopied] = useState(false);
  const isStale = isEventDataStale(event.lastSyncedAt);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const modeText = event.mode === 'online'
    ? 'Online (Global)'
    : event.mode === 'hybrid'
    ? 'Hybrid'
    : event.location;

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-12">
      {/* Back Breadcrumb & Metadata Stamp */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E2330] text-xs text-[#8D98A8]">
        <Link
          href="/events"
          className="text-[#8D98A8] hover:text-[#F4F5F6] flex items-center gap-1.5 transition-colors font-mono"
        >
          <span>?</span>
          <span>BACK TO OPPORTUNITIES</span>
        </Link>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-[#8D98A8] hover:text-[#F4F5F6] transition-colors"
          >
            {copied ? 'Link Copied ?' : 'Share Link'}
          </button>
          <span className="text-[#5A6475]">?</span>
          <span className="text-[#5A6475]">RECORD #{event.id.toUpperCase()}</span>
          <span className="text-[#5A6475]">?</span>
          <EventStatus status={event.status} isClosingSoon={event.isClosingSoon} />
        </div>
      </div>

      {/* Stale Data Warning Banner */}
      {isStale && (
        <div className="bg-[#0B0D14] border-l-2 border-[#F59E0B] p-4 text-xs text-[#8D98A8] space-y-1">
          <div className="font-medium text-[#F4F5F6]">Notice: Verified on {formatDate(event.lastSyncedAt)}</div>
          <p className="text-[#5A6475]">
            Dates and terms may have changed. Always verify rules directly on the official host website.
          </p>
        </div>
      )}

      {/* Editorial Hero Header */}
      <div className="space-y-4">
        <div className="font-mono text-xs text-[#8D98A8] uppercase tracking-wider">
          {event.type} ? {modeText}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F5F6] tracking-tight leading-tight uppercase">
          {event.title}
        </h1>
        <p className="text-base sm:text-lg text-[#8D98A8] leading-relaxed font-sans max-w-3xl">
          {event.tagline}
        </p>
        <div className="text-xs text-[#5A6475] pt-1">
          Organized by <span className="text-[#F4F5F6]">{event.organizer.name}</span> ? Verified Source
        </div>
      </div>

      {/* 2-Column Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 border-t border-[#1E2330]">
        {/* LEFT COLUMN: Narrative & Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Overview */}
          <section className="space-y-3" aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="font-mono text-xs text-[#8D98A8] tracking-wider uppercase font-semibold">
              01 / OVERVIEW & CHALLENGE
            </h2>
            <p className="text-sm text-[#F4F5F6] leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </section>

          {/* Focus Tracks */}
          <section className="space-y-3 pt-6 border-t border-[#1E2330]" aria-labelledby="tracks-heading">
            <h2 id="tracks-heading" className="font-mono text-xs text-[#8D98A8] tracking-wider uppercase font-semibold">
              02 / FOCUS TRACKS & DOMAINS
            </h2>
            <div className="flex flex-wrap gap-2">
              {event.tracks.map((track) => (
                <span
                  key={track}
                  className="px-3 py-1 bg-[#0B0D14] border border-[#1E2330] text-[#F4F5F6] text-xs rounded-[2px]"
                >
                  {track}
                </span>
              ))}
            </div>
            <div className="text-xs text-[#5A6475] pt-1">
              Relevant Tech: <span className="text-[#8D98A8]">{event.skills.join(', ')}</span>
            </div>
          </section>

          {/* Timeline Milestones */}
          {event.timelineMilestones && event.timelineMilestones.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-[#1E2330]" aria-labelledby="timeline-heading">
              <h2 id="timeline-heading" className="font-mono text-xs text-[#8D98A8] tracking-wider uppercase font-semibold">
                03 / CHRONOLOGICAL SCHEDULE
              </h2>
              <div className="space-y-4 pl-4 border-l border-[#1E2330]">
                {event.timelineMilestones.map((m, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-[#F4F5F6]">{m.date}</span>
                      <span className="text-[#5A6475]">?</span>
                      <span className="text-[#8D98A8]">{m.title}</span>
                    </div>
                    <p className="text-xs text-[#5A6475]">{m.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prize Breakdown */}
          {event.prizePool.breakdown && event.prizePool.breakdown.length > 0 && (
            <section className="space-y-3 pt-6 border-t border-[#1E2330]" aria-labelledby="prizes-heading">
              <h2 id="prizes-heading" className="font-mono text-xs text-[#8D98A8] tracking-wider uppercase font-semibold">
                04 / PRIZE POOL & INCENTIVES
              </h2>
              <div className="divide-y divide-[#1E2330] text-xs">
                {event.prizePool.breakdown.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="text-[#8D98A8]">{item.rank}</span>
                    <span className="text-[#F4F5F6] font-medium">{item.prize}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rules & Submission */}
          {event.rules && event.rules.length > 0 && (
            <section className="space-y-3 pt-6 border-t border-[#1E2330]" aria-labelledby="rules-heading">
              <h2 id="rules-heading" className="font-mono text-xs text-[#8D98A8] tracking-wider uppercase font-semibold">
                05 / RULES & CRITERIA
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-[#8D98A8]">
                {event.rules.map((rule, idx) => (
                  <li key={idx}><span className="text-[#F4F5F6]">{rule}</span></li>
                ))}
              </ul>
            </section>
          )}

          {/* Winners Showcase (If completed) */}
          {event.winners && event.winners.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-[#1E2330]" aria-labelledby="winners-heading">
              <h2 id="winners-heading" className="font-mono text-xs text-[#10B981] tracking-wider uppercase font-semibold">
                06 / COMPETITION RESULTS & PODIUM
              </h2>
              <div className="space-y-3">
                {event.winners.map((winner, idx) => (
                  <div key={idx} className="p-4 bg-[#0B0D14] border border-[#1E2330] rounded-[2px] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[#10B981] font-semibold">
                      <span>{winner.rank}</span>
                      <span className="text-[#F4F5F6]">{winner.teamName}</span>
                    </div>
                    <div className="text-[#F4F5F6]">{winner.projectTitle}</div>
                    <div className="text-[#5A6475]">Members: {winner.members.join(', ')}</div>
                    {winner.repoUrl && (
                      <div className="pt-1">
                        <a href={winner.repoUrl} target="_blank" rel="noreferrer" className="text-[#6F9FFF] hover:underline">
                          Winning Repository ?
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 7: AI Synthesis & Fit Advisor */}
          <AiInsightCard event={event} />
        </div>

        {/* RIGHT COLUMN: Critical Dates & Access (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Main Action Box */}
          <div className="space-y-3">
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-[#F4F5F6] hover:bg-[#E5E7EB] text-[#050609] font-semibold text-xs rounded-[2px] transition-colors"
            >
              REGISTER ON OFFICIAL PLATFORM ?
            </a>
            <div className="text-[11px] text-center text-[#5A6475]">
              Verified Source: {event.sourceType}
            </div>
          </div>

          {/* Critical Constraints */}
          <div className="space-y-4 text-xs pt-4 border-t border-[#1E2330]">
            <div className="font-mono text-[10px] text-[#8D98A8] uppercase tracking-wider font-semibold">
              CRITICAL DATES & TERMS
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[#5A6475] uppercase text-[10px] font-mono">Registration Deadline</div>
                <div className="text-[#F4F5F6] font-medium mt-0.5">{formatDate(event.registrationDeadline)}</div>
              </div>

              <div>
                <div className="text-[#5A6475] uppercase text-[10px] font-mono">Event Window</div>
                <div className="text-[#F4F5F6] mt-0.5">{formatDate(event.startDate)} ? {formatDate(event.endDate)}</div>
              </div>

              <div>
                <div className="text-[#5A6475] uppercase text-[10px] font-mono">Location & Mode</div>
                <div className="text-[#F4F5F6] mt-0.5">{event.location}</div>
              </div>

              <div>
                <div className="text-[#5A6475] uppercase text-[10px] font-mono">Team Size</div>
                <div className="text-[#F4F5F6] mt-0.5">{event.teamSize.label}</div>
              </div>

              <div>
                <div className="text-[#5A6475] uppercase text-[10px] font-mono">Eligibility</div>
                <div className="text-[#8D98A8] mt-0.5 leading-relaxed">{event.eligibility}</div>
              </div>

              <div>
                <div className="text-[#5A6475] uppercase text-[10px] font-mono">Entry Fee</div>
                <div className="text-[#10B981] font-semibold mt-0.5">{event.entryFee}</div>
              </div>
            </div>
          </div>

          {/* Teammates Box */}
          <div className="p-4 bg-[#0B0D14] border border-[#1E2330] rounded-[2px] space-y-2 text-xs">
            <div className="font-semibold text-[#F4F5F6]">Need Teammates?</div>
            <p className="text-[#5A6475] leading-relaxed">
              Connect with GREViX community members building teams for this challenge.
            </p>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="inline-block pt-1 text-[#6F9FFF] hover:underline"
            >
              Discord Team Formation ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
