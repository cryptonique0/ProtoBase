import React from 'react';
import { Idea, IdeaCategory } from '../../types/idea.types';

const categoryColors: Record<IdeaCategory, string> = {
  [IdeaCategory.DEFI]: 'bg-green-600/20 text-green-400 border-green-500/30',
  [IdeaCategory.NFT]: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
  [IdeaCategory.DAO]: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  [IdeaCategory.GAMING]: 'bg-pink-600/20 text-pink-400 border-pink-500/30',
  [IdeaCategory.SOCIAL]: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
  [IdeaCategory.INFRASTRUCTURE]: 'bg-gray-600/20 text-gray-400 border-gray-500/30',
  [IdeaCategory.OTHER]: 'bg-slate-600/20 text-slate-400 border-slate-500/30',
};

const categoryLabels: Record<IdeaCategory, string> = {
  [IdeaCategory.DEFI]: 'DeFi',
  [IdeaCategory.NFT]: 'NFT',
  [IdeaCategory.DAO]: 'DAO',
  [IdeaCategory.GAMING]: 'Gaming',
  [IdeaCategory.SOCIAL]: 'Social',
  [IdeaCategory.INFRASTRUCTURE]: 'Infrastructure',
  [IdeaCategory.OTHER]: 'Other',
};

interface IdeaCardProps {
  idea: Idea;
  onClick?: () => void;
  showUpvote?: boolean;
  onUpvote?: () => void;
  hasUserUpvoted?: boolean;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onClick,
  showUpvote = true,
  onUpvote,
  hasUserUpvoted = false,
}) => {
  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote?.();
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
            {idea.title}
          </h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
              categoryColors[idea.category]
            }`}
          >
            {categoryLabels[idea.category]}
          </span>
        </div>
        
        {showUpvote && (
          <button
            onClick={handleUpvoteClick}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              hasUserUpvoted
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="text-xl">👍</span>
            <span className="text-sm font-medium">{idea.upvotes}</span>
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {idea.description}
      </p>

      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {idea.tags.length > 3 && (
            <span className="px-2 py-1 text-gray-500 text-xs">
              +{idea.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          by {idea.creatorAddress.slice(0, 6)}...{idea.creatorAddress.slice(-4)}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            💬 {idea.commentsCount}
          </span>
          <span>
            {new Date(idea.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
