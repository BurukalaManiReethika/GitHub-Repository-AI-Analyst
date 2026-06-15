export interface RepoMeta {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  ownerAvatar: string;
  homepage: string | null;
  license: string;
  updatedAt: string;
  defaultBranch: string;
}

export interface ArchitectureAnalysis {
  primaryStack: string[];
  designPattern: string;
  keyComponents: string[];
}

export interface GeminiAnalysis {
  summary: string;
  architecture: ArchitectureAnalysis;
  setupQuickstart: string;
  highlights: string[];
  recommendations: string[];
}

export interface RepoAnalysisResponse {
  repoInfo: RepoMeta;
  languages: Record<string, number>;
  analysis: GeminiAnalysis;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}
