import React, { useEffect } from 'react';
import { useUIStore } from '../store';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hideToast, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div
        className={`${bgColors[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}
      >
        <span className="text-2xl">{icons[toast.type]}</span>
        <p className="flex-1">{toast.message}</p>
        <button
          onClick={hideToast}
          className="text-white/80 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};
