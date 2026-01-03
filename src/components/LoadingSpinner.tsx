import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export const LoadingCard: React.FC = () => (
  <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
    <div className="h-4 bg-gray-700 rounded w-full mb-2" />
    <div className="h-4 bg-gray-700 rounded w-5/6 mb-4" />
    <div className="flex gap-2">
      <div className="h-6 bg-gray-700 rounded w-16" />
      <div className="h-6 bg-gray-700 rounded w-16" />
    </div>
  </div>
);

export const LoadingList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);
