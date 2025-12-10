import React, { useState, useEffect } from 'react';
import OriginalNavbar from '@theme-original/Navbar';
import { useAuth } from '../components/auth/AuthContext';
import Link from '@docusaurus/Link';
import useIsBrowser from '@docusaurus/useIsBrowser';

// Custom Navbar with authentication links
export default function NavbarWrapper(props) {
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const isBrowser = useIsBrowser();

  const handleLogout = async () => {
    setLoading(true);
    try {
      logout();
      // Refresh the page to update UI after logout
      if (isBrowser) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OriginalNavbar {...props} />
      <div className="navbar-auth-section">
        {isAuthenticated && user ? (
          <div className="navbar-auth-buttons">
            <span className="navbar-user-email">Welcome, {user.email}!</span>
            <Link to="/auth/profile" className="button button--secondary button--sm">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="button button--outline button--sm"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        ) : (
          <div className="navbar-auth-buttons">
            <Link to="/auth/signin" className="button button--secondary button--sm">
              Sign In
            </Link>
            <Link to="/auth/signup" className="button button--primary button--sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
}