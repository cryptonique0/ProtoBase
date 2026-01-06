import { create } from 'zustand';

/**
 * User Store
 * Manages authenticated user state and profile
 */
interface UserState {
  userId: string | null;
  walletAddress: string | null;
  profile: any | null;
  isLoading: boolean;
  
  setUser: (userId: string, walletAddress: string, profile: any) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  updateProfile: (profile: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  walletAddress: null,
  profile: null,
  isLoading: true,
  
  setUser: (userId, walletAddress, profile) => 
    set({ userId, walletAddress, profile, isLoading: false }),
  
  clearUser: () => 
    set({ userId: null, walletAddress: null, profile: null }),
  
  setLoading: (isLoading) => 
    set({ isLoading }),
  
  updateProfile: (profile) => 
    set({ profile }),
}));

/**
 * Ideas Store
 * Manages ideas state and filters
 */
interface IdeasState {
  ideas: any[];
  selectedCategory: string | null;
  searchQuery: string;
  
  setIdeas: (ideas: any[]) => void;
  addIdea: (idea: any) => void;
  updateIdea: (id: string, updates: any) => void;
  removeIdea: (id: string) => void;
  setCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useIdeasStore = create<IdeasState>((set) => ({
  ideas: [],
  selectedCategory: null,
  searchQuery: '',
  
  setIdeas: (ideas) => set({ ideas }),
  
  addIdea: (idea) => 
    set((state) => ({ ideas: [idea, ...state.ideas] })),
  
  updateIdea: (id, updates) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === id ? { ...idea, ...updates } : idea
      ),
    })),
  
  removeIdea: (id) =>
    set((state) => ({
      ideas: state.ideas.filter((idea) => idea.id !== id),
    })),
  
  setCategory: (category) => set({ selectedCategory: category }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  clearFilters: () => 
    set({ selectedCategory: null, searchQuery: '' }),
}));

/**
 * UI Store
 * Manages global UI state (modals, toasts, etc.)
 */
interface UIState {
  isIdeaFormOpen: boolean;
  selectedIdeaId: string | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  openIdeaForm: () => void;
  closeIdeaForm: () => void;
  selectIdea: (id: string | null) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isIdeaFormOpen: false,
  selectedIdeaId: null,
  toast: null,
  
  openIdeaForm: () => set({ isIdeaFormOpen: true }),
  
  closeIdeaForm: () => set({ isIdeaFormOpen: false }),
  
  selectIdea: (id) => set({ selectedIdeaId: id }),
  
  showToast: (message, type) => {
    set({ toast: { message, type } });
    // Auto-hide after 5 seconds
    setTimeout(() => set({ toast: null }), 5000);
  },
  
  hideToast: () => set({ toast: null }),
}));

/**
 * Project Workspace Store
 * Manages project workspaces (upgraded ideas)
 */
  import { ProjectWorkspace, ProjectStatus } from '../../types';

import type { MilestoneKey, ProjectMilestone, ReferralStats } from '../../types';

import type { DeploymentLog } from '../../types';

interface ProjectsState {
  workspaces: ProjectWorkspace[];
  activeWorkspaceId: string | null;
  isLoading: boolean;
  streakCount: number;
  lastDeploymentDate: string | null;
  xpPoints: number;
  activityLog: DeploymentLog[];

  setWorkspaces: (workspaces: ProjectWorkspace[]) => void;
  addWorkspace: (workspace: ProjectWorkspace) => void;
  updateWorkspace: (id: string, updates: Partial<ProjectWorkspace>) => void;
  setActiveWorkspace: (id: string | null) => void;
  updateStatus: (id: string, status: ProjectStatus) => void;
  registerDeployment: () => void;
  achieveMilestone: (workspaceId: string, key: MilestoneKey) => void;
  shareProject: (workspaceId: string, platform: string) => void;
  claimReferral: (referralCode: string, newUserId: string) => void;
  getReferralStats: (workspaceId: string) => ReferralStats;
  logActivity: (log: DeploymentLog) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

import { v4 as uuidv4 } from 'uuid';

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,
  isLoading: false,
  streakCount: 0,
  lastDeploymentDate: null,
  xpPoints: 0,
  activityLog: [],

  setWorkspaces: (workspaces) => set({ workspaces }),

  addWorkspace: (workspace) =>
    set((state) => ({ workspaces: [workspace, ...state.workspaces] })),

