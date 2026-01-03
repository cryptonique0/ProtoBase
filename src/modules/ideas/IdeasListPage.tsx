import React, { useEffect, useState } from 'react';
import { Idea, IdeaCategory } from '../../types/idea.types';
import { getIdeas } from '../../services/ideasService';
import { upvoteIdea, removeUpvote } from '../../services/ideasService';
import { useUserStore, useIdeasStore, useUIStore } from '../../store';
import { IdeaCard } from './IdeaCard';
import { IdeaSubmissionForm } from './IdeaSubmissionForm';
import { LoadingList } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

const categoryLabels: Record<IdeaCategory, string> = {
  [IdeaCategory.DEFI]: 'DeFi',
  [IdeaCategory.NFT]: 'NFT',
  [IdeaCategory.DAO]: 'DAO',
  [IdeaCategory.GAMING]: 'Gaming',
  [IdeaCategory.SOCIAL]: 'Social',
  [IdeaCategory.INFRASTRUCTURE]: 'Infrastructure',
  [IdeaCategory.OTHER]: 'Other',
};

interface IdeasListPageProps {
  onSelectIdea?: (ideaId: string) => void;
}

export const IdeasListPage: React.FC<IdeasListPageProps> = ({ onSelectIdea }) => {
  const { userId, walletAddress } = useUserStore();
  const { ideas, setIdeas, selectedCategory, setCategory } = useIdeasStore();
  const { isIdeaFormOpen, openIdeaForm, closeIdeaForm, showToast } = useUIStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upvotedIdeas, setUpvotedIdeas] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadIdeas();

    // Listen for refresh events
    const handleRefresh = () => loadIdeas();
    window.addEventListener('ideas:refresh', handleRefresh);
    
    return () => {
      window.removeEventListener('ideas:refresh', handleRefresh);
    };
  }, [selectedCategory]);

  const loadIdeas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getIdeas(
        selectedCategory ? { category: selectedCategory } : {}
      );
      setIdeas(response.ideas);

      // Load user's upvoted ideas
      if (userId) {
        // TODO: Fetch user's upvoted ideas from service
        // For now, we'll check each idea individually when rendering
      }
    } catch (err: any) {
      console.error('Error loading ideas:', err);
      setError(err.message || 'Failed to load ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (ideaId: string) => {
    if (!userId || !walletAddress) {
      showToast('Please connect your wallet to upvote', 'info');
      return;
    }

    const hasUpvoted = upvotedIdeas.has(ideaId);

    // Optimistic update
    setUpvotedIdeas(prev => {
      const next = new Set(prev);
      if (hasUpvoted) {
        next.delete(ideaId);
      } else {
        next.add(ideaId);
      }
      return next;
    });

    const updatedIdeas = ideas.map(idea =>
      idea.id === ideaId
        ? { ...idea, upvotes: idea.upvotes + (hasUpvoted ? -1 : 1) }
        : idea
    );
    setIdeas(updatedIdeas);

    try {
      if (hasUpvoted) {
        await removeUpvote(ideaId, userId);
      } else {
        await upvoteIdea(ideaId, userId, walletAddress);
      }
    } catch (err: any) {
      // Revert on error
      setUpvotedIdeas(prev => {
        const next = new Set(prev);
        if (hasUpvoted) {
          next.add(ideaId);
        } else {
          next.delete(ideaId);
        }
        return next;
      });

      const revertedIdeas = ideas.map(idea =>
        idea.id === ideaId
          ? { ...idea, upvotes: idea.upvotes + (hasUpvoted ? 1 : -1) }
          : idea
      );
      setIdeas(revertedIdeas);

      console.error('Error toggling upvote:', err);
      showToast(err.message || 'Failed to upvote', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <LoadingList count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Failed to Load Ideas"
            message={error}
            action={{
              label: 'Retry',
              onClick: loadIdeas,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Idea Validation
          </h1>
          <p className="text-gray-400">
            Share your Web3 ideas and get community feedback
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={openIdeaForm}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            + Submit Idea
          </button>
        </div>

        {/* Idea Submission Form Modal */}
        {isIdeaFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Submit Your Idea
                </h2>
                <button
                  onClick={closeIdeaForm}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <IdeaSubmissionForm />
            </div>
          </div>
        )}

        {/* Ideas Grid */}
        {ideas.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Ideas Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Be the first to share your Web3 idea!
            </p>
            <button
              onClick={openIdeaForm}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Submit First Idea
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => onSelectIdea?.(idea.id)}
                onUpvote={() => handleUpvote(idea.id)}
                hasUserUpvoted={upvotedIdeas.has(idea.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
