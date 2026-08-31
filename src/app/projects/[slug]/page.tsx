import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/data/projectsRepository';
import { GREVIX_PROJECTS } from '@/data/projectsData';

export const revalidate = 3600;

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  if (slugs && slugs.length > 0) {
    return slugs.map((slug) => ({ slug }));
  }
  return GREVIX_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    return {
      title: 'Project Not Found | GREViX',
    };
  }

  return {
    title: `${project.name} — ${project.tagline} | GREViX`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-12 md:py-16 bg-[#060810] min-h-screen">
      <Container>
        <ProjectDetail project={project} />
      </Container>
    </div>
  );
}
