import { Event } from '../types/event';

/**
 * GREViX STATIC MOCK DATASET
 * NOTE: These entries represent structured sample scenarios for UI demonstration and development testing.
 * All entries are flagged with isMockData: true to maintain transparency.
 */
export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-001',
    slug: 'google-cloud-genai-sprint',
    title: 'Google Cloud GenAI Sprint 2026',
    tagline: 'Build next-generation multi-modal AI agents using Gemini 2.0 and Cloud Run.',
    description: 'A global 48-hour online hackathon challenging student developers to build production-grade agentic workflows, multi-modal applications, and retrieval-augmented systems using the latest Gemini APIs and Google Cloud architecture.',
    type: 'hackathon',
    status: 'upcoming',
    mode: 'online',
    location: 'Online (Global)',
    organizer: {
      name: 'Google Developers & GREViX',
      verified: true,
      website: 'https://cloud.google.com'
    },
    registrationUrl: 'https://devpost.com/hackathons',
    sourceUrl: 'https://devpost.com',
    sourceType: 'devpost',
    lastSyncedAt: '2026-08-30T18:30:00Z',
    startDate: '2026-09-12T00:00:00Z',
    endDate: '2026-09-14T23:59:00Z',
    registrationDeadline: '2026-09-10T23:59:00Z',
    isClosingSoon: false,
    prizePool: {
      totalValue: '$50,000 + Credits',
      currency: 'USD',
      breakdown: [
        { rank: '1st Place (Grand Prize)', prize: '$20,000 Cash + $10,000 GCP Credits' },
        { rank: '2nd Place', prize: '$10,000 Cash + $5,000 GCP Credits' },
        { rank: 'Best Student Hack', prize: '$5,000 Cash + Mentorship' }
      ]
    },
    tracks: ['Gemini API', 'Multi-Modal Agents', 'Cloud Run', 'Vector DB'],
    skills: ['Python', 'TypeScript', 'Next.js', 'PyTorch'],
    eligibility: 'Undergraduate, Postgraduate, and High School Students worldwide (18+)',
    teamSize: { min: 1, max: 4, label: '1 - 4 Members' },
    entryFee: '100% Free',
    timelineMilestones: [
      { date: 'Aug 15, 2026', title: 'Registrations Open', description: 'Early registration and team formation begins.', completed: true },
      { date: 'Sep 10, 2026', title: 'Registration Deadline', description: 'Portal closes for new submissions at 23:59 UTC.', completed: false },
      { date: 'Sep 12, 2026', title: 'Hacking Kickoff', description: 'Keynote livestream and problem statement release.', completed: false },
      { date: 'Sep 14, 2026', title: 'Project Submissions', description: 'Code repositories and demo videos due on Devpost.', completed: false },
      { date: 'Sep 18, 2026', title: 'Winners Announced', description: 'Live closing ceremony with panel judges.', completed: false }
    ],
    rules: [
      'All source code must be written during the 48-hour hacking window.',
      'Projects must utilize at least one Google Cloud or Gemini API endpoint.',
      'Public GitHub repository with an open-source license is required.'
    ],
    isMockData: true
  },
  {
    id: 'evt-002',
    slug: 'ethglobal-san-francisco-2026',
    title: 'EthGlobal San Francisco 2026',
    tagline: '36-hour in-person hackathon building on Ethereum, ZK-Rollups, and Account Abstraction.',
    description: 'Join over 1,500 Web3 developers, researchers, and students in San Francisco to construct censorship-resistant protocols, zero-knowledge proofs, decentralized identity systems, and modern smart contract infrastructure.',
    type: 'hackathon',
    status: 'ongoing',
    mode: 'offline',
    location: 'San Francisco, CA (USA)',
    organizer: {
      name: 'EthGlobal',
      verified: true,
      website: 'https://ethglobal.com'
    },
    registrationUrl: 'https://ethglobal.com/events/sf2026',
    sourceUrl: 'https://ethglobal.com',
    sourceType: 'verified_admin',
    lastSyncedAt: '2026-08-30T19:45:00Z',
    startDate: '2026-08-29T18:00:00Z',
    endDate: '2026-08-31T14:00:00Z',
    registrationDeadline: '2026-08-28T23:59:00Z',
    isClosingSoon: true,
    prizePool: {
      totalValue: '$150,000 Total Pool',
      currency: 'USD',
      breakdown: [
        { rank: 'Finalist Pool (10 Teams)', prize: '$50,000 Split Equally' },
        { rank: 'Best ZK Application', prize: '$25,000 Sponsor Bounty' },
        { rank: 'Best Account Abstraction UX', prize: '$25,000 Sponsor Bounty' }
      ]
    },
    tracks: ['Solidity', 'ZK-Proofs', 'Account Abstraction', 'DeFi & Privacy'],
    skills: ['Rust', 'Solidity', 'Foundry', 'TypeScript'],
    eligibility: 'Open to all approved in-person applicants and student cohorts',
    teamSize: { min: 1, max: 4, label: '1 - 4 Members' },
    entryFee: 'Free (Application & Staking required)',
    timelineMilestones: [
      { date: 'Aug 29, 18:00 PST', title: 'Hacking Initiated', description: 'Opening ceremony and team registration confirmation.', completed: true },
      { date: 'Aug 30, 12:00 PST', title: 'Checkpoint Mentorship', description: 'Technical mentor reviews and smart contract audits.', completed: true },
      { date: 'Aug 31, 09:00 PST', title: 'Hard Submission Cutoff', description: 'GitHub repos and testnet contract addresses locked.', completed: false },
      { date: 'Aug 31, 14:00 PST', title: 'Live Stage Presentations', description: 'Top 10 finalists present live on stage.', completed: false }
    ],
    rules: [
      'Smart contracts must be deployed to an Ethereum testnet (Sepolia/Holesky).',
      'No pre-written proprietary contract logic allowed.'
    ],
    isMockData: true
  },
  {
    id: 'evt-003',
    slug: 'grevix-algo-sprint-04',
    title: 'GREViX Algorithmic Sprint #04',
    tagline: 'High-speed speed-coding contest covering Dynamic Programming and Graph Algorithms.',
    description: 'Weekly student algorithmic competition hosted directly on the GREViX testing portal. Test your problem-solving speed under tight execution constraints. Top performers earn rank badges and recommendations for project leadership.',
    type: 'quiz',
    status: 'upcoming',
    mode: 'online',
    location: 'Online (GREViX Platform)',
    organizer: {
      name: 'GREViX Core Team',
      verified: true,
      website: 'https://grevix.org'
    },
    registrationUrl: 'https://grevix.org/events/register/algo-04',
    sourceType: 'verified_admin',
    lastSyncedAt: '2026-08-30T20:00:00Z',
    startDate: '2026-09-02T18:00:00Z',
    endDate: '2026-09-02T19:30:00Z',
    registrationDeadline: '2026-09-02T17:30:00Z',
    isClosingSoon: true,
    prizePool: {
      totalValue: 'Merit Certs & Badges',
      currency: 'INR',
      breakdown: [
        { rank: 'Top 3 Performers', prize: 'GREViX Gold Badge + Project Lead Fast-Track' },
        { rank: 'Top 10 Percentile', prize: 'Certificate of Merit & DSA Role Tag' }
      ]
    },
    tracks: ['Data Structures', 'Algorithms', 'Speed Coding'],
    skills: ['C++', 'Java', 'Python', 'Algorithms'],
    eligibility: 'All GREViX Community Members & Enrolled Engineering Students',
    teamSize: { min: 1, max: 1, label: 'Solo Participation' },
    entryFee: '100% Free',
    timelineMilestones: [
      { date: 'Sep 02, 17:30 IST', title: 'Portal Check-in', description: 'Registered participants receive test access keys.', completed: false },
      { date: 'Sep 02, 18:00 IST', title: 'Contest Begins', description: '4 algorithmic questions release simultaneously.', completed: false },
      { date: 'Sep 02, 19:30 IST', title: 'Leaderboard Locked', description: 'Automated test suite validates runtime and memory limits.', completed: false }
    ],
    rules: [
      'Strict anti-plagiarism automated similarity checks applied across all submissions.',
      'Allowed languages: C++20, Java 17, Python 3.12, Rust 1.80.'
    ],
    isMockData: true
  },
  {
    id: 'evt-004',
    slug: 'systems-architecture-rust-wasm-workshop',
    title: 'Systems Engineering: Rust & WebAssembly Workshop',
    tagline: 'Deep-dive masterclass on compiling low-latency Rust kernels to browser WASM runtimes.',
    description: 'A 3-hour hands-on technical workshop taught by systems engineers. Learn memory management primitives, SIMD acceleration in WebAssembly, and building high-performance browser engines with zero-overhead tooling.',
    type: 'workshop',
    status: 'upcoming',
    mode: 'online',
    location: 'Online (Live Stream + GitHub Codespaces)',
    organizer: {
      name: 'GREViX Systems Lab',
      verified: true
    },
    registrationUrl: 'https://grevix.org/workshops/rust-wasm',
    sourceType: 'verified_admin',
    lastSyncedAt: '2026-08-30T17:00:00Z',
    startDate: '2026-09-08T14:00:00Z',
    endDate: '2026-09-08T17:00:00Z',
    registrationDeadline: '2026-09-07T23:59:00Z',
    isClosingSoon: false,
    prizePool: {
      totalValue: 'Interactive Lab Access & Certs',
      currency: 'N/A'
    },
    tracks: ['Systems', 'Rust', 'WebAssembly', 'Performance'],
    skills: ['Rust', 'WASM', 'Memory Architecture', 'C/C++'],
    eligibility: 'Intermediate developers with basic C, C++, or Rust knowledge',
    teamSize: { min: 1, max: 1, label: 'Individual Workshop' },
    entryFee: '100% Free',
    isMockData: true
  },
  {
    id: 'evt-005',
    slug: 'smart-india-hackathon-2026',
    title: 'Smart India Hackathon 2026 (SIH)',
    tagline: 'Nationwide innovation marathon solving pressing technological challenges across government ministries.',
    description: 'India?s premier student hackathon initiative organized by MoE and AICTE. Teams design real-world software and hardware prototypes for ministries such as Healthcare, Smart Governance, Clean Energy, and Disaster Response.',
    type: 'competition',
    status: 'upcoming',
    mode: 'hybrid',
    location: 'Hybrid (Nodal Centers Across India)',
    organizer: {
      name: 'Ministry of Education & AICTE',
      verified: true,
      website: 'https://sih.gov.in'
    },
    registrationUrl: 'https://sih.gov.in',
    sourceUrl: 'https://sih.gov.in',
    sourceType: 'unstop',
    lastSyncedAt: '2026-08-30T15:00:00Z',
    startDate: '2026-10-15T09:00:00Z',
    endDate: '2026-10-17T18:00:00Z',
    registrationDeadline: '2026-09-25T23:59:00Z',
    isClosingSoon: false,
    prizePool: {
      totalValue: '?1,00,000 Per Statement',
      currency: 'INR',
      breakdown: [
        { rank: '1st Prize (Per Statement)', prize: '?1,00,000 Cash' },
        { rank: 'Ministry Incubation Grant', prize: 'Up to ?5,00,000 Startup Support' }
      ]
    },
    tracks: ['Smart Governance', 'Healthcare IoT', 'AgriTech', 'Cyber Security'],
    skills: ['Fullstack', 'IoT', 'AI/ML', 'Mobile Apps'],
    eligibility: 'Enrolled Indian College Students in teams of 6 with mandatory female member representation',
    teamSize: { min: 6, max: 6, label: 'Strict 6 Members' },
    entryFee: '100% Free',
    isMockData: true
  },
  {
    id: 'evt-006',
    slug: 'hackmit-2025-global-edition',
    title: 'HackMIT 2025: Global Engineering Edition',
    tagline: 'MIT?s flagship undergraduate hackathon featuring 1,000+ top hackers from 40 countries.',
    description: 'HackMIT 2025 was a 36-hour weekend sprint held on the MIT campus in Cambridge, MA. Hackers built cutting-edge developer tools, decentralized compute networks, and clinical diagnostic assistants.',
    type: 'hackathon',
    status: 'completed',
    mode: 'offline',
    location: 'Cambridge, MA (USA)',
    organizer: {
      name: 'MIT TechX',
      verified: true,
      website: 'https://hackmit.org'
    },
    registrationUrl: 'https://hackmit.org/archive/2025',
    sourceUrl: 'https://hackmit.org',
    sourceType: 'mlh',
    lastSyncedAt: '2026-08-20T10:00:00Z',
    startDate: '2025-09-19T18:00:00Z',
    endDate: '2025-09-21T15:00:00Z',
    registrationDeadline: '2025-08-15T23:59:00Z',
    prizePool: {
      totalValue: '$30,000 Cash + Bounties',
      currency: 'USD'
    },
    tracks: ['Developer Tools', 'Human-Computer Interaction', 'Hardware', 'Sustainability'],
    skills: ['TypeScript', 'Rust', 'Next.js', 'Python'],
    eligibility: 'Undergraduate students globally',
    teamSize: { min: 1, max: 4, label: '1 - 4 Members' },
    entryFee: 'Free',
    winners: [
      {
        rank: '1st Place Grand Winner',
        teamName: 'Team GREViX Alpha',
        projectTitle: 'NeuralKernel ? Distributed Browser Inference Engine',
        repoUrl: 'https://github.com/Grevix/NeuralKernel',
        demoUrl: 'https://neuralkernel.grevix.dev',
        members: ['Baibhab Gusain', 'Satyam Sharma', 'Anshika Gusain']
      },
      {
        rank: '2nd Place Overall',
        teamName: 'ByteCraft',
        projectTitle: 'VoxelVision ? Real-time Volumetric LiDAR Reconstruction',
        repoUrl: 'https://github.com/bytecraft/voxel-vision',
        members: ['Alex Chen', 'Priya Patel']
      }
    ],
    isMockData: true
  },
  {
    id: 'evt-007',
    slug: 'grevix-web3-security-trivia-02',
    title: 'GREViX Web3 Security Trivia #02',
    tagline: 'CTF and quiz evaluating smart contract reentrancy, flash loan vulnerabilities, and opcode analysis.',
    description: 'A 45-minute timed security CTF quiz testing participants on real-world exploit analysis, EVM execution mechanics, and secure Solidity design patterns.',
    type: 'quiz',
    status: 'completed',
    mode: 'online',
    location: 'Online (GREViX Platform)',
    organizer: {
      name: 'GREViX Security SIG',
      verified: true
    },
    registrationUrl: 'https://grevix.org/events/archive/security-trivia-02',
    sourceType: 'verified_admin',
    lastSyncedAt: '2026-08-15T12:00:00Z',
    startDate: '2026-08-14T19:00:00Z',
    endDate: '2026-08-14T19:45:00Z',
    registrationDeadline: '2026-08-14T18:45:00Z',
    prizePool: {
      totalValue: 'Auditor Badges & Certs',
      currency: 'N/A'
    },
    tracks: ['Smart Contract Security', 'CTF', 'EVM Opcodes'],
    skills: ['Solidity', 'Foundry', 'Security Auditing'],
    eligibility: 'All students interested in blockchain security',
    teamSize: { min: 1, max: 1, label: 'Solo' },
    entryFee: '100% Free',
    winners: [
      {
        rank: 'Top Scorer (100% Accuracy)',
        teamName: 'Solo',
        projectTitle: 'Flawless CTF Solve in 18m 42s',
        members: ['Dhruv Kumar']
      }
    ],
    isMockData: true
  },
  {
    id: 'evt-008',
    slug: 'vercel-ai-accelerate-challenge',
    title: 'Vercel AI Accelerate Challenge',
    tagline: 'Create ultra-fast AI applications with Next.js App Router, Vercel AI SDK, and Fluid compute.',
    description: 'Build and deploy applications showcasing fluid generative UI, streaming server actions, and edge AI compute using Next.js 15 and the Vercel AI SDK.',
    type: 'hackathon',
    status: 'upcoming',
    mode: 'online',
    location: 'Online (Global)',
    organizer: {
      name: 'Vercel Ecosystem',
      verified: true,
      website: 'https://vercel.com'
    },
    registrationUrl: 'https://vercel.com/ai-challenge',
    sourceUrl: 'https://vercel.com',
    sourceType: 'community',
    lastSyncedAt: '2026-08-30T19:00:00Z',
    startDate: '2026-09-05T00:00:00Z',
    endDate: '2026-09-07T23:59:00Z',
    registrationDeadline: '2026-09-01T23:59:00Z',
    isClosingSoon: true,
    prizePool: {
      totalValue: '$25,000 + Vercel Tier',
      currency: 'USD'
    },
    tracks: ['Generative UI', 'Next.js App Router', 'Vercel AI SDK', 'Edge Functions'],
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    eligibility: 'Global developer community and student builders',
    teamSize: { min: 1, max: 3, label: '1 - 3 Members' },
    entryFee: 'Free',
    isMockData: true
  }
];
