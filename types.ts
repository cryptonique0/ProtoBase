
export enum ProjectStep {
  LANDING = 'LANDING',
  INTAKE = 'INTAKE',
  CONTRACTS = 'CONTRACTS',
  FRONTEND = 'FRONTEND',
  DEPLOYMENT = 'DEPLOYMENT',
  MONITOR = 'MONITOR'
}

export interface IdeaAnalysis {
  feasibilityScore: number;
  categories: string[];
  suggestedFunctions: string[];
  scopeReduction: string;
  suggestedStack: string[];
}

export interface ContractModule {
  id: string;
  name: string;
  description: string;
  category: 'Security' | 'DeFi' | 'NFT' | 'Governance' | 'Utility';
  gasEstimate: string;
  status: 'Audited' | 'Beta' | 'Experimental';
}

export interface UITemplate {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  features: string[];
}

export interface DeploymentLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}
