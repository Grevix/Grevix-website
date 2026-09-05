import { Event } from '@/types/event';
import { EventAiAnalysis, StudentProfile, EventMatchResult } from '@/types/ai';

// In-Memory Cache for AI Analyses (Key: eventId -> EventAiAnalysis)
const analysisCache = new Map<string, { data: EventAiAnalysis; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

// Rate Limiter: simple sliding-window counter
let requestCount = 0;
let windowStartTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 30;

function checkRateLimit(): boolean {
  const now = Date.now();
  if (now - windowStartTime > 60000) {
    windowStartTime = now;
    requestCount = 0;
  }
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  requestCount++;
  return true;
}

/**
 * Deterministic Semantic Heuristic Engine (Fallback when API key is not present or upstream fails)
 */
function generateDeterministicAnalysis(event: Event): EventAiAnalysis {
  const isSystems = event.tracks.some((t) => /rust|wasm|systems|kernel|security|ctf/i.test(t)) ||
                    event.skills.some((s) => /rust|c\+\+|assembly|solidity/i.test(s));
  const isBeginner = event.type === 'workshop' || event.eligibility.toLowerCase().includes('high school');

  let difficultyLevel: 'Beginner Friendly' | 'Intermediate' | 'Advanced Systems' = 'Intermediate';
  if (isSystems) {
    difficultyLevel = 'Advanced Systems';
  } else if (isBeginner) {
    difficultyLevel = 'Beginner Friendly';
  }

  // Generate suggested project angles based on tracks
  const projectAngles: string[] = [];
  if (event.tracks.some((t) => /ai|gemini|agent/i.test(t))) {
    projectAngles.push('Autonomous multi-agent orchestration with persistent vector memory');
    projectAngles.push('Low-latency edge multi-modal diagnostic assistant');
  }
  if (event.tracks.some((t) => /web3|solidity|zk/i.test(t))) {
    projectAngles.push('Privacy-preserving verifiable state proofs for cross-chain identity');
    projectAngles.push('Account abstraction wallet with session-key automation');
  }
  if (event.tracks.some((t) => /systems|rust|wasm/i.test(t))) {
    projectAngles.push('Zero-copy streaming parser compiled to browser WebAssembly');
    projectAngles.push('Distributed memory-safe actor runtime for high-throughput messaging');
  }
  if (projectAngles.length === 0) {
    projectAngles.push(`High-impact production prototype addressing ${event.tracks.join(' and ')} challenges`);
    projectAngles.push('Collaborative open-source developer tool with real-time state sync');
  }

  const teamRoles = event.teamSize.max > 1
    ? ['Systems / Backend Architect', 'Frontend & Interaction Engineer', 'Domain Specialist / Researcher']
    : ['Fullstack Generalist'];

  return {
    executiveSummary: `${event.title} is a ${event.mode} ${event.type} organized by ${event.organizer.name}. Focuses on practical implementation across ${event.tracks.join(', ')}.`,
    difficultyLevel,
    recommendedTeamRoles: teamRoles,
    suggestedProjectAngles: projectAngles.slice(0, 2),
    estimatedPreparationTime: difficultyLevel === 'Advanced Systems' ? '1-2 weeks' : '2-4 days',
    isGeneratedByAi: false,
    modelUsed: 'grevix-deterministic-v1',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Synthesizes event intelligence via Gemini/OpenAI API with strict fallback and caching.
 */
export async function analyzeEventIntelligence(event: Event): Promise<EventAiAnalysis> {
  const cached = analysisCache.get(event.id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey || !checkRateLimit()) {
    const fallback = generateDeterministicAnalysis(event);
    analysisCache.set(event.id, { data: fallback, timestamp: Date.now() });
    return fallback;
  }

  try {
    // If Gemini API Key is available, call Gemini 2.0 Flash for structured analysis
    if (process.env.GEMINI_API_KEY) {
      const prompt = `Analyze this student technical competition and output strict JSON only:
Title: ${event.title}
Type: ${event.type}
Description: ${event.description}
Tracks: ${event.tracks.join(', ')}
Skills: ${event.skills.join(', ')}

Output valid JSON matching this schema:
{
  "executiveSummary": "2-sentence high-density summary focusing on technical takeaway",
  "difficultyLevel": "Beginner Friendly" | "Intermediate" | "Advanced Systems",
  "recommendedTeamRoles": ["Role 1", "Role 2"],
  "suggestedProjectAngles": ["Angle 1", "Angle 2"],
  "estimatedPreparationTime": "Estimated time string"
}`;

      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: 300,
            temperature: 0.2,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          const result: EventAiAnalysis = {
            executiveSummary: parsed.executiveSummary || `${event.title} technical sprint.`,
            difficultyLevel: parsed.difficultyLevel || 'Intermediate',
            recommendedTeamRoles: Array.isArray(parsed.recommendedTeamRoles) ? parsed.recommendedTeamRoles : ['Fullstack Developer'],
            suggestedProjectAngles: Array.isArray(parsed.suggestedProjectAngles) ? parsed.suggestedProjectAngles : ['Modern production prototype'],
            estimatedPreparationTime: parsed.estimatedPreparationTime || '3-5 days',
            isGeneratedByAi: true,
            modelUsed: 'gemini-2.0-flash',
            generatedAt: new Date().toISOString(),
          };
          analysisCache.set(event.id, { data: result, timestamp: Date.now() });
          return result;
        }
      }
    }
  } catch (err) {
    console.warn('[AiClient] Upstream LLM call failed. Using deterministic fallback:', err);
  }

  const fallback = generateDeterministicAnalysis(event);
  analysisCache.set(event.id, { data: fallback, timestamp: Date.now() });
  return fallback;
}

/**
 * Calculates weighted skill relevance score and generates a personalized match explanation.
 */
export function calculateOpportunityMatch(event: Event, profile: StudentProfile): EventMatchResult {
  const profileSkills = profile.skills.map((s) => s.toLowerCase());
  const profileInterests = profile.interests.map((i) => i.toLowerCase());

  // 1. Matched Skills (Weight: 50%)
  const matchedSkills = event.skills.filter((skill) =>
    profileSkills.some((ps) => skill.toLowerCase().includes(ps) || ps.includes(skill.toLowerCase()))
  );
  const skillScore = event.skills.length > 0 ? (matchedSkills.length / event.skills.length) * 50 : 25;

  // 2. Matched Categories / Interests (Weight: 35%)
  const matchedInterests = event.tracks.filter((track) =>
    profileInterests.some((pi) => track.toLowerCase().includes(pi) || pi.includes(track.toLowerCase()))
  );
  const interestScore = event.tracks.length > 0 ? (matchedInterests.length / event.tracks.length) * 35 : 20;

  // 3. Mode Preference (Weight: 15%)
  let modeScore = 15;
  if (profile.preferredMode && profile.preferredMode !== 'any' && event.mode !== profile.preferredMode) {
    modeScore = 5;
  }

  const totalScore = Math.min(100, Math.round(skillScore + interestScore + modeScore));

  let explanation = 'Good general fit based on community criteria.';
  if (matchedSkills.length > 0 && matchedInterests.length > 0) {
    explanation = `Direct match on your ${matchedSkills.join(', ')} skills and ${matchedInterests.join(', ')} interests.`;
  } else if (matchedSkills.length > 0) {
    explanation = `Strong tech stack alignment with your background in ${matchedSkills.join(', ')}.`;
  } else if (matchedInterests.length > 0) {
    explanation = `Aligns with your interest in ${matchedInterests.join(', ')}.`;
  }

  return {
    eventId: event.id,
    slug: event.slug,
    title: event.title,
    matchScore: totalScore,
    matchedSkills,
    matchedInterests,
    relevanceExplanation: explanation,
  };
}
