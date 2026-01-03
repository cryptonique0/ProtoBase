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

interface ProjectsState {
  workspaces: ProjectWorkspace[];
  activeWorkspaceId: string | null;
  isLoading: boolean;
  
  setWorkspaces: (workspaces: ProjectWorkspace[]) => void;
  addWorkspace: (workspace: ProjectWorkspace) => void;
  updateWorkspace: (id: string, updates: Partial<ProjectWorkspace>) => void;
  setActiveWorkspace: (id: string | null) => void;
  updateStatus: (id: string, status: ProjectStatus) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  workspaces: [],
  activeWorkspaceId: null,
  isLoading: false,
  
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
}));
