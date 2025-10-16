import { useState, useEffect, useCallback } from 'react';
import { handleApiResponse, safeFetch } from '@/hooks/use-error-handling';

// API configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  retryConfig: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    backoffFactor: 2
  }
};

// Request interceptor type
type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

// Response interceptor type
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

// API client class
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(baseURL: string = API_CONFIG.baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Set authorization header
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`
    };
  }

  // Remove authorization header
  clearAuthToken() {
    const { Authorization, ...headers } = this.defaultHeaders as any;
    this.defaultHeaders = headers;
  }

  // Build full URL
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    const baseUrl = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    return `${baseUrl}${path}`;
  }

  // Apply request interceptors
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let finalConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    
    return finalConfig;
  }

  // Apply response interceptors
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let finalResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }
    
    return finalResponse;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useRetry: boolean = true
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    
    let config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    // Apply request interceptors
    config = await this.applyRequestInterceptors(config);

    const operation = async (): Promise<T> => {
      const response = await fetch(url, config);
      
      // Apply response interceptors
      const interceptedResponse = await this.applyResponseInterceptors(response);
      
      return handleApiResponse<T>(interceptedResponse);
    };

    if (useRetry) {
      return safeFetch<T>(url, config, API_CONFIG.retryConfig);
    } else {
      return operation();
    }
  }

  // GET request
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }

  // Upload file
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    options: RequestInit = {}
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const { 'Content-Type': contentType, ...headers } = this.defaultHeaders as any;
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        ...headers,
        ...options.headers
      }
    });
  }

  // Download file
  async download(
    endpoint: string,
    filename?: string,
    options: RequestInit = {}
  ): Promise<void> {
    const response = await this.request<Blob>(endpoint, {
      ...options,
      method: 'GET'
    });

    // Create download link
    const url = window.URL.createObjectURL(response as any);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Add common request interceptors
apiClient.addRequestInterceptor((config) => {
  // Add timestamp to prevent caching for GET requests
  if (config.method === 'GET') {
    // Note: URL modification would need to be handled at the fetch level
    // This is a placeholder for cache-busting logic
  }
  
  return config;
});

// Add common response interceptors
apiClient.addResponseInterceptor(async (response) => {
  // Handle authentication errors globally
  if (response.status === 401) {
    // Clear auth token and redirect to login
    apiClient.clearAuthToken();
    
    // Only redirect if we're in the browser
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  
  return response;
});

// Utility functions for common API patterns
export const createApiHook = <T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    dependencies?: any[];
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
) => {
  const {
    method = 'GET',
    dependencies = [],
    enabled = true,
    onSuccess,
    onError
  } = options;

  return () => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const execute = useCallback(async (requestData?: any) => {
      if (!enabled) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let result: T;
        
        switch (method) {
          case 'GET':
            result = await apiClient.get<T>(endpoint);
            break;
          case 'POST':
            result = await apiClient.post<T>(endpoint, requestData);
            break;
          case 'PUT':
            result = await apiClient.put<T>(endpoint, requestData);
            break;
          case 'PATCH':
            result = await apiClient.patch<T>(endpoint, requestData);
            break;
          case 'DELETE':
            result = await apiClient.delete<T>(endpoint);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        setData(result);
        onSuccess?.(result);
      } catch (err) {
        setError(err);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    }, [...dependencies]);

    useEffect(() => {
      if (method === 'GET') {
        execute();
      }
    }, [execute]);

    return {
      data,
      loading,
      error,
      execute,
      refetch: execute
    };
  };
};

export default apiClient;
