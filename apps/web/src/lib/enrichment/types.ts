export type SourceError =
  | "timeout"
  | "not_found"
  | "rate_limited"
  | "blocked"
  | "parse_error"
  | "unknown";

export type SourceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: SourceError };

export interface GithubRepoSummary {
  name: string;
  url: string;
  stars: number;
  description?: string;
  pushedAt?: string;
}

export interface GithubData {
  org: string;
  url: string;
  totalStars: number;
  publicRepos: number;
  followers: number;
  topLanguages: string[];
  recentRepos: GithubRepoSummary[];
  blogUrl?: string;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  source?: string;
}

export interface NewsData {
  headlines: NewsItem[];
}

export interface LevelsRoleComp {
  role: string;
  totalComp?: string;
}

export interface LevelsData {
  url: string;
  medianTotalComp?: string;
  roles: LevelsRoleComp[];
}

export interface BlogPost {
  title: string;
  url: string;
  excerpt?: string;
}

export interface BlogData {
  url: string;
  posts: BlogPost[];
}

export interface HnStory {
  title: string;
  url?: string;
  points: number;
  comments: number;
  createdAt?: string;
  hnUrl: string;
}

export interface HnData {
  stories: HnStory[];
}

export interface EnrichmentSnapshot {
  version: 1;
  github: SourceResult<GithubData> | null;
  news: SourceResult<NewsData> | null;
  levels: SourceResult<LevelsData> | null;
  blog: SourceResult<BlogData> | null;
  hn: SourceResult<HnData> | null;
  enrichedAt: string;
}
