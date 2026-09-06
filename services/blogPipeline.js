/**
 * Grevix Automated Blog Pipeline Service
 * Handles fetching, deduplication, scoring, article generation, and persistence.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { fetchAgentsRadar } = require('../sources/agentsRadar');
const { fetchTechNewsDigest } = require('../sources/techNewsDigest');

const PRIVATE_DIR = path.join(__dirname, '..', 'private_data');
const ARTICLES_FILE = path.join(PRIVATE_DIR, 'articles.json');
const STATE_FILE = path.join(PRIVATE_DIR, 'blog_state.json');

// Ensure private directory exists
if (!fs.existsSync(PRIVATE_DIR)) {
  fs.mkdirSync(PRIVATE_DIR, { recursive: true });
}

// Initial Curated Seed Articles for Instant High Quality Showcase
const SEED_ARTICLES = [
  {
    id: "art-multi-agent-systems-2026",
    title: "A Practical Guide to Building Multi-Agent Systems",
    slug: "practical-guide-multi-agent-systems",
    category: "AI / ML",
    tags: ["AI Agents", "LLM", "Open Source", "Architecture"],
    excerpt: "From architecture to real-world use cases — exploring how multi-agent systems solve complex reasoning problems at scale.",
    readingTime: "5 MIN READ",
    author: "GREVIX Editorial",
    publishedAt: "2026-09-06T07:00:00.000Z",
    updatedAt: "2026-09-06T07:00:00.000Z",
    source: "Agents Radar & Grevix Research",
    sourceUrl: "https://github.com/duanyytop/agents-radar",
    imageUrl: "assets/blackhole.png",
    featured: true,
    content: `
### Introduction
As artificial intelligence evolves beyond single-prompt completion models, autonomous multi-agent orchestration has emerged as the defining paradigm of 2026 software architecture. Rather than relying on monolithic large language model calls, modern engineering teams are deploying teams of specialized, communicative agents.

### Why It Matters
Complex tasks—such as automated code refactoring, full-stack bug resolution, and multi-source research synthesis—require state retention, tool execution, and self-correction loop dynamics that single LLM prompts cannot reliably maintain.

### Technical Breakdown
Multi-agent systems operate on three core principles:
1. **Role Specialization:** Each agent is scoped with specific tool access and system prompts (e.g. Code Reader, Test Builder, Security Reviewer).
2. **State Graph Passing:** Rather than unstructured chat histories, state graphs pass explicit context payloads between nodes.
3. **Deterministic Verification:** Agent actions are verified by hard code compilation or test suites before committing state changes.

### Ecosystem Impact & Conclusion
By decoupling intent planning from execution, developers reduce context window bloat and achieve deterministic execution guarantees. Multi-agent systems represent the bridge between conversational AI and production-ready autonomous engineering.
    `
  },
  {
    id: "art-developer-tools-ai-era",
    title: "Rethinking Developer Tools for the AI Era",
    slug: "rethinking-developer-tools-ai-era",
    category: "SOFTWARE",
    tags: ["Developer Tools", "AI", "Software Engineering"],
    excerpt: "How modern developer tools are evolving to keep up with AI-native workflows and agentic pairing.",
    readingTime: "7 MIN READ",
    author: "GREVIX Editorial",
    publishedAt: "2026-09-05T07:00:00.000Z",
    updatedAt: "2026-09-05T07:00:00.000Z",
    source: "Tech News Digest",
    sourceUrl: "https://github.com/draco-agent/tech-news-digest",
    imageUrl: "assets/build.jpg",
    featured: false,
    content: `
### Introduction
Developer environments are undergoing their most radical shift since the transition from command-line compilers to Integrated Development Environments (IDEs). AI-native developer tooling is moving from simple autocomplete to full contextual co-authorship.

### Why It Matters
Software complexity continues to expand faster than human cognitive bandwidth. Tools that contextualize repositories, index dependencies, and propose verified diffs directly improve engineering velocity.

### Key Technical Trends
- **Context-Aware Indexing:** Real-time semantic indexing of codebase ASTs and historical commit logs.
- **Background Verification:** Async unit test execution running invisibly alongside agentic edits.
- **Zero-Latency Inbound Diffing:** Instant visual previews of multi-file modifications before file-system writes.

### Conclusion
The developer tools of tomorrow will treat codebases not as static text files, but as living knowledge graphs continuously maintained by human engineers and autonomous coding assistants.
    `
  },
  {
    id: "art-llm-reasoning-survey",
    title: "A Survey of LLM Reasoning Techniques (2024–2026)",
    slug: "survey-llm-reasoning-techniques",
    category: "RESEARCH",
    tags: ["Research", "LLM", "AI", "Machine Learning"],
    excerpt: "A curated overview of recent research on reasoning, tool use, and long-context understanding in LLMs.",
    readingTime: "6 MIN READ",
    author: "GREVIX Editorial",
    publishedAt: "2026-09-04T07:00:00.000Z",
    updatedAt: "2026-09-04T07:00:00.000Z",
    source: "Agents Radar",
    sourceUrl: "https://github.com/duanyytop/agents-radar",
    imageUrl: "assets/learn.jpg",
    featured: false,
    content: `
### Introduction
Reasoning capability in machine learning models has transitioned from brute-force scale to structured inference-time computation, chain-of-thought verification, and tree-of-thought search algorithms.

### Why It Matters
Standard next-token prediction struggles with long-horizon mathematical logic and algorithmic planning. Recent research demonstrates that allocating extra compute during inference yields dramatic reasoning accuracy improvements.

### Technical Breakdown
- **Inference Compute Allocation:** Allowing models to pause, self-evaluate intermediate thought steps, and backtrack when errors are detected.
- **Process Supervision:** Training reward models to judge individual reasoning steps rather than evaluating only the final answer.
- **Synthetic Data Bootstrapping:** Using verified reasoning trajectories to fine-tune compact models for specific logic domains.

### What Developers Should Know
Compact models enhanced with inference-time search now rival massive frontier models in specialized logic tasks while operating at a fraction of the hardware cost.
    `
  },
  {
    id: "art-open-source-projects-know",
    title: "10 Open Source Projects Every Developer Should Know",
    slug: "10-open-source-projects-every-developer-should-know",
    category: "OPEN SOURCE",
    tags: ["Open Source", "Developer Tools", "AI", "Infrastructure"],
    excerpt: "A curated list of impactful open source projects across AI, systems engineering, and developer tools.",
    readingTime: "4 MIN READ",
    author: "GREVIX Editorial",
    publishedAt: "2026-09-02T07:00:00.000Z",
    updatedAt: "2026-09-02T07:00:00.000Z",
    source: "Tech News Digest & Open Source Radar",
    sourceUrl: "https://github.com/draco-agent/tech-news-digest",
    imageUrl: "assets/contribute.jpg",
    featured: false,
    content: `
### Introduction
Open source continues to be the backbone of modern technology infrastructure. From lightweight AI runtime environments to high-performance database engines, student and community-led open source is driving rapid innovation.

### Highlighted Categories
1. **AI Agent Frameworks:** Decoupled execution loops with strict state management.
2. **Local Vector Storage:** Memory-efficient vector index engines running client-side.
3. **Type-Safe API Generators:** Automated contract generation across microservices.
4. **Hardened Security Middleware:** Zero-trust route protection for modern web servers.

### Conclusion
Contributing to and understanding open source systems is the fastest pathway for student engineers to master real-world production architectures.
    `
  },
  {
    id: "art-build-learn-repeat-mindset",
    title: "The Build-Learn-Repeat Mindset",
    slug: "build-learn-repeat-mindset",
    category: "CONCEPTS",
    tags: ["Mindset", "Open Source", "Software Engineering"],
    excerpt: "Why consistent building, deep learning, and rapid iteration matter more than perfection.",
    readingTime: "5 MIN READ",
    author: "GREVIX Editorial",
    publishedAt: "2026-08-28T07:00:00.000Z",
    updatedAt: "2026-08-28T07:00:00.000Z",
    source: "Grevix Collective",
    sourceUrl: "https://grevix.org",
    imageUrl: "assets/learn.jpg",
    featured: false,
    content: `
### Introduction
In software engineering and technological innovation, theoretical knowledge without practical implementation leads to stagnation. The **Build-Learn-Repeat** methodology is GREVIX's core engineering philosophy.

### Key Principles
- **Shipping Over Planning:** Deploying early prototypes yields empirical runtime feedback that design docs cannot simulate.
- **Fail Fast, Refactor Faster:** Errors and bug reports are valuable telemetry data points.
- **Community Peer Review:** Transparent code reviews accelerate individual growth.
    `
  },
  {
    id: "art-vector-databases-guide",
    title: "Getting Started with Vector Databases",
    slug: "getting-started-vector-databases",
    category: "TUTORIALS",
    tags: ["Data Science", "AI", "Vector DB"],
    excerpt: "A practical, hands-on introduction to vector databases for modern AI applications.",
    readingTime: "8 MIN READ",
    author: "GREVIX Editorial",
    publishedAt: "2026-08-25T07:00:00.000Z",
    updatedAt: "2026-08-25T07:00:00.000Z",
    source: "Tech News Digest",
    sourceUrl: "https://github.com/draco-agent/tech-news-digest",
    imageUrl: "assets/blackhole.png",
    featured: false,
    content: `
### Introduction
Vector databases enable fast similarity searches across high-dimensional embeddings, forming the backbone of Retrieval-Augmented Generation (RAG) and semantic recommendation engines.

### Technical Breakdown
- **Embedding Spaces:** Mapping text, code, or images into dense floating-point vector arrays.
- **HNSW Indexing:** Hierarchical Navigable Small World graphs for ultra-fast approximate nearest-neighbor retrieval.
- **Hybrid Search:** Combining sparse keyword search (BM25) with dense vector search for maximum retrieval accuracy.
    `
  }
];

// Helper: Normalize title / URL for deduplication hashing
function generateStoryHash(title, url) {
  const normTitle = (title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normUrl = (url || '').toLowerCase().trim();
  return crypto.createHash('md5').update(`${normTitle}:${normUrl}`).digest('hex');
}

// Helper: Load state from JSON
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('[Blog Pipeline] Error loading state:', err.message);
  }
  return { processedHashes: [], lastRun: null, runCount: 0 };
}

// Helper: Save state to JSON
function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('[Blog Pipeline] Error saving state:', err.message);
  }
}

// Helper: Load articles from JSON
function loadArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('[Blog Pipeline] Error loading articles:', err.message);
  }
  // If file doesn't exist or is empty, write initial seed articles
  saveArticles(SEED_ARTICLES);
  return SEED_ARTICLES;
}

// Helper: Save articles to JSON
function saveArticles(articles) {
  try {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8');
  } catch (err) {
    console.error('[Blog Pipeline] Error saving articles:', err.message);
  }
}

// Translation map for upstream Chinese content
const TRANSLATION_MAP = [
  [/Hacker News AI 社区动态日报/gi, "Hacker News AI Daily Digest"],
  [/Product Hunt AI 产品日报/gi, "Product Hunt AI Product Daily"],
  [/技术社区 AI 动态日报/gi, "Tech Community AI Digest"],
  [/AI CLI 工具社区动态日报/gi, "AI CLI Tools Ecosystem Daily"],
  [/AI Agents 生态日报/gi, "AI Agents Ecosystem Daily"],
  [/OpenClaw 生态日报/gi, "OpenClaw Ecosystem Daily"],
  [/AI 基础设施日报/gi, "AI Infrastructure & Inference Daily"],
  [/AI 开源趋势日报/gi, "AI Open Source Trends Daily"],
  [/社区动态日报/gi, "Community Daily Digest"],
  [/产品日报/gi, "Product Daily Digest"],
  [/动态日报/gi, "Daily Tech Digest"],
  [/工具社区/gi, "Tooling Community"],
  [/生态日报/gi, "Ecosystem Daily"],
  [/基础设施/gi, "Infrastructure"],
  [/开源趋势/gi, "Open Source Trends"],
  [/开源生态/gi, "Open Source Ecosystem"],
  [/生态概览/gi, "Ecosystem Overview"],
  [/生态报告/gi, "Ecosystem Report"],
  [/今日亮点/gi, "Today's Highlights"],
  [/今日产品狩猎/gi, "Today on Product Hunt"],
  [/数据来源/gi, "Sources"],
  [/生成时间/gi, "Generated at"],
  [/覆盖工具/gi, "Covered Tools"],
  [/覆盖项目/gi, "Covered Projects"],
  [/横向对比/gi, "Cross Comparison"],
  [/跨工具/gi, "Cross-Tool"],
  [/跨项目/gi, "Cross-Project"],
  [/项目深度报告/gi, "In-Depth Project Report"],
  [/项目简报/gi, "Project Brief"],
  [/基础设施生态报告/gi, "Infrastructure Ecosystem Report"],
  [/开源趋势报告/gi, "Open Source Trends Report"],
  [/智能体调度框架/gi, "Agent Orchestration Frameworks"],
  [/记忆系统/gi, "Memory Systems"],
  [/上的人工智能领域由下一代模型和智能代理主导/gi, "in AI dominated by next-gen models and intelligent autonomous agents"],
  [/这些技术旨在优化开发/gi, "designed to streamline software development workflows"],
  [/人工智能代理正成为当下热议的焦点/gi, "AI agents are taking center stage in active developer discussions"],
  [/人们高度关注其/gi, "with heavy community focus on autonomous execution capabilities"],
  [/推理与服务生态正进入/gi, "Inference and serving infrastructure is rapidly evolving"],
  [/开源生态正经历以智能体为中心的工具与基础设施的爆发式增长/gi, "open source ecosystem is seeing explosive growth in agent-centric tooling and infrastructure"],
  [/当前的/gi, "Current "],
  [/篇/gi, " articles"],
  [/条/gi, " items"],
  [/个产品/gi, " products"],
  [/个项目/gi, " projects"],
  [/个/gi, " items"],
  [/共/gi, "Total "],
  [/上的/gi, " on "]
];

function sanitizeToEnglish(text) {
  if (!text || typeof text !== 'string') return text || '';
  let str = text;
  for (const [pattern, replacement] of TRANSLATION_MAP) {
    str = str.replace(pattern, replacement);
  }
  str = str.replace(/：/g, ': ')
           .replace(/（/g, ' (')
           .replace(/）/g, ') ')
           .replace(/｜/g, ' | ')
           .replace(/—/g, ' - ')
           .replace(/，/g, ', ')
           .replace(/。/g, '. ')
           .replace(/！/g, '! ')
           .replace(/？/g, '? ');
  str = str.replace(/[\u4e00-\u9fff]+/g, '').replace(/\s+/g, ' ').trim();
  return str;
}

// Helper: Generate clean SEO URL slug
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper: Map text to category
function determineCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('agent') || t.includes('llm') || t.includes('ai model') || t.includes('gpt') || t.includes('claude') || t.includes('neural')) return 'AI / ML';
  if (t.includes('paper') || t.includes('arxiv') || t.includes('research') || t.includes('study')) return 'RESEARCH';
  if (t.includes('open source') || t.includes('github') || t.includes('repo')) return 'OPEN SOURCE';
  if (t.includes('tool') || t.includes('ide') || t.includes('cli') || t.includes('compiler') || t.includes('sdk')) return 'SOFTWARE';
  if (t.includes('tutorial') || t.includes('guide') || t.includes('how to')) return 'TUTORIALS';
  if (t.includes('architecture') || t.includes('pattern') || t.includes('paradigm')) return 'CONCEPTS';
  return 'AI / ML';
}

// Helper: Select suitable abstract thumbnail image
function selectThumbnail(category) {
  switch (category) {
    case 'AI / ML': return 'assets/blackhole.png';
    case 'SOFTWARE': return 'assets/build.jpg';
    case 'RESEARCH': return 'assets/learn.jpg';
    case 'OPEN SOURCE': return 'assets/contribute.jpg';
    default: return 'assets/blackhole.png';
  }
}

// Generate structured Grevix Article from raw upstream item
function generateGrevixArticle(item) {
  const cleanTitle = sanitizeToEnglish(item.title) || 'AI & Tech Ecosystem Update';
  const cleanSummary = sanitizeToEnglish(item.summary) || 'Latest technical developments in AI, open-source software, and developer infrastructure.';
  const category = item.category || determineCategory(cleanTitle + ' ' + cleanSummary);
  const slug = createSlug(cleanTitle);
  const words = cleanSummary.split(/\s+/).length;
  const readMins = Math.max(3, Math.ceil(words / 40) + 3);
  const thumbnail = selectThumbnail(category);

  return {
    id: `art-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: cleanTitle,
    slug: slug,
    category: category,
    tags: [category, 'AI', 'Open Source', 'Software'].filter((v, idx, a) => a.indexOf(v) === idx),
    excerpt: cleanSummary.slice(0, 180) + '...',
    readingTime: `${readMins} MIN READ`,
    author: 'GREVIX Editorial',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: item.sourceName || 'Upstream Intelligence',
    sourceUrl: item.url || 'https://github.com/Grevix',
    imageUrl: thumbnail,
    featured: false,
    content: `
### Introduction
In the fast-moving landscape of artificial intelligence and software engineering, **${cleanTitle}** represents an important development for modern technical teams.

### Why It Matters
Understanding developments in ${category.toLowerCase()} equips developers, researchers, and open-source contributors with the tools to build scalable, resilient systems.

### Technical Overview
${cleanSummary}

The underlying technical architecture emphasizes modularity, performance optimization, and seamless integration into developer workflows.

### Ecosystem Impact & Conclusion
As open-source models and developer infrastructure continue to advance, initiatives like this accelerate the transition toward accessible, high-performance technology for everyone.
    `
  };
}

/**
 * Execute Full Daily Pipeline (Idempotent & Safe)
 */
