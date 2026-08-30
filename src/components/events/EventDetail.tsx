'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';

interface EventDetailProps {
  event: Event;
}

export function EventDetail({ event }: EventDetailProps) {
  const [copied, setCopied] = useState(false);

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
  const isWorkshop = event.type === 'workshop';

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-10 font-mono">
      {/* Top Breadcrumb & Share */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#141C2E] text-xs text-[#8092A8]">
        <Link
          href={`/events?type=${event.type}`}
          className="text-[#8092A8] hover:text-[#FFFFFF] flex items-center gap-1.5 transition-colors"
        >
          <span>?</span>
          <span className="uppercase">BACK TO {event.type}S</span>
        </Link>
        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-[#8092A8] hover:text-[#FFFFFF] transition-colors"
          >
            {copied ? 'Link Copied ?' : 'Share Link'}
          </button>
          <span className="text-[#334155]">?</span>
          <span className="text-[#64748B]">GREViX COMMUNITY INITIATIVE</span>
          <span className="text-[#334155]">?</span>
          <span className={`px-2 py-0.5 rounded-[2px] font-bold text-[10px] ${
            event.status === 'ongoing' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' :
            event.status === 'upcoming' ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40' :
            'bg-[#1E293B] text-[#8092A8]'
          }`}>
            {event.status === 'ongoing' ? 'LIVE NOW' : event.status === 'upcoming' ? 'OPEN' : 'CONCLUDED'}
          </span>
        </div>
      </div>

      {/* Main Title Header */}
      <div className="space-y-4">
        <div className="text-xs text-[#60A5FA] uppercase tracking-wider font-semibold">
          // {event.type.toUpperCase()} ? {event.mode.toUpperCase()}
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#F1F5F9] uppercase tracking-tight leading-tight">
          {event.title}
        </h1>
        <p className="text-sm sm:text-base text-[#8092A8] leading-relaxed max-w-3xl font-sans">
          {event.tagline}
        </p>
        <div className="text-xs text-[#64748B] pt-1 flex items-center gap-3 flex-wrap">
          <span>Host: <span className="text-[#F1F5F9]">{event.organizer.name}</span></span>
          <span>?</span>
          <span>Venue: <span className="text-[#F1F5F9]">{event.location}</span></span>
        </div>
      </div>

      {/* 2-Column Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-[#141C2E]">
        {/* LEFT MAIN CONTENT (8 Cols) */}
        <div className="lg:col-span-8 space-y-8 text-xs">
          {/* Overview */}
          <div className="space-y-3">
            <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
              // 01. OVERVIEW & OBJECTIVE
            </div>
            <p className="text-sm text-[#CBD5E1] leading-relaxed font-sans whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Tracks / Topics */}
          <div className="space-y-3 pt-6 border-t border-[#141C2E]">
            <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
              // 02. FOCUS TRACKS & TECH STACK
            </div>
            <div className="flex flex-wrap gap-2">
              {event.tracks.map((track) => (
                <span
                  key={track}
                  className="px-3 py-1 bg-[#090D18] border border-[#182338] text-[#F1F5F9] rounded-[2px]"
                >
                  {track}
                </span>
              ))}
            </div>
            <div className="text-[#64748B] pt-1">
              Target Technologies: <span className="text-[#8092A8]">{event.skills.join(', ')}</span>
            </div>
          </div>

          {/* Schedule Milestones */}
          {event.timelineMilestones && event.timelineMilestones.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#141C2E]">
              <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
                // 03. EVENT SCHEDULE & TIMELINE
              </div>
              <div className="space-y-3 pl-4 border-l border-[#1E293B]">
                {event.timelineMilestones.map((m, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F1F5F9]">{m.date}</span>
                      <span className="text-[#50627A]">?</span>
                      <span className="text-[#60A5FA]">{m.title}</span>
                    </div>
                    <p className="text-[#64748B]">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prize Breakdown / Rewards */}
          {event.prizePool.breakdown && event.prizePool.breakdown.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-[#141C2E]">
              <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
                // 04. PRIZES & REWARDS
              </div>
              <div className="p-4 bg-[#090D18] border border-[#141C2E] rounded-[4px] space-y-2">
                {event.prizePool.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-[#141C2E] last:border-0">
                    <span className="text-[#8092A8]">{item.rank}</span>
                    <span className="text-[#F1F5F9] font-bold">{item.prize}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules / Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-[#141C2E]">
              <div className="text-xs text-[#8092A8] uppercase tracking-wider font-bold">
                // 05. PARTICIPATION GUIDELINES
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-[#8092A8]">
                {event.rules.map((rule, idx) => (
                  <li key={idx}><span className="text-[#CBD5E1]">{rule}</span></li>
                ))}
              </ul>
            </div>
          )}

          {/* Completed Podium Winners */}
          {event.winners && event.winners.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#141C2E]">
              <div className="text-xs text-[#10B981] uppercase tracking-wider font-bold">
                // 06. WINNERS PODIUM & PROJECT REPOSITORIES
              </div>
              <div className="space-y-3">
                {event.winners.map((winner, idx) => (
                  <div key={idx} className="p-4 bg-[#090D18] border border-[#182338] rounded-[4px] space-y-1.5">
                    <div className="flex items-center justify-between text-[#F59E0B] font-bold">
                      <span>?? {winner.rank}</span>
                      <span className="text-[#F1F5F9]">{winner.teamName}</span>
                    </div>
                    <div className="text-sm text-[#F1F5F9] font-sans font-semibold">{winner.projectTitle}</div>
                    <div className="text-[#64748B]">Members: {winner.members.join(', ')}</div>
                    {winner.repoUrl && (
                      <div className="pt-1">
                        <a
                          href={winner.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#60A5FA] hover:underline flex items-center gap-1"
                        >
                          <span>View Winning GitHub Repository</span>
                          <span>?</span>
                        </a>
                      </div>
                    )}
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
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-[#F1F5F9] hover:bg-[#FFFFFF] text-[#060810] font-bold text-xs rounded-[2px] transition-colors"
            >
              {event.status === 'completed' ? 'VIEW RESULTS ?' : 'REGISTER NOW ?'}
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
              rel="noreferrer"
              className="inline-block pt-1 text-[#60A5FA] hover:underline"
            >
              Join Discord Server ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
