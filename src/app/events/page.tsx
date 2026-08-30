import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { EventsHero } from '@/components/events/EventsHero';
import { EventsExplorer } from '@/components/events/EventsExplorer';
import { MOCK_EVENTS } from '@/data/mockEvents';

export const metadata: Metadata = {
  title: 'Opportunities & Hackathons | GREViX',
  description: 'From solving real world problems to building open source tools, explore the hackathons, quizzes and workshops we are competing in and curating.',
};

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#060810]">
      {/* 1. TOP WHITE EDITORIAL HERO SECTION */}
      <EventsHero />

      {/* 2. DARK SECTION WITH FEATURED CARD & NUMBERED ROWS */}
      <main className="flex-1 pt-6 md:pt-10 pb-16 slanted-top-cut">
        <Container>
          <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-[#50627A]">Loading opportunities...</div>}>
            <EventsExplorer initialEvents={MOCK_EVENTS} />
          </Suspense>
        </Container>
      </main>
    </div>
  );
}
