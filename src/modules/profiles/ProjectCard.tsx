import React from 'react';
import type { BuilderProject, ProjectStatus } from '../../types';

interface ProjectCardProps {
  project: BuilderProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColors: Record<ProjectStatus, string> = {
    [ProjectStatus.DRAFT]: 'text-gray-400 bg-gray-400/10',
    [ProjectStatus.DEPLOYING]: 'text-yellow-400 bg-yellow-400/10',
    [ProjectStatus.DEPLOYED]: 'text-blue-400 bg-blue-400/10',
    [ProjectStatus.VERIFIED]: 'text-emerald-400 bg-emerald-400/10',
    [ProjectStatus.ARCHIVED]: 'text-text-secondary bg-surface-dark',
  };

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-6 hover:border-primary/30 transition-all group cursor-pointer">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[project.status]}`}>
          {project.status}
        </span>
        {project.contractAddress && (
          <a
            href={`https://basescan.org/address/${project.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        )}
      </div>

      {/* Project Info */}
      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2">
        {project.name}
      </h3>
      
      {project.description && (
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Modules Used */}
      {project.modules.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.modules.slice(0, 3).map((module) => (
            <span 
              key={module} 
              className="px-2 py-1 bg-white/5 rounded text-xs text-text-secondary"
            >
              {module}
            </span>
          ))}
          {project.modules.length > 3 && (
            <span className="px-2 py-1 text-xs text-text-secondary">
              +{project.modules.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t border-border-dark">
        <span className="uppercase tracking-wider">{project.category}</span>
        {project.deployedAt && (
          <span>
            Deployed {new Date(project.deployedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
