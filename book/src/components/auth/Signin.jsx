import React, { useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { authApi } from './api';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isBrowser = useIsBrowser();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authApi.signin(formData);

      // Check if user has completed onboarding
      try {
        const profileData = await authApi.getProfile();
        if (!profileData.onboarding_profile) {
          // Redirect to onboarding if not completed - only in browser
          if (isBrowser) {
            window.location.href = '/auth/onboarding';
          }
        } else {
          // Go to dashboard/home if onboarding is complete - only in browser
          if (isBrowser) {
            window.location.href = '/';
          }
        }
      } catch (profileError) {
        // If profile request fails, go to onboarding anyway - only in browser
        if (isBrowser) {
          window.location.href = '/auth/onboarding';
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p>
          Don't have an account? <a href="/auth/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Signin;