import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy | GREViX Community',
  description: 'GREViX student privacy policy and data governance practices.',
};

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24 font-mono text-xs">
      <Container>
        <div className="max-w-3xl space-y-8">
          <div>
            <div className="text-[10px] text-[#50627A] uppercase tracking-widest mb-2">// LEGAL & COMPLIANCE</div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#F1F5F9] uppercase tracking-tight">
              PRIVACY POLICY
            </h1>
            <p className="text-[#64748B] mt-2">Last updated: September 2026</p>
          </div>

          <div className="space-y-6 font-sans text-[#CBD5E1] leading-relaxed divide-y divide-[#162032]">
            <div className="space-y-2 pt-4">
              <h2 className="font-display font-bold text-lg text-[#F1F5F9] uppercase font-mono">1. Information We Collect</h2>
              <p>
                GREViX collects only minimal information necessary to coordinate hackathons, quizzes, and community membership. This may include your name, student email, GitHub username, and discord handle provided during event registrations or Google Forms.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="font-display font-bold text-lg text-[#F1F5F9] uppercase font-mono">2. How We Use Data</h2>
              <p>
                Your registration data is used exclusively to evaluate submissions, issue verified certificates of completion, and invite qualified candidates to GREViX core technical interviews. We never sell, rent, or trade student data.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="font-display font-bold text-lg text-[#F1F5F9] uppercase font-mono">3. Open Source Code & Submissions</h2>
              <p>
                Hackathon code submitted to GREViX remains the intellectual property of the authoring student builders, published under open-source licenses as agreed during team registration.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
