import React from 'react';
import { Container } from '@/components/layout/Container';
import { LoadingState } from '@/components/events/LoadingState';

export default function EventsLoading() {
  return (
    <div className="py-12">
      <Container>
        <div className="h-12 bg-[#101020] border border-[#203050] rounded-[3px] mb-6 animate-pulse"></div>
        <LoadingState />
      </Container>
    </div>
  );
}
