export type ProjectCategory = 'all' | 'systems' | 'ai-research' | 'developer-tools' | 'quantitative';

export type ProjectStatus = 'production' | 'active-development' | 'research-lab';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface TechStackBreakdown {
  languages: string[];
  frameworks?: string[];
  libraries?: string[];
  tools?: string[];
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  whyItExists?: string;
  whatItDoes?: string;
  howItWorks?: HowItWorksStep[];
  techStackBreakdown?: TechStackBreakdown;
  category: ProjectCategory;
  categoryLabel: string;
  status: ProjectStatus;
  statusLabel: string;
  isMostRecent?: boolean;
  version?: string;
  language: string;
  technologies: string[];
  topics: string[];
  license: string;
  stars: number;
  forks: number;
  openIssues: number;
  githubUrl: string;
  docsUrl?: string;
  packageUrl?: string;
  packageType?: 'npm' | 'crates.io' | 'pypi';
  architectureHighlights: string[];
  keyFeatures: string[];
  metrics: ProjectMetric[];
  updatedAt: string;
}

export interface ProjectFilterState {
  category: ProjectCategory;
  search: string;
  sort: 'recent' | 'stars' | 'name';
}
