// API utility functions for authenticated requests

const API_BASE_URL = 'http://localhost:8000';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Check if response is ok before returning
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const authApi = {
  // Auth endpoints
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  signin: (userData) => apiCall('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Profile endpoints
  getProfile: () => apiCall('/auth/profile', {
    method: 'GET',
  }),

  updateProfile: (profileData) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  // Onboarding endpoint
  completeOnboarding: (onboardingData) => apiCall('/auth/onboarding', {
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