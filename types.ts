
export enum ProjectStep {
  LANDING = 'LANDING',
  INTAKE = 'INTAKE',
  CONTRACTS = 'CONTRACTS',
  FRONTEND = 'FRONTEND',
  DEPLOYMENT = 'DEPLOYMENT',
  MONITOR = 'MONITOR',
  ROADMAP = 'ROADMAP',
  DOCS = 'DOCS',
  IDEAS = 'IDEAS',
  IDEA_DETAIL = 'IDEA_DETAIL',
  WORKSPACE = 'WORKSPACE'
}

export interface IdeaAnalysis {
  feasibilityScore: number;
  categories: string[];
  suggestedFunctions: string[];
  scopeReduction: string;
  suggestedStack: string[];
}

export interface ContractDocItem {
  name: string;
  description: string;
  params?: { name: string; type: string; description: string }[];
}

export interface ContractDocumentation {
  functions: ContractDocItem[];
  events: ContractDocItem[];
}

export interface ContractModule {
  id: string;
  name: string;
  description: string;
  category: 'Security' | 'DeFi' | 'NFT' | 'Governance' | 'Utility';
  gasEstimate: string;
  status: 'Audited' | 'Beta' | 'Experimental';
  documentation: ContractDocumentation;
}

export interface UITemplate {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  features: string[];
}

export enum ProjectStatus {
  IDEA = 'idea',
  MVP_PLANNING = 'mvp_planning',
  MVP_BUILDING = 'mvp_building',
  MVP_DEPLOYED = 'mvp_deployed',
  MAINNET_DEPLOYED = 'mainnet_deployed'
}

export interface SmartContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'token' | 'nft' | 'defi' | 'dao' | 'utility';
  contractCode: string;
  deploymentParams?: { name: string; type: string; description: string }[];
  baseOptimized: boolean;
}

export interface FrontendTemplate {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  code: { [key: string]: string }; // filename -> content
  preview?: string;
}

export type MilestoneKey = 'first_deploy' | 'ten_deploys' | 'first_frontend_live';

export interface ProjectMilestone {
  key: MilestoneKey;
  label: string;
  achieved: boolean;
  achievedAt?: string;
}

export interface ProjectWorkspace {
  id: string;
  ideaId: string;
  name: string;
  status: ProjectStatus;
  
  // Templates selected
  contractTemplateId?: string;
  frontendTemplateId?: string;
  
  // Customized code
  contractCode?: string;
  frontendFiles?: { [key: string]: string };
  
  // Deployment info
  testnetAddress?: string;
  testnetTxHash?: string;
  mainnetAddress?: string;
  mainnetTxHash?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deployedAt?: string;

  // Social Sharing & Referral
  referralCode?: string;
  shares?: { platform: string; date: string }[];
  referredBy?: string; // referralCode of referrer
  referrals?: string[]; // userIds of referred users
  shareXpClaimed?: boolean;
  referralXpClaimed?: boolean;

  // Milestones
  milestones?: ProjectMilestone[];
}

export interface ReferralStats {
  totalShares: number;
  totalReferrals: number;
  earnedXp: number;
}

export interface DeploymentLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}
