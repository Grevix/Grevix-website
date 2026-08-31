import { Project, ProjectCategory, ProjectStatus } from '@/types/project';
import { GREVIX_PROJECTS } from '@/data/projectsData';

export interface GitHubRepoDto {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics?: string[];
  license?: {
    key: string;
    name: string;
    spdx_id: string | null;
    url: string | null;
  } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  disabled: boolean;
  visibility?: string;
}

export interface ProjectsResult {
  projects: Project[];
  isFromGitHub: boolean;
  lastSyncedAt: string;
  error?: string;
}

// Repositories excluded by default from the showcase (infrastructure / internal)
const EXCLUDED_REPOSITORIES = new Set(['.github', 'website']);

/**
 * Infer a project category from GitHub topics and language metadata
 */
function inferCategory(topics: string[] = [], language: string | null = ''): { category: ProjectCategory; categoryLabel: string } {
  const t = topics.map((s) => s.toLowerCase());
  const lang = (language || '').toLowerCase();

  if (t.some((tag) => ['quant', 'quantitative', 'finance', 'derivatives', 'black-scholes', 'ssvi'].includes(tag))) {
    return { category: 'quantitative', categoryLabel: 'Quantitative Systems' };
  }

  if (t.some((tag) => ['ai', 'ai-agents', 'llm', 'inference-engine', 'llm-verification', 'sandbox', 'autonomous-agents'].includes(tag))) {
    return { category: 'ai-research', categoryLabel: 'AI & Research' };
  }

  if (t.some((tag) => ['build-system', 'systems-programming', 'monorepo', 'reproducible-builds', 'supply-chain-security'].includes(tag))) {
    return { category: 'systems', categoryLabel: 'Systems & Tooling' };
  }

  if (t.some((tag) => ['cli', 'developer-tools', 'dependency-migration', 'validation', 'monorepo'].includes(tag))) {
    return { category: 'developer-tools', categoryLabel: 'Developer Tools' };
  }

  if (lang === 'rust' || lang === 'c++' || lang === 'c' || lang === 'go') {
    return { category: 'systems', categoryLabel: 'Systems & Tooling' };
  }

  return { category: 'developer-tools', categoryLabel: 'Developer Tools' };
}

/**
 * Infer package registry URL and type from GitHub homepage link or known packages
 */
function inferPackageRegistry(homepage: string | null, repoName: string): { packageUrl?: string; packageType?: 'npm' | 'crates.io' | 'pypi' } {
  if (!homepage) {
    const lower = repoName.toLowerCase();
    if (lower === 'rivox') return { packageUrl: 'https://crates.io/crates/rivox', packageType: 'crates.io' };
    if (lower === 'berryn') return { packageUrl: 'https://www.npmjs.com/package/berryn', packageType: 'npm' };
    if (lower === 'kuwala') return { packageUrl: 'https://pypi.org/project/kuwala/', packageType: 'pypi' };
    return {};
  }

  if (homepage.includes('npmjs.com')) {
    return { packageUrl: homepage, packageType: 'npm' };
  }
  if (homepage.includes('crates.io')) {
    return { packageUrl: homepage, packageType: 'crates.io' };
  }
  if (homepage.includes('pypi.org')) {
    return { packageUrl: homepage, packageType: 'pypi' };
  }

  return {};
}

/**
 * Normalizes a raw GitHub repository API object into a strongly-typed GREViX Project.
 * Merges with curated architectural knowledge when available.
 */
