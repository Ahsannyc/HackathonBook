import React, { useState, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    software_experience: '',
    hardware_experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const isBrowser = useIsBrowser();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token && isBrowser) {
      window.location.href = '/auth/signin';
    }
  }, [isBrowser]);

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

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCompleted(true);
        // Redirect to dashboard after a short delay - only in browser
        if (isBrowser) {
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        setError(data.detail || 'Onboarding failed');
      }
    } catch (err) {
      setError('An error occurred during onboarding');
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-success">
          <h2>Welcome! 🎉</h2>
          <p>Your profile has been set up successfully.</p>
          <p>You'll be redirected to the dashboard shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-form">
        <h2>Tell us about yourself</h2>
        <p>Help us personalize your experience</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="software_experience">Software Experience Level:</label>
            <select
              id="software_experience"
              name="software_experience"
              value={formData.software_experience}
              onChange={handleChange}
              required
            >
              <option value="">Select your level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="hardware_experience">Hardware Experience Level:</label>
            <select
              id="hardware_experience"
              name="hardware_experience"
              value={formData.hardware_experience}
              onChange={handleChange}
              required
            >
              <option value="">Select your level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;