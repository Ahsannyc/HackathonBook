import React, { useState } from 'react';
import { authClient } from '../../services/auth-client';

interface SignUpProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
  softwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  hardwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  primaryFocus: 'software' | 'hardware' | 'both' | 'theory';
  backgroundDetails: string;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    name: '',
    softwareExperience: 'beginner',
    hardwareExperience: 'beginner',
    primaryFocus: 'both',
    backgroundDetails: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        softwareExperience: formData.softwareExperience,
        hardwareExperience: formData.hardwareExperience,
        primaryFocus: formData.primaryFocus,
        backgroundDetails: formData.backgroundDetails,
      });

      if (result) {
        onSuccess?.();
      } else {
        const errorMsg = 'Failed to create account. Please try again.';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during sign up';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up-component">
      <form onSubmit={handleSubmit} className="sign-up-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={8}
            placeholder="••••••••"
          />
        </div>

        <div className="form-section">
          <h3>User Background</h3>
          <p>Please provide information about your experience to personalize your content:</p>

          <div className="form-group">
            <label htmlFor="softwareExperience">Software Experience</label>
            <select
              id="softwareExperience"
              name="softwareExperience"
              value={formData.softwareExperience}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="hardwareExperience">Hardware Experience</label>
            <select
              id="hardwareExperience"
              name="hardwareExperience"
              value={formData.hardwareExperience}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="primaryFocus">Primary Focus Area</label>
            <select
              id="primaryFocus"
              name="primaryFocus"
              value={formData.primaryFocus}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
              <option value="both">Both</option>
              <option value="theory">Theory</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="backgroundDetails">Additional Background Details</label>
            <textarea
              id="backgroundDetails"
              name="backgroundDetails"
              value={formData.backgroundDetails}
              onChange={handleChange}
              disabled={loading}
              placeholder="Tell us more about your technical background..."
              rows={3}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;