'use client';

import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { AppError, ErrorType, classifyError } from '@/hooks/use-error-handling';

interface ErrorContextType {
  errors: AppError[];
  addError: (error: any, context?: string) => AppError;
  removeError: (id: string) => void;
  clearErrors: () => void;
  hasErrors: boolean;
  getErrorsByType: (type: ErrorType) => AppError[];
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
  maxErrors?: number;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  maxErrors = 10 
}) => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = useCallback((error: any, context?: string): AppError => {
    const appError = classifyError(error);
    
    // Add unique ID and context
    const errorWithId = {
      ...appError,
      id: Math.random().toString(36).substr(2, 9),
      context
    } as AppError & { id: string };

    setErrors(prev => {
      // Check for duplicate errors (same type and message within last 5 seconds)
      const isDuplicate = prev.some(existingError => 
        existingError.type === appError.type &&
        existingError.message === appError.message &&
        Date.now() - existingError.timestamp.getTime() < 5000
      );

      if (isDuplicate) {
        return prev;
      }

      // Add new error and limit total count
      return [errorWithId, ...prev.slice(0, maxErrors - 1)];
    });

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', errorWithId, error);
    }

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // reportError(errorWithId, error);
    }

    return appError;
  }, [maxErrors]);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => (error as any).id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorsByType = useCallback((type: ErrorType): AppError[] => {
    return errors.filter(error => error.type === type);
  }, [errors]);

  const hasErrors = errors.length > 0;

  const value: ErrorContextType = {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors,
    getErrorsByType
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useGlobalError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useGlobalError must be used within an ErrorProvider');
  }
  return context;
};

// HOC for components that need error handling
export const withErrorHandling = <P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: React.ComponentType<{ error: AppError; retry?: () => void }>
) => {
  const WrappedComponent = (props: P) => {
    const { addError } = useGlobalError();
    const [localError, setLocalError] = useState<AppError | null>(null);

    const handleError = useCallback((error: any, context?: string) => {
      const appError = addError(error, context);
      setLocalError(appError);
    }, [addError]);

    const retry = useCallback(() => {
      setLocalError(null);
    }, []);

    if (localError && errorFallback) {
      const ErrorFallback = errorFallback;
      return <ErrorFallback error={localError} retry={retry} />;
    }

    try {
      return <Component {...props} />;
    } catch (error) {
      handleError(error, `Component: ${Component.displayName || Component.name}`);
      return null;
    }
  };

  WrappedComponent.displayName = `withErrorHandling(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Error notification hook
export const useErrorNotification = () => {
  const { errors, removeError } = useGlobalError();
  
  // Get only errors that should be shown as notifications
  const notificationErrors = errors.filter(error => 
    error.type !== ErrorType.VALIDATION && // Don't show validation errors as notifications
    Date.now() - error.timestamp.getTime() < 30000 // Only show errors from last 30 seconds
  );

  const dismissError = useCallback((error: AppError) => {
    removeError((error as any).id);
  }, [removeError]);

  return {
    errors: notificationErrors,
    dismissError
  };
};