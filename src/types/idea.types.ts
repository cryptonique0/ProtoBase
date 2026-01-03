/**
 * Idea Validation Types
 * For the idea submission and validation system
 */

export interface Idea {
  id: string;
  title: string;
  description: string;
  problem: string;
  targetUsers: string;
  
  // Creator info
  creatorId: string;
  creatorAddress: `0x${string}`;
  
  // Metadata
  category: IdeaCategory;
  tags: string[];
  
  // Engagement
  upvotes: number;
  commentsCount: number;
  
  // Status
  status: IdeaStatus;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export enum IdeaCategory {
  DEFI = 'defi',
  NFT = 'nft',
  DAO = 'dao',
  GAMING = 'gaming',
  SOCIAL = 'social',
  INFRASTRUCTURE = 'infrastructure',
  OTHER = 'other',
}

export enum IdeaStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_DEVELOPMENT = 'in_development',
  DEPLOYED = 'deployed',
  ARCHIVED = 'archived',
}

/**
 * Upvote tracking
 */
export interface IdeaUpvote {
  id: string;
  ideaId: string;
  userId: string;
  userAddress: `0x${string}`;
  createdAt: Date;
}

/**
 * Comments (future enhancement)
 */
export interface IdeaComment {
  id: string;
  ideaId: string;
  userId: string;
  userAddress: `0x${string}`;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Form validation types
 */
export interface CreateIdeaInput {
  title: string;
  description: string;
  problem: string;
  targetUsers: string;
  category: IdeaCategory;
  tags?: string[];
}

export interface UpdateIdeaInput {
  title?: string;
  description?: string;
  problem?: string;
  targetUsers?: string;
  category?: IdeaCategory;
  tags?: string[];
  status?: IdeaStatus;
}

/**
 * API response types
 */
export interface IdeasResponse {
  ideas: Idea[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IdeaWithUpvoteStatus extends Idea {
  hasUserUpvoted: boolean;
}
