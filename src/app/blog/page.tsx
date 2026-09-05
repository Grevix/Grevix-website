import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Engineering Blog & Dispatch | GREViX',
  description: 'Technical essays, hackathon post-mortems, and engineering dispatches from GREViX core members.',
};

export default function BlogPage() {
  const posts = [
    {
      date: 'AUG 28, 2026',
      readTime: '6 MIN READ',
      title: 'Building Zero-Copy WebAssembly Parsers with Rust & SIMD',
      summary: 'A deep dive into zero-copy memory buffers between JavaScript TypedArrays and WebAssembly linear memory without garbage collection pauses.',
      category: 'SYSTEMS',
    },
    {
      date: 'AUG 18, 2026',
      readTime: '4 MIN READ',
      title: 'GREViX Induction Quiz: Post-Mortem & Top Performer Highlights',
      summary: 'Analyzing the results of our August 2026 Recruitment Quiz across 250+ Graphic Era students, covering common problem solving pitfalls and solutions.',
      category: 'COMMUNITY',
    },
    {
      date: 'JUL 12, 2026',
      readTime: '8 MIN READ',
      title: 'Architecting Autonomous Multi-Agent Evaluator Loops for Code Generation',
      summary: 'How to build feedback loops where local LLMs evaluate test suites, generate git patches, and iteratively debug compiler errors.',
      category: 'AI RESEARCH',
    },
  ];

  return (
    <div className="py-16 md:py-24 font-mono">
      <Container>
        <div className="max-w-4xl space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#60A5FA] bg-[#1E293B]/60 border border-[#3B82F6]/30 rounded-[2px]">
            <span>04 // TECHNICAL DISPATCH</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black text-[#F1F5F9] uppercase tracking-tight leading-[1.05]">
            ENGINEERING LOGS<br />& POST-MORTEMS.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#8092A8] leading-relaxed max-w-3xl">
            In-depth architectural breakdowns, lessons from hackathons, and technical writeups authored by student builders.
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-6 max-w-4xl">
          {posts.map((post, idx) => (
            <article
              key={idx}
              className="p-6 sm:p-8 bg-[#090D18] border border-[#162032] hover:border-[#253556] rounded-[4px] space-y-3 transition-all"
            >
              <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                <span className="text-[#60A5FA] bg-[#1E293B] px-2 py-0.5 rounded-[2px]">{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F1F5F9] uppercase hover:text-[#60A5FA] transition-colors cursor-pointer">
                {post.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#8092A8] leading-relaxed">
                {post.summary}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
