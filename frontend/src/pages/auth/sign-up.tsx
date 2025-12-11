import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../../services/auth-client';

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
  softwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  hardwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  primaryFocus: 'software' | 'hardware' | 'both' | 'theory';
  backgroundDetails: string;
}

const SignUpPage: React.FC = () => {
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
  const navigate = useNavigate();

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
        // Redirect to main application after successful sign-up (skip onboarding)
        navigate('/dashboard'); // Direct to main app instead of onboarding
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <div className="form-section">
            <h3>User Background Questionnaire</h3>
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

        <div className="auth-links">
          <p>
            Already have an account? <Link to="/auth/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;