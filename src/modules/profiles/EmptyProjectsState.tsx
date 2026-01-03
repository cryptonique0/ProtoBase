import React from 'react';

interface EmptyProjectsStateProps {
  isOwnProfile?: boolean;
  onCreateProject?: () => void;
}

export const EmptyProjectsState: React.FC<EmptyProjectsStateProps> = ({ 
  isOwnProfile = false,
  onCreateProject 
}) => {
  if (isOwnProfile) {
    return (
      <div className="bg-surface-dark border border-border-dark rounded-2xl p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl text-primary">rocket_launch</span>
          </div>
          <h3 className="text-xl font-bold text-white">No projects yet</h3>
          <p className="text-text-secondary">
            Turn your ideas into deployed MVPs on Base. Start building your first project now.
          </p>
          <button
            onClick={onCreateProject}
            className="mt-4 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Launch Your First MVP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-dark border border-border-dark rounded-2xl p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl text-text-secondary">inventory_2</span>
        </div>
        <h3 className="text-xl font-bold text-white">No projects yet</h3>
        <p className="text-text-secondary">
          This builder hasn't launched any projects on ProtoStack.
        </p>
      </div>
    </div>
  );
};
