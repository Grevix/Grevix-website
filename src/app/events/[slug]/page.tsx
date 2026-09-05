import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { EventDetail } from '@/components/events/EventDetail';
import { DynamicEventViewer } from '@/components/events/DynamicEventViewer';
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
      title: 'Event Archive | GREViX',
    };
  }

  return {
    title: `${event.title} | GREViX`,
    description: event.tagline,
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const resolvedParams = await params;
  const event = await getEventBySlug(resolvedParams.slug);

  return (
    <div className="py-6">
      <Container>
        {event ? (
          <EventDetail event={event} />
        ) : (
          <DynamicEventViewer slug={resolvedParams.slug} />
        )}
      </Container>
    </div>
  );
}
