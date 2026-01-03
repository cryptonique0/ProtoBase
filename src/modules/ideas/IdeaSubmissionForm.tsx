import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ideaSubmissionSchema, type IdeaSubmissionFormData } from '../../lib/validation';
import { IdeaCategory } from '../../types/idea.types';
import { createIdea } from '../../services/ideasService';
import { useUserStore } from '../../store';
import { useUIStore } from '../../store';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const categoryLabels: Record<IdeaCategory, string> = {
  [IdeaCategory.DEFI]: 'DeFi',
  [IdeaCategory.NFT]: 'NFT',
  [IdeaCategory.DAO]: 'DAO',
  [IdeaCategory.GAMING]: 'Gaming',
  [IdeaCategory.SOCIAL]: 'Social',
  [IdeaCategory.INFRASTRUCTURE]: 'Infrastructure',
  [IdeaCategory.OTHER]: 'Other',
};

export const IdeaSubmissionForm: React.FC = () => {
  const { userId, walletAddress } = useUserStore();
  const { showToast, closeIdeaForm } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<IdeaSubmissionFormData>({
    resolver: zodResolver(ideaSubmissionSchema),
    defaultValues: {
      tags: [],
    },
  });

  const tags = watch('tags') || [];

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      const newTags = [...tags, tagInput.trim()];
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: IdeaSubmissionFormData) => {
    if (!userId || !walletAddress) {
      showToast('Please connect your wallet to submit an idea', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await createIdea(
        {
          title: data.title,
          description: data.description,
          problem: data.problem,
          targetUsers: data.targetUsers,
          category: data.category,
          tags: data.tags,
        },
        userId,
        walletAddress
      );

      showToast('Idea submitted successfully! 🚀', 'success');
      reset();
      closeIdeaForm();
      
      // Refresh ideas list
      window.dispatchEvent(new CustomEvent('ideas:refresh'));
    } catch (error: any) {
      console.error('Error submitting idea:', error);
      showToast(error.message || 'Failed to submit idea', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-400">
          Please connect your wallet to submit an idea
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Idea Title *
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          placeholder="e.g., Decentralized Social Network for Creators"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          placeholder="Describe your idea in detail. What makes it unique?"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Problem */}
      <div>
        <label htmlFor="problem" className="block text-sm font-medium text-gray-300 mb-2">
          Problem Statement *
        </label>
        <textarea
          {...register('problem')}
          id="problem"
          rows={4}
          placeholder="What problem does this solve? Why is it important?"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          disabled={isSubmitting}
        />
        {errors.problem && (
          <p className="mt-1 text-sm text-red-400">{errors.problem.message}</p>
        )}
      </div>

      {/* Target Users */}
      <div>
        <label htmlFor="targetUsers" className="block text-sm font-medium text-gray-300 mb-2">
          Target Users *
        </label>
        <input
          {...register('targetUsers')}
          type="text"
          id="targetUsers"
          placeholder="e.g., Content creators, NFT artists, DeFi traders"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          disabled={isSubmitting}
        />
        {errors.targetUsers && (
          <p className="mt-1 text-sm text-red-400">{errors.targetUsers.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
          Category *
        </label>
        <select
          {...register('category')}
          id="category"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          disabled={isSubmitting}
        >
          <option value="">Select a category</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags (Optional, max 5)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add a tag..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isSubmitting || tags.length >= 5}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || tags.length >= 5}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="hover:text-blue-300 transition-colors"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.tags && (
          <p className="mt-1 text-sm text-red-400">{errors.tags.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Submitting...</span>
            </>
          ) : (
            'Submit Idea'
          )}
        </button>
        <button
          type="button"
          onClick={() => closeIdeaForm()}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
