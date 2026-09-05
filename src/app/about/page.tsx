import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'About GREViX — Engineering, Culture & Principles',
  description: 'GREViX is a student-driven technology, research, and open-source collective dedicated to building production systems.',
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 font-mono">
      <Container>
        {/* Header Tag */}
        <div className="max-w-4xl space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#60A5FA] bg-[#1E293B]/60 border border-[#3B82F6]/30 rounded-[2px]">
            <span>01 // MISSION & CHARTER</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black text-[#F1F5F9] uppercase tracking-tight leading-[1.05]">
            BUILT WITH PURPOSE.<br />DRIVEN BY STUDENTS.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#8092A8] leading-relaxed max-w-3xl">
            GREViX is a student-founded technology collective and engineering laboratory. We do not build classroom toy projects or compile passive tutorials; we build production systems, compete in intense technical hackathons, conduct algorithmic research, and cultivate an uncompromising culture of craft.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-3">
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest">// PILLAR 01</div>
            <h3 className="font-display font-bold text-xl text-[#F1F5F9] uppercase">SYSTEMS & ARCHITECTURE</h3>
            <p className="font-sans text-xs text-[#8092A8] leading-relaxed">
              Deep focus on low-level performance, Rust, WebAssembly, distributed consensus, and developer tooling that operates at the edge.
            </p>
          </div>

          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-3">
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest">// PILLAR 02</div>
            <h3 className="font-display font-bold text-xl text-[#F1F5F9] uppercase">AUTONOMOUS AI RESEARCH</h3>
            <p className="font-sans text-xs text-[#8092A8] leading-relaxed">
              Building multi-modal agent workflows, local model fine-tuning, retrieval-augmented pipelines, and practical machine learning applications.
            </p>
          </div>

          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-3">
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest">// PILLAR 03</div>
            <h3 className="font-display font-bold text-xl text-[#F1F5F9] uppercase">OPEN-SOURCE INTEGRITY</h3>
            <p className="font-sans text-xs text-[#8092A8] leading-relaxed">
              Every tool, engine, and challenge project is published under permissive open-source licenses to enrich the broader developer ecosystem.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="p-8 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-6 mb-16">
          <div className="text-xs text-[#60A5FA] uppercase tracking-wider font-bold">
            // OUR ETHOS: THE FEW WHO BUILD WHAT’S NEXT
          </div>
          <div className="space-y-4 font-sans text-sm text-[#CBD5E1] leading-relaxed max-w-4xl">
            <p>
              GREViX was established by engineering students who felt modern curricula focused too heavily on theoretical memorization rather than shipping software to real users. We started by organizing sprint hackathons and weekend build marathons inside university dorm rooms.
            </p>
            <p>
              Today, GREViX hosts annual hackathons like <span className="text-[#F1F5F9] font-bold">Genesis Hack</span>, high-tempo quizzes in algorithmic problem solving and AI/ML, and hands-on workshops that produce production-ready code.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-4 text-xs font-mono">
            <Link
              href="/events"
              className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#FFFFFF] text-[#060810] font-bold rounded-[2px] transition-colors"
            >
              Explore Our Events ↗
            </Link>
            <Link
              href="/community"
              className="px-5 py-2.5 border border-[#1E293B] hover:border-[#60A5FA] text-[#F1F5F9] rounded-[2px] transition-colors"
            >
              Join the Community →
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
