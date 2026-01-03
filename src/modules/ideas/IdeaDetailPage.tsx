import React, { useEffect, useState } from 'react';
import { IdeaWithUpvoteStatus, IdeaCategory } from '../../types/idea.types';
import { getIdeaById, upvoteIdea, removeUpvote } from '../../services/ideasService';
import { useUserStore } from '../../store';
import { useUIStore } from '../../store';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LaunchProjectButton } from '../../components/LaunchProjectButton';

const categoryLabels: Record<IdeaCategory, string> = {
  [IdeaCategory.DEFI]: 'DeFi',
  [IdeaCategory.NFT]: 'NFT',
  [IdeaCategory.DAO]: 'DAO',
  [IdeaCategory.GAMING]: 'Gaming',
  [IdeaCategory.SOCIAL]: 'Social',
  [IdeaCategory.INFRASTRUCTURE]: 'Infrastructure',
  [IdeaCategory.OTHER]: 'Other',
};

interface IdeaDetailPageProps {
  ideaId: string;
  onBack: () => void;
}

export const IdeaDetailPage: React.FC<IdeaDetailPageProps> = ({ ideaId, onBack }) => {
  const { userId, walletAddress } = useUserStore();
  const { showToast } = useUIStore();
  
  const [idea, setIdea] = useState<IdeaWithUpvoteStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
    loadIdea();
  }, [ideaId, userId]);

  const loadIdea = async () => {
    if (!ideaId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getIdeaById(ideaId, userId || undefined);
      if (!data) {
        setError('Idea not found');
      } else {
        setIdea(data);
      }
    } catch (err: any) {
      console.error('Error loading idea:', err);
      setError(err.message || 'Failed to load idea');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!idea || !userId || !walletAddress) {
      showToast('Please connect your wallet to upvote', 'info');
      return;
    }

    setIsUpvoting(true);

    try {
      if (idea.hasUserUpvoted) {
        await removeUpvote(idea.id, userId);
        setIdea({
          ...idea,
          upvotes: idea.upvotes - 1,
          hasUserUpvoted: false,
        });
        showToast('Upvote removed', 'info');
      } else {
        await upvoteIdea(idea.id, userId, walletAddress);
        setIdea({
          ...idea,
          upvotes: idea.upvotes + 1,
          hasUserUpvoted: true,
        });
        showToast('Upvoted! 👍', 'success');
      }
    } catch (err: any) {
      console.error('Error toggling upvote:', err);
      showToast(err.message || 'Failed to upvote', 'error');
    } finally {
      setIsUpvoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Idea Not Found"
            message={error || 'This idea does not exist or has been removed'}
            action={{
              label: 'Back to Ideas',
              onClick: onBack,
            }}
          />
        </div>
      </div>
    );
  }

  const isOwner = walletAddress === idea.creatorAddress;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">
                {idea.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium">
                  {categoryLabels[idea.category]}
                </span>
                <span className="text-gray-400 text-sm">
                  by {idea.creatorAddress.slice(0, 6)}...
                  {idea.creatorAddress.slice(-4)}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Upvote Button */}
            <button
              onClick={handleUpvote}
              disabled={isUpvoting || !userId}
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-lg transition-all ${
                idea.hasUserUpvoted
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-2xl">👍</span>
              <span className="text-lg font-bold">{idea.upvotes}</span>
              <span className="text-xs">
                {idea.hasUserUpvoted ? 'Upvoted' : 'Upvote'}
              </span>
            </button>

            {/* Launch Project Button */}
            {userId === idea.creator.id && (
              <LaunchProjectButton ideaId={idea.id} ideaTitle={idea.title} />
            )}
          </div>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {idea.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Description */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Description
            </h2>
            <p className="text-gray-300 whitespace-pre-wrap">
              {idea.description}
            </p>
          </section>

          {/* Problem */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Problem Statement
            </h2>
            <p className="text-gray-300 whitespace-pre-wrap">
              {idea.problem}
            </p>
          </section>

          {/* Target Users */}
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Target Users
            </h2>
            <p className="text-gray-300">
              {idea.targetUsers}
            </p>
          </section>
        </div>

        {/* Actions (for owner) */}
        {isOwner && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Manage Your Idea
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  // TODO: Implement edit
                  showToast('Edit functionality coming soon', 'info');
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Edit Idea
              </button>
              <button
                onClick={() => {
                  // TODO: Implement delete
                  showToast('Delete functionality coming soon', 'info');
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Idea
              </button>
            </div>
          </div>
        )}

        {/* Comments Section (Placeholder) */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Comments ({idea.commentsCount})
          </h3>
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-3">💬</div>
            <p>Comments coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
