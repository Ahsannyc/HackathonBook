import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from '../../services/auth-client';

interface SignInFormData {
  email: string;
  password: string;
}

const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const result = await authClient.signIn({
        email: formData.email,
        password: formData.password,
      });

      if (result) {
        // Redirect to main application after successful sign-in
        navigate('/dashboard'); // Or wherever the main app page should be
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign In</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/auth/signup">Sign up</Link>
          </p>
          <p>
            <Link to="/auth/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;