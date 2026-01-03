import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error',
  message,
  action 
}) => {
  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
      <div className="text-red-400 text-4xl mb-3">⚠️</div>
      <h3 className="text-xl font-semibold text-red-400 mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ErrorMessage
              title="Something went wrong"
              message={this.state.error?.message || 'An unexpected error occurred'}
              action={{
                label: 'Reload Page',
                onClick: () => window.location.reload(),
              }}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
