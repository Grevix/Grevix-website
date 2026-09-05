import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Community & Induction | GREViX',
  description: 'Join the GREViX engineering collective. Learn about core member induction, weekly build sprints, and Discord channels.',
};

export default function CommunityPage() {
  return (
    <div className="py-16 md:py-24 font-mono">
      <Container>
        {/* Header Tag */}
        <div className="max-w-4xl space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#60A5FA] bg-[#1E293B]/60 border border-[#3B82F6]/30 rounded-[2px]">
            <span>02 // THE BUILDER NETWORK</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black text-[#F1F5F9] uppercase tracking-tight leading-[1.05]">
            JOIN GREViX.<br />BECOME A CORE BUILDER.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#8092A8] leading-relaxed max-w-3xl">
            We are looking for self-directed builders, systems programmers, AI researchers, and designers who care about software quality. Here is how you can participate and join our ranks.
          </p>
        </div>

        {/* 3 Step Induction Path */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-4">
            <div className="w-8 h-8 rounded-full border border-[#3B82F6] text-[#60A5FA] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-[#F1F5F9] uppercase">TEST YOUR SKILLS</h3>
            <p className="font-sans text-xs text-[#8092A8] leading-relaxed">
              Participate in our regular induction quizzes and technical speed tests covering AI/ML, DSA, systems architecture, and problem solving.
            </p>
            <Link
              href="/events?type=quiz"
              className="inline-block text-xs text-[#60A5FA] hover:underline"
            >
              Explore Quizzes ↗
            </Link>
          </div>

          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-4">
            <div className="w-8 h-8 rounded-full border border-[#3B82F6] text-[#60A5FA] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-[#F1F5F9] uppercase">SHIP AT HACKATHONS</h3>
            <p className="font-sans text-xs text-[#8092A8] leading-relaxed">
              Form a team and ship working production prototypes during our 48-hour sprints like Genesis Hack. Top builders earn lab fellowship invitations.
            </p>
            <Link
              href="/events?type=hackathon"
              className="inline-block text-xs text-[#60A5FA] hover:underline"
            >
              Explore Hackathons ↗
            </Link>
          </div>

          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-4">
            <div className="w-8 h-8 rounded-full border border-[#3B82F6] text-[#60A5FA] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-[#F1F5F9] uppercase">CORE INDUCTION</h3>
            <p className="font-sans text-xs text-[#8092A8] leading-relaxed">
              Qualify for Core Member privileges, gain repository push permissions, access compute grants, and mentor new engineering cohorts.
            </p>
            <span className="inline-block text-xs text-[#10B981]">
              Selective Admission
            </span>
          </div>
        </div>

        {/* Discord & GitHub Hub Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-4">
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest">// OFFICIAL DISCORD</div>
            <h3 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase">COMMUNITY HUB</h3>
            <p className="font-sans text-xs text-[#8092A8] leading-relaxed">
              Connect with 500+ student engineers, discover teammates for upcoming hackathons, ask questions, and collaborate on open-source repositories.
            </p>
            <div className="pt-2">
              <a
                href="https://discord.gg/grevix"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-[#FFFFFF] font-bold text-xs rounded-[2px] transition-colors"
              >
                Join Discord Server ↗
              </a>
            </div>
          </div>

          <div className="p-8 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-4">
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest">// GITHUB ORGANIZATION</div>
            <h3 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase">OPEN SOURCE REPOS</h3>
            <p className="font-sans text-xs text-[#8092A8] leading-relaxed">
              Inspect our production codebases, review winning hackathon repositories, fork starter templates, and submit pull requests.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/Grevix"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block px-5 py-2.5 border border-[#1E293B] hover:border-[#60A5FA] text-[#F1F5F9] font-bold text-xs rounded-[2px] transition-colors"
              >
                Explore GitHub Org ↗
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