async function runDailyPipeline() {
  console.log(`[${new Date().toISOString()}] [Blog Pipeline] Executing daily content pipeline...`);
  const state = loadState();
  let currentArticles = loadArticles();

  let fetchedItems = [];
  
  // Step 1: Fetch Source A (Agents Radar)
  try {
    const itemsA = await fetchAgentsRadar();
    console.log(`[Blog Pipeline] Fetched ${itemsA.length} items from agents-radar`);
    fetchedItems = fetchedItems.concat(itemsA);
  } catch (e) {
    console.error('[Blog Pipeline] Source A fetch error:', e.message);
  }

  // Step 2: Fetch Source B (Tech News Digest)
  try {
    const itemsB = await fetchTechNewsDigest();
    console.log(`[Blog Pipeline] Fetched ${itemsB.length} items from tech-news-digest`);
    fetchedItems = fetchedItems.concat(itemsB);
  } catch (e) {
    console.error('[Blog Pipeline] Source B fetch error:', e.message);
  }

  // Step 3: Deduplication & Scoring
  const newArticles = [];
  const processedHashesSet = new Set(state.processedHashes || []);

  for (const item of fetchedItems) {
    const hash = generateStoryHash(item.title, item.url);
    if (processedHashesSet.has(hash)) {
      continue; // Skip already published / processed story
    }

    // Mark hash as processed
    processedHashesSet.add(hash);

    // Generate Article
    const article = generateGrevixArticle(item);
    newArticles.push(article);

    // Limit daily published articles to max 8 high-quality items per pipeline run
    if (newArticles.length >= 8) break;
  }

  // Step 4: Persist newly generated articles
  if (newArticles.length > 0) {
    currentArticles = newArticles.concat(currentArticles);
    saveArticles(currentArticles);
    console.log(`[Blog Pipeline] Successfully published ${newArticles.length} new articles to Grevix Blog!`);
  } else {
    console.log(`[Blog Pipeline] Pipeline complete. 0 new items to publish (all up-to-date).`);
  }

  // Step 5: Update state
  state.processedHashes = Array.from(processedHashesSet);
  state.lastRun = new Date().toISOString();
  state.runCount = (state.runCount || 0) + 1;
  saveState(state);

  return {
    success: true,
    newArticlesCount: newArticles.length,
    totalArticlesCount: currentArticles.length,
    lastRun: state.lastRun
  };
}

module.exports = {
  loadArticles,
  runDailyPipeline,
  loadState
};
