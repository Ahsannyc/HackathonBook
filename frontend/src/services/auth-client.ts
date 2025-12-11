/**
 * Authentication Client Service
 *
 * Provides client-side methods for interacting with the authentication API.
 * Handles user sign-up, sign-in, session management, and user data retrieval.
 */

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  image?: string;
  softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
  backgroundDetails?: string;
}

interface UserBackground {
  id: string;
  userId: string;
  softwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  hardwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  primaryFocus: 'software' | 'hardware' | 'both' | 'theory';
  backgroundDetails?: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
  backgroundDetails?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface PersonalizationData {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendedSections: string[];
  learningPath: string[];
  adaptations: {
    showAdvancedExamples: boolean;
    includeTheory: boolean;
    focusOnPractical: boolean;
    addExplanations: boolean;
  };
  summary: string;
}

export class AuthClient {
  private baseUrl: string;
  private currentUser: User | null = null;
  private currentSession: Session | null = null;

  constructor(baseUrl: string = process.env.REACT_APP_API_URL || '/api/auth') {
    this.baseUrl = baseUrl;

    // Check for existing session on initialization
    this.checkExistingSession();
  }

  /**
   * Check for existing session in cookies or local storage
   */
  private checkExistingSession() {
    // Try to get session token from cookies
    const token = this.getCookie('authjs.session-token');
    if (token) {
      // TODO: Verify session with API call
    }
  }

  /**
   * Get a cookie value by name
   */
  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  /**
   * Get redirect URL after successful authentication
   * This ensures users are redirected to valid pages instead of 404 errors
   */
  getRedirectUrl(defaultUrl: string = '/dashboard'): string {
    // Check for a redirect parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');

    // Validate redirect URL to prevent open redirect vulnerabilities
    if (redirect && this.isValidRedirectUrl(redirect)) {
      return redirect;
    }

    // Default to dashboard or main application page
    return defaultUrl;
  }

  /**
   * Validate if a redirect URL is safe to use
   */
  private isValidRedirectUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      // Only allow same-origin redirects to prevent open redirect
      return parsedUrl.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  /**
   * Handle API errors and return a user-friendly message
   */
  handleApiError(error: any, defaultMessage: string = 'An error occurred'): string {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return data?.message || 'Invalid request. Please check your input.';
        case 401:
          return data?.message || 'Authentication required. Please sign in.';
        case 403:
          return data?.message || 'Access forbidden. You do not have permission.';
        case 404:
          return 'Resource not found. Please check the URL.';
        case 429:
          return data?.message || 'Too many requests. Please wait before trying again.';
        case 500:
          return data?.message || 'Server error. Please try again later.';
        default:
          return data?.message || `Server error (${status}). Please try again.`;
      }
    }

    if (error.request) {
      // Request was made but no response received
      return 'Request failed. Please check your connection.';
    }

    // Something else happened
    return error.message || defaultMessage;
  }

  /**
   * Check if an error is related to authentication
   */
  isAuthError(error: any): boolean {
    if (error.response) {
      return error.response.status === 401;
    }
    // Additional checks for auth-related errors
    if (error.message) {
      return error.message.toLowerCase().includes('authentication') ||
             error.message.toLowerCase().includes('session') ||
             error.message.toLowerCase().includes('token');
    }
    return false;
  }

  /**
   * Set a cookie
   */
  private setCookie(name: string, value: string, days: number = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }

  /**
   * Clear a cookie
   */
  private clearCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
  }

  /**
   * Register a new user with background information
   */
  async signUp(data: SignUpData): Promise<{ user: User; userBackground: UserBackground } | null> {
    try {
      // Check for any redirect parameters in the URL that might be causing issues
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect') || urlParams.get('callbackUrl');

      // If the redirect parameter is for onboarding, override it
      if (redirectParam === '/auth/onboarding') {
        // Remove the problematic redirect parameter
        urlParams.delete('redirect');
        urlParams.delete('callbackUrl');

        // Update the URL without the problematic parameter
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }

      const response = await fetch(`${this.baseUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Sign up failed');
      }

      // Store user and session information
      this.currentUser = result.user;
      this.currentSession = result.session;

      return {
        user: result.user,
        userBackground: result.userBackground,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Authenticate a user with email and password
   */
  async signIn(data: SignInData): Promise<{ user: User } | null> {
    try {
      // Check for any redirect parameters in the URL that might be causing issues
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect') || urlParams.get('callbackUrl');

      // If the redirect parameter is for onboarding, override it
      if (redirectParam === '/auth/onboarding') {
        // Remove the problematic redirect parameter
        urlParams.delete('redirect');
        urlParams.delete('callbackUrl');

        // Update the URL without the problematic parameter
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }

      const response = await fetch(`${this.baseUrl}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Sign in failed');
      }

      // Store user and session information
      this.currentUser = result.user;
      this.currentSession = result.session;

      return {
        user: result.user,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<{ user: User; userBackground: UserBackground } | null> {
    try {
      // Check if we have a cached user
      if (this.currentUser) {
        return {
          user: this.currentUser,
          userBackground: this.currentUser as unknown as UserBackground, // This will be fixed with a proper API call
        };
      }

      const response = await fetch(`${this.baseUrl}/me`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired or invalid, clear local state
          this.currentUser = null;
          this.currentSession = null;
        }
        return null;
      }

      // Store user information
      this.currentUser = result.user;

      return {
        user: result.user,
        userBackground: result.userBackground,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Update user background information
   */
  async updateUserBackground(backgroundData: {
    softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
    backgroundDetails?: string;
  }): Promise<UserBackground | null> {
    try {
      const response = await fetch(`${this.baseUrl}/user-background`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(backgroundData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update background information');
      }

      // Update cached user data
      if (this.currentUser) {
        this.currentUser = {
          ...this.currentUser,
          ...backgroundData,
        };
      }

      return result;
    } catch (error) {
      console.error('Update background error:', error);
      throw error;
    }
  }

  /**
   * Get personalized content recommendations
   */
  async getPersonalization(): Promise<PersonalizationData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/personalization`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get personalization recommendations');
      }

      return result;
    } catch (error) {
      console.error('Get personalization error:', error);
      return null;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/signout`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Sign out failed');
      }

      // Clear local state
      this.currentUser = null;
      this.currentSession = null;
      this.clearCookie('authjs.session-token');

      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }

  /**
   * Check if the user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentSession !== null;
  }

  /**
   * Get the current user
   */
  getCurrentUserSync(): User | null {
    return this.currentUser;
  }

  /**
   * Get the current session
   */
  getCurrentSessionSync(): Session | null {
    return this.currentSession;
  }
}

// Export a singleton instance of the AuthClient
export const authClient = new AuthClient();