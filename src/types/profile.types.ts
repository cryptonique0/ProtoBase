/**
 * ProtoVM Profile Types
 * Core identity and reputation system for ProtoStack builders
 */

export interface BuilderProfile {
  id: string;
  address: `0x${string}`;
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  
  // Reputation metrics
  reputation: BuilderReputation;
  
  // Social links
  socials?: BuilderSocials;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface BuilderReputation {
  xp: number;
  level: number;
  projectsLaunched: number;
  contractsDeployed: number;
  totalGasOptimized: bigint;
  
  // TODO: Add badges system
  badges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: Date;
}

export interface BuilderSocials {
  warpcast?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

/**
 * Project ownership and tracking
 * Links builders to their deployed projects
 */
export interface BuilderProject {
  id: string;
  name: string;
  description?: string;
  
  // Ownership
  ownerId: string; // BuilderProfile.id
  ownerAddress: `0x${string}`;
  
  // Deployment details
  contractAddress?: `0x${string}`;
  chainId: number;
  deployedAt?: Date;
  
  // Project metadata
  category: ProjectCategory;
  status: ProjectStatus;
  
  // Tech stack
  modules: string[]; // Contract module IDs used
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // TODO: Add analytics
  // analytics?: ProjectAnalytics;
}

export enum ProjectCategory {
  DEFI = 'defi',
  NFT = 'nft',
  DAO = 'dao',
  GAMING = 'gaming',
  SOCIAL = 'social',
  INFRASTRUCTURE = 'infrastructure',
  OTHER = 'other',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  DEPLOYING = 'deploying',
  DEPLOYED = 'deployed',
  VERIFIED = 'verified',
  ARCHIVED = 'archived',
}

/**
 * Profile update operations
 */
export interface UpdateProfileInput {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  socials?: Partial<BuilderSocials>;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  category: ProjectCategory;
  modules: string[];
}

/**
 * API response types
 */
export interface ProfileResponse {
  profile: BuilderProfile;
  projects: BuilderProject[];
}
