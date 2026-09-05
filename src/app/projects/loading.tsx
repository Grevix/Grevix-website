import React from 'react';
import { Container } from '@/components/layout/Container';

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#060810]">
      {/* Light Hero Skeleton */}
      <section className="bg-[#F4F5F7] pt-8 pb-20 md:pb-28">
        <Container>
          <div className="space-y-6 animate-pulse">
            <div className="h-4 w-28 bg-[#CBD5E1] rounded-[2px]" />
            <div className="h-16 w-3/4 max-w-xl bg-[#E2E8F0] rounded-[2px]" />
            <div className="h-5 w-1/2 max-w-md bg-[#CBD5E1] rounded-[2px]" />
          </div>
        </Container>
      </section>

      {/* Dark Body Skeleton */}
      <main className="flex-1 pt-10 pb-16 slanted-top-cut">
        <Container>
          <div className="p-8 bg-[#090D18] border border-[#162238] rounded-[4px] mb-12 animate-pulse space-y-4">
            <div className="h-4 w-32 bg-[#1E293B] rounded-[2px]" />
            <div className="h-8 w-64 bg-[#1E293B] rounded-[2px]" />
            <div className="h-12 w-full bg-[#1E293B]/50 rounded-[2px]" />
          </div>

          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-20 bg-[#080C16] border border-[#162032] rounded-[4px]" />
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}
