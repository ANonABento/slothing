import type { Opportunity, Profile } from "./types";

export interface ExtensionProfileResponse extends Profile {
  computed?: Record<string, unknown>;
}

export interface ExtensionImportJobResponse {
  imported: number;
  opportunityIds: string[];
  pendingCount: number;
}

export interface ExtensionOpportunityImportRequest {
  title: string;
  company: string;
  location?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  keywords?: string[];
  type?: Opportunity["jobType"];
  remote?: boolean;
  salary?: string;
  url: string;
  source: Opportunity["source"] | string;
  sourceJobId?: string;
  postedAt?: string;
  deadline?: string;
}
