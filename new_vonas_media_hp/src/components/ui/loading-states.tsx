import React from 'react';
import { Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

// Basic loading spinner
export const LoadingSpinner = ({ size = 'md', className = '' }: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      aria-label="Loading"
    />
  );
};

// Full page loading
export const PageLoading = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" className="text-blue-600 mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

// Section loading
export const SectionLoading = ({ 
  message = 'Loading content...', 
  height = 'h-64',
  className = '' 
}: { 
  message?: string; 
  height?: string;
  className?: string;
}) => {
  return (
    <div className={`flex items-center justify-center ${height} ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-blue-600 mb-3" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Card loading skeleton
export const CardSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

// Text loading skeleton
export const TextSkeleton = ({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string;
}) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};

// Button loading state
export const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button 
      className={`inline-flex items-center justify-center ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {children}
    </button>
  );
};

// Network status indicator
export const NetworkStatus = ({ 
  isOnline = true, 
  className = '' 
}: { 
  isOnline?: boolean; 
  className?: string;
}) => {
  if (isOnline) return null;

  return (
    <div className={`flex items-center gap-2 text-red-600 ${className}`}>
      <WifiOff className="w-4 h-4" />
      <span className="text-sm">No internet connection</span>
    </div>
  );
};

// Error state component
export const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'Please try again later.',
  onRetry,
  className = ''
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// Empty state component
export const EmptyState = ({ 
  title = 'No data found',
  message = 'There is no content to display.',
  action,
  className = ''
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {action}
    </div>
  );
};

// Async data wrapper with loading, error, and empty states
export const AsyncDataWrapper = ({ 
  loading,
  error,
  data,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  emptyCondition = (data: any) => !data || (Array.isArray(data) && data.length === 0)
}: {
  loading: boolean;
  error?: Error | string | null;
  data: any;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  emptyCondition?: (data: any) => boolean;
}) => {
  if (loading) {
    return loadingComponent || <SectionLoading />;
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return errorComponent || <ErrorState message={errorMessage} />;
  }

  if (emptyCondition(data)) {
    return emptyComponent || <EmptyState />;
  }

  return <>{children}</>;
};

// Hook for managing async states
export const useAsyncState = <T,>(initialData?: T) => {
  const [data, setData] = React.useState<T | undefined>(initialData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const execute = React.useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = React.useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
    setLoading,
    setError
  };
};