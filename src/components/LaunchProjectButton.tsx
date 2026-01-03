import React from 'react';
import { useIdeasStore, useProjectsStore, useUIStore } from '../store';
import { ProjectStatus } from '../types';

export function LaunchProjectButton({ ideaId, ideaTitle }: { ideaId: string; ideaTitle: string }) {
  const { addWorkspace, setActiveWorkspace } = useProjectsStore();
  const { showToast } = useUIStore();

  const handleLaunchProject = () => {
    const newWorkspace = {
      id: `ws_${Date.now()}`,
      ideaId,
      name: ideaTitle,
      status: ProjectStatus.MVP_PLANNING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addWorkspace(newWorkspace);
    setActiveWorkspace(newWorkspace.id);
    showToast('Project workspace created! 🚀', 'success');

    // Navigate to workspace page
    window.location.hash = '#/workspace';
  };

  return (
    <button
      onClick={handleLaunchProject}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 font-medium shadow-lg hover:shadow-xl transition-all"
    >
      🚀 Launch as Project
    </button>
  );
}
