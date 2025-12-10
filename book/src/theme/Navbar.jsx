import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useIsBrowser from '@docusaurus/useIsBrowser';

// Simple Navbar that doesn't directly depend on auth context during SSR
export default function Navbar() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });
  const [loading, setLoading] = useState(false);
  const isBrowser = useIsBrowser();

  // Access auth state only on the client side after component mounts
  useEffect(() => {
    if (isBrowser) {
      // Dynamically import the auth context and get current state
      const getAuthState = async () => {
        try {
          const authModule = await import('../components/auth/AuthContext');

          // Create a temporary component to access the hook properly
          // We'll use a functional approach to access the context
          const getAuth = () => {
            try {
              // Since we're in useEffect, we can't directly call the hook here
              // Instead, we'll create a component that can access the hook
              const AuthChecker = () => {
                const auth = authModule.useAuth();
                return null;
              };

              // For now, let's use a simpler approach - just check for auth token in localStorage
              const token = localStorage.getItem('access_token');
              setAuthState({
                isAuthenticated: !!token,
                user: token ? { email: 'user@example.com' } : null // This is a simplified approach
              });
            } catch (error) {
              console.warn('Could not access auth context:', error);
              // Fallback: check for token in localStorage
              const token = localStorage.getItem('access_token');
              setAuthState({
                isAuthenticated: !!token,
                user: token ? { email: 'user@example.com' } : null
              });
            }
          };

          getAuth();
        } catch (error) {
          console.error('Error loading auth module:', error);
        }
      };

      getAuthState();
    }
  }, [isBrowser]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Access the auth context to call logout
      const authModule = await import('../components/auth/AuthContext');
      try {
        const authContext = authModule.useAuth();
        if (authContext.logout) {
          await authContext.logout();
        }
      } catch (error) {
        // If hook access fails, try direct localStorage removal
        localStorage.removeItem('access_token');
      }

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
    <nav className="navbar navbar--fixed-top">
      <div className="navbar__inner">
        <div className="navbar__items">
          {/* Logo and title - similar to original navbar */}
          <div className="navbar__item">
            <Link className="navbar__brand" to="/">
              <div className="navbar__title text--truncate">Robotics Textbook</div>
            </Link>
          </div>

          {/* Navigation items */}
          <Link className="navbar__item navbar__link" to="/docs/intro">
            Modules
          </Link>
          <Link className="navbar__item navbar__link" to="/blog">
            Blog
          </Link>
        </div>

        <div className="navbar__items navbar__items--right">
          {/* Auth section - check auth state only on client */}
          {isBrowser ? (
            authState.isAuthenticated ? (
              <div className="navbar__item">
                <span className="navbar-user-email">Welcome, {authState.user?.email}!</span>
                <Link className="button button--secondary button--sm" to="/auth/profile" style={{ marginLeft: '0.5rem' }}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="button button--outline button--sm"
                  style={{ marginLeft: '0.5rem' }}
                >
                  {loading ? '...' : 'Logout'}
                </button>
              </div>
            ) : (
              <>
                <Link className="button button--secondary button--sm navbar__item" to="/auth/signin">
                  Sign In
                </Link>
                <Link className="button button--primary button--sm navbar__item" to="/auth/signup">
                  Sign Up
                </Link>
              </>
            )
          ) : (
            // Server-side rendering - show sign in/up links by default
            // This ensures the navbar renders properly during SSR
            <>
              <Link className="button button--secondary button--sm navbar__item" to="/auth/signin">
                Sign In
              </Link>
              <Link className="button button--primary button--sm navbar__item" to="/auth/signup">
                Sign Up
              </Link>
            </>
          )}

          {/* GitHub link */}
          <Link
            className="navbar__item navbar__link"
            href="https://github.com/Ahsannyc/HackathonBook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="navbar__icon">GitHub</i>
          </Link>
        </div>
      </div>
    </nav>
  );
}