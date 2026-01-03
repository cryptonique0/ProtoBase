/**
 * ProtoStack Type Definitions
 * Centralized exports for type safety across modules
 */

// Profile types
export * from './profile.types';

// Idea types
export * from './idea.types';

// Re-export legacy types for backward compatibility
// TODO: Migrate these to module-specific type files
export type { IdeaAnalysis, ContractModule, UITemplate, DeploymentLog } from '../../types';
