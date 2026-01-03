import React from 'react';
import type { BuilderProject } from '../../types';
import { ProjectCard } from './ProjectCard';
import { EmptyProjectsState } from './EmptyProjectsState';

interface ProjectsListProps {
  projects: BuilderProject[];
  isOwnProfile?: boolean;
  onCreateProject?: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ 
  projects, 
  isOwnProfile = false,
  onCreateProject 
}) => {
  if (projects.length === 0) {
    return <EmptyProjectsState isOwnProfile={isOwnProfile} onCreateProject={onCreateProject} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Projects <span className="text-text-secondary font-normal">({projects.length})</span>
        </h2>
        {isOwnProfile && (
          <button
            onClick={onCreateProject}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold transition-all"
          >
            + New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
