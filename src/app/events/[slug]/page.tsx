import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { EventDetail } from '@/components/events/EventDetail';
import { getEventBySlug } from '@/lib/data/eventsRepository';
import { MOCK_EVENTS } from '@/data/mockEvents';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return MOCK_EVENTS.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const event = await getEventBySlug(resolvedParams.slug);

  if (!event) {
    return {
      title: 'Event Not Found | GREViX',
    };
  }

  return {
    title: `${event.title} | GREViX Opportunity Archive`,
    description: event.tagline,
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const resolvedParams = await params;
  const event = await getEventBySlug(resolvedParams.slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="py-6">
      <Container>
        <EventDetail event={event} />
      </Container>
    </div>
  );
}
