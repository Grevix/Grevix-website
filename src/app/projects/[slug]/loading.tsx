import React from 'react';
import { Container } from '@/components/layout/Container';

export default function ProjectDetailLoading() {
  return (
    <div className="py-12 md:py-16 bg-[#060810] min-h-screen">
      <Container>
        <div className="space-y-8 max-w-5xl mx-auto animate-pulse">
          <div className="h-4 w-32 bg-[#1E293B] rounded-[2px]" />
          <div className="h-12 w-3/4 max-w-lg bg-[#1E293B] rounded-[2px]" />
          <div className="h-6 w-full max-w-2xl bg-[#1E293B]/60 rounded-[2px]" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 border-y border-[#162032]">
            <div className="h-32 bg-[#090D18] rounded-[2px]" />
            <div className="h-32 bg-[#090D18] rounded-[2px]" />
          </div>
        </div>
      </Container>
    </div>
  );
}