  updateWorkspace: (id, updates) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id ? { ...ws, ...updates, updatedAt: new Date().toISOString() } : ws
      ),
    })),

  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

  updateStatus: (id, status) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id ? { ...ws, status, updatedAt: new Date().toISOString() } : ws
      ),
    })),

  logActivity: (log) =>
    set((state) => ({ activityLog: [{ ...log, timestamp: new Date().toISOString() }, ...state.activityLog] })),

  achieveMilestone: (workspaceId, key) => {
    set((state) => {
      const ws = state.workspaces.find((w) => w.id === workspaceId);
      if (!ws) return {};
      const now = new Date().toISOString();
      const milestones = ws.milestones || [];
      if (milestones.find((m) => m.key === key && m.achieved)) return {}; // already achieved
      const milestoneLabels: Record<MilestoneKey, string> = {
        first_deploy: 'First Contract Deployed',
        ten_deploys: '10 Deployments',
        first_frontend_live: 'First Frontend Live',
      };
      const newMilestone: ProjectMilestone = {
        key,
        label: milestoneLabels[key],
        achieved: true,
        achievedAt: now,
      };
      let xp = state.xpPoints;
      if (key === 'first_deploy') xp += 100;
      if (key === 'ten_deploys') xp += 300;
      if (key === 'first_frontend_live') xp += 100;
      // Log activity
      setTimeout(() => get().logActivity({
        level: 'success',
        message: `Milestone achieved: ${milestoneLabels[key]}`,
        timestamp: new Date().toISOString(),
      }), 0);
      return {
        workspaces: state.workspaces.map((w) =>
          w.id === workspaceId
            ? { ...w, milestones: [...milestones.filter((m) => m.key !== key), newMilestone] }
            : w
        ),
        xpPoints: xp,
      };
    });
  },

  shareProject: (workspaceId, platform) => {
    set((state) => {
      const ws = state.workspaces.find((w) => w.id === workspaceId);
      if (!ws) return {};
      // Only grant XP for first share per platform
      const alreadyShared = ws.shares?.some((s) => s.platform === platform);
      let xp = state.xpPoints;
      if (!alreadyShared) xp += 100;
      const shares = [...(ws.shares || []), { platform, date: new Date().toISOString() }];
      // Log activity
      setTimeout(() => get().logActivity({
        level: 'info',
        message: `Project shared on ${platform}`,
        timestamp: new Date().toISOString(),
      }), 0);
      return {
        workspaces: state.workspaces.map((w) =>
          w.id === workspaceId ? { ...w, shares } : w
        ),
        xpPoints: xp,
      };
    });
  },

  claimReferral: (referralCode, newUserId) => {
    set((state) => {
      // Find workspace with referralCode
      const ws = state.workspaces.find((w) => w.referralCode === referralCode);
      if (!ws) return {};
      // Only reward if not already referred
      const referrals = ws.referrals || [];
      if (referrals.includes(newUserId)) return {};
      // Grant XP to referrer and referee
      setTimeout(() => get().logActivity({
        level: 'success',
        message: `Referral claimed by user ${newUserId}`,
        timestamp: new Date().toISOString(),
      }), 0);
      return {
        workspaces: state.workspaces.map((w) =>
          w.id === ws.id ? { ...w, referrals: [...referrals, newUserId] } : w
        ),
        xpPoints: state.xpPoints + 200,
      };
    });
  },

  getReferralStats: (workspaceId) => {
    const ws = get().workspaces.find((w) => w.id === workspaceId);
    return {
      totalShares: ws?.shares?.length || 0,
      totalReferrals: ws?.referrals?.length || 0,
      earnedXp: (ws?.shares?.length || 0) * 100 + (ws?.referrals?.length || 0) * 200,
    };
  },

  registerDeployment: () => {
    set((state) => {
      const today = new Date().toISOString().slice(0, 10);
      const isConsecutive = state.lastDeploymentDate
        ? new Date(today).getTime() - new Date(state.lastDeploymentDate).getTime() === 24 * 60 * 60 * 1000
        : true;

      const nextStreak = isConsecutive ? state.streakCount + 1 : 1;
      const earnedXp = 150 + Math.max(nextStreak - 1, 0) * 25; // streak multiplier

      // Log activity
      setTimeout(() => get().logActivity({
        level: 'success',
        message: `Deployment registered. Streak: ${nextStreak}`,
        timestamp: new Date().toISOString(),
      }), 0);

      return {
        streakCount: nextStreak,
        lastDeploymentDate: today,
        xpPoints: state.xpPoints + earnedXp,
      };
    });
  },

  showToast: (message, type) => {
    // Use UIStore toast if available, fallback to alert
    try {
      const uiStore = require('./index');
      if (uiStore && uiStore.useUIStore) {
        uiStore.useUIStore.getState().showToast(message, type);
        return;
      }
    } catch {}
    alert(`${type.toUpperCase()}: ${message}`);
  },
}));
