import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="navbar-auth-buttons">
        <span>Welcome, {user.email}!</span>
        <button onClick={() => navigate('/auth/profile')} disabled={loading}>
          Profile
        </button>
        <button onClick={handleLogout} disabled={loading}>
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    );
  } else {
    return (
      <div className="navbar-auth-buttons">
        <button onClick={() => navigate('/auth/signin')} disabled={loading}>
          Sign In
        </button>
        <button onClick={() => navigate('/auth/signup')} disabled={loading}>
          Sign Up
        </button>
      </div>
    );
  }
};

export default AuthNavbar;