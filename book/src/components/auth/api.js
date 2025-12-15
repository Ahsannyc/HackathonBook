// API utility functions for authenticated requests

const API_BASE_URL = typeof window !== 'undefined'
  ? ''  // Use relative paths in browser (will use the same origin as the page)
  : process.env.API_BASE_URL || 'http://localhost:8000';  // For server-side rendering

// Helper function to get cookie value
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper function to set cookie
const setCookie = (name, value, days) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

export const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',  // Include cookies in requests
    ...options,
    headers,
  });

  // Check if response is ok before returning
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const authApi = {
  // Auth endpoints
  signup: (userData) => apiCall('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  signin: (userData) => apiCall('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Profile endpoints
  getProfile: () => apiCall('/api/auth/profile', {
    method: 'GET',
  }),

  updateProfile: (profileData) => apiCall('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  // Onboarding endpoint
  completeOnboarding: (onboardingData) => apiCall('/api/auth/onboarding', {
    method: 'POST',
    body: JSON.stringify(onboardingData),
  }),

  // RAG endpoints (with authentication)
  query: (queryData) => apiCall('/rag/query', {
    method: 'POST',
    body: JSON.stringify(queryData),
  }),

  selectedTextQuery: (queryData) => apiCall('/rag/selected_text_query', {
    method: 'POST',
    body: JSON.stringify(queryData),
  }),
};