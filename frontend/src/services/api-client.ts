/**
 * API Client Service
 *
 * Provides a general-purpose client for making API requests.
 * Handles authentication headers, error handling, and request/response processing.
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(
    baseUrl: string = process.env.REACT_APP_API_BASE_URL || '',
    defaultHeaders: Record<string, string> = {}
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * Make a POST request
   */
  async post<T, D = any>(endpoint: string, data?: D, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, options);
  }

  /**
   * Make a PUT request
   */
  async put<T, D = any>(endpoint: string, data?: D, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Make a PATCH request
   */
  async patch<T, D = any>(endpoint: string, data?: D, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Construct the full URL
      const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint;

      // Prepare headers
      const headers = {
        ...this.defaultHeaders,
        ...options.headers,
      };

      // Prepare the request options
      const requestOptions: RequestInit = {
        method,
        headers,
        ...options,
      };

      // Add body for methods that support it
      if (data !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestOptions.body = JSON.stringify(data);
      }

      // Make the request
      const response = await fetch(url, requestOptions);

      // Parse the response
      let responseData: T | undefined;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // For non-JSON responses, return the text
        if (response.status !== 204) {
          responseData = await response.text() as unknown as T;
        }
      }

      // Return the response
      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      console.error(`API request error (${method} ${endpoint}):`, error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  /**
   * Set a default header for all requests
   */
  setDefaultHeader(name: string, value: string): void {
    this.defaultHeaders[name] = value;
  }

  /**
   * Remove a default header
   */
  removeDefaultHeader(name: string): void {
    delete this.defaultHeaders[name];
  }

  /**
   * Set the base URL for all requests
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

// Export a singleton instance of the ApiClient
export const apiClient = new ApiClient();