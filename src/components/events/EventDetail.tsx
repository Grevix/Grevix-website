'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { EventTimeline } from './EventTimeline';
import { AiInsightCard } from './AiInsightCard';
import { sanitizeUrl } from '@/lib/utils';

interface EventDetailProps {
  event: Event;
}

export function EventDetail({ event: initialEvent }: EventDetailProps) {
  const { events, isAdmin, openEditorForEvent } = useAdminAuth();
  const [copied, setCopied] = useState(false);

  // Sync with context if edited
  const event = events.find((e) => e.id === initialEvent.id || e.slug === initialEvent.slug) || initialEvent;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startDate = new Date(event.startDate);
  const dateStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const isHackathon = event.type === 'hackathon';
  const isQuiz = event.type === 'quiz';

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-10 font-mono">

      {/* Top Breadcrumb & Share */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#141C2E] text-xs text-[#8092A8]">
        <Link
          href={`/events?type=${event.type}`}
          className="text-[#8092A8] hover:text-[#FFFFFF] flex items-center gap-1.5 transition-colors"
        >
          <span>←</span>
          <span className="uppercase">BACK TO {event.type}S</span>
        </Link>
        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-[#8092A8] hover:text-[#FFFFFF] transition-colors"
          >
            {copied ? 'Link Copied ✓' : 'Share Link'}
          </button>
          <span className="text-[#334155]">·</span>
          <span className="text-[#64748B]">GREViX COMMUNITY INITIATIVE</span>
          <span className="text-[#334155]">·</span>
          <span className={`px-2 py-0.5 rounded-[2px] font-bold text-[10px] ${
            event.status === 'ongoing' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' :
            event.status === 'upcoming' ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40' :
            'bg-[#1E293B] text-[#8D98A8]'
          }`}>
            {event.status === 'ongoing' ? 'LIVE NOW' : event.status === 'upcoming' ? 'OPEN' : 'CONCLUDED'}
          </span>
        </div>
      </div>

      {/* Main Title Header */}
      <div className="space-y-4">
        <div className="text-xs text-[#60A5FA] uppercase tracking-wider font-semibold">
          // {event.type.toUpperCase()} • {event.mode.toUpperCase()}
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#F1F5F9] uppercase tracking-tight leading-tight">
          {event.title}
        </h1>
        <p className="text-sm sm:text-base text-[#8092A8] leading-relaxed max-w-3xl font-sans">
          {event.tagline}
        </p>
        <div className="text-xs text-[#64748B] pt-1 flex items-center gap-3 flex-wrap">
          <span>Host: <span className="text-[#F1F5F9]">{event.organizer.name}</span></span>
          <span>•</span>
          <span>Venue: <span className="text-[#F1F5F9]">{event.location}</span></span>
          {event.sourceUrl && (
            <>
              <span>•</span>
              <a
                href={sanitizeUrl(event.sourceUrl)}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#60A5FA] hover:underline"
              >
                LinkedIn Post ↗
              </a>
            </>
          )}
        </div>
      </div>

      {/* Grid: Main Narrative (8 Cols) vs Action Sidebar (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Narrative, Agenda, AI Intel, Winners (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Winner Podium Showcase if Completed */}
          {event.winners && event.winners.length > 0 && (
            <div className="p-6 bg-[#0B1220] border border-[#1E2B45] rounded-[4px] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A263D] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <span className="font-bold text-sm text-[#F1F5F9] uppercase tracking-wider">
                    {isQuiz ? 'TOP INDUCTED BUILDERS' : 'OFFICIAL PODIUM & RESULTS'}
                  </span>
                </div>
                <span className="text-[10px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-[2px] font-bold">
                  VERIFIED RESULTS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {event.winners.map((winner, idx) => (
                  <div key={idx} className="p-4 bg-[#060810] border border-[#1E293B] rounded-[3px] space-y-2">
                    <div className="text-[10px] text-[#F59E0B] font-bold uppercase">
                      {winner.rank || `Rank #${idx + 1}`}
                    </div>
                    <div className="font-bold text-sm text-[#F1F5F9]">{winner.teamName}</div>
                    <div className="text-[11px] text-[#8092A8] font-sans italic">"{winner.projectTitle}"</div>
                    {winner.repoUrl && (
                      <a
                        href={sanitizeUrl(winner.repoUrl)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-block text-[10px] text-[#60A5FA] hover:underline pt-1"
                      >
                        Explore Project Repo ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview & Description */}
          <div className="space-y-3">
            <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
              // OVERVIEW & CHALLENGE BRIEF
            </div>
            <div className="text-sm font-sans text-[#8092A8] leading-relaxed whitespace-pre-line bg-[#090D18] p-6 border border-[#141C2E] rounded-[4px]">
              {event.description}
            </div>
          </div>

          {/* AI Strategic Intelligence Component */}
          <AiInsightCard event={event} />

          {/* Tracks & Themes */}
          {event.tracks && event.tracks.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
                // FOCUS TRACKS & PROBLEM DOMAINS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.tracks.map((track) => (
                  <div key={track} className="p-4 bg-[#090D18] border border-[#162032] rounded-[3px] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
                    <span className="text-xs font-semibold text-[#F1F5F9] font-sans">{track}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones / Schedule */}
          {event.timelineMilestones && event.timelineMilestones.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
                // EVENT TIMELINE & KEY MILESTONES
              </div>
              <div className="p-6 bg-[#090D18] border border-[#141C2E] rounded-[4px]">
                <EventTimeline milestones={event.timelineMilestones} />
              </div>
            </div>
          )}

          {/* Prizes / Incentives Breakdown */}
          {event.prizePool?.breakdown && event.prizePool.breakdown.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
                // REWARDS & RECOGNITION
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {event.prizePool.breakdown.map((item, idx) => (
                  <div key={idx} className="p-4 bg-[#090D18] border border-[#162032] rounded-[3px] space-y-1">
                    <div className="text-[10px] text-[#50627A] uppercase">{item.rank}</div>
                    <div className="font-bold text-base text-[#F1F5F9]">{item.prize}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 text-xs">
          {/* Main Action Registration Card */}
          <div className="p-6 bg-[#090D18] border border-[#162238] rounded-[4px] space-y-4">
            <div className="text-[10px] text-[#50627A] uppercase tracking-wider">OFFICIAL PORTAL</div>
            <a
              href={sanitizeUrl(event.registrationUrl)}
              target="_blank"
              rel="noreferrer noopener"
              className="block w-full text-center py-3 bg-[#F1F5F9] hover:bg-[#FFFFFF] text-[#060810] font-bold text-xs rounded-[2px] transition-colors"
            >
              {event.status === 'completed' ? 'VIEW REGISTRATION FORM ↗' : 'REGISTER NOW ↗'}
            </a>
            <div className="text-[10px] text-center text-[#64748B]">
              Organized by {event.organizer.name}
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="p-6 bg-[#090D18] border border-[#162238] rounded-[4px] space-y-4">
            <div className="text-[10px] text-[#8092A8] uppercase tracking-wider font-bold">
              KEY SPECIFICATIONS
            </div>

            <div className="space-y-3 divide-y divide-[#141C2E]">
              <div className="pt-2">
                <div className="text-[#50627A] uppercase text-[10px]">DATE & TIME</div>
                <div className="text-[#F1F5F9] font-medium mt-0.5">{dateStr} at {timeStr}</div>
              </div>

              <div className="pt-2">
                <div className="text-[#50627A] uppercase text-[10px]">VENUE / FORMAT</div>
                <div className="text-[#F1F5F9] font-medium mt-0.5">{event.location}</div>
              </div>

              {isHackathon && (
                <div className="pt-2">
                  <div className="text-[#50627A] uppercase text-[10px]">TEAM FORMATION</div>
                  <div className="text-[#F1F5F9] font-medium mt-0.5">{event.teamSize.label}</div>
                </div>
              )}

              <div className="pt-2">
                <div className="text-[#50627A] uppercase text-[10px]">ELIGIBILITY</div>
                <div className="text-[#8092A8] mt-0.5 leading-relaxed">{event.eligibility}</div>
              </div>

              <div className="pt-2">
                <div className="text-[#50627A] uppercase text-[10px]">ENTRY FEE</div>
                <div className="text-[#10B981] font-bold mt-0.5">{event.entryFee}</div>
              </div>
            </div>
          </div>

          {/* Discord Community Box */}
          <div className="p-6 bg-[#090D18] border border-[#162238] rounded-[4px] space-y-2">
            <div className="font-bold text-[#F1F5F9]">Need Teammates or Help?</div>
            <p className="text-[#64748B] leading-relaxed">
              Join the GREViX Discord community to collaborate, form teams, and get help from mentors.
            </p>
            <a
              href="https://discord.gg/grevix"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block pt-1 text-[#60A5FA] hover:underline"
            >
              Join Discord Server →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
