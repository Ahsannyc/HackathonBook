import React, { useState } from 'react';
import { authClient } from '../../services/auth-client';

interface SignInProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC<SignInProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        onSuccess?.();
      } else {
        const errorMsg = 'Invalid email or password';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during sign in';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-component">
      <form onSubmit={handleSubmit} className="sign-in-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;