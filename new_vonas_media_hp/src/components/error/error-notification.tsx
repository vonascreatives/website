'use client';

import React, { useEffect, useState } from 'react';
import { useErrorNotification, useGlobalError } from '@/contexts/error-context';
import { AppError, ErrorType } from '@/hooks/use-error-handling';
import { X, AlertCircle, Wifi, Shield, Server, RefreshCw } from 'lucide-react';

interface ErrorNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  maxVisible?: number;
  autoHideDuration?: number;
}

const getErrorIcon = (type: ErrorType) => {
  switch (type) {
    case ErrorType.NETWORK:
      return <Wifi className="w-5 h-5" />;
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
      return <Shield className="w-5 h-5" />;
    case ErrorType.SERVER:
      return <Server className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getErrorColor = (type: ErrorType) => {
  switch (type) {
    case ErrorType.NETWORK:
      return 'bg-orange-50 border-orange-200 text-orange-800';
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
      return 'bg-red-50 border-red-200 text-red-800';
    case ErrorType.SERVER:
      return 'bg-red-50 border-red-200 text-red-800';
    case ErrorType.NOT_FOUND:
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    default:
      return 'bg-red-50 border-red-200 text-red-800';
  }
};

const getPositionClasses = (position: string) => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-right':
      return 'top-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    case 'top-center':
      return 'top-4 left-1/2 transform -translate-x-1/2';
    default:
      return 'top-4 right-4';
  }
};

interface ErrorItemProps {
  error: AppError & { id: string };
  onDismiss: (error: AppError) => void;
  onRetry?: () => void;
  autoHide?: boolean;
  duration?: number;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ 
  error, 
  onDismiss, 
  onRetry, 
  autoHide = true, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss(error);
    }, 300);
  };

  useEffect(() => {
    if (autoHide && error.type !== ErrorType.AUTHENTICATION) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, error.type, handleDismiss]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      handleDismiss();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        relative mb-3 p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out
        ${getErrorColor(error.type)}
        ${isExiting ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'}
        max-w-sm w-full
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getErrorIcon(error.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium mb-1">
            {error.type === ErrorType.NETWORK && 'Connection Error'}
            {error.type === ErrorType.AUTHENTICATION && 'Authentication Required'}
            {error.type === ErrorType.AUTHORIZATION && 'Access Denied'}
            {error.type === ErrorType.SERVER && 'Server Error'}
            {error.type === ErrorType.NOT_FOUND && 'Not Found'}
            {error.type === ErrorType.VALIDATION && 'Validation Error'}
            {error.type === ErrorType.CLIENT && 'Client Error'}
            {error.type === ErrorType.UNKNOWN && 'Unexpected Error'}
          </div>
          
          <div className="text-sm opacity-90">
            {error.message}
          </div>
          
          {error.code && (
            <div className="text-xs opacity-75 mt-1">
              Error Code: {error.code}
            </div>
          )}
          
          {error.retryable && onRetry && (
            <button
              onClick={handleRetry}
              className="inline-flex items-center mt-2 text-xs font-medium hover:underline focus:outline-none focus:underline"
              aria-label="Retry operation"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Try Again
            </button>
          )}
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  position = 'top-right',
  maxVisible = 3,
  autoHideDuration = 5000
}) => {
  const { errors, dismissError } = useErrorNotification();
  
  // Limit the number of visible errors
  const visibleErrors = errors.slice(0, maxVisible);

  if (visibleErrors.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 ${getPositionClasses(position)}`}
      aria-live="polite"
      aria-label="Error notifications"
    >
      {visibleErrors.map((error) => (
        <ErrorItem
          key={(error as any).id}
          error={error as AppError & { id: string }}
          onDismiss={dismissError}
          duration={autoHideDuration}
        />
      ))}
    </div>
  );
};

// Compact error banner for critical errors
interface ErrorBannerProps {
  error: AppError;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onDismiss,
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-lg border
        ${getErrorColor(error.type)}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          {getErrorIcon(error.type)}
        </div>
        <div className="text-sm font-medium">
          {error.message}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            aria-label="Retry operation"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </button>
        )}
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Hook for programmatic error notifications
export const useErrorToast = () => {
  const { addError } = useGlobalError();
  
  const showError = (error: any, context?: string) => {
    return addError(error, context);
  };
  
  const showNetworkError = (message?: string) => {
    return addError({
      type: ErrorType.NETWORK,
      message: message || 'Network connection failed. Please check your internet connection.'
    });
  };
  
  const showServerError = (message?: string) => {
    return addError({
      type: ErrorType.SERVER,
      message: message || 'Server error occurred. Please try again later.'
    });
  };
  
  return {
    showError,
    showNetworkError,
    showServerError
  };
};
