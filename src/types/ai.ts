export interface EventAiAnalysis {
  executiveSummary: string;
  difficultyLevel: 'Beginner Friendly' | 'Intermediate' | 'Advanced Systems';
  recommendedTeamRoles: string[];
  suggestedProjectAngles: string[];
  estimatedPreparationTime: string;
  isGeneratedByAi: boolean;
  modelUsed: string;
  generatedAt: string;
}

export interface StudentProfile {
  skills: string[];
  interests: string[];
  preferredMode?: 'online' | 'offline' | 'hybrid' | 'any';
}

export interface EventMatchResult {
  eventId: string;
  slug: string;
  title: string;
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  matchedInterests: string[];
  relevanceExplanation: string;
}
