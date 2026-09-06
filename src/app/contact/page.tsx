import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Contact & Inquiries | GREViX',
  description: 'Reach out to the GREViX core engineering team, partnership leads, and community organizers.',
};

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24 font-mono">
      <Container>
        <div className="max-w-4xl space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#60A5FA] bg-[#1E293B]/60 border border-[#3B82F6]/30 rounded-[2px]">
            <span>05 // OFFICIAL COMMS</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black text-[#F1F5F9] uppercase tracking-tight leading-[1.05]">
            CONNECT WITH<br />GREViX LEADERSHIP.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#8092A8] leading-relaxed max-w-3xl">
            Whether you want to sponsor a hackathon prize pool, conduct a joint systems workshop, or inquire about community induction, reach out through our official channels.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-xs">
          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-3">
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest">// DISCORD SERVER</div>
            <h3 className="font-display font-bold text-lg text-[#F1F5F9] uppercase">COMMUNITY & SUPPORT</h3>
            <p className="font-sans text-xs text-[#8092A8]">
              Instant access to core maintainers, announcements, and team formation channels.
            </p>
            <div className="pt-2">
              <a
                href="https://discord.gg/HMFaCYeYa"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#60A5FA] hover:underline"
              >
                discord.gg/grevix ↗
              </a>
            </div>
          </div>

          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-3">
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest">// GITHUB DEV</div>
            <h3 className="font-display font-bold text-lg text-[#F1F5F9] uppercase">CODE & RESEARCH</h3>
            <p className="font-sans text-xs text-[#8092A8]">
              File issues, inspect public pull requests, and contribute to community projects.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/Grevix"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#60A5FA] hover:underline"
              >
                github.com/Grevix ↗
              </a>
            </div>
          </div>

          <div className="p-6 bg-[#090D18] border border-[#162032] rounded-[4px] space-y-3">
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest">// LINKEDIN</div>
            <h3 className="font-display font-bold text-lg text-[#F1F5F9] uppercase">ORGANIZATION</h3>
            <p className="font-sans text-xs text-[#8092A8]">
              Official announcements, recruitment quiz updates, and partnership posts.
            </p>
            <div className="pt-2">
              <a
                href="https://in.linkedin.com/company/grevix-org"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#60A5FA] hover:underline"
              >
                linkedin.com/company/grevix-org ↗
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
