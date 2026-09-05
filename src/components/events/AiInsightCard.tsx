'use client';

import React, { useState } from 'react';
import { Event } from '@/types/event';
import { EventAiAnalysis } from '@/types/ai';
import { calculateOpportunityMatch } from '@/lib/ai/aiClient';

interface AiInsightCardProps {
  event: Event;
  initialAnalysis?: EventAiAnalysis;
}

export function AiInsightCard({ event, initialAnalysis }: AiInsightCardProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const availableSkills = ['Python', 'TypeScript', 'Rust', 'Solidity', 'C++', 'Next.js', 'PyTorch', 'DSA'];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const match = calculateOpportunityMatch(event, {
    skills: selectedSkills,
    interests: event.tracks,
    preferredMode: event.mode,
  });

  const analysis: EventAiAnalysis = initialAnalysis || {
    executiveSummary: `${event.title} is a ${event.mode} ${event.type} organized by ${event.organizer.name}. Focuses on practical implementation across ${event.tracks.join(', ')}.`,
    difficultyLevel: event.tracks.some((t) => /systems|rust|zk|security/i.test(t)) ? 'Advanced Systems' : 'Intermediate',
    recommendedTeamRoles: event.teamSize.max > 1 ? ['Core Systems Engineer', 'Frontend / UI Developer', 'Domain Researcher'] : ['Solo Builder'],
    suggestedProjectAngles: [
      `Production prototype solving practical bottlenecks in ${event.tracks[0] || 'software architecture'}.`,
      'Open-source tool with verified benchmarks and live demo deployment.'
    ],
    estimatedPreparationTime: '3-5 days',
    isGeneratedByAi: false,
    modelUsed: 'grevix-synthesis-engine',
    generatedAt: new Date().toISOString(),
  };

  return (
    <section className="pt-8 mt-8 border-t border-[#1E2330] space-y-6" aria-labelledby="ai-advisor-heading">
      <div>
        <div className="font-mono text-xs text-[#8D98A8] tracking-widest uppercase mb-1" id="ai-advisor-heading">
          TECHNICAL SYNTHESIS & ADVISOR
        </div>
        <p className="text-xs text-[#5A6475]">
          Computed analysis to assist in project planning. Factual rules and deadlines above remain the official source of truth.
        </p>
      </div>

      <div className="space-y-6 text-xs">
        {/* Executive Takeaway */}
        <div>
          <div className="font-mono text-[10px] text-[#5A6475] uppercase tracking-wider mb-1">
            Executive Synthesis
          </div>
          <p className="text-sm text-[#F4F5F6] leading-relaxed font-sans">
            {analysis.executiveSummary}
          </p>
        </div>

        {/* Complexity & Prep */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-[#1E2330]">
          <div>
            <div className="text-[#5A6475] uppercase text-[10px] font-mono">Estimated Complexity</div>
            <div className="text-[#F4F5F6] font-medium text-sm mt-0.5">{analysis.difficultyLevel}</div>
          </div>
          <div>
            <div className="text-[#5A6475] uppercase text-[10px] font-mono">Recommended Prep</div>
            <div className="text-[#F4F5F6] font-medium text-sm mt-0.5">{analysis.estimatedPreparationTime}</div>
          </div>
        </div>

        {/* Suggested Angles */}
        <div>
          <div className="text-[#5A6475] uppercase text-[10px] font-mono mb-2">Suggested Project Architectures</div>
          <ul className="space-y-1.5 list-disc list-inside text-[#8D98A8]">
            {analysis.suggestedProjectAngles.map((angle, i) => (
              <li key={i}><span className="text-[#F4F5F6]">{angle}</span></li>
            ))}
          </ul>
        </div>

        {/* Real-time Fit Calculator */}
        <div className="p-4 bg-[#0B0D14] border border-[#1E2330] rounded-[2px] space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[11px] text-[#F4F5F6] uppercase tracking-wider font-semibold">
              Calculate Your Match Fit
            </div>
            <div className="text-sm font-bold text-[#6F9FFF]">{match.matchScore}% Match</div>
          </div>

          <p className="text-xs text-[#8D98A8]">
            Select your skills to test compatibility with this challenge:
          </p>

          <div className="flex flex-wrap gap-1.5">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-2.5 py-1 text-xs rounded-[2px] transition-colors ${
                    isSelected
                      ? 'bg-[#F4F5F6] text-[#050609] font-medium'
                      : 'border border-[#1E2330] text-[#8D98A8] hover:text-[#F4F5F6]'
                  }`}
                >
                  {isSelected ? `? ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-[#8D98A8] pt-1">
            {match.relevanceExplanation}
          </div>
        </div>
      </div>
    </section>
  );
}