export function normalizeGitHubRepo(repo: GitHubRepoDto, curatedFallback?: Project): Project {
  const nameFormatted = repo.name.toUpperCase();
  const slug = repo.name.toLowerCase();
  const topics = repo.topics || [];
  const { category, categoryLabel } = curatedFallback
    ? { category: curatedFallback.category, categoryLabel: curatedFallback.categoryLabel }
    : inferCategory(topics, repo.language);

  const { packageUrl, packageType } = inferPackageRegistry(repo.homepage, repo.name);

  // License formatting
  let license = 'Open Source';
  if (repo.license) {
    license = repo.license.spdx_id && repo.license.spdx_id !== 'NOASSERTION'
      ? repo.license.spdx_id
      : repo.license.name || 'Open Source';
  } else if (curatedFallback?.license) {
    license = curatedFallback.license;
  }

  const technologies = Array.from(
    new Set([
      ...(repo.language ? [repo.language] : []),
      ...topics.slice(0, 5),
      ...(curatedFallback ? curatedFallback.technologies : []),
    ])
  );

  const dateToUse = repo.pushed_at || repo.updated_at;
  const updatedDateStr = dateToUse
    ? new Date(dateToUse).toISOString().split('T')[0]
    : curatedFallback?.updatedAt || '2026-08';

  const status: ProjectStatus = curatedFallback?.status || (packageUrl ? 'production' : 'active-development');
  const statusLabel: string = curatedFallback?.statusLabel || (packageUrl ? 'Production' : 'Active Development');

  return {
    id: `gh-${repo.id}`,
    name: nameFormatted,
    slug,
    tagline: repo.description || curatedFallback?.tagline || `Open source ${categoryLabel.toLowerCase()} project by GREViX.`,
    shortDescription: repo.description || curatedFallback?.shortDescription || `Open source ${categoryLabel.toLowerCase()} repository.`,
    longDescription: curatedFallback?.longDescription || repo.description || 'Open source engineering project built by the GREViX student community.',
    whyItExists: curatedFallback?.whyItExists,
    whatItDoes: curatedFallback?.whatItDoes || repo.description || undefined,
    howItWorks: curatedFallback?.howItWorks,
    techStackBreakdown: curatedFallback?.techStackBreakdown,
    category,
    categoryLabel,
    status,
    statusLabel,
    version: curatedFallback?.version,
    language: repo.language || curatedFallback?.language || 'Polyglot',
    technologies,
    topics,
    license,
    stars: repo.stargazers_count ?? curatedFallback?.stars ?? 0,
    forks: repo.forks_count ?? curatedFallback?.forks ?? 0,
    openIssues: repo.open_issues_count ?? curatedFallback?.openIssues ?? 0,
    githubUrl: repo.html_url,
    docsUrl: curatedFallback?.docsUrl,
    packageUrl: packageUrl || curatedFallback?.packageUrl,
    packageType: packageType || curatedFallback?.packageType,
    architectureHighlights: curatedFallback?.architectureHighlights || [
      `Official GREViX repository maintaining ${repo.language || 'polyglot'} systems codebase`,
      'Open-source public repository with community code reviews and issue tracking',
      `Actively maintained on GitHub with ${repo.stargazers_count || 0} stars`,
    ],
    keyFeatures: curatedFallback?.keyFeatures || [
      'Open-source architecture',
      'Local-first design',
      'Deterministic builds',
    ],
    metrics: [
      { label: 'Stars', value: `${repo.stargazers_count ?? 0}` },
      { label: 'Language', value: repo.language || 'Polyglot' },
      { label: 'License', value: license },
    ],
    updatedAt: updatedDateStr,
  };
}

/**
 * Server-Side Data Access Layer for GREViX Projects.
 * Fetches dynamic public repository metadata from GitHub with revalidation caching.
 * Falls back to verified local seed data on network failure or rate limits.
 */
export async function getProjects(): Promise<ProjectsResult> {
  const org = 'Grevix';
  const url = `https://api.github.com/orgs/${org}/repos?per_page=100&type=public&sort=pushed`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GREViX-Platform/1.0',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      next: {
        revalidate: 3600, // Revalidate cache every 1 hour (ISR)
        tags: ['github-repos', 'projects'],
      },
    });

    if (!res.ok) {
      const errorText = `GitHub API returned HTTP ${res.status}`;
      console.warn(`[ProjectsRepository] ${errorText}. Falling back to local data.`);
      return {
        projects: GREVIX_PROJECTS,
        isFromGitHub: false,
        lastSyncedAt: new Date().toISOString(),
        error: errorText,
      };
    }

    const rawRepos: GitHubRepoDto[] = await res.json();

    if (!Array.isArray(rawRepos) || rawRepos.length === 0) {
      return {
        projects: GREVIX_PROJECTS,
        isFromGitHub: false,
        lastSyncedAt: new Date().toISOString(),
      };
    }

    // Filter out infrastructure repositories and forks
    const showcaseRepos = rawRepos.filter(
      (repo) => !EXCLUDED_REPOSITORIES.has(repo.name.toLowerCase()) && !repo.fork && !repo.archived
    );

    // Map and normalize each repository
    const projects: Project[] = showcaseRepos.map((repo) => {
      const curated = GREVIX_PROJECTS.find(
        (p) => p.slug.toLowerCase() === repo.name.toLowerCase()
      );
      return normalizeGitHubRepo(repo, curated);
    });

    // Sort by latest pushed_at / updated_at date descending
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Flag the most recent project
    if (projects.length > 0) {
      projects.forEach((p, idx) => {
        p.isMostRecent = idx === 0;
      });
    }

    return {
      projects: projects.length > 0 ? projects : GREVIX_PROJECTS,
      isFromGitHub: true,
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn('[ProjectsRepository] Network error fetching GitHub repos:', err?.message || err);
    return {
      projects: GREVIX_PROJECTS,
      isFromGitHub: false,
      lastSyncedAt: new Date().toISOString(),
      error: err?.message || 'Network error',
    };
  }
}

/**
 * Fetch a single project by its slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const normalizedSlug = slug.toLowerCase();
  const { projects } = await getProjects();
  const match = projects.find((p) => p.slug.toLowerCase() === normalizedSlug);

  if (match) return match;

  // Fallback to local data
  const fallbackMatch = GREVIX_PROJECTS.find((p) => p.slug.toLowerCase() === normalizedSlug);
  return fallbackMatch || null;
}

/**
 * Get all available project slugs for static pre-rendering
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const { projects } = await getProjects();
  return projects.map((p) => p.slug);
}
