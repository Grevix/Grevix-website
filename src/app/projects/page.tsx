import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { ProjectsHero } from '@/components/projects/ProjectsHero';
import { FeaturedProject } from '@/components/projects/FeaturedProject';
import { ProjectArchive } from '@/components/projects/ProjectArchive';
import { ProjectCTA } from '@/components/projects/ProjectCTA';
import { getProjects } from '@/lib/data/projectsRepository';

export const revalidate = 3600; // Revalidate every 1 hour (ISR)

export const metadata: Metadata = {
  title: 'Projects & Systems | GREViX',
  description: 'Explore the open-source engineering systems, verification sandboxes, polyglot build tools, and quantitative engines built by GREViX builders.',
};

export default async function ProjectsPage() {
  const { projects } = await getProjects();
  const featuredProject = projects.find((p) => p.isMostRecent) || projects[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#060810]">
      {/* 1. TOP LIGHT EDITORIAL HERO SECTION */}
      <ProjectsHero />

      {/* 2. DARK SECTION WITH FEATURED SHOWCASE, ARCHIVE & CTA */}
      <main className="flex-1 pt-6 md:pt-10 pb-16 slanted-top-cut">
        <Container>
          {/* Featured / Most Recent Project */}
          {featuredProject && <FeaturedProject project={featuredProject} />}

          {/* Numbered Editorial Archive with Category Filtering */}
          <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-[#5A6475]">Loading repositories...</div>}>
            <ProjectArchive initialProjects={projects} />
          </Suspense>

          {/* Community Call to Action */}
          <ProjectCTA />
        </Container>
      </main>
    </div>
  );
}
