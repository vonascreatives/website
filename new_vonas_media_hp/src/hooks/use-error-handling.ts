import { useState, useCallback, useRef } from 'react';

// Error types for better error categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: any;
  timestamp: Date;
  retryable: boolean;
}

// Error classification utility
export const classifyError = (error: any): AppError => {
  const timestamp = new Date();
  
  // Network errors
  if (!navigator.onLine) {
    return {
      type: ErrorType.NETWORK,
      message: 'No internet connection. Please check your network and try again.',
      timestamp,
      retryable: true
    };
  }

  // Fetch/HTTP errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network error. Please check your connection and try again.',
      timestamp,
      retryable: true
    };
  }

  // HTTP status errors
  if (error.status || error.response?.status) {
    const status = error.status || error.response.status;
    const statusText = error.statusText || error.response.statusText;
    
    switch (Math.floor(status / 100)) {
      case 4:
        if (status === 401) {
          return {
            type: ErrorType.AUTHENTICATION,
            message: 'Authentication required. Please log in and try again.',
            code: status,
            timestamp,
            retryable: false
          };
        }
        if (status === 403) {
          return {
            type: ErrorType.AUTHORIZATION,
            message: 'You do not have permission to perform this action.',
            code: status,
            timestamp,
            retryable: false
          };
        }
        if (status === 404) {
          return {
            type: ErrorType.NOT_FOUND,
            message: 'The requested resource was not found.',
            code: status,
            timestamp,
            retryable: false
          };
        }
        return {
          type: ErrorType.CLIENT,
          message: `Client error: ${statusText || 'Bad request'}`,
          code: status,
          timestamp,
          retryable: false
        };
      
      case 5:
        return {
          type: ErrorType.SERVER,
          message: 'Server error. Please try again later.',
          code: status,
          timestamp,
          retryable: true
        };
    }
  }

  // Validation errors
  if (error.name === 'ValidationError' || error.type === 'validation') {
    return {
      type: ErrorType.VALIDATION,
      message: error.message || 'Validation failed. Please check your input.',
      details: error.details,
      timestamp,
      retryable: false
    };
  }

  // Generic error
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || 'An unexpected error occurred. Please try again.',
    details: error,
    timestamp,
    retryable: true
  };
};

// Retry configuration
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
};

// Exponential backoff utility
const calculateDelay = (attempt: number, config: RetryConfig): number => {
  const delay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
  return Math.min(delay, config.maxDelay);
};

// Sleep utility
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Main error handling hook
export const useErrorHandling = () => {
  const [errors, setErrors] = useState<AppError[]>([]);
  const retryAttempts = useRef<Map<string, number>>(new Map());

  const addError = useCallback((error: any, context?: string) => {
    const appError = classifyError(error);
    
    // Add context if provided
    if (context) {
      appError.details = { ...appError.details, context };
    }

    setErrors(prev => [appError, ...prev.slice(0, 9)]); // Keep last 10 errors
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', appError, error);
    }

    return appError;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
    retryAttempts.current.clear();
  }, []);

  const removeError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Retry mechanism with exponential backoff
  const withRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    operationId?: string
  ): Promise<T> => {
    const retryConfig = { ...defaultRetryConfig, ...config };
    const id = operationId || Math.random().toString(36).substr(2, 9);
    
    let lastError: any;
    
    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        const result = await operation();
        // Reset retry count on success
        retryAttempts.current.delete(id);
        return result;
      } catch (error) {
        lastError = error;
        const appError = classifyError(error);
        
        // Don't retry if error is not retryable
        if (!appError.retryable || attempt === retryConfig.maxAttempts) {
          retryAttempts.current.delete(id);
          throw error;
        }
        
        // Update retry count
        retryAttempts.current.set(id, attempt);
        
        // Wait before retrying
        const delay = calculateDelay(attempt, retryConfig);
        await sleep(delay);
      }
    }
    
    throw lastError;
  }, []);

  // Safe async operation wrapper
  const safeAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    options: {
      context?: string;
      onError?: (error: AppError) => void;
      retry?: Partial<RetryConfig>;
      operationId?: string;
    } = {}
  ): Promise<T | null> => {
    try {
      if (options.retry) {
        return await withRetry(operation, options.retry, options.operationId);
      } else {
        return await operation();
      }
    } catch (error) {
      const appError = addError(error, options.context);
      options.onError?.(appError);
      return null;
    }
  }, [addError, withRetry]);

  // Get retry count for an operation
  const getRetryCount = useCallback((operationId: string): number => {
    return retryAttempts.current.get(operationId) || 0;
  }, []);

  return {
    errors,
    addError,
    clearErrors,
    removeError,
    withRetry,
    safeAsync,
    getRetryCount
  };
};

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // You could dispatch this to a global error store or reporting service
    // Example: store.dispatch(addGlobalError(event.reason));
  });
}

// Utility for handling API responses
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use the default message
    }
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).statusText = response.statusText;
    throw error;
  }
  
  return response.json();
};

// Enhanced fetch with error handling
export const safeFetch = async <T>(
  url: string,
  options: RequestInit = {},
  retryConfig?: Partial<RetryConfig>
): Promise<T> => {
  const operation = async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    return handleApiResponse<T>(response);
  };
  
  if (retryConfig) {
    // Manual retry implementation without hooks
    let lastError: any;
    const config = { ...defaultRetryConfig, ...retryConfig };
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const appError = classifyError(error);
        
        if (!appError.retryable || attempt === config.maxAttempts) {
          throw error;
        }
        
        const delay = calculateDelay(attempt, config);
        await sleep(delay);
      }
    }
    
    throw lastError;
  }
  
  return operation();
};