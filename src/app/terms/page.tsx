import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Terms of Participation & Code of Conduct | GREViX',
  description: 'Community code of conduct, competition rules, and terms of participation for GREViX initiatives.',
};

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24 font-mono text-xs">
      <Container>
        <div className="max-w-3xl space-y-8">
          <div>
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest mb-2">// COMMUNITY CHARTER</div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#F1F5F9] uppercase tracking-tight">
              TERMS & CODE OF CONDUCT
            </h1>
            <p className="text-[#64748B] mt-2">Effective: Fall 2026</p>
          </div>

          <div className="space-y-6 font-sans text-[#CBD5E1] leading-relaxed divide-y divide-[#162032]">
            <div className="space-y-2 pt-4">
              <h2 className="font-display font-bold text-lg text-[#F1F5F9] uppercase font-mono">1. Code of Conduct</h2>
              <p>
                GREViX is committed to a harassment-free and merit-driven environment for all developers, researchers, and students regardless of background. All members agree to collaborate respectfully, give constructive feedback, and act with integrity.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="font-display font-bold text-lg text-[#F1F5F9] uppercase font-mono">2. Competition Fair Play</h2>
              <p>
                In all hackathons, quizzes, and coding sprints, participants must author all project code during the sanctioned hacking window. Pre-built software or automated plagiarized code will result in immediate disqualification and revocation of certificates.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="font-display font-bold text-lg text-[#F1F5F9] uppercase font-mono">3. Open Source Attribution</h2>
              <p>
                Builders must respect open-source licenses and provide clear attribution for any third-party libraries, datasets, or foundation models utilized in project submissions.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
